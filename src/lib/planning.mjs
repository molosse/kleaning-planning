import { LINGE_MODE_PROPRIETAIRE, normalizeLingeMode } from "./lieux.mjs";

export const DEFAULT_CENTRE = { lat: 31.635, lng: -8.010 };

// Calcul de la distance à vol d'oiseau entre deux points GPS (formule Haversine).
// Retourne la distance en km. Si les coords manquent, on suppose 5 km par défaut.
export function distKm(a, b) {
  if (!a || !b) return 5;

  const R = 6371;
  const dlat = Math.PI / 180 * (b.lat - a.lat);
  const dlng = Math.PI / 180 * (b.lng - a.lng);
  const x =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(Math.PI / 180 * a.lat) *
      Math.cos(Math.PI / 180 * b.lat) *
      Math.sin(dlng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// Vitesse scooter en milieu urbain Marrakech : ~35 km/h + 3 min arrêt/stationnement.
export function trajetMin(a, b) {
  return Math.round(distKm(a, b) / 35 * 60) + 3;
}

// Arrondir une durée (en minutes) au prochain multiple de 5.
export function arrondir5(m) {
  return Math.ceil(m / 5) * 5;
}

// Convertit un nombre de minutes en chaîne "HH:MM" (ex : 750 -> "12:30").
export function minToH(m) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

// Convertit une chaîne "HH:MM" en minutes depuis minuit (ex : "12:30" -> 750).
export function hToMin(h) {
  const [a, b] = (h || "12:00").split(":").map(Number);
  return a * 60 + b;
}

// Formate l'heure pour WhatsApp : "12:30" -> "12h30".
export function toWA(h) {
  return (h || "").replace(":", "h");
}

// Retourne l'heure de début par défaut (en minutes) selon le nom de l'intervention.
export function hDefaut(nom, defaultH = 12 * 60) {
  if (/cabinet.m[eé]d/i.test(nom)) return 8 * 60;
  if (/alami/i.test(nom)) return 10 * 60 + 30;
  if (/zoraida/i.test(nom)) return 11 * 60 + 30;
  if (/coralia/i.test(nom)) return 11 * 60;
  if (/escales/i.test(nom)) return 9 * 60 + 30;
  return defaultH;
}

// Retourne l'heure de fin (en minutes). Certains clients ont une fin fixe.
export function hFin(nom, d, defaultH = 12 * 60) {
  if (/cabinet.m[eé]d/i.test(nom)) return 10 * 60;
  if (/alami/i.test(nom)) return 12 * 60;
  if (/zoraida/i.test(nom)) return 16 * 60;
  if (/escales/i.test(nom)) return 17 * 60 + 30;
  return hDefaut(nom, defaultH) + d;
}

// Recherche floue d'un lieu dans la liste en comparant les 7 premiers caractères du nom nettoyé.
export function matchLieu(s, lieux) {
  if (!s || !lieux?.length) return null;

  const normalizedSearch = s.toLowerCase();
  return lieux.find((lieu) => {
    const normalizedLieu = lieu.nom
      .toLowerCase()
      .replace("appartement gh ", "")
      .replace("appartement ", "")
      .replace("villa ", "")
      .replace("gh ", "");

    const compactSearch = normalizedSearch
      .replace(/gh\s+/g, "")
      .replace(/airbnb\s+/g, "")
      .replace(/apt\s+/g, "")
      .trim()
      .slice(0, 7);

    return (
      normalizedSearch.includes(normalizedLieu.slice(0, 7)) ||
      normalizedLieu.includes(compactSearch)
    );
  });
}

// Transforme un événement Google Calendar brut en objet intervention structuré.
export function parseEv(ev, lieux, defaultH = 12 * 60) {
  const sourceLieux = Array.isArray(lieux) ? lieux : [];
  const summary = ev.summary || "";
  const nom = ev.nom || summary;

  const lieu =
    (ev.propertyName && matchLieu(ev.propertyName, sourceLieux)) ||
    matchLieu(nom, sourceLieux) ||
    matchLieu(summary, sourceLieux);

  const typeParNom = /\bvilla\b/i.test(nom) || /\bvilla\b/i.test(summary) ? "Villa" : null;
  const type = lieu?.type || typeParNom || ev.type || "Appartement GH";

  const villaLieux = sourceLieux.filter((l) => l.type === "Villa");
  const lieuVilla =
    type === "Villa" && lieu?.type !== "Villa"
      ? (matchLieu(ev.propertyName || nom, villaLieux) || matchLieu(summary, villaLieux))
      : null;

  const lieuFinal = lieuVilla || lieu;
  const duree = lieuFinal?.d || (type === "Villa" ? 240 : 90);
  const debut = ev.startTime ? hToMin(ev.startTime) : hDefaut(nom, defaultH);
  const fin = ev.startTime ? debut + duree : hFin(nom, duree, defaultH);
  const lingeMode = normalizeLingeMode(lieuFinal?.lingeMode, lieuFinal?.lingeProprio);

  return {
    id: ev.id,
    nom,
    type,
    cli: lieuFinal?.cli || ev.cli || "",
    proprietaire: lieuFinal?.proprietaire || "",
    lieu: lieuFinal,
    d: duree,
    debut,
    fin,
    employes: [],
    bla_linge: false,
    lingeMode,
    lingeProprio: lingeMode === LINGE_MODE_PROPRIETAIRE,
    heureDebut: minToH(debut),
    heureFin: minToH(fin),
  };
}

// Mode sans association automatique : chaque intervention reste dans sa propre chaîne.
export function construireChainesSolo(interventions) {
  return [...interventions]
    .sort((a, b) => a.debut - b.debut)
    .map((inter) => ({
      inters: [inter],
      trajetTotal: 0,
      dureeTotal: inter.d,
    }));
}

// Algorithme d'optimisation du planning : groupe les interventions en chaînes de 2 maximum.
export function optimiser(interventions, centre = DEFAULT_CENTRE) {
  if (!interventions.length) return [];

  const sorted = [...interventions].sort((a, b) => {
    const priority = (inter) => {
      if (inter.type === "Bureau") return 0;
      if (inter.type === "Appartement MM") return 1;
      if (inter.type === "Riad") return 2;
      return 3;
    };

    return priority(a) - priority(b) || b.d - a.d;
  });

  const assigned = new Set();
  const chaines = [];
  const getLieu = (index) => sorted[index].lieu || centre;
  const isVilla = (index) => sorted[index].type === "Villa" || /\bvilla\b/i.test(sorted[index].nom);

  for (const inter of sorted) {
    if (assigned.has(inter.id)) continue;

    const idx = sorted.findIndex((current) => current.id === inter.id);
    const chaine = [idx];
    assigned.add(inter.id);

    if (chaine.length < 2 && !isVilla(idx)) {
      let best = null;
      let bestTrajet = Infinity;

      for (let j = 0; j < sorted.length; j += 1) {
        if (assigned.has(sorted[j].id)) continue;
        if (isVilla(j)) continue;
        if (sorted[idx].type === "Bureau" && sorted[j].type !== "Bureau") continue;
        if (sorted[idx].type !== "Bureau" && sorted[j].type === "Bureau") continue;
        if (Math.abs(sorted[j].debut - sorted[idx].debut) > 30) continue;

        const trajet = trajetMin(getLieu(idx), getLieu(j));
        if (trajet <= 20 && trajet < bestTrajet) {
          bestTrajet = trajet;
          best = j;
        }
      }

      if (best !== null) {
        chaine.push(best);
        assigned.add(sorted[best].id);
      }
    }

    chaines.push(chaine);
  }

  const result = chaines.map((chaine) => {
    const lieux = chaine.map((index) => sorted[index]);
    let currentStart = lieux[0].debut;

    const inters = lieux.map((lieu, index) => {
      const debut = currentStart;
      const fin = debut + lieu.d;

      if (index < lieux.length - 1) {
        currentStart = arrondir5(fin + trajetMin(lieux[index].lieu || centre, lieux[index + 1].lieu || centre));
      }

      return { ...lieu, debut, fin, heureDebut: minToH(debut), heureFin: minToH(fin) };
    });

    const trajetTotal = lieux.reduce((sum, _, index) => {
      if (index >= lieux.length - 1) return sum;
      return sum + trajetMin(lieux[index].lieu || centre, lieux[index + 1].lieu || centre);
    }, 0);

    return {
      inters,
      trajetTotal,
      dureeTotal: inters[inters.length - 1].fin - inters[0].debut,
    };
  });

  return result.sort((a, b) => a.inters[0].debut - b.inters[0].debut);
}

function isBureauInter(inter) {
  return inter.type === "Bureau" || inter.cli === "Cabinet médical";
}

export function isVillaInter(inter) {
  return inter.type === "Villa" || /\bvilla\b/i.test(inter.nom);
}

export function updateInterventionInChaines(chaines, ci, ii, field, value) {
  const nextChaines = [...chaines];
  const chaine = { ...nextChaines[ci], inters: [...nextChaines[ci].inters] };
  const inter = chaine.inters[ii];

  if (field === "employes") {
    const employes = value;
    chaine.inters = chaine.inters.length === 2
      ? chaine.inters.map((current) => ({ ...current, employes }))
      : [
          ...chaine.inters.slice(0, ii),
          { ...inter, employes },
          ...chaine.inters.slice(ii + 1),
        ];
  } else if (field === "heureDebut") {
    const debut = hToMin(value);
    if (isBureauInter(inter)) {
      chaine.inters = [
        ...chaine.inters.slice(0, ii),
        { ...inter, debut, heureDebut: minToH(debut) },
        ...chaine.inters.slice(ii + 1),
      ];
    } else {
      const fin = debut + inter.d;
      chaine.inters = [
        ...chaine.inters.slice(0, ii),
        {
          ...inter,
          debut,
          fin,
          heureDebut: minToH(debut),
          heureFin: minToH(fin),
        },
        ...chaine.inters.slice(ii + 1),
      ];
    }
  } else if (field === "heureFin") {
    const fin = hToMin(value);
    chaine.inters = [
      ...chaine.inters.slice(0, ii),
      { ...inter, fin, heureFin: minToH(fin) },
      ...chaine.inters.slice(ii + 1),
    ];
  } else {
    chaine.inters = [
      ...chaine.inters.slice(0, ii),
      { ...inter, [field]: value },
      ...chaine.inters.slice(ii + 1),
    ];
  }

  chaine.dureeTotal = chaine.inters[chaine.inters.length - 1].fin - chaine.inters[0].debut;
  nextChaines[ci] = chaine;
  return nextChaines;
}

export function removeChaineAtIndex(chaines, ci) {
  return chaines.filter((_, index) => index !== ci);
}

export function mergeChainesAtIndexes(chaines, ci1, ci2, centre = DEFAULT_CENTRE) {
  const nextChaines = [...chaines];
  const a = nextChaines[ci1].inters[0];
  const b = nextChaines[ci2].inters[0];
  const [first, second] = a.debut <= b.debut ? [a, b] : [b, a];
  const trajet = trajetMin(first.lieu || centre, second.lieu || centre);
  const d1 = first.debut;
  const f1 = d1 + first.d;
  const d2 = arrondir5(f1 + trajet);
  const f2 = d2 + second.d;
  const employes = [...new Set([...(first.employes || []), ...(second.employes || [])])];

  const inter1 = {
    ...first,
    debut: d1,
    fin: f1,
    heureDebut: minToH(d1),
    heureFin: minToH(f1),
    employes,
  };
  const inter2 = {
    ...second,
    debut: d2,
    fin: f2,
    heureDebut: minToH(d2),
    heureFin: minToH(f2),
    employes,
  };

  const merged = {
    inters: [inter1, inter2],
    trajetTotal: trajet,
    dureeTotal: f2 - d1,
  };

  const [hi, lo] = ci1 > ci2 ? [ci1, ci2] : [ci2, ci1];
  nextChaines.splice(hi, 1);
  nextChaines.splice(lo, 1, merged);
  return nextChaines;
}

export function splitChaineAtIndex(chaines, ci) {
  const nextChaines = [...chaines];
  const chaine = nextChaines[ci];
  if (chaine.inters.length < 2) return chaines;

  const solos = chaine.inters.map((inter) => ({
    inters: [inter],
    trajetTotal: 0,
    dureeTotal: inter.d,
  }));
  nextChaines.splice(ci, 1, ...solos);
  return nextChaines;
}

export function buildWhatsAppText(dateQ, chaines, clientIcons = {}, typeIcons = {}) {
  const [day, month, year] = dateQ.split("/");
  const label = new Date(`${year}-${month}-${day}`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let text = `\`Planning du jour - ${label.charAt(0).toUpperCase()}${label.slice(1)}\` :\n\n`;
  const all = chaines.flatMap((chaine) => chaine.inters);
  const byEmployee = {};

  all.forEach((inter) => {
    const employes = inter.employes || [];
    if (!employes.length) {
      if (!byEmployee.__none__) byEmployee.__none__ = [];
      byEmployee.__none__.push(inter);
      return;
    }

    employes.forEach((employee) => {
      if (!byEmployee[employee]) byEmployee[employee] = [];
      byEmployee[employee].push(inter);
    });
  });

  Object.entries(byEmployee)
    .sort(([, a], [, b]) => hToMin(a[0].heureDebut) - hToMin(b[0].heureDebut))
    .forEach(([employee, inters]) => {
      const sorted = [...inters].sort((a, b) => hToMin(a.heureDebut) - hToMin(b.heureDebut));
      const lines = sorted.map((inter) => {
        const icon = clientIcons[inter.cli] || typeIcons[inter.type] || "🔵";
        const hours = isBureauInter(inter)
          ? `${toWA(inter.heureDebut)}->${toWA(inter.heureFin)}`
          : toWA(inter.heureDebut);

        return `${icon} _${inter.nom}_ ${hours}${inter.bla_linge ? " (Bla linge)" : ""}${inter.lingeProprio ? " (linge propriétaire)" : ""}`;
      });

      if (employee === "__none__") {
        text += `${lines.map((line) => `${line} : **,`).join("\n\n")}\n\n`;
        return;
      }

      text += `${lines.join(",\n")} : *${employee}*,\n\n`;
    });

  return text.trimEnd();
}

export function buildChargeByEmployee(chaines) {
  const charge = {};
  chaines.flatMap((chaine) => chaine.inters).forEach((inter) => {
    (inter.employes || []).forEach((employee) => {
      if (!charge[employee]) charge[employee] = [];
      charge[employee].push(inter);
    });
  });
  return charge;
}

export function buildConflits(chaines, equipe) {
  return equipe
    .filter((employee) => employee.actif !== false)
    .flatMap((employee) => {
      const all = chaines
        .flatMap((chaine) => chaine.inters.filter((inter) => (inter.employes || []).includes(employee.nom)))
        .sort((a, b) => hToMin(a.heureDebut) - hToMin(b.heureDebut));

      const conflits = [];
      for (let index = 0; index < all.length - 1; index += 1) {
        if (hToMin(all[index].heureFin) > hToMin(all[index + 1].heureDebut)) {
          conflits.push(`${employee.nom}: ${all[index].nom.split(" ").pop()} → ${all[index + 1].nom.split(" ").pop()}`);
        }
      }
      return conflits;
    });
}

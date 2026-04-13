import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChargeByEmployee,
  buildConflits,
  arrondir5,
  construireChainesSolo,
  hToMin,
  mergeChainesAtIndexes,
  minToH,
  optimiser,
  parseEv,
  splitChaineAtIndex,
  toWA,
  trajetMin,
  updateInterventionInChaines,
} from "../src/lib/planning.mjs";
import {
  normalizeLingeMode,
  normalizeLieuRecord,
} from "../src/lib/lieux.mjs";
import {
  isEmployeeOffForDay,
  createDefaultEquipe,
  normalizeEmployeeRecord,
  normalizeWeekdays,
} from "../src/lib/team.mjs";
import {
  buildTabs,
  countUnderstaffedVillas,
  countUnassignedInterventions,
  getInitialDateQ,
  getSelectedWeekday,
} from "../src/lib/appState.mjs";
import {
  formatUserLogin,
  isValidLoginIdentifier,
  normalizeUserLogin,
} from "../src/lib/users.mjs";

test("les helpers horaires gardent un format cohérent", () => {
  assert.equal(minToH(750), "12:30");
  assert.equal(hToMin("12:30"), 750);
  assert.equal(toWA("12:30"), "12h30");
  assert.equal(arrondir5(703), 705);
});

test("parseEv utilise l'horaire Calendar et le logement correspondant", () => {
  const lieux = [
    {
      id: "l_1",
      nom: "Escape",
      type: "Appartement GH",
      d: 120,
      proprietaire: "GH",
      cli: "GetHost",
      lingeMode: "proprietaire",
      lingeProprio: true,
      lat: 31.63,
      lng: -8.01,
    },
  ];

  const intervention = parseEv(
    {
      id: "evt_1",
      summary: "GH Ménage Escape - 2ch",
      nom: "Ménage Escape",
      propertyName: "Escape",
      cli: "GetHost",
      startTime: "09:15",
    },
    lieux
  );

  assert.equal(intervention.lieu?.id, "l_1");
  assert.equal(intervention.d, 120);
  assert.equal(intervention.debut, 555);
  assert.equal(intervention.fin, 675);
  assert.equal(intervention.heureDebut, "09:15");
  assert.equal(intervention.heureFin, "11:15");
  assert.equal(intervention.proprietaire, "GH");
  assert.equal(intervention.cli, "GetHost");
  assert.equal(intervention.lingeMode, "proprietaire");
  assert.equal(intervention.lingeProprio, true);
});

test("les helpers logement normalisent propriétaire et linge", () => {
  assert.equal(normalizeLingeMode("proprietaire"), "proprietaire");
  assert.equal(normalizeLingeMode("kleaning"), "kleaning");
  assert.equal(normalizeLingeMode(undefined, false), "");
  assert.equal(normalizeLingeMode("", undefined), "");

  const lieu = normalizeLieuRecord({
    nom: "Perle",
    proprietaire: " GH ",
    lingeProprio: false,
  });

  assert.equal(lieu.proprietaire, "GH");
  assert.equal(lieu.lingeMode, "");
  assert.equal(lieu.lingeProprio, false);
});

test("optimiser garde les villas seules et chaîne les logements proches", () => {
  const centreVille = { lat: 31.63, lng: -8.01 };
  const proche = { lat: 31.631, lng: -8.011 };

  const interventions = [
    {
      id: "a_1",
      nom: "Ménage Escape",
      type: "Appartement GH",
      cli: "GetHost",
      lieu: centreVille,
      d: 100,
      debut: 600,
      fin: 700,
      heureDebut: "10:00",
      heureFin: "11:40",
    },
    {
      id: "a_2",
      nom: "Ménage Perle",
      type: "Appartement GH",
      cli: "GetHost",
      lieu: proche,
      d: 90,
      debut: 625,
      fin: 715,
      heureDebut: "10:25",
      heureFin: "11:55",
    },
    {
      id: "v_1",
      nom: "Villa Rosa",
      type: "Villa",
      cli: "GetHost",
      lieu: { lat: 31.7, lng: -8.05 },
      d: 240,
      debut: 720,
      fin: 960,
      heureDebut: "12:00",
      heureFin: "16:00",
    },
  ];

  const chaines = optimiser(interventions);

  assert.equal(chaines.length, 2);
  assert.equal(chaines[0].inters.length, 2);
  assert.equal(chaines[1].inters.length, 1);
  assert.equal(chaines[1].inters[0].type, "Villa");

  const premier = chaines[0].inters[0];
  const second = chaines[0].inters[1];
  assert.equal(second.debut, arrondir5(premier.fin + trajetMin(premier.lieu, second.lieu)));
});

test("construireChainesSolo trie les interventions par heure", () => {
  const chaines = construireChainesSolo([
    { id: "b", nom: "Tard", d: 90, debut: 720 },
    { id: "a", nom: "Tôt", d: 60, debut: 540 },
  ]);

  assert.equal(chaines.length, 2);
  assert.equal(chaines[0].inters[0].id, "a");
  assert.equal(chaines[1].inters[0].id, "b");
});

test("les helpers équipe normalisent les jours off", () => {
  assert.deepEqual(normalizeWeekdays([6, "1", 6, 9, -1]), [1, 6]);
  assert.deepEqual(normalizeWeekdays({ recurringWeekdays: [3, "0", 3] }), [0, 3]);
  assert.equal(isEmployeeOffForDay({ joursOff: [0, 2] }, 2), true);

  const normalized = normalizeEmployeeRecord({ nom: "Majda", joursOff: { recurringWeekdays: [4, "1"] } });
  assert.equal(normalized.actif, true);
  assert.deepEqual(normalized.joursOff, [1, 4]);
});

test("les helpers de chaînes gardent les assignations et détectent les conflits", () => {
  const soloA = {
    inters: [{
      id: "a",
      nom: "Appartement Atlas",
      type: "Appartement GH",
      cli: "GetHost",
      d: 90,
      debut: 600,
      fin: 690,
      heureDebut: "10:00",
      heureFin: "11:30",
      employes: ["Majda"],
      lieu: { lat: 31.63, lng: -8.01 },
    }],
    trajetTotal: 0,
    dureeTotal: 90,
  };
  const soloB = {
    inters: [{
      id: "b",
      nom: "Appartement Bahia",
      type: "Appartement GH",
      cli: "GetHost",
      d: 60,
      debut: 620,
      fin: 680,
      heureDebut: "10:20",
      heureFin: "11:20",
      employes: ["Amina"],
      lieu: { lat: 31.631, lng: -8.011 },
    }],
    trajetTotal: 0,
    dureeTotal: 60,
  };

  const merged = mergeChainesAtIndexes([soloA, soloB], 0, 1);
  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0].inters[0].employes.sort(), ["Amina", "Majda"]);
  assert.deepEqual(merged[0].inters[1].employes.sort(), ["Amina", "Majda"]);
  assert.equal(merged[0].inters[0].heureDebut, "10:00");
  assert.equal(merged[0].inters[0].heureFin, "11:30");
  assert.equal(merged[0].inters[1].heureDebut, "10:20");
  assert.equal(merged[0].inters[1].heureFin, "11:20");
  assert.equal(merged[0].inters[1].debut, 620);
  assert.equal(merged[0].inters[1].fin, 680);

  const updated = updateInterventionInChaines(merged, 0, 0, "employes", ["Touria"]);
  assert.deepEqual(updated[0].inters[0].employes, ["Touria"]);
  assert.deepEqual(updated[0].inters[1].employes, ["Touria"]);

  const split = splitChaineAtIndex(updated, 0);
  assert.equal(split.length, 2);

  const charge = buildChargeByEmployee(split);
  assert.equal(charge.Touria.length, 2);

  const conflits = buildConflits(
    [{
      inters: [
        { nom: "Appartement Atlas", heureDebut: "10:00", heureFin: "11:30", employes: ["Touria"] },
        { nom: "Appartement Bahia", heureDebut: "11:00", heureFin: "12:00", employes: ["Touria"] },
      ],
    }],
    [{ nom: "Touria", actif: true }]
  );
  assert.equal(conflits.length, 1);
  assert.match(conflits[0], /Touria/);
});

test("les helpers d'état calculent les dérivés de l'app", () => {
  const initialDate = getInitialDateQ();
  assert.match(initialDate, /^\d{2}\/\d{2}\/\d{4}$/);
  assert.equal(getSelectedWeekday("13/04/2026"), 1);

  const chaines = [
    { inters: [{ type: "Villa", employes: ["Majda"] }, { type: "Appartement GH", employes: [] }] },
  ];
  assert.equal(countUnassignedInterventions(chaines), 1);
  assert.equal(countUnderstaffedVillas(chaines), 1);

  const adminTabs = buildTabs("admin");
  assert.equal(adminTabs.some(([key]) => key === "users"), true);
  const userTabs = buildTabs("user");
  assert.equal(userTabs.some(([key]) => key === "users"), false);

  assert.equal(createDefaultEquipe().length >= 4, true);
});

test("les helpers accès normalisent les emails et gardent les anciens identifiants admin", () => {
  assert.equal(normalizeUserLogin(" Amina@Kleaning.ma "), "amina@kleaning.ma");
  assert.equal(isValidLoginIdentifier("amina@kleaning.ma", "user"), true);
  assert.equal(isValidLoginIdentifier("amina", "user"), false);
  assert.equal(isValidLoginIdentifier("admin_local", "admin"), true);
  assert.equal(formatUserLogin("amina@kleaning.ma"), "amina@kleaning.ma");
  assert.equal(formatUserLogin("admin_local"), "@admin_local");
});

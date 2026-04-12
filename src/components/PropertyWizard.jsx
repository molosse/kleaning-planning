import { useState } from "react";
import { DS, QUARTIERS_WITH_DETAILS } from "../constants";
import {
  LINGE_MODE_KLEANING,
  LINGE_MODE_NONE,
  LINGE_MODE_PROPRIETAIRE,
  normalizeLingeMode,
} from "../lib/lieux.mjs";

const quartierOptions = QUARTIERS_WITH_DETAILS.map((quartier) => `${quartier.name} — ${quartier.category} (${quartier.kmCenter} km)`);

const WQ = [
  { id: "nom", label: "Nom du logement", placeholder: "ex: Appartement GH Lotus", req: true },
  { id: "type", label: "Type de logement", placeholder: "", req: true },
  { id: "cli", label: "Gestionnaire / client", placeholder: "ex: GetHost, Maison Madeleines", req: false },
  { id: "proprietaire", label: "Propriétaire / badge planning", placeholder: "ex: GH, Dr, Alami", req: false },
  { id: "q", label: "Quartier / Zone", placeholder: "ex: Guéliz, Targa", req: true, datalist: quartierOptions },
  { id: "adresse", label: "Adresse / Lien Google Maps", placeholder: "ex: https://maps.google.com/?q=... ou 12 Rue Ibn Khaldoun", req: false },
  { id: "d", label: "Durée intervention (min)", placeholder: "ex: 90", req: true },
  { id: "heureFin", label: "Heure limite du jour (opt)", placeholder: "ex: 16h00 ou 17h00", req: false, opts: ["16h00", "17h00", "18h00", "19h00", "20h00"] },
  { id: "code", label: "Code d'accès", placeholder: "ex: 262626#", req: false },
  { id: "notes", label: "Notes accès", placeholder: "ex: 5ème étage", req: false },
  {
    id: "lingeMode",
    label: "Linge",
    placeholder: "",
    req: false,
    opts: [
      { value: LINGE_MODE_NONE, label: "Aucun" },
      { value: LINGE_MODE_PROPRIETAIRE, label: "Linge propriétaire" },
      { value: LINGE_MODE_KLEANING, label: "Linge Kleaning" },
    ],
  },
];

export default function PropertyWizard({ onSave, onClose, lieux, typesLogement }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [err, setErr] = useState("");

  const rawQ = WQ[step];
  const q = rawQ.id === "type" ? { ...rawQ, opts: typesLogement || ["Villa", "Appartement", "Bureau", "Riad"] } : rawQ;
  const dynamicDatalist = ["cli", "proprietaire"].includes(q.id)
    ? [...new Set((lieux || []).map((lieu) => lieu[q.id]).filter(Boolean))]
    : q.datalist;

  const finish = () => {
    const heureFin = data.heureFin ? parseInt(data.heureFin, 10) * 60 : null;
    const lingeMode = normalizeLingeMode(data.lingeMode);

    onSave({
      nom: data.nom,
      type: data.type || "Appartement GH",
      cli: data.cli || "",
      proprietaire: data.proprietaire || "",
      q: data.q || "Guéliz",
      adresse: data.adresse || "",
      lat: 31.635,
      lng: -8.010,
      d: parseInt(data.d, 10) || 90,
      heureFin,
      code: data.code || "",
      notes: data.notes || "",
      lingeMode,
      lingeProprio: lingeMode === LINGE_MODE_PROPRIETAIRE,
    });
  };

  const next = () => {
    if (q.req && !data[q.id]) {
      setErr("Champ obligatoire");
      return;
    }

    setErr("");

    if (step < WQ.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    finish();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 3000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px 20px 0 0",
          padding: "0 20px calc(32px + env(safe-area-inset-bottom, 0px))",
          width: "100%",
          maxWidth: 500,
          animation: "slideUp .25s ease-out",
        }}
      >
        <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 4, margin: "14px auto 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 12px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>🏠 Nouveau logement</h2>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>Étape {step + 1} sur {WQ.length}</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", border: "none", fontSize: 17, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
        </div>

        <div style={{ height: 4, background: "#f1f5f9", borderRadius: 4, marginBottom: 20 }}>
          <div style={{ height: "100%", borderRadius: 4, background: "#3b82f6", width: `${((step + 1) / WQ.length) * 100}%`, transition: "width .3s" }} />
        </div>

        <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>
          {q.label}
          {q.req && <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>}
        </label>

        {q.opts ? (
          <select
            value={data[q.id] || ""}
            onChange={(e) => setData((prev) => ({ ...prev, [q.id]: e.target.value }))}
            style={{ width: "100%", padding: "13px 14px", border: `2px solid ${err ? "#dc2626" : "#e2e8f0"}`, borderRadius: 10, fontSize: 15, outline: "none", background: "white", minHeight: 50 }}
          >
            {q.id === "lingeMode" ? null : <option value="">Sélectionner...</option>}
            {q.opts.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const label = typeof option === "string" ? option : option.label;
              return <option key={`${q.id}-${value}`} value={value}>{label}</option>;
            })}
          </select>
        ) : q.datalist || ["cli", "proprietaire"].includes(q.id) ? (
          <>
            <input
              list={`list-${q.id}`}
              value={data[q.id] || ""}
              onChange={(e) => setData((prev) => ({ ...prev, [q.id]: e.target.value }))}
              placeholder={q.placeholder}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && next()}
              style={{ width: "100%", padding: "13px 14px", border: `2px solid ${err ? "#dc2626" : "#e2e8f0"}`, borderRadius: 10, fontSize: 15, outline: "none", minHeight: 50 }}
            />
            <datalist id={`list-${q.id}`}>
              {(dynamicDatalist || []).map((item) => <option key={item}>{item}</option>)}
            </datalist>
          </>
        ) : (
          <input
            value={data[q.id] || ""}
            onChange={(e) => setData((prev) => ({ ...prev, [q.id]: e.target.value }))}
            placeholder={q.placeholder}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && next()}
            style={{ width: "100%", padding: "13px 14px", border: `2px solid ${err ? "#dc2626" : "#e2e8f0"}`, borderRadius: 10, fontSize: 15, outline: "none", minHeight: 50 }}
          />
        )}

        {err && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#dc2626", fontWeight: 600 }}>{err}</p>}
        {q.id === "lat" && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>💡 Google Maps → clic droit → Copier les coordonnées</p>}
        {q.id === "d" && (
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[60, 90, 120, 180, 240, 270].map((value) => (
              <button
                key={value}
                onClick={() => setData((prev) => ({ ...prev, d: String(value) }))}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: `2px solid ${data.d === String(value) ? "#3b82f6" : "#e2e8f0"}`,
                  fontSize: 13,
                  fontWeight: 600,
                  background: data.d === String(value) ? "#eff6ff" : "white",
                  color: data.d === String(value) ? "#3b82f6" : "#64748b",
                  minHeight: 44,
                }}
              >
                {value}min
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {step > 0 && (
            <button
              onClick={() => {
                setStep((current) => current - 1);
                setErr("");
              }}
              style={{ flex: 1, padding: 14, background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 600, minHeight: 50 }}
            >
              ← Retour
            </button>
          )}
          <button
            onClick={next}
            style={{ flex: 2, padding: 14, background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`, color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, minHeight: 50, cursor: "pointer", fontFamily: "inherit" }}
          >
            {step === WQ.length - 1 ? "✅ Enregistrer" : "Suivant →"}
          </button>
        </div>
        {!q.req && (
          <button
            onClick={() => {
              setErr("");
              if (step < WQ.length - 1) {
                setStep((current) => current + 1);
                return;
              }
              finish();
            }}
            style={{ width: "100%", marginTop: 10, padding: 10, background: "none", border: "none", color: "#94a3b8", fontSize: 13 }}
          >
            Passer cette étape →
          </button>
        )}
      </div>
    </div>
  );
}

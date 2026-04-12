import { DS } from "../../constants";

export default function SettingsTab({
  typesLogement,
  newType,
  onNewTypeChange,
  onAddType,
  onDeleteType,
}) {
  const canDeleteType = typesLogement.length > 1;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 16 }}>🔧</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: DS.ink }}>Paramètres</span>
      </div>

      <div style={{ background: "white", borderRadius: 12, border: `1px solid ${DS.line}`, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: DS.ink, marginBottom: 12 }}>Types de logements autorisés</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {typesLogement.map((type) => (
            <div
              key={type}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 600 }}
            >
              <span>{type}</span>
              <button
                onClick={() => onDeleteType(type)}
                disabled={!canDeleteType}
                style={{ background: "none", border: "none", color: canDeleteType ? "#dc2626" : "#cbd5e1", cursor: canDeleteType ? "pointer" : "not-allowed", fontSize: 14, padding: "0 2px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={newType}
            onChange={(e) => onNewTypeChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newType.trim()) onAddType();
            }}
            placeholder="Nouveau type..."
            style={{ flex: 1, padding: "10px 14px", border: `1.5px solid ${DS.line}`, borderRadius: 10, fontSize: 14, outline: "none", minHeight: 44, background: "#FAFAF8", color: DS.ink, fontFamily: "inherit" }}
          />
          <button
            onClick={onAddType}
            style={{ padding: "10px 18px", background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`, color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, minHeight: 44, cursor: "pointer" }}
          >
            + Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

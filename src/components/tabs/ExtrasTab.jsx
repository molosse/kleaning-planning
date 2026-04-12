import { Plus, UserPlus } from "lucide-react";
import { DeleteIcon } from "../../icons/index.jsx";
import { DS } from "../../constants";

export default function ExtrasTab({
  extras,
  newExtra,
  onNewExtraChange,
  onAddExtra,
  onDeleteExtra,
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <UserPlus size={16} color={DS.brand} />
        <span style={{ fontSize: 15, fontWeight: 700, color: DS.ink }}>Extras mémorisés</span>
      </div>
      <div style={{ fontSize: 12, color: DS.ink3, marginBottom: 16 }}>
        Restent en mémoire jusqu&apos;à suppression. Disponibles dans tous les plannings.
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newExtra}
          onChange={(e) => onNewExtraChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAddExtra()}
          placeholder="Prénom de l'extra"
          style={{ flex: 1, padding: "12px 14px", border: `1.5px solid ${DS.line}`, borderRadius: 10, fontSize: 14, outline: "none", minHeight: 48, background: "#FAFAF8", color: DS.ink, fontFamily: "inherit" }}
        />
        <button
          onClick={onAddExtra}
          className="btn-primary"
          style={{
            padding: "12px 18px",
            background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            minHeight: 48,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(13,27,42,0.2)",
          }}
        >
          <Plus size={15} />
          Ajouter
        </button>
      </div>
      {extras.length === 0 ? (
        <div className="card" style={{ padding: "32px", textAlign: "center", color: DS.ink3, border: `1px dashed ${DS.line}` }}>
          Tapez un prénom et appuyez sur Entrée ou + Ajouter
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {extras.map((ex) => (
            <div
              key={ex.id}
              className="card"
              style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${DS.ink}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserPlus size={15} color={DS.ink2} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: DS.ink }}>{ex.nom}</div>
                  <div style={{ fontSize: 11, color: DS.ink3, marginTop: 1 }}>
                    Enregistré le {new Date(ex.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteExtra(ex.id)}
                className="btn-danger"
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${DS.line}`,
                  background: "white",
                  color: DS.ink3,
                  fontSize: 13,
                  fontWeight: 500,
                  minHeight: 38,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                <DeleteIcon size={13} />
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

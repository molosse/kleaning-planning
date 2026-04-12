import { AlertTriangle, CheckCircle2, Plus, X } from "lucide-react";
import { DeleteIcon, TeamIcon } from "../../icons/index.jsx";
import { DS } from "../../constants";
import { isEmployeeOffForDay, normalizeWeekdays } from "../../lib/team.mjs";

const inits = (nom) =>
  (nom || "?")
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export default function TeamTab({
  userRole,
  equipe,
  newEmp,
  onNewEmpChange,
  onAddEmp,
  onDeleteEmp,
  onToggleEmp,
  onOpenDaysOff,
  empMsg,
  selectedWeekday,
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <TeamIcon size={16} color={DS.brand} />
        <span style={{ fontSize: 15, fontWeight: 700, color: DS.ink }}>Équipe fixe</span>
      </div>
      <div style={{ fontSize: 12, color: DS.ink3, marginBottom: 16 }}>
        Les employées listées ici apparaissent dans les assignations de chaque intervention.
        {userRole !== "admin" && <span style={{ color: DS.ink3 }}> Vous pouvez gérer les jours off uniquement.</span>}
      </div>

      {userRole === "admin" && (
        <div className="card" style={{ padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: DS.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} color={DS.brand} />
            Ajouter une employée
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <div>
              <label className="section-label" style={{ display: "block", marginBottom: 6 }}>Emoji</label>
              <select
                value={newEmp.emoji}
                onChange={(e) => onNewEmpChange({ ...newEmp, emoji: e.target.value })}
                style={{ padding: "10px 12px", border: `1.5px solid ${DS.line}`, borderRadius: 9, fontSize: 18, minHeight: 48, minWidth: 70, background: "#FAFAF8" }}
              >
                {["👩", "👩‍🦱", "👩‍🦳", "👩‍🦰", "👨", "👨‍🦱", "👨‍🦳", "👨‍🦰", "🧑", "👤"].map((emoji) => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label className="section-label" style={{ display: "block", marginBottom: 6 }}>Prénom</label>
              <input
                value={newEmp.nom}
                onChange={(e) => onNewEmpChange({ ...newEmp, nom: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && onAddEmp()}
                placeholder="ex: Rachida"
                style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${DS.line}`, borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 48, background: "#FAFAF8", color: DS.ink, fontFamily: "inherit" }}
              />
            </div>
            <div style={{ paddingTop: 24 }}>
              <button
                onClick={onAddEmp}
                className="btn-primary"
                style={{
                  padding: "12px 18px",
                  background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
                  color: "white",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 14,
                  fontWeight: 600,
                  minHeight: 48,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 3px 10px rgba(13,27,42,0.2)",
                }}
              >
                <Plus size={15} />
                Ajouter
              </button>
            </div>
          </div>
          {empMsg && (
            <div
              style={{
                padding: "9px 12px",
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 500,
                background: empMsg.startsWith("✅") ? DS.sageSoft : DS.rubySoft,
                color: empMsg.startsWith("✅") ? DS.sage : DS.ruby,
                border: `1px solid ${empMsg.startsWith("✅") ? "#A7F3D0" : "#FECACA"}`,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {empMsg.startsWith("✅") ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
              {empMsg.replace("✅ ", "").replace("🗑 ", "")}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {equipe.map((emp) => (
          <div
            key={emp.id}
            className="card"
            style={{
              padding: "12px 16px",
              borderLeft: `3px solid ${emp.actif !== false ? emp.coul : DS.line}`,
              opacity: emp.actif === false ? 0.5 : 1,
              transition: "opacity .2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: emp.coul,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    flexShrink: 0,
                    color: "white",
                    border: `2px solid ${emp.coul}30`,
                  }}
                >
                  {inits(emp.nom)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: emp.actif !== false ? emp.coul : DS.ink3, display: "flex", alignItems: "center", gap: 8 }}>
                    {emp.nom}
                    {isEmployeeOffForDay(emp, selectedWeekday) && (
                      <span style={{ fontSize: 10, background: DS.rubySoft, color: DS.ruby, padding: "2px 8px", borderRadius: 8, fontWeight: 700, border: "1px solid #FECACA" }}>
                        OFF aujourd&apos;hui
                      </span>
                    )}
                    {normalizeWeekdays(emp.joursOff).length > 0 && (
                      <span style={{ fontSize: 10, background: DS.brandSoft, color: DS.brand, padding: "2px 8px", borderRadius: 8, fontWeight: 700, border: `1px solid ${DS.brandMid}` }}>
                        OFF {normalizeWeekdays(emp.joursOff).map((d) => ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][d]).join(",")}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: DS.ink3, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    {emp.actif === false ? (
                      <>
                        <X size={10} />
                        Inactive
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={10} color={DS.sage} />
                        Active
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => onOpenDaysOff(emp.id)}
                  style={{ padding: "7px 11px", borderRadius: 8, fontSize: 11, fontWeight: 600, minHeight: 38, cursor: "pointer", border: `1px solid ${DS.line}`, background: "white", color: DS.ink2, transition: "all .15s" }}
                >
                  Off
                </button>
                {userRole === "admin" && (
                  <>
                    <button
                      onClick={() => onToggleEmp(emp.id, emp.actif === false)}
                      style={{
                        padding: "7px 11px",
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        minHeight: 38,
                        cursor: "pointer",
                        border: `1px solid ${emp.actif !== false ? DS.line : "#A7F3D0"}`,
                        background: emp.actif !== false ? "#FAFAF8" : DS.sageSoft,
                        color: emp.actif !== false ? DS.ink2 : DS.sage,
                        transition: "all .15s",
                      }}
                    >
                      {emp.actif !== false ? "Désactiver" : "Activer"}
                    </button>
                    <button
                      onClick={() => onDeleteEmp(emp.id)}
                      className="btn-danger"
                      style={{
                        padding: "7px 11px",
                        borderRadius: 8,
                        border: `1px solid ${DS.line}`,
                        background: "white",
                        color: DS.ink3,
                        fontSize: 13,
                        minHeight: 38,
                        cursor: "pointer",
                        transition: "all .15s",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <DeleteIcon size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {equipe.length === 0 && (
          <div style={{ background: "white", borderRadius: 10, padding: "28px", textAlign: "center", color: "#94a3b8", border: "1px dashed #e2e8f0" }}>
            Aucune employée dans l&apos;équipe
          </div>
        )}
      </div>

      <div style={{ marginTop: 14, padding: "10px 13px", background: "#eff6ff", borderRadius: 9, border: "1px solid #bfdbfe", fontSize: 11, color: "#1e40af" }}>
        💡 <strong>Désactiver</strong> masque l&apos;employée des assignations sans la supprimer — utile en cas d&apos;absence prolongée.
        <strong> Supprimer</strong> la retire définitivement de l&apos;équipe.
      </div>
    </div>
  );
}

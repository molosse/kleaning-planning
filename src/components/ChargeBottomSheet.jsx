import BottomSheet from "./BottomSheet.jsx";
import { toWA } from "../lib/planning.mjs";

const inits = (nom) =>
  (nom || "?")
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export default function ChargeBottomSheet({
  visible,
  onClose,
  equipe,
  chargeByEmployee,
  conflits,
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="👥 Charge du jour">
      {equipe.filter((employee) => employee.actif !== false).map((employee) => {
        const tasks = chargeByEmployee[employee.nom] || [];
        return (
          <div key={employee.nom} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 10, background: employee.bg }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: employee.coul }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: employee.coul, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {inits(employee.nom)}
                </span>
                {employee.nom}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: tasks.length >= 3 ? "#ef4444" : tasks.length >= 2 ? "#f97316" : tasks.length >= 1 ? "#059669" : "#94a3b8" }}>
                {tasks.length > 0 ? `${tasks.length} mission${tasks.length > 1 ? "s" : ""}` : "—"}
              </span>
            </div>
            {tasks.length > 0 && (
              <div style={{ paddingLeft: 12, marginTop: 4 }}>
                {tasks.map((task, index) => (
                  <div key={index} style={{ fontSize: 12, color: "#94a3b8", paddingBottom: 2 }}>
                    {toWA(task.heureDebut)} · {task.nom.replace("Appartement GH ", "").replace("Appartement ", "")}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {conflits.length > 0 && (
        <div style={{ marginTop: 6, padding: "10px 12px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fca5a5" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>⚠️ Conflits</div>
          {conflits.map((conflit, index) => (
            <div key={index} style={{ fontSize: 12, color: "#dc2626" }}>
              {conflit}
            </div>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}

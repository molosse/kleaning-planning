import { useRef, useState } from "react";
import { MissionIcon, NettoyageIcon, LogementIcon } from "../icons/index.jsx";
import { CLIENT_COLORS, DS, EQUIPE_FALLBACK } from "../constants";
import { getLingeModeMeta } from "../lib/lieux.mjs";
import { toWA } from "../lib/planning.mjs";
import { isEmployeeOffForDay } from "../lib/team.mjs";
import EmployeeSelector from "./EmployeeSelector.jsx";

const HEURES = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00",
];

const inits = (nom) =>
  (nom || "?")
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

function getTypeInfo(type, cli) {
  const cliColors = CLIENT_COLORS[cli];
  if (cli === "Cabinet médical") return { IC: MissionIcon, color: cliColors?.color || "#b5172d", bg: cliColors?.bg || "#fdeef0" };
  if (type === "Villa") return { IC: LogementIcon, color: cliColors?.color || "#1e4fa8", bg: cliColors?.bg || "#edf1fb" };
  if (type === "Riad") return { IC: LogementIcon, color: cliColors?.color || "#c84b1f", bg: cliColors?.bg || "#fdf1ec" };
  if (type === "Bureau") return { IC: MissionIcon, color: cliColors?.color || "#3d4155", bg: cliColors?.bg || "#f1f0ec" };
  return { IC: NettoyageIcon, color: cliColors?.color || "#3a6b54", bg: cliColors?.bg || "#edf4f0" };
}

export default function InterventionCard({
  interv,
  extras,
  equipe,
  selectedWeekday,
  onChange,
  chaineBg,
  chaineBorder,
}) {
  const [openSel, setOpenSel] = useState(false);
  const [editHr, setEditHr] = useState(false);
  const btnRef = useRef();

  const resolvedEquipe = equipe || EQUIPE_FALLBACK;
  const ep = resolvedEquipe.find((emp) => emp.nom === (interv.employes || [])[0]);
  const isBureau = interv.type === "Bureau" || interv.cli === "Cabinet médical";
  const isVilla = interv.type === "Villa";
  const villaManque = isVilla && (interv.employes || []).length < 2;
  const { IC: TypeIC, color: typeColor, bg: typeBg } = getTypeInfo(interv.type, interv.cli);
  const lingeMeta = getLingeModeMeta(interv.lingeMode, interv.lingeProprio);

  return (
    <div
      className="planning-intervention-card"
      style={{
        padding: "13px 15px",
        background: chaineBg || "white",
        borderLeft: `3px solid ${ep ? ep.coul : chaineBorder || DS.line}`,
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <div className="planning-intervention-header" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
        {editHr ? (
          <div
            className="planning-intervention-time-edit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "white",
              borderRadius: 8,
              padding: "6px 10px",
              border: "2px solid #3b82f6",
              flexShrink: 0,
              maxWidth: "100%",
              overflowX: "auto",
            }}
          >
            <select
              value={interv.heureDebut}
              onChange={(e) => onChange("heureDebut", e.target.value)}
              style={{ border: "none", background: "transparent", fontSize: 14, fontWeight: 700, color: "#3b82f6", outline: "none", cursor: "pointer" }}
            >
              {HEURES.map((h) => <option key={h}>{h}</option>)}
            </select>
            {isBureau && (
              <>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>→</span>
                <select
                  value={interv.heureFin}
                  onChange={(e) => onChange("heureFin", e.target.value)}
                  style={{ border: "none", background: "transparent", fontSize: 14, fontWeight: 700, color: "#3b82f6", outline: "none", cursor: "pointer" }}
                >
                  {HEURES.map((h) => <option key={h}>{h}</option>)}
                </select>
              </>
            )}
            <button
              onClick={() => setEditHr(false)}
              style={{ background: "#3b82f6", color: "white", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 700, minHeight: 32 }}
            >
              ✓
            </button>
          </div>
        ) : (
          <button
            className="planning-intervention-time"
            onClick={() => setEditHr(true)}
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              border: "1.5px solid rgba(0,0,0,0.1)",
              flexShrink: 0,
              whiteSpace: "nowrap",
              minHeight: 40,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            ✏️ {isBureau ? `${toWA(interv.heureDebut)}→${toWA(interv.heureFin)}` : toWA(interv.heureDebut)}
          </button>
          )}

        <div className="planning-intervention-main" style={{ minWidth: 0, flex: 1 }}>
          {interv.proprietaire && (
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: typeColor, marginBottom: 3 }}>
              👤 {interv.proprietaire}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ width: 26, height: 26, borderRadius: 6, background: typeBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TypeIC size={14} color={typeColor} />
            </span>
            <div className="planning-intervention-title" style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.2 }}>
              {interv.nom}
            </div>
          </div>
          <div className="planning-intervention-meta" style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span>{interv.d}min</span>
            {interv.lieu?.q && <span>· {interv.lieu.q}</span>}
            {!interv.lieu && <span style={{ color: "#f59e0b", fontWeight: 600 }}>⚠️ GPS manquant</span>}
            {isVilla && (
              <span
                style={{
                  color: "#ea580c",
                  fontWeight: 700,
                  background: "rgba(255,255,255,0.7)",
                  padding: "1px 7px",
                  borderRadius: 10,
                  border: "1px solid #fed7aa",
                  fontSize: 10,
                }}
              >
                🏠 min 2 personnes
              </span>
            )}
          </div>
        </div>
      </div>

      {/villa|appartement|riad/i.test(interv.type) && (
        <div className="planning-intervention-flags" style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => onChange("bla_linge", !interv.bla_linge)}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              minHeight: 44,
              background: interv.bla_linge ? "#fef9c3" : "rgba(255,255,255,0.7)",
              color: interv.bla_linge ? "#92400e" : "#94a3b8",
              border: `1.5px solid ${interv.bla_linge ? "#fde68a" : "rgba(0,0,0,0.1)"}`,
            }}
          >
            🧺 {interv.bla_linge ? "Bla linge ✓" : "Bla linge"}
          </button>
          {lingeMeta && (
            <span
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                minHeight: 44,
                background: lingeMeta.bg,
                color: lingeMeta.color,
                border: `1.5px solid ${lingeMeta.border}`,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {lingeMeta.icon} {lingeMeta.label}
            </span>
          )}
        </div>
      )}

      <div className="planning-intervention-assignees" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
          Assignées
        </span>

        {(interv.employes || []).map((nom) => {
          const emp = resolvedEquipe.find((item) => item.nom === nom) || { nom, coul: "#64748b", bg: "#f1f5f9", emoji: "👤" };
          const isOff = isEmployeeOffForDay(emp, selectedWeekday);

          return (
            <span
              className="planning-intervention-assignee"
              key={nom}
              style={{
                padding: "5px 10px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                background: emp.bg,
                color: emp.coul,
                border: `1.5px solid ${emp.coul}40`,
                display: "flex",
                alignItems: "center",
                gap: 4,
                maxWidth: "100%",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: emp.coul,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {inits(emp.nom)}
              </span>
              {emp.nom}
              {isOff && (
                <span
                  style={{
                    fontSize: 10,
                    background: DS.rubySoft,
                    color: DS.ruby,
                    padding: "1px 6px",
                    borderRadius: 8,
                    fontWeight: 700,
                    border: "1px solid #FECACA",
                  }}
                >
                  OFF
                </span>
              )}
              <button
                onClick={() => onChange("employes", (interv.employes || []).filter((item) => item !== nom))}
                style={{
                  background: "none",
                  border: "none",
                  color: emp.coul,
                  fontSize: 14,
                  padding: "0 0 0 2px",
                  opacity: 0.5,
                  lineHeight: 1,
                  minWidth: 20,
                  minHeight: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </span>
          );
        })}

        {villaManque && (interv.employes || []).length === 1 && (
          <span
            style={{
              fontSize: 11,
              color: "#ea580c",
              background: "rgba(255,255,255,0.8)",
              padding: "3px 8px",
              borderRadius: 10,
              border: "1px solid #fed7aa",
              fontWeight: 600,
            }}
          >
            ⚠️ + 1 personne requise
          </span>
        )}

        <div className="planning-intervention-plus">
          {!(interv.employes || []).length ? (
            <button
              className="planning-intervention-add"
              ref={btnRef}
              onClick={() => setOpenSel((prev) => !prev)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                minHeight: 44,
                background: "rgba(255,255,255,0.9)",
                color: "#dc2626",
                border: "2px solid #fca5a5",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ⚠️ À assigner
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#dc2626",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                +
              </span>
            </button>
          ) : (
            <button
              className="planning-intervention-add"
              ref={btnRef}
              onClick={() => setOpenSel((prev) => !prev)}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.8)",
                color: "#475569",
                border: "1.5px solid rgba(0,0,0,0.15)",
                fontSize: 20,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              +
            </button>
          )}

          {openSel && (
            <EmployeeSelector
              employes={interv.employes || []}
              extras={extras}
              equipe={resolvedEquipe}
              selectedWeekday={selectedWeekday}
              anchorRef={btnRef}
              onAdd={(nom) => {
                if (!(interv.employes || []).includes(nom)) {
                  onChange("employes", [...(interv.employes || []), nom]);
                }
              }}
              onRemove={(nom) => onChange("employes", (interv.employes || []).filter((item) => item !== nom))}
              onClose={() => setOpenSel(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

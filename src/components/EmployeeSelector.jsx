import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DS, EQUIPE_FALLBACK } from "../constants";
import { isEmployeeOffForDay } from "../lib/team.mjs";

const inits = (nom) =>
  (nom || "?")
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export default function EmployeeSelector({
  employes,
  extras,
  equipe,
  selectedWeekday,
  onAdd,
  onRemove,
  onClose,
  anchorRef,
}) {
  const allExtras = extras.map((extra) => ({ nom: extra.nom, coul: "#64748b", bg: "#f1f5f9", emoji: "👤" }));
  const available = [
    ...(equipe || EQUIPE_FALLBACK).filter((emp) => !employes.includes(emp.nom) && emp.actif !== false),
    ...allExtras.filter((extra) => !employes.includes(extra.nom)),
  ];

  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow > 240 ? rect.bottom + 6 : rect.top - 242;
      const dropW = Math.min(210, window.innerWidth - 16);
      setPos({
        top,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - dropW - 8)),
        width: dropW,
      });
    }
  }, [anchorRef]);

  const content = (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 9998 }} onClick={onClose} />
      <div
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          zIndex: 9999,
          width: pos.width || 200,
          background: "white",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
          padding: 10,
        }}
      >
        {available.length === 0 ? (
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, padding: "4px 0" }}>Toutes assignées</p>
        ) : (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6, letterSpacing: "0.05em" }}>
              Ajouter
            </div>
            {available.map((emp) => (
              <button
                key={emp.nom}
                onClick={() => {
                  onAdd(emp.nom);
                  onClose();
                }}
                style={{
                  width: "100%",
                  padding: "10px 10px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 3,
                  background: emp.bg,
                  color: emp.coul,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 44,
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: emp.coul,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {inits(emp.nom)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {emp.nom}
                  {isEmployeeOffForDay(emp, selectedWeekday) && (
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
                      OFF aujourd&apos;hui
                    </span>
                  )}
                </span>
              </button>
            ))}
          </>
        )}

        {employes.length > 0 && (
          <>
            <div style={{ height: 1, background: "#f1f5f9", margin: "8px 0" }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6, letterSpacing: "0.05em" }}>
              Retirer
            </div>
            {employes.map((nom) => {
              const emp = (equipe || EQUIPE_FALLBACK).find((item) => item.nom === nom) || {
                nom,
                coul: "#64748b",
                bg: "#f1f5f9",
                emoji: "👤",
              };

              return (
                <button
                  key={nom}
                  onClick={() => {
                    onRemove(nom);
                    onClose();
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 10px",
                    borderRadius: 8,
                    border: "1px solid #fca5a5",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 3,
                    background: "#fef2f2",
                    color: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 44,
                  }}
                >
                  ✕ {nom}
                  {isEmployeeOffForDay(emp, selectedWeekday) && (
                    <span
                      style={{
                        fontSize: 10,
                        background: "white",
                        color: "#b91c1c",
                        padding: "1px 6px",
                        borderRadius: 8,
                        fontWeight: 700,
                        border: "1px solid #fecaca",
                      }}
                    >
                      OFF
                    </span>
                  )}
                </button>
              );
            })}
          </>
        )}
      </div>
    </>
  );

  return createPortal(content, document.body);
}

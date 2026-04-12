import { useEffect, useState } from "react";
import { DS } from "../constants";

export default function DaysOffWeekModal({ visible, empName, initialWeekdays, onSave, onCancel }) {
  const dayShort = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
  const [weekdays, setWeekdays] = useState(initialWeekdays || []);

  useEffect(() => {
    setWeekdays(initialWeekdays || []);
  }, [visible, initialWeekdays]);

  if (!visible) return null;

  const toggleWeekday = (day) => {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((value) => value !== day) : [...prev, day].sort((a, b) => a - b)));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 3500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          maxWidth: 440,
          width: "calc(100% - 24px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "fadeIn .25s ease-out",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: DS.ink }}>Jours off - {empName}</h3>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: DS.ink3 }}>Selectionnez les jours de semaine off (sans date)</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 12 }}>
          {dayShort.map((day, index) => {
            const active = weekdays.includes(index);
            return (
              <button
                key={index}
                onClick={() => toggleWeekday(index)}
                style={{
                  padding: "8px 8px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  minHeight: 40,
                  border: `1px solid ${active ? DS.brand : DS.line}`,
                  background: active ? DS.brandSoft : "white",
                  color: active ? DS.brand : DS.ink2,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 12, color: DS.ink3, marginBottom: 14 }}>
          {weekdays.length === 0 ? "Aucun jour off defini" : `${weekdays.length} jour${weekdays.length > 1 ? "s" : ""} off`}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 12,
              background: DS.paper2,
              border: `1px solid ${DS.line}`,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: DS.ink2,
              cursor: "pointer",
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(weekdays)}
            style={{
              flex: 1,
              padding: 12,
              background: DS.brand,
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

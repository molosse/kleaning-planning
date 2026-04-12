import { ChevronRight, Zap } from "lucide-react";
import { TimeIcon } from "../../icons/index.jsx";
import { DS, EQUIPE, TYPE_IC } from "../../constants";

export default function HistoryTab({
  historique,
  histVisible,
  histExpanded,
  onToggleEntry,
  onShowMore,
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <TimeIcon size={16} color={DS.brand} />
        <span style={{ fontSize: 15, fontWeight: 700, color: DS.ink }}>Historique des plannings</span>
      </div>
      <div style={{ fontSize: 12, color: DS.ink3, marginBottom: 16 }}>
        Plannings générés et sauvegardés automatiquement. Cliquez sur un jour pour le consulter ou le restaurer.
      </div>

      {historique.length === 0 ? (
        <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: DS.ink, marginBottom: 6 }}>Aucun historique</div>
          <div style={{ fontSize: 13, color: DS.ink3 }}>Les plannings générés apparaîtront ici automatiquement</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {historique.slice(0, histVisible).map((h) => {
            const isOpen = histExpanded === h.date;
            return (
              <div key={h.date} className="card" style={{ overflow: "hidden", transition: "all .2s" }}>
                <div
                  style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                  onClick={() => onToggleEntry(h, isOpen)}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${DS.ink}12 0%, ${DS.brand}18 100%)`,
                      border: `1px solid ${DS.line}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 800, color: DS.ink, lineHeight: 1 }}>
                      {new Date(h.date).getDate()}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: DS.ink3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {new Date(h.date).toLocaleDateString("fr-FR", { month: "short" })}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: DS.ink,
                        marginBottom: 2,
                        textTransform: "capitalize",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h.dateLabel || h.date}
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: DS.ink3, display: "flex", alignItems: "center", gap: 4 }}>
                        <Zap size={10} color={DS.brand} />
                        {h.nbChaines} chaîne{h.nbChaines > 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: 11, color: DS.ink3 }}>
                        · {new Date(h.savedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {h.agents?.length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                        {h.agents.map((agent) => {
                          const emp = EQUIPE.find((entry) => entry.nom === agent);
                          return (
                            <span
                              key={agent}
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "1px 7px",
                                borderRadius: 20,
                                background: emp?.bg || "#f1f5f9",
                                color: emp?.coul || DS.ink2,
                                border: `1px solid ${emp?.coul || DS.line}22`,
                              }}
                            >
                              {emp?.emoji || "👤"} {agent}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <ChevronRight
                      size={16}
                      color={DS.ink3}
                      style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s" }}
                    />
                  </div>
                </div>

                {isOpen && h.chaines && (
                  <div
                    style={{
                      borderTop: `1px solid ${DS.line}`,
                      padding: "12px 16px",
                      background: DS.paper,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {h.chaines.map((chaine, ci) => (
                      <div key={ci} style={{ background: "white", borderRadius: 10, border: `1px solid ${DS.line}`, overflow: "hidden" }}>
                        <div
                          style={{
                            padding: "8px 12px",
                            background: `${DS.ink}06`,
                            borderBottom: `1px solid ${DS.line}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 700, color: DS.ink2 }}>
                            {chaine.inters.length === 2 ? `✦ Chaîne ${ci + 1}` : `· Solo ${ci + 1}`}
                          </span>
                          <span style={{ fontSize: 11, color: DS.ink3, display: "flex", alignItems: "center", gap: 4 }}>
                            <TimeIcon size={9} />
                            {chaine.inters[0]?.heureDebut || ""}
                            {chaine.inters.length > 1 && <> → {chaine.inters[chaine.inters.length - 1]?.heureFin}</>}
                          </span>
                        </div>
                        {chaine.inters.map((inter, ii) => (
                          <div key={ii} style={{ padding: "8px 12px", borderBottom: ii < chaine.inters.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: DS.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {TYPE_IC[inter.type] || "🔵"} {inter.nom}
                                </div>
                                <div style={{ fontSize: 11, color: DS.ink3, marginTop: 2 }}>
                                  {inter.heureDebut} · {inter.d}min{inter.lieu?.q && ` · ${inter.lieu.q}`}
                                </div>
                              </div>
                              {(inter.employes || []).length > 0 && (
                                <div style={{ fontSize: 11, fontWeight: 600, color: DS.ink2, flexShrink: 0, marginLeft: 8 }}>
                                  {(inter.employes || []).join(", ")}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {historique.length > histVisible && (
            <button
              onClick={onShowMore}
              style={{
                padding: "13px",
                border: `1.5px dashed ${DS.line}`,
                borderRadius: 12,
                background: "transparent",
                color: DS.ink2,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                minHeight: 48,
              }}
              className="btn-ghost"
            >
              <ChevronRight size={14} style={{ transform: "rotate(90deg)" }} />
              Voir {Math.min(15, historique.length - histVisible)} plannings de plus
            </button>
          )}
        </div>
      )}
    </div>
  );
}

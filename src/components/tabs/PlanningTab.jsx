import {
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  RefreshCw,
  Send,
  X,
  Zap,
} from "lucide-react";
import InterventionCard from "../InterventionCard.jsx";
import { DeleteIcon, LocationIcon, TeamIcon, TimeIcon } from "../../icons/index.jsx";
import { CHAINE_COLORS, CENTRE, DS } from "../../constants";
import { toWA, trajetMin } from "../../lib/planning.mjs";

const inits = (nom) => (nom || "?").split(/\s+/).map((part) => (part[0] || "")).join("").slice(0, 2).toUpperCase() || "?";

export default function PlanningTab({
  dateQ,
  loading,
  onLoadAgenda,
  autoAssocierLogements,
  onAutoAssocierChange,
  msg,
  nbSans,
  nbVilla,
  chaines,
  associerMode,
  onAssocierModeChange,
  onSeparateChaine,
  onAssocierChaines,
  onDeleteChaine,
  extras,
  equipe,
  selectedWeekday,
  onChangeInChaine,
  isVillaInter,
  chargeByEmployee,
  conflits,
  onOpenCharge,
  onGenerateWhatsApp,
  waText,
  copied,
  waSent,
  onCopyWhatsApp,
  onOpenWhatsApp,
}) {
  return (
    <>
      <div className="card" style={{ padding: "16px", marginBottom: 14 }}>
        <div className="planning-controls" style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="planning-date-field" style={{ flex: "0 0 128px", minWidth: 110, maxWidth: 150 }}>
            <label className="section-label" style={{ display: "block", marginBottom: 6 }}>Date</label>
            <input
              value={dateQ}
              readOnly
              style={{ padding: "10px 13px", border: `1.5px solid ${DS.line}`, borderRadius: 10, fontSize: 14, width: "100%", fontFamily: "inherit", minHeight: 46, background: "#F0EDE8", color: DS.ink2, cursor: "default" }}
            />
          </div>
          <button
            onClick={onLoadAgenda}
            disabled={loading}
            className="btn-primary planning-load-button"
            style={{ flex: "1 1 160px", minWidth: 0, padding: "12px 18px", background: loading ? DS.ink3 : `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`, color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, minHeight: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: loading ? "none" : "0 4px 14px rgba(13,27,42,0.25)", cursor: loading ? "not-allowed" : "pointer" }}
          >
            <RefreshCw size={15} style={{ animation: loading ? "spin .8s linear infinite" : "none" }} />
            {loading ? "Chargement…" : "Charger l'agenda Kleaning"}
          </button>
          <label className="planning-auto-associate" style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 46, padding: "0 4px", color: DS.ink2, fontSize: 12, fontWeight: 600, cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={autoAssocierLogements}
              onChange={(e) => onAutoAssocierChange(e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer", accentColor: DS.brand, flexShrink: 0 }}
            />
            Associer automatiquement les logements
          </label>
        </div>

        {msg && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              background: msg.startsWith("✅") ? DS.sageSoft : msg.startsWith("ℹ️") ? "#EFF6FF" : DS.rubySoft,
              color: msg.startsWith("✅") ? DS.sage : msg.startsWith("ℹ️") ? "#1E40AF" : DS.ruby,
              border: `1px solid ${msg.startsWith("✅") ? "#A7F3D0" : msg.startsWith("ℹ️") ? "#BFDBFE" : "#FECACA"}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {msg.startsWith("✅") ? <CheckCircle2 size={14} /> : msg.startsWith("ℹ️") ? <Zap size={14} /> : <AlertTriangle size={14} />}
            <span style={{ flex: 1 }}>{msg.replace("✅ ", "").replace("ℹ️ ", "")}</span>
            {nbSans > 0 && <span style={{ background: DS.rubySoft, color: DS.ruby, padding: "3px 9px", borderRadius: 8, fontSize: 11, border: "1px solid #FECACA", fontWeight: 700, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={10} />{nbSans} sans assignation</span>}
            {nbVilla > 0 && <span style={{ background: DS.amberSoft, color: DS.amber, padding: "3px 9px", borderRadius: 8, fontSize: 11, border: `1px solid ${DS.amber}`, fontWeight: 700, whiteSpace: "nowrap" }}>Villa &lt; 2</span>}
          </div>
        )}
      </div>

      {chaines.length === 0 ? (
        <div className="card" style={{ padding: "52px 24px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${DS.ink}14 0%, ${DS.brand}18 100%)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: `1px solid ${DS.line}` }}>
            <CalendarDays size={28} color={DS.brand} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: DS.ink, marginBottom: 6 }}>Aucun planning chargé</div>
          <div style={{ fontSize: 13, color: DS.ink3 }}>Saisissez une date et appuyez sur "Charger l'agenda Kleaning"</div>
        </div>
      ) : (
        <div className="layout-2col" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 14, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: DS.ink3, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={11} color={DS.brand} /> {chaines.length} chaîne{chaines.length > 1 ? "s" : ""} · même couleur = assigner ensemble
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {chaines.map((chaine, ci) => {
                const estPaire = chaine.inters.length === 2;
                const estSolo = chaine.inters.length === 1;
                const inter0 = chaine.inters[0];
                const estVilla = isVillaInter(inter0);
                const estSource = associerMode === ci;
                const estCible = associerMode !== null && associerMode !== ci && estSolo && !estVilla;
                const colorIdx = estPaire ? chaines.filter((current, index) => index < ci && current.inters.length === 2).length % CHAINE_COLORS.length : -1;
                const couleur = estPaire ? CHAINE_COLORS[colorIdx] : null;
                const chaineBg = estSource ? "#FFFBEB" : estCible ? `${DS.ink}08` : couleur ? couleur.bg : "white";
                const chaineBorder = estSource ? DS.amber : estCible ? DS.ink : couleur ? couleur.border : DS.line;

                return (
                  <div className="planning-chain-card" key={ci} style={{ borderRadius: 16, overflow: "hidden", border: `${estSource || estCible ? "2px" : "1.5px"} solid ${chaineBorder}`, boxShadow: estCible ? `0 0 0 3px ${DS.ink}18` : "0 2px 10px rgba(13,27,42,0.06)", transition: "all .2s" }}>
                    <div className="planning-chain-header" style={{ background: chaineBg, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, borderBottom: `1px solid ${chaineBorder}` }}>
                      <div className="planning-chain-header-main" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: couleur ? couleur.label : DS.ink2 }}>
                          {estPaire ? `✦ Chaîne ${ci + 1}` : `· Solo ${ci + 1}`}
                        </span>
                        <span style={{ fontSize: 11, color: DS.ink3, display: "flex", alignItems: "center", gap: 4 }}>
                          <TimeIcon size={10} />
                          {chaine.dureeTotal}min
                          {chaine.trajetTotal > 0 && (
                            <>
                              <LocationIcon size={9} />
                              {chaine.trajetTotal}min
                            </>
                          )}
                        </span>
                      </div>
                      <div className="planning-chain-header-actions" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        {estPaire && (
                          <button
                            onClick={() => onSeparateChaine(ci)}
                            title="Séparer en 2 tâches indépendantes"
                            style={{ minHeight: 44, padding: "0 10px", borderRadius: 8, background: "rgba(255,255,255,0.85)", border: `1px solid ${chaineBorder}`, color: couleur ? couleur.label : DS.ink2, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", transition: "all .15s" }}
                          >
                            <X size={11} /> Séparer
                          </button>
                        )}
                        {estSolo && !estVilla && !estCible && (
                          estSource ? (
                            <button
                              onClick={() => onAssocierModeChange(null)}
                              style={{ minHeight: 44, padding: "0 10px", borderRadius: 8, background: DS.amberSoft, border: `1px solid ${DS.amber}`, color: DS.amber, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}
                            >
                              <X size={11} /> Annuler
                            </button>
                          ) : (
                            associerMode === null && (
                              <button
                                onClick={() => onAssocierModeChange(ci)}
                                title="Associer à une autre tâche"
                                style={{ minHeight: 44, padding: "0 10px", borderRadius: 8, background: "rgba(255,255,255,0.85)", border: `1px solid ${DS.line}`, color: DS.ink2, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", transition: "all .15s" }}
                              >
                                🔗 Associer
                              </button>
                            )
                          )
                        )}
                        {estCible && (
                          <button
                            onClick={() => onAssocierChaines(associerMode, ci)}
                            style={{ minHeight: 44, padding: "0 12px", borderRadius: 8, background: DS.ink, color: "white", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(13,27,42,0.3)" }}
                          >
                            ✓ Choisir
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteChaine(ci)}
                          className="btn-danger"
                          style={{ minWidth: 44, minHeight: 44, borderRadius: 8, background: "rgba(255,255,255,0.8)", border: `1px solid ${DS.line}`, color: DS.ink3, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s" }}
                        >
                          <DeleteIcon size={13} />
                        </button>
                      </div>
                    </div>

                    {chaine.inters.map((inter, ii) => (
                      <div key={inter.id}>
                        <InterventionCard
                          interv={inter}
                          extras={extras}
                          equipe={equipe}
                          selectedWeekday={selectedWeekday}
                          onChange={(field, value) => onChangeInChaine(ci, ii, field, value)}
                          chaineBg={chaineBg}
                          chaineBorder={chaineBorder}
                        />
                        {ii < chaine.inters.length - 1 && (
                          <div className="planning-chain-route" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: chaineBg, borderTop: `1px solid ${chaineBorder}`, borderBottom: `1px solid ${chaineBorder}` }}>
                            <div style={{ flex: 1, height: 1, background: chaineBorder }} />
                            <span className="planning-chain-route-label" style={{ fontSize: 10, color: DS.ink3, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, overflow: "hidden", maxWidth: "70%", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                              <LocationIcon size={9} style={{ flexShrink: 0 }} />
                              {trajetMin(inter.lieu || CENTRE, chaine.inters[ii + 1].lieu || CENTRE)}min › {chaine.inters[ii + 1].nom.replace("Appartement GH ", "").replace("Appartement ", "")}
                            </span>
                            <div style={{ flex: 1, height: 1, background: chaineBorder }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="mobile-only" style={{ display: "none", gap: 10, marginTop: 14, flexDirection: "column" }}>
              <button
                onClick={onOpenCharge}
                className="card"
                style={{ width: "100%", padding: "14px 16px", border: `1px solid ${DS.line}`, borderRadius: 12, fontSize: 14, fontWeight: 600, color: DS.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, cursor: "pointer", background: "white" }}
              >
                <TeamIcon size={16} color={DS.brand} />
                Charge du jour
                {conflits.length > 0 && <span style={{ background: DS.rubySoft, color: DS.ruby, padding: "2px 8px", borderRadius: 8, fontSize: 12, border: "1px solid #FECACA", fontWeight: 700 }}>{conflits.length} conflit{conflits.length > 1 ? "s" : ""}</span>}
              </button>
              <button
                onClick={onGenerateWhatsApp}
                className="btn-primary"
                style={{ width: "100%", padding: "14px 16px", background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`, color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(13,27,42,0.25)" }}
              >
                <Send size={15} /> Générer le planning WhatsApp
              </button>
            </div>
          </div>

          <div className="panel-right desktop-only" style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 72 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: DS.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <TeamIcon size={12} color={DS.brand} /> Charge du jour
              </div>
              {equipe.filter((employee) => employee.actif !== false).map((employee) => {
                const tasks = chargeByEmployee[employee.nom] || [];
                return (
                  <div key={employee.nom} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: 10, background: employee.bg, border: `1px solid ${employee.coul}20` }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 12, color: employee.coul }}>
                        <span style={{ width: 20, height: 20, borderRadius: "50%", background: employee.coul, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "white", flexShrink: 0 }}>{inits(employee.nom)}</span>
                        {employee.nom}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: tasks.length >= 3 ? "#DC2626" : tasks.length >= 2 ? "#D97706" : tasks.length >= 1 ? DS.sage : DS.ink3 }}>
                        {tasks.length > 0 ? `${tasks.length} mission${tasks.length > 1 ? "s" : ""}` : "—"}
                      </span>
                    </div>
                    {tasks.length > 0 && (
                      <div style={{ paddingLeft: 10, marginTop: 3 }}>
                        {tasks.map((task, index) => (
                          <div key={index} style={{ fontSize: 10, color: DS.ink3, display: "flex", alignItems: "center", gap: 4, paddingBottom: 1 }}>
                            <ChevronRight size={9} color={employee.coul} />
                            {toWA(task.heureDebut)} {task.nom.replace("Appartement GH ", "").replace("Appartement ", "")}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {conflits.length > 0 ? (
              <div style={{ background: DS.rubySoft, borderRadius: 12, padding: "12px 14px", border: "1px solid #FECACA" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: DS.ruby, marginBottom: 6, display: "flex", alignItems: "center", gap: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <AlertTriangle size={12} /> Conflits ({conflits.length})
                </div>
                {conflits.map((conflit, index) => <div key={index} style={{ fontSize: 11, color: DS.ruby, paddingBottom: 2 }}>{conflit}</div>)}
              </div>
            ) : (
              <div className="card" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, background: DS.sageSoft, border: "1px solid #A7F3D0" }}>
                <CheckCircle2 size={14} color={DS.sage} />
                <span style={{ fontSize: 12, fontWeight: 600, color: DS.sage }}>Aucun conflit</span>
              </div>
            )}

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: DS.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Send size={12} color={DS.brand} /> WhatsApp
              </div>
              <button
                onClick={onGenerateWhatsApp}
                className="btn-primary"
                style={{ width: "100%", padding: 11, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`, color: "white", marginBottom: 8, minHeight: 44, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 12px rgba(13,27,42,0.2)" }}
              >
                <Zap size={14} /> Générer le planning
              </button>
              {waText && (
                <>
                  <textarea
                    readOnly
                    value={waText}
                    onClick={(e) => {
                      e.target.select();
                      e.target.setSelectionRange(0, 99999);
                    }}
                    style={{ width: "100%", background: "#FAFAF8", borderRadius: 9, padding: 10, fontFamily: "monospace", fontSize: 10, lineHeight: 1.7, border: `1px solid ${DS.line}`, height: 140, resize: "none", boxSizing: "border-box", color: DS.ink, outline: "none", marginBottom: 8 }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      onClick={onCopyWhatsApp}
                      style={{ padding: "10px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", background: copied ? DS.sageSoft : "#F4F2EE", color: copied ? DS.sage : DS.ink2, border: `1px solid ${copied ? "#A7F3D0" : DS.line}`, minHeight: 42, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copié !" : "Copier"}
                    </button>
                    <button
                      onClick={onOpenWhatsApp}
                      style={{ padding: "10px", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", background: waSent ? "#128C7E" : "#25D366", color: "white", minHeight: 42, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                    >
                      {waSent ? <Check size={14} /> : <Send size={14} />} {waSent ? "Envoyé !" : "WhatsApp"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

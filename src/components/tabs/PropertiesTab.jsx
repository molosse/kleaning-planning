import { CheckCircle2, Plus } from "lucide-react";
import { LocationIcon, PropertyIcon } from "../../icons/index.jsx";
import { DS, QUARTIERS_WITH_DETAILS, TYPE_IC } from "../../constants";
import { getLingeModeMeta, normalizeLieuRecord, prepareLieuPayload } from "../../lib/lieux.mjs";

function getFilteredLieux(lieux, searchLieux) {
  if (!searchLieux) return lieux;
  const q = searchLieux.toLowerCase();
  return lieux.filter((lieu) =>
    lieu.nom.toLowerCase().includes(q) ||
    lieu.q?.toLowerCase().includes(q) ||
    lieu.proprietaire?.toLowerCase().includes(q) ||
    lieu.cli?.toLowerCase().includes(q) ||
    lieu.type.toLowerCase().includes(q)
  );
}

export default function PropertiesTab({
  lieux,
  userRole,
  onOpenWizard,
  searchLieux,
  onSearchChange,
  msg,
  editLieu,
  setEditLieu,
  typesLogement,
  onDeleteLieu,
  onSaveLieu,
}) {
  const normalizedLieux = lieux.map(normalizeLieuRecord);
  const filteredLieux = getFilteredLieux(normalizedLieux, searchLieux);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PropertyIcon size={16} color={DS.brand} />
          <span style={{ fontSize: 15, fontWeight: 700, color: DS.ink }}>{lieux.length} logements</span>
        </div>
        {userRole === "admin" && (
          <button
            onClick={onOpenWizard}
            className="btn-primary"
            style={{
              padding: "10px 18px",
              background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              minHeight: 42,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(13,27,42,0.2)",
            }}
          >
            <Plus size={14} />
            Ajouter
          </button>
        )}
      </div>

      {userRole !== "admin" && (
        <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 500, background: "#EFF6FF", color: "#1E40AF", border: "1px solid #BFDBFE" }}>
          Mode utilisateur: consultation des logements uniquement.
        </div>
      )}

      <div style={{ position: "relative", marginBottom: 14 }}>
        <input
          value={searchLieux}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par nom, quartier, propriétaire, client, type…"
          style={{ width: "100%", padding: "11px 14px 11px 40px", border: `1.5px solid ${DS.line}`, borderRadius: 10, fontSize: 14, outline: "none", background: "white", color: DS.ink, fontFamily: "inherit", boxSizing: "border-box", minHeight: 46 }}
        />
        <LocationIcon size={15} color={DS.ink3} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        {searchLieux && (
          <button
            onClick={() => onSearchChange("")}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: DS.ink3, cursor: "pointer", fontSize: 16, padding: 4, lineHeight: 1 }}
          >
            ✕
          </button>
        )}
      </div>

      {msg && (
        <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500, background: DS.sageSoft, color: DS.sage, border: "1px solid #A7F3D0", display: "flex", alignItems: "center", gap: 7 }}>
          <CheckCircle2 size={14} />
          {msg.replace("✅ ", "").replace("🗑 ", "")}
        </div>
      )}

      {searchLieux && (
        <div style={{ fontSize: 12, color: DS.ink3, marginBottom: 10 }}>
          {filteredLieux.length} résultat{filteredLieux.length > 1 ? "s" : ""}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredLieux.map((lieu) => {
          const isEdit = editLieu?.id === lieu.id;
          const lingeMeta = getLingeModeMeta(lieu.lingeMode, lieu.lingeProprio);
          const borderColor = lieu.type === "Villa" ? "#d97706" : lieu.type === "Riad" ? "#dc2626" : lieu.type === "Bureau" ? "#2563eb" : "#059669";

          return (
            <div
              key={lieu.id}
              style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", borderLeft: `4px solid ${borderColor}`, overflow: "hidden", width: "100%", maxWidth: "100%" }}
            >
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                    {isEdit ? (
                      <input
                        value={editLieu.nom}
                        onChange={(e) => setEditLieu((prev) => ({ ...prev, nom: e.target.value }))}
                        style={{ width: "100%", padding: "8px 10px", border: "2px solid #3b82f6", borderRadius: 8, fontSize: 14, fontWeight: 600, outline: "none", boxSizing: "border-box", minHeight: 44 }}
                      />
                    ) : (
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", lineHeight: 1.3 }}>
                        {TYPE_IC[lieu.type] || "🔵"} {lieu.nom}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                      {isEdit ? (
                        <select
                          value={editLieu.type}
                          onChange={(e) => setEditLieu((prev) => ({ ...prev, type: e.target.value }))}
                          style={{ padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 12, minHeight: 36 }}
                        >
                          {typesLogement.map((type) => <option key={type}>{type}</option>)}
                        </select>
                      ) : (
                        <span style={{ fontSize: 11, color: "#64748b", background: "#f8fafc", padding: "3px 8px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                          {lieu.type}
                        </span>
                      )}

                      {!isEdit && lieu.proprietaire && (
                        <span style={{ fontSize: 11, color: "#0f172a", background: "#f0fdf4", padding: "3px 8px", borderRadius: 8, border: "1px solid #bbf7d0", fontWeight: 600 }}>
                          👤 {lieu.proprietaire}
                        </span>
                      )}

                      {isEdit ? (
                        <>
                          <input
                            list="list-q-edit"
                            value={editLieu.q}
                            onChange={(e) => setEditLieu((prev) => ({ ...prev, q: e.target.value }))}
                            style={{ padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 12, width: 150, outline: "none", minHeight: 36 }}
                          />
                          <datalist id="list-q-edit">
                            {QUARTIERS_WITH_DETAILS.map((quartier) => (
                              <option key={quartier.name}>{quartier.name} — {quartier.category} ({quartier.kmCenter} km)</option>
                            ))}
                          </datalist>
                        </>
                      ) : (
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>📍 {lieu.q}</span>
                      )}
                    </div>
                  </div>

                  {userRole === "admin" && (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {!isEdit ? (
                        <>
                          <button onClick={() => setEditLieu(prepareLieuPayload(lieu))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 13, minHeight: 44 }}>
                            ✏️
                          </button>
                          <button onClick={() => onDeleteLieu(lieu.id)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontSize: 13, minHeight: 44 }}>
                            🗑
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => onSaveLieu(lieu.id, editLieu)} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#059669", color: "white", fontSize: 13, fontWeight: 700, minHeight: 44 }}>
                            ✓
                          </button>
                          <button onClick={() => setEditLieu(null)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 13, minHeight: 44 }}>
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Durée</div>
                    {isEdit ? (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <input
                          value={editLieu.d}
                          onChange={(e) => setEditLieu((prev) => ({ ...prev, d: parseInt(e.target.value, 10) || 90 }))}
                          type="number"
                          style={{ width: 60, padding: "6px 8px", border: "2px solid #3b82f6", borderRadius: 7, fontSize: 13, fontWeight: 700, color: "#3b82f6", outline: "none", textAlign: "center", minHeight: 44 }}
                        />
                        {[60, 90, 120, 180, 240].map((value) => (
                          <button
                            key={value}
                            onClick={() => setEditLieu((prev) => ({ ...prev, d: value }))}
                            style={{ padding: "5px 10px", borderRadius: 7, border: `1.5px solid ${editLieu.d === value ? "#3b82f6" : "#e2e8f0"}`, fontSize: 11, background: editLieu.d === value ? "#eff6ff" : "white", color: editLieu.d === value ? "#3b82f6" : "#64748b", fontWeight: editLieu.d === value ? 700 : 400, minHeight: 36 }}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                        {lieu.d}
                        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400, marginLeft: 3 }}>min</span>
                      </span>
                    )}
                  </div>

                  {(isEdit || lieu.code) && (
                    <div>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Code</div>
                      {isEdit ? (
                        <input
                          value={editLieu.code || ""}
                          onChange={(e) => setEditLieu((prev) => ({ ...prev, code: e.target.value }))}
                          style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, width: 100, outline: "none", minHeight: 44 }}
                        />
                      ) : (
                        <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>🔑 {lieu.code}</span>
                      )}
                    </div>
                  )}

                  {(isEdit || lieu.notes) && (
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
                      {isEdit ? (
                        <input
                          value={editLieu.notes || ""}
                          onChange={(e) => setEditLieu((prev) => ({ ...prev, notes: e.target.value }))}
                          style={{ width: "100%", padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", minHeight: 44 }}
                        />
                      ) : (
                        <span style={{ fontSize: 12, color: "#64748b" }}>{lieu.notes}</span>
                      )}
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Gestionnaire / client</div>
                    {isEdit ? (
                      <>
                        <input
                          list="list-cli-edit"
                          value={editLieu.cli || ""}
                          onChange={(e) => setEditLieu((prev) => ({ ...prev, cli: e.target.value }))}
                          placeholder="ex: GetHost, Maison Madeleines"
                          style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, width: 160, outline: "none", minHeight: 44, boxSizing: "border-box" }}
                        />
                        <datalist id="list-cli-edit">
                          {[...new Set(normalizedLieux.map((entry) => entry.cli).filter(Boolean))].map((client) => <option key={client}>{client}</option>)}
                        </datalist>
                      </>
                    ) : lieu.cli ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{lieu.cli}</span>
                    ) : (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Propriétaire</div>
                    {isEdit ? (
                      <>
                        <input
                          list="list-proprietaire-edit"
                          value={editLieu.proprietaire || ""}
                          onChange={(e) => setEditLieu((prev) => ({ ...prev, proprietaire: e.target.value }))}
                          placeholder="ex: GH, Dr, Alami"
                          style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, width: 140, outline: "none", minHeight: 44, boxSizing: "border-box" }}
                        />
                        <datalist id="list-proprietaire-edit">
                          {[...new Set(normalizedLieux.map((entry) => entry.proprietaire).filter(Boolean))].map((proprietaire) => <option key={proprietaire}>{proprietaire}</option>)}
                        </datalist>
                      </>
                    ) : lieu.proprietaire ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>👤 {lieu.proprietaire}</span>
                    ) : (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                    )}
                  </div>

                  {/villa|appartement|riad/i.test(isEdit ? editLieu.type : lieu.type) && (
                    <div>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Linge</div>
                      {isEdit ? (
                        <select
                          value={editLieu.lingeMode || ""}
                          onChange={(e) => setEditLieu((prev) => ({ ...prev, lingeMode: e.target.value }))}
                          style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, width: 160, outline: "none", minHeight: 44, boxSizing: "border-box", background: "white" }}
                        >
                          <option value="">Aucun</option>
                          <option value="proprietaire">Linge propriétaire</option>
                          <option value="kleaning">Linge Kleaning</option>
                        </select>
                      ) : lingeMeta ? (
                        <span style={{ fontSize: 12, fontWeight: 600, color: lingeMeta.color, background: lingeMeta.bg, padding: "3px 10px", borderRadius: 10, border: `1px solid ${lingeMeta.border}` }}>{lingeMeta.icon} {lingeMeta.shortLabel}</span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                      )}
                    </div>
                  )}
                </div>

                {(isEdit || lieu.adresse) && (() => {
                  const adresse = isEdit ? editLieu.adresse : lieu.adresse;
                  const isMap = adresse && /maps\.google|goo\.gl\/maps|maps\.app\.goo/i.test(adresse);
                  return (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${DS.line}` }}>
                      <div className="section-label" style={{ marginBottom: 5 }}>Adresse</div>
                      {isEdit ? (
                        <input
                          value={editLieu.adresse || ""}
                          onChange={(e) => setEditLieu((prev) => ({ ...prev, adresse: e.target.value }))}
                          placeholder="Adresse texte ou lien Google Maps"
                          style={{ width: "100%", padding: "7px 10px", border: `1px solid ${DS.line}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", minHeight: 40, background: "#FAFAF8", fontFamily: "inherit", color: DS.ink }}
                        />
                      ) : isMap ? (
                        <a
                          href={lieu.adresse}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: DS.ink2, fontWeight: 500, textDecoration: "none", padding: "5px 10px", borderRadius: 8, background: `${DS.ink}08`, border: `1px solid ${DS.ink}18` }}
                        >
                          <LocationIcon size={13} color={DS.brand} />
                          Voir sur Google Maps
                        </a>
                      ) : (
                        <span style={{ fontSize: 13, color: DS.ink2, display: "flex", alignItems: "center", gap: 5 }}>
                          <LocationIcon size={13} color={DS.brand} />
                          {lieu.adresse}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

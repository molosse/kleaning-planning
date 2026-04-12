import { DS } from "../../constants";

export default function UsersTab({
  userMsg,
  newUser,
  onNewUserChange,
  onCreateUser,
  users,
  editUserId,
  editUserForm,
  onEditUserFormChange,
  onOpenEditUser,
  onSaveEditUser,
  onCancelEditUser,
  pwdUserId,
  pwdValue,
  onPwdValueChange,
  onOpenPasswordChange,
  onSavePassword,
  onCancelPassword,
  currentUserId,
  onDeleteUser,
}) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>⚙️ Gestion des accès</div>
      {userMsg && (
        <div
          style={{
            marginBottom: 12,
            padding: "9px 12px",
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 600,
            background: userMsg.startsWith("✅") ? "#f0fdf4" : "#fef2f2",
            color: userMsg.startsWith("✅") ? "#166534" : "#dc2626",
            border: `1px solid ${userMsg.startsWith("✅") ? "#86efac" : "#fca5a5"}`,
          }}
        >
          {userMsg}
        </div>
      )}

      <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e2e8f0", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>+ Créer un accès</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[["Identifiant", "username", "ex: amina", false], ["Mot de passe", "password", "ex: Kleaning2024", true], ["Prénom affiché", "displayName", "ex: Amina", false]].map(([label, key, placeholder, isPwd]) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
              <input
                type={isPwd ? "password" : "text"}
                value={newUser[key]}
                onChange={(e) => onNewUserChange(key, e.target.value)}
                placeholder={placeholder}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 48 }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Niveau d'accès</label>
            <select
              value={newUser.role}
              onChange={(e) => onNewUserChange("role", e.target.value)}
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 48, background: "white" }}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <button
            onClick={onCreateUser}
            className="btn-primary"
            style={{ padding: "14px", background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`, color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, minHeight: 50, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 10px rgba(13,27,42,0.2)" }}
          >
            Créer l'accès
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{ background: "white", borderRadius: 10, padding: "12px 14px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              {editUserId === user.id && user.role !== "admin" ? (
                <div style={{ display: "grid", gap: 6, minWidth: 240 }}>
                  <input
                    value={editUserForm.displayName}
                    onChange={(e) => onEditUserFormChange("displayName", e.target.value)}
                    placeholder="Nom affiché"
                    style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, minHeight: 38 }}
                  />
                  <input
                    value={editUserForm.username}
                    onChange={(e) => onEditUserFormChange("username", e.target.value)}
                    placeholder="Identifiant"
                    style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, minHeight: 38 }}
                  />
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                    {user.displayName}
                    {user.role === "admin" && <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", padding: "1px 7px", borderRadius: 8, fontWeight: 700 }}>ADMIN</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    @{user.username} · {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </>
              )}

              {pwdUserId === user.id && (
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  <input
                    type="password"
                    value={pwdValue}
                    onChange={(e) => onPwdValueChange(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, minHeight: 38, minWidth: 180 }}
                  />
                  <button
                    onClick={() => onSavePassword(user.id)}
                    style={{ padding: "8px 10px", borderRadius: 8, border: "none", background: "#059669", color: "white", fontSize: 12, fontWeight: 700, minHeight: 38 }}
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={onCancelPassword}
                    style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 12, minHeight: 38 }}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {user.role !== "admin" && editUserId !== user.id && (
                <button
                  onClick={() => onOpenEditUser(user)}
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 12, minHeight: 38 }}
                >
                  Modifier
                </button>
              )}
              {user.role !== "admin" && editUserId === user.id && (
                <>
                  <button
                    onClick={() => onSaveEditUser(user.id)}
                    style={{ padding: "8px 10px", borderRadius: 8, border: "none", background: "#2563eb", color: "white", fontSize: 12, fontWeight: 700, minHeight: 38 }}
                  >
                    Sauver
                  </button>
                  <button
                    onClick={onCancelEditUser}
                    style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 12, minHeight: 38 }}
                  >
                    Annuler
                  </button>
                </>
              )}
              <button
                onClick={() => onOpenPasswordChange(user.id)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#1f2937", fontSize: 12, minHeight: 38 }}
              >
                Mot de passe
              </button>
              {user.id !== currentUserId && user.role !== "admin" && (
                <button
                  onClick={() => onDeleteUser(user.id)}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontSize: 13, minHeight: 38 }}
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

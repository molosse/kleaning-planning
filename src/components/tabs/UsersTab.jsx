import { DS } from "../../constants";
import {
  formatUserLogin,
  isValidLoginIdentifier,
  normalizeUserLogin,
} from "../../lib/users.mjs";

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
  const loginFieldLabel = newUser.role === "user" ? "Email de connexion" : "Identifiant ou email admin";
  const loginFieldPlaceholder = newUser.role === "user" ? "ex: amina@kleaning.ma" : "ex: admin";
  const normalizedCreateLogin = normalizeUserLogin(newUser.username);
  const createLoginError = (() => {
    if (newUser.role === "user") {
      if (!normalizedCreateLogin) return "Un email est obligatoire pour créer un compte utilisateur.";
      if (!isValidLoginIdentifier(normalizedCreateLogin, "user")) return "Renseigne un email valide, par exemple amina@kleaning.ma.";
    } else if (!normalizedCreateLogin) {
      return "Renseigne un identifiant ou un email pour ce compte administrateur.";
    }
    return "";
  })();
  const disableCreateUser = !newUser.displayName.trim() || !newUser.password.trim() || !!createLoginError;

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
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Pseudo affiché</label>
            <input
              type="text"
              value={newUser.displayName}
              onChange={(e) => onNewUserChange("displayName", e.target.value)}
              placeholder="ex: Amina"
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 48 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{loginFieldLabel}</label>
            <input
              type="text"
              inputMode={newUser.role === "user" ? "email" : "text"}
              value={newUser.username}
              onChange={(e) => onNewUserChange("username", e.target.value)}
              placeholder={loginFieldPlaceholder}
              style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${createLoginError ? "#fca5a5" : "#e2e8f0"}`, borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 48 }}
            />
            <div style={{ marginTop: 5, fontSize: 11, color: createLoginError ? "#dc2626" : "#64748b" }}>
              {createLoginError || (newUser.role === "user"
                ? "Cet email servira d'identifiant de connexion pour l'utilisateur."
                : "Tu peux utiliser un email ou un identifiant admin classique.")}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Mot de passe</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => onNewUserChange("password", e.target.value)}
              placeholder="ex: Kleaning2024"
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 48 }}
            />
          </div>
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
            disabled={disableCreateUser}
            className="btn-primary"
            style={{ padding: "14px", background: disableCreateUser ? "#cbd5e1" : `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`, color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, minHeight: 50, cursor: disableCreateUser ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: disableCreateUser ? "none" : "0 3px 10px rgba(13,27,42,0.2)" }}
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
              {(() => {
                const isEditingUser = editUserId === user.id && user.role !== "admin";
                const normalizedEditLogin = normalizeUserLogin(editUserForm.username);
                const editLoginError = isEditingUser && !normalizedEditLogin
                  ? "Un email est obligatoire pour cet utilisateur."
                  : isEditingUser && !isValidLoginIdentifier(normalizedEditLogin, "user")
                    ? "Renseigne un email valide pour enregistrer."
                    : "";

                if (isEditingUser) {
                  return (
                    <div style={{ display: "grid", gap: 6, minWidth: 240 }}>
                      <input
                        value={editUserForm.displayName}
                        onChange={(e) => onEditUserFormChange("displayName", e.target.value)}
                        placeholder="Pseudo affiché"
                        style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, minHeight: 38 }}
                      />
                      <input
                        type="text"
                        inputMode="email"
                        value={editUserForm.username}
                        onChange={(e) => onEditUserFormChange("username", e.target.value)}
                        placeholder="email@kleaning.ma"
                        style={{ padding: "8px 10px", border: `1px solid ${editLoginError ? "#fca5a5" : "#cbd5e1"}`, borderRadius: 8, fontSize: 13, minHeight: 38 }}
                      />
                      <div style={{ fontSize: 11, color: editLoginError ? "#dc2626" : "#64748b" }}>
                        {editLoginError || "L'utilisateur se connectera avec cet email."}
                      </div>
                    </div>
                  );
                }

                return (
                  <>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                      {user.displayName}
                      {user.role === "admin" && <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", padding: "1px 7px", borderRadius: 8, fontWeight: 700 }}>ADMIN</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                      {formatUserLogin(user.username)} · {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </>
                );
              })()}

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
                  {(() => {
                    const normalizedEditLogin = normalizeUserLogin(editUserForm.username);
                    const disableSaveEditUser = !editUserForm.displayName.trim()
                      || !normalizedEditLogin
                      || !isValidLoginIdentifier(normalizedEditLogin, "user");

                    return (
                  <button
                    onClick={() => onSaveEditUser(user.id)}
                    disabled={disableSaveEditUser}
                    style={{ padding: "8px 10px", borderRadius: 8, border: "none", background: disableSaveEditUser ? "#cbd5e1" : "#2563eb", color: "white", fontSize: 12, fontWeight: 700, minHeight: 38, cursor: disableSaveEditUser ? "not-allowed" : "pointer" }}
                  >
                    Sauver
                  </button>
                    );
                  })()}
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

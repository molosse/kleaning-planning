import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur de connexion"); return; }
      sessionStorage.setItem("kleaning_token", data.token);
      onLogin({ displayName: data.displayName, role: data.role });
    } catch { setError("Serveur inaccessible"); }
    finally  { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100dvh", /* dvh = dynamic viewport height — corrige iOS */
      background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px 16px",
    }}>
      <div style={{
        background: "white", borderRadius: 20, padding: "32px 24px",
        width: "100%", maxWidth: 380,
        boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🧹</div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>Kleaning</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Planning & Optimisation · Marrakech</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Identifiant
            </label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              placeholder="votre identifiant"
              autoComplete="username" required
              style={{
                width: "100%", padding: "13px 14px", border: "1.5px solid #e2e8f0",
                borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box",
                minHeight: 50, transition: "border-color .15s",
              }}
              onFocus={e => e.target.style.borderColor = "#3b82f6"}
              onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Mot de passe
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password" required
              style={{
                width: "100%", padding: "13px 14px", border: "1.5px solid #e2e8f0",
                borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box",
                minHeight: 50, transition: "border-color .15s",
              }}
              onFocus={e => e.target.style.borderColor = "#3b82f6"}
              onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5",
              borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600,
              marginBottom: 16, textAlign: "center",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "14px", minHeight: 52,
              background: loading ? "#94a3b8" : "#0f172a", color: "white",
              border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background .15s",
            }}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p style={{ margin: "20px 0 0", fontSize: 10, color: "#cbd5e1", textAlign: "center" }}>
          Casoar Services · planning.kleaning.ma
        </p>
      </div>
    </div>
  );
}

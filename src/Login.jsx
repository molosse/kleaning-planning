import { useState } from "react";
import { DS_LOGIN, DS } from "./constants";

// ── SVG : Motif géométrique marocain (zellige) ─────────────────
const MoroccanPattern = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
    <defs>
      <pattern id="zellige" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {/* Étoile à 8 branches marocaine */}
        <polygon points="40,4 46,28 68,16 56,36 76,40 56,44 68,64 46,52 40,76 34,52 12,64 24,44 4,40 24,36 12,16 34,28"
          fill="none" stroke="${DS_LOGIN.gold}" strokeWidth="1.2"/>
        <polygon points="40,14 44,28 56,22 50,34 62,40 50,46 56,58 44,52 40,66 36,52 24,58 30,46 18,40 30,34 24,22 36,28"
          fill="none" stroke="${DS_LOGIN.gold}" strokeWidth="0.6"/>
        <circle cx="40" cy="40" r="6" fill="none" stroke="${DS_LOGIN.gold}" strokeWidth="0.8"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#zellige)"/>
  </svg>
);

// ── SVG : Silhouette de Marrakech (Koutoubia + palmiers) ───────
const MarrakechSkyline = () => (
  <svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", opacity: 0.35 }}>
    {/* Ciel étoilé */}
    {[60,140,200,290,350,420,500,580,640,720].map((x, i) => (
      <circle key={i} cx={x} cy={[30,15,40,20,35,10,25,38,18,28][i]} r="1.5" fill="${DS_LOGIN.gold}" opacity="0.8"/>
    ))}
    {/* Lune */}
    <circle cx="700" cy="30" r="18" fill="${DS_LOGIN.beige}" opacity="0.6"/>
    <circle cx="710" cy="24" r="14" fill="${DS_LOGIN.darkNavy}" opacity="0.9"/>

    {/* Palmiers gauche */}
    <rect x="30" y="110" width="5" height="80" fill="${DS_LOGIN.navyMid}"/>
    <ellipse cx="32" cy="105" rx="18" ry="10" fill="${DS_LOGIN.navyMid}" transform="rotate(-20 32 105)"/>
    <ellipse cx="32" cy="105" rx="18" ry="10" fill="${DS_LOGIN.navyMid}" transform="rotate(20 32 105)"/>
    <ellipse cx="32" cy="105" rx="18" ry="10" fill="${DS_LOGIN.navyMid}" transform="rotate(0 32 105)"/>

    {/* Minaret de la Koutoubia (centre) */}
    <rect x="370" y="20" width="60" height="160" fill="${DS_LOGIN.darkNavy}"/>
    <rect x="360" y="90" width="80" height="20" fill="${DS_LOGIN.darkNavy}"/>
    <rect x="355" y="140" width="90" height="40" fill="${DS_LOGIN.darkNavy}"/>
    {/* Détails minaret */}
    <rect x="375" y="30" width="50" height="12" fill="${DS_LOGIN.darkNavy}" opacity="0.5"/>
    <rect x="375" y="50" width="50" height="12" fill="${DS_LOGIN.darkNavy}" opacity="0.5"/>
    <rect x="375" y="70" width="50" height="12" fill="${DS_LOGIN.darkNavy}" opacity="0.5"/>
    {/* Sommet minaret */}
    <polygon points="400,5 380,22 420,22" fill="${DS_LOGIN.gold}"/>
    <rect x="396" y="0" width="8" height="12" fill="${DS_LOGIN.gold}"/>
    <circle cx="400" cy="0" r="4" fill="${DS_LOGIN.gold}"/>

    {/* Maisons médina gauche */}
    <rect x="100" y="100" width="80" height="90" fill="${DS_LOGIN.darkNavy}"/>
    <rect x="90" y="120" width="40" height="70" fill="${DS_LOGIN.darkNavy}"/>
    <rect x="160" y="130" width="50" height="60" fill="${DS_LOGIN.navyMid}"/>
    {/* Arches */}
    <path d="M 120 190 Q 130 160 140 190" fill="${DS_LOGIN.darkNavy}"/>
    <path d="M 170 190 Q 180 168 190 190" fill="${DS_LOGIN.darkNavy}"/>

    {/* Maisons médina droite */}
    <rect x="560" y="110" width="70" height="80" fill="${DS_LOGIN.darkNavy}"/>
    <rect x="610" y="95" width="50" height="95" fill="${DS_LOGIN.darkNavy}"/>
    <rect x="650" y="120" width="60" height="70" fill="${DS_LOGIN.navyMid}"/>
    <path d="M 575 190 Q 585 165 595 190" fill="${DS_LOGIN.darkNavy}"/>
    <path d="M 620 190 Q 630 162 640 190" fill="${DS_LOGIN.darkNavy}"/>

    {/* Palmiers droite */}
    <rect x="763" y="115" width="5" height="75" fill="${DS_LOGIN.navyMid}"/>
    <ellipse cx="765" cy="110" rx="18" ry="10" fill="${DS_LOGIN.navyMid}" transform="rotate(-15 765 110)"/>
    <ellipse cx="765" cy="110" rx="18" ry="10" fill="${DS_LOGIN.navyMid}" transform="rotate(25 765 110)"/>
    <ellipse cx="765" cy="110" rx="18" ry="10" fill="${DS_LOGIN.navyMid}"/>

    {/* Sol */}
    <rect x="0" y="185" width="800" height="15" fill="${DS_LOGIN.darkNavy}"/>
  </svg>
);

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusUser, setFocusUser] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Identifiants incorrects"); return; }
      sessionStorage.setItem("kleaning_token", data.token);
      onLogin({ displayName: data.displayName, role: data.role });
    } catch { setError("Serveur inaccessible"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── CÔTÉ GAUCHE : Visuel Marrakech (desktop uniquement) ── */}
      <div className="login-visual" style={{
        flex: "0 0 55%",
        position: "relative",
        background: "linear-gradient(155deg, ${DS_LOGIN.darkNavy} 0%, ${DS_LOGIN.navyMid} 40%, ${DS_LOGIN.darkNavy} 70%, ${DS_LOGIN.darkNavy} 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        padding: "48px",
      }}>
        {/* Motif zellige en arrière-plan */}
        <MoroccanPattern />

        {/* Dégradé radial doré au centre */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}/>

        {/* Skyline Marrakech */}
        <MarrakechSkyline />

        {/* Texte accroche */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)",
            borderRadius: 100, padding: "6px 14px", marginBottom: 20,
          }}>
            <span style={{ color: "${DS_LOGIN.gold}", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              ✦ Marrakech
            </span>
          </div>
          <h1 style={{
            margin: "0 0 12px", fontSize: 42, fontWeight: 700, lineHeight: 1.1,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "${DS_LOGIN.cream}",
            letterSpacing: "-0.5px",
          }}>
            L'excellence<br />
            <span style={{ color: "${DS_LOGIN.gold}" }}>du service</span>
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "rgba(245,236,215,0.6)", lineHeight: 1.6, maxWidth: 320 }}>
            Gestion intelligente du planning de nettoyage pour les propriétés de Marrakech.
          </p>
        </div>
      </div>

      {/* ── CÔTÉ DROIT : Formulaire de connexion ── */}
      <div style={{
        flex: 1,
        background: "#f8f7f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        position: "relative",
        minHeight: "100dvh",
      }}>
        {/* Motif léger en arrière-plan sur mobile */}
        <div className="login-bg-mobile" style={{
          position: "absolute", inset: 0, overflow: "hidden",
          background: "linear-gradient(155deg, ${DS_LOGIN.darkNavy} 0%, ${DS_LOGIN.navyMid} 100%)",
          display: "none",
        }}>
          <MoroccanPattern />
        </div>

        <div style={{
          background: "white",
          borderRadius: 24,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
          position: "relative",
          boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 40px rgba(13,27,42,0.10)",
          border: "1px solid rgba(232,224,213,0.8)",
        }}>
          {/* Logo */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <img
              src="/logo.png"
              alt="KleanBnB"
              style={{
                width: 160,
                height: "auto",
                objectFit: "contain",
                marginBottom: 8,
              }}
            />
            <p style={{ margin: 0, fontSize: 13, color: "#8A9BB0" }}>
              Planning & Optimisation · Marrakech
            </p>
          </div>

          <form onSubmit={submit}>
            {/* Champ identifiant */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 12, fontWeight: 600, color: "#4A5568",
                display: "block", marginBottom: 8,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                Identifiant
              </label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focusUser ? "${DS_LOGIN.gold}" : "#94a3b8", transition: "color .15s" }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="votre identifiant"
                  autoComplete="username" required
                  onFocus={() => setFocusUser(true)}
                  onBlur={() => setFocusUser(false)}
                  style={{
                    width: "100%", padding: "13px 14px 13px 42px",
                    border: `1.5px solid ${focusUser ? "${DS_LOGIN.gold}" : "${DS.line}"}`,
                    borderRadius: 12, fontSize: 14, outline: "none",
                    boxSizing: "border-box", minHeight: 50,
                    background: focusUser ? "#FFFDF7" : "#FAFAF8",
                    color: "${DS_LOGIN.darkNavy}", fontFamily: "inherit",
                    transition: "border-color .15s, background .15s",
                  }}
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                fontSize: 12, fontWeight: 600, color: "#4A5568",
                display: "block", marginBottom: 8,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focusPass ? "${DS_LOGIN.gold}" : "#94a3b8", transition: "color .15s" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password" required
                  onFocus={() => setFocusPass(true)}
                  onBlur={() => setFocusPass(false)}
                  style={{
                    width: "100%", padding: "13px 14px 13px 42px",
                    border: `1.5px solid ${focusPass ? "${DS_LOGIN.gold}" : "${DS.line}"}`,
                    borderRadius: 12, fontSize: 14, outline: "none",
                    boxSizing: "border-box", minHeight: 50,
                    background: focusPass ? "#FFFDF7" : "#FAFAF8",
                    color: "${DS_LOGIN.darkNavy}", fontFamily: "inherit",
                    transition: "border-color .15s, background .15s",
                  }}
                />
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div style={{
                background: "#FEF2F2", color: "${DS.ruby}",
                border: "1px solid #FECACA",
                borderRadius: 10, padding: "10px 14px",
                fontSize: 13, fontWeight: 500,
                marginBottom: 16, textAlign: "center",
                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="${DS.ruby}" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="${DS.ruby}" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="${DS.ruby}" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* Bouton connexion */}
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "15px",
                background: loading
                  ? "#94a3b8"
                  : `linear-gradient(135deg, ${DS_LOGIN.darkNavy} 0%, #1a2d47 50%, #2a4a6f 100%)`,
                color: "white",
                border: `2px solid ${loading ? "transparent" : "${DS_LOGIN.gold}"}`, borderRadius: 14, fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                minHeight: 52, fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: loading ? "none" : `0 4px 14px rgba(13,27,42,0.4), inset 0 1px 0 rgba(201,168,76,0.3)`,
                transition: "all .2s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Connexion en cours…
                </>
              ) : (
                <>
                  Se connecter
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #F0EBE3", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#B0A898" }}>
              Casoar Services · planning.kleaning.ma
            </p>
          </div>
        </div>
      </div>

      {/* ── CSS spécifique Login ── */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .login-visual { animation: fadeInUp .5s ease-out; }
        @media (max-width: 768px) {
          .login-visual { display: none !important; }
          .login-bg-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}

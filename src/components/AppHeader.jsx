import { LogOut } from "lucide-react";
import { DS } from "../constants";

export default function AppHeader({
  userDisplayName,
  tabs,
  activeTab,
  onSelectTab,
  onLogout,
}) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(13,27,42,0.3)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1080, margin: "0 auto", height: 58 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/logo.png"
            alt="KleanBnB"
            style={{ height: 36, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.92 }}
          />
          <div style={{ display: "flex", flexDirection: "column", fontSize: 10, lineHeight: 1.2, fontWeight: 500, whiteSpace: "nowrap" }}>
            <div style={{ color: "rgba(201,168,76,0.9)", fontSize: 11, fontWeight: 700 }}>planning Kleaning</div>
            <div style={{ color: "rgba(201,168,76,0.6)", fontSize: 9 }}>{userDisplayName}</div>
          </div>
        </div>

        <div className="nav-top-tabs" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {tabs.map(([key, , label]) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => onSelectTab(key)}
                style={{
                  padding: "7px 13px",
                  borderRadius: 9,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  background: active ? "rgba(201,168,76,0.18)" : "transparent",
                  color: active ? "#C9A84C" : "rgba(255,255,255,0.55)",
                  borderBottom: active ? "2px solid #C9A84C" : "2px solid transparent",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={onLogout}
            className="btn-ghost"
            style={{
              marginLeft: 8,
              padding: "6px 12px",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 9,
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "all .15s",
            }}
          >
            <LogOut size={12} />
            Déco
          </button>
        </div>
      </div>
    </div>
  );
}

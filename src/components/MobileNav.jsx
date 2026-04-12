import { CalendarDays, LogOut, Settings, Star, UserPlus } from "lucide-react";
import { TimeIcon, PropertyIcon, TeamIcon } from "../icons/index.jsx";
import { DS } from "../constants";

const NAV_ICONS = {
  planning: <CalendarDays size={20} />,
  historique: <TimeIcon size={20} />,
  lieux: <PropertyIcon size={20} />,
  extras: <UserPlus size={20} />,
  equipe: <TeamIcon size={20} />,
  users: <Settings size={20} />,
};

export default function MobileNav({ tabs, activeTab, onSelectTab, onLogout }) {
  return (
    <nav
      className="nav-bottom"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: DS.ink,
        borderTop: "1px solid rgba(201,168,76,0.2)",
        display: "flex",
        alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom,0px)",
        boxShadow: "0 -4px 20px rgba(13,27,42,0.25)",
      }}
    >
      {tabs.map(([key, , label]) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onSelectTab(key)}
            style={{
              flex: 1,
              padding: "10px 4px 8px",
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              color: active ? DS.brand : "rgba(255,255,255,0.38)",
              cursor: "pointer",
              minHeight: 56,
              borderTop: active ? `2px solid ${DS.brand}` : "2px solid transparent",
              transition: "all .15s",
            }}
          >
            {NAV_ICONS[key] || <Star size={20} />}
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, letterSpacing: "0.04em", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {label}
            </span>
          </button>
        );
      })}
      <button
        onClick={onLogout}
        style={{
          flex: 1,
          padding: "10px 4px 8px",
          background: "none",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          color: "rgba(255,255,255,0.3)",
          cursor: "pointer",
          minHeight: 56,
          borderTop: "2px solid transparent",
        }}
      >
        <LogOut size={20} />
        <span style={{ fontSize: 9, fontWeight: 500 }}>Sortir</span>
      </button>
    </nav>
  );
}

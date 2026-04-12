export default function ConfirmDialog({ visible, title, message, confirmText, onConfirm, onCancel }) {
  if (!visible) return null;

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
          maxWidth: 380,
          width: "calc(100% - 24px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "fadeIn .25s ease-out",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 12,
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: "#475569",
              cursor: "pointer",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: 12,
              background: "#dc2626",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
            }}
          >
            {confirmText || "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

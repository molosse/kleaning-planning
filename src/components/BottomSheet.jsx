export default function BottomSheet({ visible, onClose, title, children }) {
  if (!visible) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderRadius: "20px 20px 0 0",
          padding: "0 0 env(safe-area-inset-bottom,16px)",
          animation: "slideUp .25s ease-out",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 4, margin: "12px auto 0" }} />
        <div style={{ padding: "12px 20px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f1f5f9",
              border: "none",
              fontSize: 16,
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "4px 20px 20px" }}>{children}</div>
      </div>
    </div>
  );
}

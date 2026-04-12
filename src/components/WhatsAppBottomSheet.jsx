import BottomSheet from "./BottomSheet.jsx";

export default function WhatsAppBottomSheet({
  visible,
  onClose,
  waText,
  copied,
  waSent,
  onCopy,
  onOpenWhatsApp,
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="💬 Planning WhatsApp">
      {waText && (
        <>
          <textarea
            readOnly
            value={waText}
            onClick={(e) => {
              e.target.select();
              e.target.setSelectionRange(0, 99999);
            }}
            style={{ width: "100%", background: "#f8fafc", borderRadius: 10, padding: 12, fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, border: "1px solid #e2e8f0", height: 200, resize: "none", boxSizing: "border-box", color: "#1e293b", outline: "none", marginBottom: 12 }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              onClick={onCopy}
              style={{ padding: "14px", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, background: copied ? "#059669" : "#475569", color: "white", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              {copied ? "✅" : "📋"} {copied ? "Copié !" : "Copier"}
            </button>
            <button
              onClick={onOpenWhatsApp}
              style={{ padding: "14px", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, background: waSent ? "#128C7E" : "#25D366", color: "white", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              {waSent ? "✅" : "📤"} {waSent ? "Ouvert !" : "WhatsApp"}
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}

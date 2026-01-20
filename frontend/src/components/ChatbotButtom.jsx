import { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating AI Button */}
      <div
        onClick={() => setOpen(true)}
        title="AI Prompt Assistant"
        style={styles.button}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
        }}
      >
        {/* Icon */}
        <span style={styles.icon}>AI</span>
      </div>

      {/* Optional label (hover hint) */}
      {!open && (
        <div style={styles.label}>
          Prompt Assistant
        </div>
      )}

      {open && <ChatbotWindow onClose={() => setOpen(false)} />}
    </>
  );
}

/* ================= UX STYLES ================= */

const styles = {
  button: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease",
    zIndex: 9999,
    userSelect: "none"
  },

  icon: {
    fontSize: 14,
    letterSpacing: "0.5px"
  },

  label: {
    position: "fixed",
    bottom: 40,
    right: 90,
    background: "#111827",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: 6,
    fontSize: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 9998,
    opacity: 0.9
  }
};

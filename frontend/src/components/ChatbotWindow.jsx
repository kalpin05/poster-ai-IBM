import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

export default function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await api("/chatbot/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages })
      });

      const botMsg = {
        sender: "bot",
        text: res.reply || "No response generated."
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to contact AI service." }
      ]);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>AI Prompt Assistant</div>
          <div style={styles.subtitle}>Craft better image prompts</div>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>

      {/* CHAT AREA */}
      <div ref={scrollRef} style={styles.chatArea}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: 14
            }}
          >
            <div
              style={{
                ...styles.message,
                ...(m.sender === "user"
                  ? styles.userMessage
                  : styles.botMessage)
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div style={styles.emptyState}>
            Ask things like:
            <ul>
              <li>“Improve this prompt for a cinematic poster”</li>
              <li>“Make my prompt more detailed”</li>
              <li>“Convert this idea into an AI image prompt”</li>
            </ul>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Describe your idea or paste your prompt…"
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  wrapper: {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "380px",
    height: "520px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    zIndex: 10000,
    overflow: "hidden",
    fontFamily: "'Inter', system-ui, sans-serif"
  },

  header: {
    padding: "14px 16px",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: {
    fontSize: "15px",
    fontWeight: 600
  },

  subtitle: {
    fontSize: "11px",
    opacity: 0.9
  },

  closeBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "white",
    fontSize: "16px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer"
  },

  chatArea: {
    flex: 1,
    padding: "14px",
    overflowY: "auto",
    background: "#f9fafb"
  },

  message: {
    maxWidth: "80%",
    padding: "10px 14px",
    borderRadius: "14px",
    fontSize: "14px",
    lineHeight: 1.45,
    whiteSpace: "pre-wrap"
  },

  userMessage: {
    background: "linear-gradient(135deg, #06231D, #E3EF26)",
    color: "#e3ef26",
    borderBottomRightRadius: "4px"
  },

  botMessage: {
    background: "#e5e7eb",
    color: "#111827",
    borderBottomLeftRadius: "4px"
  },

  emptyState: {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: 1.6
  },

  inputArea: {
    padding: "12px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "8px",
    background: "#ffffff"
  },

  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none"
  },

  sendBtn: {
    padding: "10px 16px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: 500,
    cursor: "pointer"
  }
};

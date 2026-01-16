import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

export default function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();

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

    // Send to backend
    try {
      const res = await api("/chatbot/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages })
      });

      const botMsg = { sender: "bot", text: res.reply || "No response" };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Error contacting AI model." }]);
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "100px",
      right: "20px",
      width: "360px",
      height: "480px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      zIndex: 10000
    }}>
      <div style={{
        padding: "10px",
        background: "#4f46e5",
        color: "white",
        fontWeight: "600",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        AI Prompt Assistant
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "white", fontSize: 18 }}>✖</button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, padding: 12, overflowY: "auto", background: "#f7f7fb" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, textAlign: m.sender === "user" ? "right" : "left" }}>
            <div style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: 12,
              background: m.sender === "user" ? "#4f46e5" : "#e5e7eb",
              color: m.sender === "user" ? "white" : "black",
              maxWidth: "85%"
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 10, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Ask for a better prompt..."
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 12px", background: "#4f46e5", color: "white", borderRadius: 8, border: "none" }}>
          Send
        </button>
      </div>
    </div>
  );
}
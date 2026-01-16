import { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4f46e5",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "28px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 9999
        }}
      >
        💬
      </div>
      {open && <ChatbotWindow onClose={() => setOpen(false)} />}
    </>
  );
}
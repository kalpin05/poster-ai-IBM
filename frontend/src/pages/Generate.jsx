import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [err, setErr] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErr("Prompt is required");
      return;
    }
    try {
      await api("/posters", {
        method: "POST",
        body: JSON.stringify({ prompt, title: "" })
      });
      nav("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h2>Generate Poster</h2>
      <a href="#" onClick={() => nav("/dashboard")} style={{ marginBottom: 12, display: "block" }}>
        ← Back to Dashboard
      </a>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <form onSubmit={submit}>
        <textarea
          placeholder="Describe your poster..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          cols={50}
        />
        <br />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}
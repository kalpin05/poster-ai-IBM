import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErr("Prompt is required");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await api("/posters", {
        method: "POST",
        body: JSON.stringify({ prompt, title: "" })
      });
      nav("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
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
          disabled={loading}
          style={{
            backgroundColor: loading ? '#f5f5f5' : 'white',
            cursor: loading ? 'not-allowed' : 'text'
          }}
        />
        <br />
        <button type="submit" disabled={loading} style={{
          backgroundColor: loading ? '#ccc' : '#007bff',
          cursor: loading ? 'not-allowed' : 'pointer',
          padding: '10px 20px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '4px'
        }}>
          {loading ? (
            <span>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⚙️</span>
              {" "}Generating Poster...
            </span>
          ) : (
            "Generate"
          )}
        </button>
        {loading && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            Please wait while we create your poster...
          </p>
        )}
      </form>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
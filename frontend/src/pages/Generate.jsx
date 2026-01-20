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
      setErr("Please enter a prompt to generate a poster.");
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
    } catch {
      setErr("Failed to generate poster. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => nav("/dashboard")} style={styles.backBtn}>
          ← Dashboard
        </button>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <h2 style={styles.title}>Generate Poster</h2>
        <p style={styles.subtitle}>
          Describe your idea clearly. The AI will turn it into a visual poster.
        </p>

        {err && <div style={styles.error}>{err}</div>}

        <form onSubmit={submit}>
          <label style={styles.label}>Poster Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: A futuristic cyberpunk city at night with neon lights, cinematic lighting, high detail..."
            disabled={loading}
            style={{
              ...styles.textarea,
              opacity: loading ? 0.7 : 1
            }}
          />

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.primaryBtn,
                opacity: loading ? 0.75 : 1
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Generating…
                </>
              ) : (
                "Generate Poster"
              )}
            </button>
          </div>

          {loading && (
            <p style={styles.loadingText}>
              Creating your poster. This may take a few seconds…
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* ===================== MOON THEME ===================== */

const palette = {
  bg: "#8b6ec7",
  bgAlt: "#d2c2ec",
  card: "#5e84e2",
  border: "#6667AB",
  textarea: "#42325c",
  button: "#F6a93a",
  buttonText: "#210635",
  textLight: "#FFFFFF",
  textMuted: "#E6D6F0",
  errorBg: "#7B337E",
  errorText: "#F5D5E0"
};

/* ===================== STYLES ===================== */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",   // ✅ removes horizontal scroll
    background: `linear-gradient(180deg, ${palette.bg}, ${palette.bgAlt})`,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 60,
    fontFamily: "Inter, system-ui, sans-serif",
    color: palette.textLight
  },

  header: {
    position: "absolute",
    top: 24,
    left: 24
  },

  backBtn: {
    background: "transparent",
    border: "none",
    color: palette.textMuted,
    fontSize: 14,
    cursor: "pointer"
  },

  card: {
    width: "100%",
    maxWidth: 600,
    background: palette.card,
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 40px 90px rgba(0,0,0,0.45)"
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 6
  },

  subtitle: {
    fontSize: 14,
    color: palette.textMuted,
    marginBottom: 24
  },

  label: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 8,
    display: "block",
    color: palette.textMuted
  },

  textarea: {
    width: "98%",
    minHeight: 180,
    resize: "vertical",
    borderRadius: 12,
    border: `1px solid ${palette.border}`,
    padding: 14,
    fontSize: 15,
    lineHeight: 1.6,
    outline: "none",
    background: palette.textarea,
    color: palette.textLight
  },

  actions: {
    marginTop: 24,
    display: "flex",
    justifyContent: "flex-end"
  },

  primaryBtn: {
    background: palette.button,
    color: palette.buttonText,
    border: "none",
    borderRadius: 12,
    padding: "12px 22px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: palette.textMuted
  },

  error: {
    background: palette.errorBg,
    color: palette.errorText,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 14
  },

  spinner: {
    width: 16,
    height: 16,
    border: `2px solid ${palette.buttonText}`,
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

/* Spinner animation */
const css = document.createElement("style");
css.textContent = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(css);

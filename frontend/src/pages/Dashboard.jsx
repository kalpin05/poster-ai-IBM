import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Dashboard() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [selectedPoster, setSelectedPoster] = useState(null);
  const nav = useNavigate();

  const handleImageLoad = (id) => {
    setImageLoading((p) => ({ ...p, [id]: false }));
  };

  const handleImageLoadStart = (id) => {
    setImageLoading((p) => ({ ...p, [id]: true }));
  };

  const downloadPoster = async (url, id) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `poster-${id}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    api("/posters")
      .then((res) => setPosters(res.posters || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={{ color: palette.textLight }}>Loading posters…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Your Posters</h2>
        <button onClick={() => nav("/generate")} style={styles.primaryBtn}>
          + Generate Poster
        </button>
      </div>

      {/* Gallery */}
      {posters.length === 0 ? (
        <div style={styles.empty}>
          <p>No posters yet.</p>
          <button onClick={() => nav("/generate")} style={styles.primaryBtn}>
            Create your first poster
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {posters.map((p) => (
            <div
              key={p.id}
              style={styles.card}
              onClick={() => setSelectedPoster(p)}
            >
              <div style={styles.thumb}>
                {imageLoading[p.id] && <div style={styles.cardLoader} />}
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  onLoadStart={() => handleImageLoadStart(p.id)}
                  onLoad={() => handleImageLoad(p.id)}
                  style={styles.image}
                />
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.cardTitle}>{p.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedPoster && (
        <div style={styles.overlay} onClick={() => setSelectedPoster(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPoster.imageUrl}
              alt={selectedPoster.title}
              style={styles.modalImage}
            />
            <div style={styles.modalActions}>
              <button
                onClick={() =>
                  downloadPoster(selectedPoster.imageUrl, selectedPoster.id)
                }
                style={styles.primaryBtn}
              >
                Download
              </button>
              <button
                onClick={() => setSelectedPoster(null)}
                style={styles.secondaryBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== PALETTE ===================== */

const palette = {
  bg: "#210635",
  bgAlt: "#420D4B",
  card: "#7B337E",
  cardAlt: "#6667AB",
  button: "#F5D5E0",
  buttonText: "#210635",
  textLight: "#FFFFFF"
};

/* ===================== STYLES ===================== */

const styles = {
  page: {
    minHeight: "100vh",
    width: "99%",
    overflowX: "hidden",     // ✅ REMOVES HORIZONTAL SCROLL
    padding: 24,
    background: `linear-gradient(180deg, ${palette.bg}, ${palette.bgAlt})`,
    fontFamily: "Inter, system-ui, sans-serif",
    color: palette.textLight
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  },

  title: {
    fontSize: 22,
    fontWeight: 600
  },

  primaryBtn: {
    background: palette.button,
    color: palette.buttonText,
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer"
  },

  secondaryBtn: {
    background: palette.cardAlt,
    color: palette.textLight,
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20
  },

  card: {
    background: palette.card,
    borderRadius: 14,
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 12px 32px rgba(0,0,0,0.45)"
  },

  thumb: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  cardFooter: {
    padding: 10,
    background: palette.cardAlt
  },

  cardTitle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  empty: {
    textAlign: "center",
    padding: 60,
    maxWidth: 420,
    margin: "100px auto",
    background: palette.cardAlt,
    borderRadius: 16
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(33,6,53,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },

  modal: {
    background: palette.bg,
    padding: 20,
    borderRadius: 16
  },

  modalImage: {
    maxWidth: "100%",
    maxHeight: "70vh",
    objectFit: "contain"
  },

  modalActions: {
    marginTop: 16,
    display: "flex",
    gap: 10,
    justifyContent: "center"
  },

  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  spinner: {
    width: 32,
    height: 32,
    border: `3px solid ${palette.cardAlt}`,
    borderTopColor: palette.button,
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  cardLoader: {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(90deg, ${palette.bgAlt}, ${palette.card}, ${palette.bgAlt})`,
    animation: "shimmer 1.5s infinite"
  }
};

/* animations */
const css = document.createElement("style");
css.textContent = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer {
  0% { background-position: -200px 0 }
  100% { background-position: 200px 0 }
}
`;
document.head.appendChild(css);

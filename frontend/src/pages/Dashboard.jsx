import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Dashboard() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [selectedPoster, setSelectedPoster] = useState(null);
  const nav = useNavigate();

  const handleImageLoad = (posterId) => {
    setImageLoading((prev) => ({ ...prev, [posterId]: false }));
  };

  const handleImageLoadStart = (posterId) => {
    setImageLoading((prev) => ({ ...prev, [posterId]: true }));
  };

  const openFullScreen = (poster) => {
    setSelectedPoster(poster);
  };

  const closeFullScreen = () => {
    setSelectedPoster(null);
  };

  // ✅ CORRECT & RELIABLE DOWNLOAD FUNCTION
  const downloadPoster = async (posterUrl, posterId) => {
    try {
      const response = await fetch(posterUrl, { mode: "cors" });
      const blob = await response.blob();

      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `poster-${posterId}.png`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download poster. Please try again.");
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await api("/posters");
        setPosters(res.posters || []);
      } catch (err) {
        console.error("Failed to load posters", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div style={{ fontSize: "24px", marginBottom: "10px" }}>
          <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
            ⚙️
          </span>
        </div>
        <p>Loading your posters...</p>
      </div>
    );

  return (
    <div>
      <button
        onClick={() => nav("/generate")}
        style={{ marginBottom: 16, padding: "8px 16px" }}
      >
        Generate Poster
      </button>

      {posters.length === 0 ? (
        <div>No posters yet</div>
      ) : (
        posters.map((p) => (
          <div
            key={p.id}
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px"
            }}
          >
            <h4>{p.title}</h4>

            <div style={{ position: "relative", width: 300, height: 300 }}>
              {imageLoading[p.id] && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
                      ⚙️
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Loading poster...
                  </p>
                </div>
              )}

              <img
                src={p.imageUrl}
                alt={p.title}
                style={{
                  width: 300,
                  height: 300,
                  objectFit: "cover",
                  display: imageLoading[p.id] ? "none" : "block",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}
                onLoadStart={() => handleImageLoadStart(p.id)}
                onLoad={() => handleImageLoad(p.id)}
                onError={() => handleImageLoad(p.id)}
                onClick={() => openFullScreen(p)}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            </div>
          </div>
        ))
      )}

      {/* FULL SCREEN MODAL */}
      {selectedPoster && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
          onClick={closeFullScreen}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#ff4444",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer"
              }}
              onClick={closeFullScreen}
            >
              ×
            </button>

            <img
              src={selectedPoster.imageUrl}
              alt={selectedPoster.title}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "4px"
              }}
            />

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "12px 24px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() =>
                  downloadPoster(selectedPoster.imageUrl, selectedPoster.id)
                }
              >
                ⬇ Download Poster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS animation
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Dashboard() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await api("/posters"); // expects { posters: [...] }
        setPosters(res.posters || []);
      } catch (err) {
        console.error("Failed to load posters", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <button onClick={() => nav("/generate")} style={{ marginBottom: 16, padding: "8px 16px" }}>
        Generate Poster
      </button>
      {posters.length === 0 ? <div>No posters yet</div> : (
        posters.map(p => (
          <div key={p.id}>
            <h4>{p.title}</h4>
            <img src={p.imageUrl} alt={p.title} style={{ width: 300 }} />
            <a href={p.imageUrl} download={`poster-${p.id}.png`}><button>Download</button></a>
          </div>
        ))
      )}
    </div>
  );
}
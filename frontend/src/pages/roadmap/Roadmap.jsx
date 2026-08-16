import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/roadmap"),
      api.get("/roadmap/progress").catch(() => ({ data: { data: [] } })),
    ]).then(([rRes, pRes]) => {
      if (rRes.data.success) setRoadmap(rRes.data.data);
      if (pRes.data?.success) setProgress(pRes.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1>Placement Roadmap</h1>
      <p style={{ color: "var(--text-muted)" }}>Topic-wise completion tracker.</p>
      {loading ? (
        <p>Loading...</p>
      ) : roadmap.length === 0 ? (
        <div className="card">No roadmap items yet. Faculty/Admin can add roadmap topics.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {roadmap.map((r) => {
            const prog = progress.find((p) => p.roadmapId === r.id);
            return (
              <li key={r.id} className="card" style={{ marginBottom: "0.5rem" }}>
                <strong>{r.title}</strong>
                <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>{prog?.status || "not_started"}</span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>{r.description}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

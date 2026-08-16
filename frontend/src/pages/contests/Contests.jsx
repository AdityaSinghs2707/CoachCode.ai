import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { CardSkeleton } from "../../components/common/Skeleton";

export default function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api.get("/contests")
      .then((r) => r.data.success && setContests(r.data.data))
      .catch(() => toast.error("Failed to load contests"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setLeaderboard([]);
      return;
    }
    api.get(`/contests/${selectedId}/leaderboard`)
      .then((r) => r.data.success && setLeaderboard(r.data.data))
      .catch(() => setLeaderboard([]));
  }, [selectedId]);

  return (
    <div className="container">
      <h1>Contests</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        Coding contests with live leaderboard. Rank by score and submission time.
      </p>
      {loading ? (
        <div className="stats-grid"><CardSkeleton /><CardSkeleton /></div>
      ) : contests.length === 0 ? (
        <div className="card">No contests yet. Faculty/Admin can create contests.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <h3>Contests</h3>
            {contests.map((c) => (
              <div
                key={c.id}
                className="card"
                style={{
                  marginBottom: "0.5rem",
                  cursor: "pointer",
                  background: selectedId === c.id ? "var(--primary)" : "var(--surface)",
                  color: selectedId === c.id ? "#fff" : "var(--text)",
                }}
                onClick={() => setSelectedId(c.id)}
              >
                <strong>{c.title}</strong>
                <span style={{ opacity: 0.9, marginLeft: 8, fontSize: 13 }}>
                  {new Date(c.startTime).toLocaleDateString()} — {new Date(c.endTime).toLocaleDateString()}
                </span>
                <p style={{ margin: "0.25rem 0 0", fontSize: 13, opacity: 0.9 }}>{c.description}</p>
              </div>
            ))}
          </div>
          <div>
            <h3>Leaderboard</h3>
            {selectedId ? (
              leaderboard.length === 0 ? (
                <div className="card">No submissions yet.</div>
              ) : (
                <div className="card">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <th style={{ textAlign: "left", padding: "8px" }}>Rank</th>
                        <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
                        <th style={{ textAlign: "right", padding: "8px" }}>Score</th>
                        <th style={{ textAlign: "right", padding: "8px" }}>Submissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((r) => (
                        <tr key={r.userId} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "8px" }}>{r.rank}</td>
                          <td style={{ padding: "8px" }}>{r.name}</td>
                          <td style={{ padding: "8px", textAlign: "right" }}>{r.totalScore}</td>
                          <td style={{ padding: "8px", textAlign: "right" }}>{r.submissions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="card" style={{ color: "var(--text-muted)" }}>Select a contest to view leaderboard.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

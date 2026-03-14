import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { CardSkeleton } from "../../components/common/Skeleton";

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/tests")
      .then((r) => r.data.success && setTests(r.data.data))
      .catch(() => toast.error("Failed to load tests"))
      .finally(() => setLoading(false));
  }, []);

  const startAttempt = async (test) => {
    try {
      const { data } = await api.post(`/tests/${test.id}/attempt`);
      if (data.success) {
        navigate(`/tests/${test.id}/attempt`, { state: { test, attempt: data.data } });
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to start");
    }
  };

  return (
    <div className="container">
      <h1>Mock Tests</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        Timed mock tests. Start an attempt to begin. Auto-submit when time runs out.
      </p>
      {loading ? (
        <div className="stats-grid"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      ) : tests.length === 0 ? (
        <div className="card">No tests yet. Create a test (Faculty/Admin) to get started.</div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {tests.map((t) => (
            <div key={t.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <strong>{t.title}</strong>
                <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>{t.durationMinutes} min</span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>{t.description}</p>
              </div>
              <button className="btn btn-primary" onClick={() => startAttempt(t)}>
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/announcements")
      .then(({ data }) => {
        if (data.success) setAnnouncements(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1>Announcements</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Faculty and admin announcements.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : announcements.length === 0 ? (
        <div className="card">No announcements yet.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {announcements.map((a) => (
            <li
              key={a.id}
              className="card"
              style={{ marginBottom: "0.5rem" }}
            >
              <strong>{a.title}</strong>

              {a.User && (
                <span
                  style={{
                    color: "var(--text-muted)",
                    marginLeft: "0.5rem",
                  }}
                >
                  — {a.User.name}
                </span>
              )}

              <p style={{ margin: "0.5rem 0 0" }}>
                {a.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
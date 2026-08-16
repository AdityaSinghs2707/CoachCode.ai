import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookmarks").then(({ data }) => data.success && setBookmarks(data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1>Bookmarks</h1>
      <p style={{ color: "var(--text-muted)" }}>Your saved questions and materials.</p>
      {loading ? (
        <p>Loading...</p>
      ) : bookmarks.length === 0 ? (
        <div className="card">No bookmarks yet. Bookmark questions or materials from Practice/Materials.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {bookmarks.map((b) => (
            <li key={b.id} className="card" style={{ marginBottom: "0.5rem" }}>
              {b.itemType}: {b.item?.title || b.itemId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

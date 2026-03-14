import { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { CardSkeleton } from "../../components/common/Skeleton";

const AUTO_SAVE_MS = 5000;

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block", "blockquote"],
    ["link"],
    ["clean"],
  ],
};

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const loadNotes = useCallback(() => {
    api.get("/notes")
      .then((r) => r.data.success && setNotes(r.data.data))
      .catch(() => toast.error("Failed to load notes"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (!selected) {
      setTitle("");
      setContent("");
      return;
    }
    setTitle(selected.title);
    setContent(selected.content || "");
  }, [selected?.id]);

  useEffect(() => {
    if (!selected || saving) return;
    const t = setTimeout(() => {
      if (!title.trim() && !content) return;
      setSaving(true);
      const payload = { title: title || "Untitled", content };
      if (selected.id) {
        api.put(`/notes/${selected.id}`, payload)
          .then(() => toast.success("Saved"))
          .catch(() => toast.error("Save failed"))
          .finally(() => setSaving(false));
      } else {
        api.post("/notes", payload)
          .then((r) => {
            if (r.data.success) {
              setSelected(r.data.data);
              loadNotes();
              toast.success("Created");
            }
          })
          .catch(() => toast.error("Create failed"))
          .finally(() => setSaving(false));
      }
    }, AUTO_SAVE_MS);
    return () => clearTimeout(t);
  }, [title, content, selected?.id]);

  const createNew = () => {
    setSelected({ id: null, title: "", content: "" });
    setTitle("");
    setContent("");
  };

  const filtered = notes.filter(
    (n) =>
      !search ||
      (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.content || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ maxWidth: "none" }}>
      <h1>Smart Notes</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
        Rich text notes with auto-save every 5 seconds. {saving && "Saving..."}
      </p>

      <div style={{ display: "flex", gap: 16, height: "calc(100vh - 220px)", minHeight: 400 }}>
        <aside
          style={{
            width: 280,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
              }}
            />
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={createNew}>
              + New Note
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <div style={{ padding: 16 }}><CardSkeleton /></div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 16, color: "var(--text-muted)" }}>No notes</div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelected(n)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    background: selected?.id === n.id ? "var(--primary)" : "transparent",
                    color: selected?.id === n.id ? "#fff" : "var(--text)",
                  }}
                >
                  <strong style={{ fontSize: 14 }}>{n.title || "Untitled"}</strong>
                </div>
              ))
            )}
          </div>
        </aside>

        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            style={{
              padding: "12px 16px",
              border: "none",
              borderBottom: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text)",
              fontSize: 18,
              fontWeight: 600,
            }}
          />
          <div style={{ flex: 1, overflow: "auto" }} className="quill-wrapper">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Write your note..."
              style={{ height: "100%", border: "none" }}
            />
          </div>
        </main>
      </div>

      <style>{`
        .quill-wrapper .ql-container { border: none; font-size: 15px; }
        .quill-wrapper .ql-editor { min-height: 200px; }
        .quill-wrapper .ql-toolbar { border: none; border-bottom: 1px solid var(--border); background: var(--bg); }
      `}</style>
    </div>
  );
}

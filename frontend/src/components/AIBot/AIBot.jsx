import { useState, useRef, useEffect } from "react";

const KNOWLEDGE = [
  { q: /compiler|run code|execute|monaco/i, a: "Use the Practice section. Select a question, write code in the Monaco editor, add optional input, and click Run. Your code runs via Judge0 and results show below." },
  { q: /notes|smart notes|create note/i, a: "Go to Notes. Create notes with the rich text editor. Notes auto-save every 5 seconds. Use folders to organize. You can export as PDF." },
  { q: /roadmap|track progress/i, a: "The Roadmap shows topic-wise placement prep. Mark topics as in_progress or completed. Your progress is saved per user." },
  { q: /contest|leaderboard/i, a: "Contests have start and end times. Submit solutions during the contest. Ranking is by score and submission time. Faculty/Admin create contests." },
  { q: /mock test|test attempt/i, a: "Mock Tests are timer-based. Start an attempt to begin. Questions are shown in order. Submit before time runs out. Auto-submit on timeout." },
  { q: /bookmark/i, a: "Bookmark questions or materials from Practice and Materials. Access them later from the Bookmarks section." },
  { q: /material|upload|pdf/i, a: "Materials are subject-wise notes, PDFs, PPTs. Faculty/Admin upload them. Students can read and filter by subject." },
  { q: /faculty|admin|role/i, a: "Students: read, practice, tests, notes, bookmarks. Faculty: + upload materials, add questions, create tests, announcements. Admin: + manage users, platform settings." },
  { q: /how|what|where|help/i, a: "CoachCode.ai helps you prepare for placements. Use Materials for theory, Practice for coding, Mock Tests for timed practice, Roadmap to track progress, and Notes for personal study." },
];

const DEFAULT_MSG = "I'm your CoachCode assistant. Ask about the compiler, notes, roadmap, contests, mock tests, or how to use the app.";

function getReply(input) {
  const lower = input.toLowerCase().trim();
  for (const { q, a } of KNOWLEDGE) {
    if (q.test(lower)) return a;
  }
  return "I can help with: compiler usage, smart notes, roadmap, contests, mock tests, bookmarks, and roles. Try asking something more specific about the app.";
}

export default function AIBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: DEFAULT_MSG }]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const reply = getReply(userMsg.text);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "var(--shadow)",
          zIndex: 9998,
        }}
        title="AI Guide"
      >
        🤖
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 360,
            maxWidth: "calc(100vw - 48px)",
            height: 480,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "var(--shadow)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>
            CoachCode AI Guide
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: m.role === "user" ? "var(--primary)" : "var(--bg)",
                    color: m.role === "user" ? "#fff" : "var(--text)",
                    fontSize: 14,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about the app..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 14,
              }}
            />
            <button className="btn btn-primary" onClick={send}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

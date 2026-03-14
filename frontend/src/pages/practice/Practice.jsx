import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { CardSkeleton } from "../../components/common/Skeleton";

const LANGUAGES = [
  { id: "cpp", name: "C++" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "javascript", name: "JavaScript" },
  { id: "c", name: "C" },
];

const DEFAULT_CODE = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World";\n    return 0;\n}`,
  python: `print("Hello World")`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`,
  javascript: `console.log("Hello World");`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello World");\n    return 0;\n}`,
};

export default function Practice() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [code, setCode] = useState(DEFAULT_CODE.cpp);
  const [language, setLanguage] = useState("cpp");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const params = {};
    if (difficulty) params.difficulty = difficulty;
    if (type) params.type = type;
    api.get("/questions", { params })
      .then((r) => r.data.success && setQuestions(r.data.data))
      .catch(() => toast.error("Failed to load questions"))
      .finally(() => setLoading(false));
  }, [difficulty, type]);

  useEffect(() => {
    if (selected?.starterCode) setCode(selected.starterCode);
    else setCode(DEFAULT_CODE[language] || DEFAULT_CODE.cpp);
  }, [selected?.id]);

  useEffect(() => {
    if (!selected?.starterCode) setCode(DEFAULT_CODE[language] || DEFAULT_CODE.cpp);
  }, [language]);

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const { data } = await api.post("/compiler/execute", {
        code,
        language,
        stdin,
        questionId: selected?.id,
      });
      if (data.success) setOutput(data.data);
      else toast.error(data.message || "Execution failed");
    } catch (e) {
      toast.error(e.response?.data?.message || "Execution failed");
      setOutput({ stderr: e.message, stdout: "" });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "none", padding: 0 }}>
      <div style={{ display: "flex", height: "calc(100vh - 120px)", minHeight: 400 }}>
        <aside
          style={{
            width: 320,
            borderRight: "1px solid var(--border)",
            overflow: "auto",
            background: "var(--surface)",
          }}
        >
          <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 0.5rem" }}>Questions</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ padding: "0.4rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }}
              >
                <option value="">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ padding: "0.4rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }}
              >
                <option value="">All</option>
                <option value="coding">Coding</option>
                <option value="theory">Theory</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div style={{ padding: 16 }}><CardSkeleton /></div>
          ) : questions.length === 0 ? (
            <div style={{ padding: 16, color: "var(--text-muted)" }}>No questions</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {questions.map((q) => (
                <li
                  key={q.id}
                  onClick={() => setSelected(q)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    background: selected?.id === q.id ? "var(--primary)" : "transparent",
                    color: selected?.id === q.id ? "#fff" : "var(--text)",
                  }}
                >
                  <strong style={{ fontSize: 14 }}>{q.title}</strong>
                  <span style={{ fontSize: 12, opacity: 0.8, marginLeft: 8 }}>{q.difficulty}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {selected && (
              <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", maxHeight: 180, overflow: "auto", background: "var(--surface)" }}>
                <h4 style={{ margin: "0 0 0.5rem" }}>{selected.title}</h4>
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>{selected.description}</p>
              </div>
            )}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 200 }}>
              <div style={{ display: "flex", gap: 8, padding: "8px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ padding: "0.4rem 0.8rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={handleRun} disabled={running}>
                  {running ? "Running..." : "Run"}
                </button>
              </div>
              <div style={{ flex: 1, minHeight: 200 }}>
                <Editor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language}
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                  }}
                />
              </div>
            </div>
            <div style={{ padding: "1rem", background: "var(--surface)", borderTop: "1px solid var(--border)", maxHeight: 180, overflow: "auto" }}>
              <h4 style={{ margin: "0 0 0.5rem", fontSize: 14 }}>Input</h4>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Custom input (optional)"
                style={{
                  width: "100%",
                  minHeight: 60,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: 13,
                  resize: "vertical",
                }}
              />
              {output && (
                <>
                  <h4 style={{ margin: "1rem 0 0.5rem", fontSize: 14 }}>Output</h4>
                  <pre style={{ margin: 0, fontSize: 13, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{output.stdout || "(empty)"}</pre>
                  {output.stderr && (
                    <pre style={{ margin: "0.5rem 0 0", fontSize: 13, color: "var(--danger)", whiteSpace: "pre-wrap" }}>{output.stderr}</pre>
                  )}
                  {(output.time != null || output.memory != null) && (
                    <p style={{ margin: "0.5rem 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                      Time: {output.time ?? "-"}s · Memory: {output.memory ?? "-"} KB
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

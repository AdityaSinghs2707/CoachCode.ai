import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TestAttempt() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [test, setTest] = useState(state?.test);
  const [attempt, setAttempt] = useState(state?.attempt);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!test) {
      api.get(`/tests/${id}`).then((r) => {
        if (r.data.success) setTest(r.data.data);
      });
    }
  }, [id, test]);

  useEffect(() => {
    if (test) {
      setQuestions(test.Questions || []);
      const durationSec = (test.durationMinutes || 60) * 60;
      setTimeLeft(durationSec);
    }
  }, [test]);

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      await api.post(`/tests/${id}/submit`, {
        attemptId: attempt?.id,
        score: 0,
        totalMarks: questions.length,
        answers: {},
      });
      toast.success("Test submitted");
      navigate("/tests");
    } catch (e) {
      toast.error("Submit failed");
    }
  };

  if (!test) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1>{test.title}</h1>
        <div
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: timeLeft <= 60 ? "var(--danger)" : "var(--surface)",
            color: timeLeft <= 60 ? "#fff" : "var(--text)",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {formatTime(timeLeft ?? 0)}
        </div>
      </div>
      <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
        {questions.length} questions · Auto-submit when timer ends
      </p>
      <div className="card">
        {questions.map((q, i) => (
          <div key={q.id} style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: i < questions.length - 1 ? "1px solid var(--border)" : "none" }}>
            <strong>Q{i + 1}. {q.title}</strong>
            <p style={{ margin: "0.5rem 0 0", fontSize: 14, color: "var(--text-muted)" }}>{q.description}</p>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={handleSubmit} disabled={submitted}>
        {submitted ? "Submitted" : "Submit Test"}
      </button>
    </div>
  );
}

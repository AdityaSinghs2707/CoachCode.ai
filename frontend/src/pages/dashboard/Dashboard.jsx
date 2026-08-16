import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { CardSkeleton } from "../../components/common/Skeleton";
import { Link } from "react-router-dom";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.role === "student") {
          const stRes = await api.get("/analytics/student/dashboard").catch(() => ({ data: { success: false } }));
          if (stRes.data?.success) setStudentStats(stRes.data.data);
        } else {
          const [sRes, wRes] = await Promise.all([
            api.get("/analytics/dashboard").catch(() => ({ data: { success: false } })),
            api.get("/analytics/weekly").catch(() => ({ data: { success: false } })),
          ]);
          if (sRes.data?.success) setStats(sRes.data.data);
          if (wRes.data?.success) setWeekly(wRes.data.data);
        }
      } catch (e) {
        setStats({ totalUsers: 0, totalMaterials: 0, totalQuestions: 0, testAttempts: 0, roleDistribution: {} });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.role]);

  if (loading) {
    return (
      <div className="container">
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const roleData = stats?.roleDistribution
    ? Object.entries(stats.roleDistribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="container animate-fade-in">
      {/* Welcome Hero Banner */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          marginBottom: "2rem",
          padding: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: "0.75rem" }}>
            🔥 7 DAY STUDY STREAK ACTIVE
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
            Welcome back, {user?.name || "Learner"}! 👋
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, maxWidth: "600px", fontSize: "0.95rem" }}>
            Ready to continue your placement preparation? Track your stats, practice daily coding challenges, or take a quick mock quiz.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/practice" className="btn btn-primary">
            ⚡ Start Practice
          </Link>
          <Link to="/mock-test" className="btn btn-ghost">
            🎯 Take Mock Quiz
          </Link>
        </div>
      </div>

      {/* Admin / Faculty View */}
      {(user?.role === "admin" || user?.role === "faculty") && stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                👥
              </div>
              <div className="stat-content">
                <h3>{stats.totalUsers ?? 0}</h3>
                <p>Total Registered Users</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: "var(--secondary-light)", color: "var(--secondary)" }}>
                📚
              </div>
              <div className="stat-content">
                <h3>{stats.totalMaterials ?? 0}</h3>
                <p>Study Materials</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>
                ⚡
              </div>
              <div className="stat-content">
                <h3>{stats.totalQuestions ?? 0}</h3>
                <p>Question Bank</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: "var(--success-light)", color: "var(--success)" }}>
                🎯
              </div>
              <div className="stat-content">
                <h3>{stats.testAttempts ?? 0}</h3>
                <p>Test Attempts</p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
            <div className="card">
              <h3 style={{ marginBottom: "1.25rem" }}>Weekly User Activity</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly}>
                    <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                    <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                    <Bar dataKey="users" fill="var(--primary)" radius={[6, 6, 0, 0]} name="Users" />
                    <Bar dataKey="attempts" fill="var(--success)" radius={[6, 6, 0, 0]} name="Attempts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: "1.25rem" }}>User Roles</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                      {roleData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Student Dashboard */}
      {user?.role === "student" && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: "var(--success-light)", color: "var(--success)" }}>
                ⚡
              </div>
              <div className="stat-content">
                <h3>{studentStats?.totalProblemsSolved ?? 0}</h3>
                <p>Problems Solved</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                📝
              </div>
              <div className="stat-content">
                <h3>{studentStats?.totalSubmissions ?? 0}</h3>
                <p>Total Submissions</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>
                🎯
              </div>
              <div className="stat-content">
                <h3>{studentStats?.accuracy ?? 100}%</h3>
                <p>Accuracy Score</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: "var(--secondary-light)", color: "var(--secondary)" }}>
                🏆
              </div>
              <div className="stat-content">
                <h3>Top 10%</h3>
                <p>Global Rank</p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
            <div className="card">
              <h3 style={{ marginBottom: "1.25rem" }}>Solved Problems Progress</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentStats?.solvedOverTime || []}>
                    <XAxis dataKey="date" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="solved" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: "1.25rem" }}>Difficulty Distribution</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentStats?.difficultyDistribution || [
                        { name: "Easy", value: 12 },
                        { name: "Medium", value: 8 },
                        { name: "Hard", value: 3 }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label
                    >
                      {(studentStats?.difficultyDistribution || [1, 2, 3]).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { CardSkeleton } from "../../components/common/Skeleton";

const COLORS = ["#58a6ff", "#3fb950", "#d29922", "#f85149"];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, wRes] = await Promise.all([
          api.get("/analytics/dashboard").catch(() => ({ data: { success: false } })),
          api.get("/analytics/weekly").catch(() => ({ data: { success: false } })),
        ]);
        if (sRes.data?.success) setStats(sRes.data.data);
        if (wRes.data?.success) setWeekly(wRes.data.data);
      } catch (e) {
        setStats({ totalUsers: 0, totalMaterials: 0, totalQuestions: 0, testAttempts: 0, roleDistribution: {} });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1>Dashboard</h1>
        <div className="stats-grid" style={{ marginTop: "1.5rem" }}>
          {[1, 2, 3, 4, 5].map((i) => (
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
    <div className="container">
      <h1>Dashboard</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        Welcome back, <strong>{user?.name}</strong>
      </p>

      {(user?.role === "admin" || user?.role === "faculty") && stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.totalUsers ?? 0}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalMaterials ?? 0}</h3>
              <p>Materials</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalQuestions ?? 0}</h3>
              <p>Questions</p>
            </div>
            <div className="stat-card">
              <h3>{stats.testAttempts ?? 0}</h3>
              <p>Test Attempts</p>
            </div>
            <div className="stat-card">
              <h3>{stats.newUsersThisWeek ?? 0}</h3>
              <p>New Users (7d)</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "2rem" }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Weekly Growth</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="users" fill="var(--primary)" name="Users" />
                    <Bar dataKey="attempts" fill="var(--success)" name="Attempts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Role Distribution</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {roleData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {user?.role === "student" && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Quick actions</h3>
          <ul style={{ color: "var(--text-muted)" }}>
            <li>Browse Materials and practice coding in Practice.</li>
            <li>Track your progress in Roadmap and save Bookmarks.</li>
            <li>Take Mock Tests and join Contests.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

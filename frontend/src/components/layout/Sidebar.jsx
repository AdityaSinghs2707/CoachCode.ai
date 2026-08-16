import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const studentSections = [
  {
    title: "LEARNING",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: "📊" },
      { to: "/roadmap", label: "Learning Roadmap", icon: "🗺️" },
      { to: "/materials", label: "Study Materials", icon: "📚" },
      { to: "/notes", label: "My Notes", icon: "📝" },
    ]
  },
  {
    title: "PRACTICE & TESTS",
    items: [
      { to: "/practice", label: "Coding Practice", icon: "⚡" },
      { to: "/mock-test", label: "Mock Quizzes", icon: "🎯" },
      { to: "/contests", label: "Live Contests", icon: "🏆" },
    ]
  },
  {
    title: "PERSONAL",
    items: [
      { to: "/bookmarks", label: "Saved Items", icon: "🔖" },
      { to: "/announcements", label: "Announcements", icon: "📢" },
    ]
  }
];

const facultySections = [
  {
    title: "TEACHING & CONTENT",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: "📊" },
      { to: "/materials", label: "Manage Materials", icon: "📚" },
      { to: "/practice", label: "Question Bank", icon: "⚡" },
      { to: "/mock-test", label: "Quizzes", icon: "🎯" },
      { to: "/roadmap", label: "Roadmaps", icon: "🗺️" },
      { to: "/contests", label: "Contests", icon: "🏆" },
      { to: "/announcements", label: "Announcements", icon: "📢" },
    ]
  }
];

const adminSections = [
  ...facultySections,
  {
    title: "ADMINISTRATION",
    items: [
      { to: "/admin/users", label: "Manage Users", icon: "👥" }
    ]
  }
];

export default function Sidebar() {
  const { user } = useAuth();

  const sections =
    user?.role === "admin"
      ? adminSections
      : user?.role === "faculty"
      ? facultySections
      : studentSections;

  return (
    <aside
      style={{
        width: "250px",
        background: "var(--surface-solid)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-sm)"
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "var(--accent-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "800",
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
          }}
        >
          C
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "var(--text)" }}>
            CoachCode<span style={{ color: "var(--primary)" }}>.ai</span>
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
            STUDY & AI PLATFORM
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 0.75rem" }}>
        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--text-dim)",
                letterSpacing: "0.08em",
                padding: "0 0.75rem 0.5rem",
              }}
            >
              {section.title}
            </div>
            {section.items.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  background: isActive ? "var(--primary-light)" : "transparent",
                  marginBottom: "0.2rem",
                  transition: "var(--transition)"
                })}
              >
                <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom User Card */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--primary-light)",
            border: "1px solid var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "var(--primary)",
            fontSize: "0.95rem"
          }}
        >
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.name || "Student User"}
          </div>
          <span className={`badge ${user?.role === "admin" ? "badge-rose" : user?.role === "faculty" ? "badge-amber" : "badge-indigo"}`} style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
            {user?.role || "Student"}
          </span>
        </div>
      </div>
    </aside>
  );
}
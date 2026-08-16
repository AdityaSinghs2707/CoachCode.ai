import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <header
      style={{
        height: "64px",
        padding: "0 2rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        backdropFilter: "var(--glass-blur)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 90,
        boxShadow: "var(--shadow-sm)"
      }}
    >
      {/* Search / Context bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--surface-solid)",
            border: "1px solid var(--border)",
            padding: "0.4rem 0.85rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            width: "280px"
          }}
        >
          <span>🔍</span>
          <span>Search topics, questions...</span>
        </div>
      </div>

      {/* Right Action buttons */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          className="btn btn-ghost"
          onClick={toggle}
          title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          style={{ borderRadius: "var(--radius-full)", width: "38px", height: "38px", padding: 0 }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />

        <button
          className="btn btn-ghost"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          style={{ color: "var(--danger)", fontSize: "0.85rem" }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </header>
  );
}

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
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "background var(--transition)",
      }}
    >
      <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
        <strong>{user?.name}</strong> · {user?.role}
      </span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="btn btn-ghost"
          onClick={toggle}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          style={{ padding: "0.35rem 0.6rem", fontSize: "0.9rem" }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <button className="btn btn-ghost" onClick={() => { logout(); navigate("/login"); }}>
          Logout
        </button>
      </div>
    </header>
  );
}

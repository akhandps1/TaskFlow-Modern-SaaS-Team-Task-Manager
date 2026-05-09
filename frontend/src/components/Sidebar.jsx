import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/my-tasks", label: "My Tasks" }
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--brand)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            TF
          </div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>TaskFlow</h2>
            <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Workspace</span>
          </div>
        </div>

        {/* Mobile Close Button (Visible only on very small screens contextually) */}
        <button className="topbar-menu-btn" onClick={onClose} style={{ background: "transparent" }}>
          ✕
        </button>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            style={({ isActive }) => ({
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              color: isActive ? "var(--primary)" : "var(--muted-foreground)",
              backgroundColor: isActive ? "var(--muted)" : "transparent",
              transition: "background 0.2s"
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "4px" }}>Signed in as</p>
        <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{user?.name}</p>
        <span style={{ fontSize: "0.75rem", display: "inline-block", marginTop: "4px", padding: "2px 8px", borderRadius: "12px", background: "var(--muted)", color: "var(--primary)" }}>{user?.role}</span>
      </div>
    </aside>
  );
}
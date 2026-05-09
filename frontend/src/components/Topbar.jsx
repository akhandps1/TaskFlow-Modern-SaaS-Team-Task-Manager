import useAuth from "../hooks/useAuth";

export default function Topbar({ onMenuClick }) {
  const { logout, user } = useAuth();

  return (
    <header style={{
      height: "64px", background: "var(--surface)", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 30
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Hamburger Menu - Only visible on Mobile via CSS */}
        <button className="topbar-menu-btn" onClick={onMenuClick}>
          ☰
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{ textAlign: "right", display: "none", '@media(min-width: 600px)': { display: 'block' } }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{user?.name}</p>
          <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textTransform: "capitalize" }}>{user?.role} Workspace</p>
        </div>
        <div style={{ width: "1px", height: "32px", background: "var(--border)" }}></div>
        <button
          onClick={logout}
          style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--muted-foreground)" }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
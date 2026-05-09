export default function EmptyState({ title, description }) {
  return (
    <div style={{
      padding: "3rem 1.5rem",
      textAlign: "center",
      background: "var(--surface)",
      border: "1px dashed var(--border)",
      borderRadius: "var(--radius)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%", background: "var(--muted)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem"
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>{title}</h3>
      {description && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", maxWidth: "300px", margin: "0 auto" }}>{description}</p>}
    </div>
  );
}
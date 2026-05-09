export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      borderBottom: "1px solid var(--border)",
      paddingBottom: "1.5rem",
      marginBottom: "2rem"
    }}>
      <div style={{ maxWidth: "800px" }}>
        {eyebrow && (
          <span style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--brand)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "block",
            marginBottom: "0.5rem"
          }}>
            {eyebrow}
          </span>
        )}
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.025em" }}>
          {title}
        </h1>
        {description && (
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "0.5rem", lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {actions}
        </div>
      )}
    </header>
  );
}
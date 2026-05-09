export default function StatCard({ label, value, tone = "default" }) {
  // Determine color based on the requested tone
  let color = "var(--foreground)";
  if (tone === "brand") color = "var(--brand)";
  if (tone === "danger") color = "var(--danger)";
  if (tone === "warning") color = "var(--warning)";
  if (tone === "success") color = "var(--success)";

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "1.5rem",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
    }}>
      <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", fontWeight: 500 }}>
        {label}
      </p>
      <h3 style={{ fontSize: "2rem", fontWeight: 700, color: color }}>
        {value}
      </h3>
    </div>
  );
}
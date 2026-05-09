export default function LoadingScreen({ label = "Loading..." }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minHeight: "400px",
      gap: "1rem"
    }}>
      <div style={{
        width: "32px", height: "32px",
        border: "3px solid var(--muted)",
        borderTopColor: "var(--brand)",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }}>
        {/* Injecting keyframes directly for ease of use */}
        <style>{"@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"}</style>
      </div>
      <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", fontWeight: 500 }}>{label}</p>
    </div>
  );
}
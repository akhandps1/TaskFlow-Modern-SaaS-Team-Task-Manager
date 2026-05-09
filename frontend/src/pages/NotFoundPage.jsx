import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", background: "var(--background)", textAlign: "center", padding: "2rem"
    }}>
      <h1 style={{ fontSize: "6rem", fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--foreground)", margin: "1rem 0" }}>Page not found</h2>
      <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem", maxWidth: "400px" }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary" style={{ textDecoration: "none" }}>
        Return to Dashboard
      </Link>
    </div>
  );
}
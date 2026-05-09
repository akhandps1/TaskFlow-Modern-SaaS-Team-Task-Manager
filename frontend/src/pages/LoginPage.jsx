import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await login(formData);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "var(--surface)", padding: "2.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "48px", height: "48px", background: "var(--brand)", color: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", margin: "0 auto 1rem" }}>TM</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Welcome back</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "0.5rem" }}>Sign in to your workspace.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Email Address</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
          </div>

          {error && <div style={{ fontSize: "0.875rem", color: "var(--danger)", background: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-sm)" }}>{error}</div>}

          <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: "0.75rem", marginTop: "0.5rem", fontWeight: 600 }}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
          Don't have an account? <Link to="/signup" style={{ color: "var(--brand)", fontWeight: 500, textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
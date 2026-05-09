import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await signup(formData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleCardStyle = (isActive) => ({
    padding: "1.25rem",
    border: `2px solid ${isActive ? "var(--brand)" : "var(--border)"}`,
    borderRadius: "var(--radius)",
    background: isActive ? "rgba(37, 99, 235, 0.04)" : "var(--surface)",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "480px", background: "var(--surface)", padding: "2.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>

        {!selectedRole ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ width: "48px", height: "48px", background: "var(--brand)", color: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", margin: "0 auto 1rem" }}>TM</div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Choose your role</h1>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "0.5rem" }}>Select how you will use the workspace.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button
                type="button"
                style={roleCardStyle(false)}
                onClick={() => { setSelectedRole("member"); setFormData({ ...formData, role: "member" }); }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Member Access</span>
                <strong style={{ fontSize: "1.125rem", color: "var(--foreground)" }}>Join as a Team Member</strong>
                <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Update assigned tasks and track your personal work queue.</span>
              </button>

              <button
                type="button"
                style={roleCardStyle(false)}
                onClick={() => { setSelectedRole("admin"); setFormData({ ...formData, role: "admin" }); }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Admin Access</span>
                <strong style={{ fontSize: "1.125rem", color: "var(--foreground)" }}>Join as an Admin</strong>
                <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Create projects, invite members, and monitor delivery.</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, textTransform: "capitalize" }}>{selectedRole} Signup</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Complete your profile details.</p>
              </div>
              <button onClick={() => { setSelectedRole(""); setFormData({ ...formData, role: "" }); }} style={{ fontSize: "0.875rem", color: "var(--brand)", fontWeight: 500 }}>
                Change Role
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Password</label>
                <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Min. 6 characters" />
              </div>

              {error && <div style={{ fontSize: "0.875rem", color: "var(--danger)", background: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-sm)" }}>{error}</div>}

              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: "0.75rem", marginTop: "0.5rem", fontWeight: 600 }}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
          Already registered? <Link to="/login" style={{ color: "var(--brand)", fontWeight: 500, textDecoration: "none" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
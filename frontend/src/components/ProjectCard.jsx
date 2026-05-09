import { Link } from "react-router-dom";

export default function ProjectCard({ project, canDelete = false, isDeleting = false, onDelete }) {
  const cardStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1.5rem",
    boxShadow: "var(--shadow-sm)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.2s ease"
  };

  return (
    <div style={cardStyle} className="project-card-hover">
      <Link to={`/projects/${project._id}`} style={{ textDecoration: "none", color: "inherit", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{project.name}</h3>
          <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "1rem", backgroundColor: project.status === 'active' ? 'var(--muted)' : 'var(--border)', color: "var(--foreground)", fontWeight: 500, textTransform: "capitalize" }}>
            {project.status}
          </span>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.5, flex: 1 }}>
          {project.description || "No description added yet."}
        </p>

        <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "var(--muted-foreground)", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
          <span>Lead: {project.createdBy?.name || "Unknown"}</span>
          <span>•</span>
          <span>{project.members?.length || 0} members</span>
        </div>
      </Link>

      {canDelete && (
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete?.(project)}
          style={{ width: "100%", padding: "0.5rem", fontSize: "0.875rem", color: "var(--danger)", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)", fontWeight: 500 }}
        >
          {isDeleting ? "Deleting..." : "Delete Project"}
        </button>
      )}
    </div>
  );
}
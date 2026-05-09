import { useEffect, useState } from "react";
import { createProject, deleteProject, fetchProjects } from "../api/projectService";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import ProjectCard from "../components/ProjectCard";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

export default function ProjectsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState("");

  const loadProjects = async () => {
    try {
      const response = await fetchProjects();
      setProjects(response.projects || []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProject(formData);
      setFormData({ name: "", description: "" });
      await loadProjects();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete project "${project.name}"?`)) return;
    setDeletingProjectId(project._id);
    try {
      await deleteProject(project._id);
      await loadProjects();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeletingProjectId("");
    }
  };

  if (isLoading) return <LoadingScreen label="Loading projects..." />;

  const formCardStyle = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", boxShadow: "var(--shadow-sm)", height: "fit-content" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 600 }}>Project Workspace</h1>
        <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>{isAdmin ? "Manage and track all company projects." : "View your assigned project environments."}</p>
      </header>

      {error && <div style={{ padding: "1rem", background: "var(--danger-bg)", color: "var(--danger)", borderRadius: "var(--radius-sm)" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "300px 1fr" : "1fr", gap: "2rem", alignItems: "start" }}>

        {isAdmin && (
          <form style={formCardStyle} onSubmit={handleSubmit}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem" }}>Create Project</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Project Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Q4 Marketing" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Description</label>
                <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Project goals and scope..." />
              </div>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: "0.5rem" }}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {projects.length > 0 ? (
            projects.map(p => <ProjectCard key={p._id} project={p} canDelete={isAdmin} isDeleting={deletingProjectId === p._id} onDelete={handleDelete} />)
          ) : (
            <div style={{ gridColumn: "1 / -1" }}>
              <EmptyState title="No projects found" description={isAdmin ? "Use the panel to create your first project." : "You have not been assigned to any projects yet."} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
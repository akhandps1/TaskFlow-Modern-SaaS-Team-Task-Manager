import { useEffect, useState } from "react";
import { fetchDashboardSummary, fetchOverdueTasks, fetchTaskStatusCount } from "../api/dashboardService";
import { createProject, fetchProjects } from "../api/projectService";
import { fetchMyTasks, fetchTasks } from "../api/taskService";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import ProjectCard from "../components/ProjectCard";
import TaskTable from "../components/TaskTable";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [data, setData] = useState({ summary: null, statusCount: null, overdueTasks: [], myTasks: [], projects: [] });
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summary, status, overdue, tasks, projects] = await Promise.all([
          fetchDashboardSummary(), fetchTaskStatusCount(), fetchOverdueTasks(),
          isAdmin ? fetchTasks() : fetchMyTasks(), fetchProjects()
        ]);
        setData({
          summary: summary.summary, statusCount: status.statusCount,
          overdueTasks: overdue.tasks || [], myTasks: tasks.tasks || [], projects: projects.projects || []
        });
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, [isAdmin]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProject(formData);
      setFormData({ name: "", description: "" });
      window.location.reload(); // Simple refresh to sync state globally for MVP
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen label="Loading dashboard..." />;

  const cardStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1.5rem",
    boxShadow: "var(--shadow-sm)"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 600, letterSpacing: "-0.025em" }}>Welcome back, {user?.name}</h1>
        <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>Here is what's happening in your workspace today.</p>
      </header>

      {error && <div style={{ padding: "1rem", background: "var(--danger-bg)", color: "var(--danger)", borderRadius: "var(--radius-sm)" }}>{error}</div>}

      {/* Top Metrics Row - Natively responsive via CSS Grid auto-fit */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {[
          { label: "Total Projects", value: data.summary?.totalProjects || 0 },
          { label: "Total Tasks", value: data.summary?.totalTasks || 0 },
          { label: "In Progress", value: data.summary?.inProgressTasks || 0 },
          { label: "Overdue", value: data.summary?.overdueTasks || 0, color: "var(--danger)" }
        ].map((stat, idx) => (
          <div key={idx} style={cardStyle}>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", fontWeight: 500 }}>{stat.label}</p>
            <h3 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem", color: stat.color || "var(--foreground)" }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Dashboard Main Content Grid - Uses the responsive class from index.css */}
      <div className="dashboard-grid">

        {/* Left Column: Projects & Main Task List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Active Projects</h2>
            </div>
            {data.projects.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                {data.projects.slice(0, 4).map(p => <ProjectCard key={p._id} project={p} />)}
              </div>
            ) : <EmptyState title="No projects yet" description="Create a project to start collaborating." />}
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>{isAdmin ? "Global Task Queue" : "Your Assigned Tasks"}</h2>
            {data.myTasks.length ? (
              <TaskTable tasks={data.myTasks.slice(0, 5)} currentUser={user} showProject />
            ) : (
              <EmptyState title="No assigned tasks" description="You're all caught up." />
            )}
          </section>

        </div>

        {/* Right Column: Actions & Alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {isAdmin && (
            <section style={{ ...cardStyle, background: "var(--muted)", border: "none" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Quick Create Project</h3>
              <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </form>
            </section>
          )}

          <section style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--danger)", marginBottom: "1rem" }}>Needs Attention</h3>
            {data.overdueTasks.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {data.overdueTasks.slice(0, 5).map(task => (
                  <div key={task._id} style={{ padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{task.title}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{task.project?.name || "No Project"}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--danger)", fontWeight: 500 }}>Overdue</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>No overdue tasks. Great job keeping up!</p>
            )}
          </section>

        </div>

      </div>
    </div>
  );
}
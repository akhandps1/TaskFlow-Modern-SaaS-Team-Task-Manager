import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addMemberToProject, deleteProject, fetchProjectById, fetchProjectMembers, removeMemberFromProject, updateProject } from "../api/projectService";
import { createTask, deleteTask, fetchTaskById, fetchTasksByProject, updateTask, updateTaskStatus } from "../api/taskService";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import TaskTable from "../components/TaskTable";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");

  const [projectForm, setProjectForm] = useState({ name: "", description: "", status: "active" });
  const [memberForm, setMemberForm] = useState({ email: "" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" });

  const isProjectAdmin = useMemo(() => String(project?.createdBy?._id) === String(user?.id), [project, user]);

  const loadData = async () => {
    try {
      const [projRes, memRes, taskRes] = await Promise.all([
        fetchProjectById(projectId), fetchProjectMembers(projectId), fetchTasksByProject(projectId)
      ]);
      setProject(projRes.project);
      setMembers(memRes.members || []);
      setTasks(taskRes.tasks || []);
      setProjectForm({ name: projRes.project.name, description: projRes.project.description || "", status: projRes.project.status });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [projectId]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) await updateTask(editingTaskId, taskForm);
      else await createTask({ ...taskForm, project: projectId });
      setEditingTaskId("");
      setTaskForm({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" });
      await loadData();
    } catch (err) { alert(getApiErrorMessage(err)); }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm("Delete this task?")) return;
    await deleteTask(task._id);
    await loadData();
  };

  const handleRemoveMember = async (member) => {
    if (!window.confirm(`Remove ${member.name}?`)) return;
    await removeMemberFromProject(projectId, member._id);
    await loadData();
  };

  if (isLoading) return <LoadingScreen label="Loading workspace..." />;
  if (!project) return <EmptyState title="Project not found" />;

  const cardStyle = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {isProjectAdmin ? "Admin Access" : "Member Access"}
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.25rem" }}>{project.name}</h1>
          <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem", maxWidth: "600px" }}>{project.description || "No description provided."}</p>
        </div>
        <span style={{ padding: "0.5rem 1rem", background: "var(--muted)", borderRadius: "2rem", fontSize: "0.875rem", fontWeight: 500, textTransform: "capitalize" }}>
          Status: {project.status}
        </span>
      </header>

      {error && <div style={{ padding: "1rem", background: "var(--danger-bg)", color: "var(--danger)", borderRadius: "var(--radius-sm)" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>

        {/* Main Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {isProjectAdmin && (
            <section style={cardStyle}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>{editingTaskId ? "Edit Task" : "Create Task"}</h2>
              <form onSubmit={handleTaskSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <input required placeholder="Task Title" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <textarea rows="2" placeholder="Task Description" value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
                </div>
                <select required value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })} style={{ padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", outline: "none" }}>
                  <option value="" disabled>Assign to member</option>
                  {members.map(m => <option key={m._id} value={m.email}>{m.name}</option>)}
                </select>
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} style={{ padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", outline: "none" }}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input required type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingTaskId ? "Save Changes" : "Add Task"}</button>
                  {editingTaskId && <button type="button" onClick={() => setEditingTaskId("")} style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Cancel</button>}
                </div>
              </form>
            </section>
          )}

          <section style={cardStyle}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Task Board</h2>
            {tasks.length ? (
              <TaskTable tasks={tasks} currentUser={user} onStatusChange={(id, status) => updateTaskStatus(id, { status }).then(loadData)} onDeleteTask={isProjectAdmin ? handleDeleteTask : null} />
            ) : (
              <EmptyState title="No tasks yet" description="Start adding tasks to populate the board." />
            )}
          </section>
        </div>

        {/* Sidebar Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          <aside style={cardStyle}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem" }}>Team Members</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {members.map(member => (
                <div key={member._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid var(--muted)" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.875rem", color: "var(--foreground)" }}>{member.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{member.email}</span>
                  </div>
                  {isProjectAdmin && String(member._id) !== String(project.createdBy?._id) && (
                    <button onClick={() => handleRemoveMember(member)} style={{ fontSize: "0.75rem", color: "var(--danger)", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-sm)", background: "var(--danger-bg)" }}>Remove</button>
                  )}
                </div>
              ))}
            </div>

            {isProjectAdmin && (
              <form onSubmit={async (e) => { e.preventDefault(); await addMemberToProject(projectId, memberForm); setMemberForm({ email: "" }); loadData(); }} style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
                <input required type="email" placeholder="Invite by email" value={memberForm.email} onChange={e => setMemberForm({ email: e.target.value })} style={{ flex: 1, padding: "0.5rem", fontSize: "0.875rem" }} />
                <button type="submit" className="btn-primary" style={{ padding: "0.5rem 1rem" }}>Add</button>
              </form>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { fetchMyTasks, updateTaskStatus } from "../api/taskService";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import TaskTable from "../components/TaskTable";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

export default function MyTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const response = await fetchMyTasks();
      setTasks(response.tasks || []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") return tasks;
    return tasks.filter(t => t.status === statusFilter);
  }, [statusFilter, tasks]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, { status });
      await loadTasks();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (isLoading) return <LoadingScreen label="Loading your tasks..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 600 }}>My Tasks</h1>
          <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>Focus on your personal work queue.</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "0.6rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface)", fontWeight: 500, outline: "none", cursor: "pointer" }}
        >
          <option value="all">All Tasks</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </header>

      {error && <div style={{ padding: "1rem", background: "var(--danger-bg)", color: "var(--danger)", borderRadius: "var(--radius-sm)" }}>{error}</div>}

      <div>
        {filteredTasks.length ? (
          <TaskTable tasks={filteredTasks} currentUser={user} showProject onStatusChange={handleStatusChange} />
        ) : (
          <EmptyState title="Clear queue" description="You have no tasks matching this status." />
        )}
      </div>
    </div>
  );
}
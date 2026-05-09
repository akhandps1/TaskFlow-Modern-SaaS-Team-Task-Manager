import { formatDate, formatStatusLabel } from "../utils/formatters";

export default function TaskTable({ tasks, showProject = false, currentUser, onStatusChange, onEditTask, onDeleteTask, actionTaskId }) {
  const thStyle = { textAlign: "left", padding: "1rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)", fontWeight: 600 };
  const tdStyle = { padding: "1rem", borderBottom: "1px solid var(--muted)", fontSize: "0.875rem", verticalAlign: "middle" };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return { bg: "#fef2f2", color: "#ef4444" };
      case "medium": return { bg: "#fffbeb", color: "#f59e0b" };
      default: return { bg: "#f1f5f9", color: "#64748b" };
    }
  };

  return (
    <div style={{ overflowX: "auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
        <thead style={{ background: "var(--background)" }}>
          <tr>
            <th style={thStyle}>Task</th>
            {showProject && <th style={thStyle}>Project</th>}
            <th style={thStyle}>Assigned To</th>
            <th style={thStyle}>Priority</th>
            <th style={thStyle}>Due Date</th>
            <th style={thStyle}>Status</th>
            {(onEditTask || onDeleteTask) && <th style={thStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const canUpdate = Boolean(onStatusChange) && (String(task.assignedTo?._id) === String(currentUser?.id) || String(task.createdBy?._id) === String(currentUser?.id));
            const isBusy = actionTaskId === task._id;
            const prioColors = getPriorityColor(task.priority);

            return (
              <tr key={task._id} style={{ transition: "background 0.2s" }} className="table-row-hover">
                <td style={tdStyle}>
                  <strong style={{ display: "block", fontWeight: 500, color: "var(--foreground)", marginBottom: "0.25rem" }}>{task.title}</strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{task.description ? (task.description.length > 50 ? task.description.slice(0, 50) + '...' : task.description) : "No description."}</span>
                </td>
                {showProject && <td style={tdStyle}>{task.project?.name || "-"}</td>}
                <td style={tdStyle}>{task.assignedTo?.name || "-"}</td>
                <td style={tdStyle}>
                  <span style={{ padding: "0.25rem 0.6rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: 500, background: prioColors.bg, color: prioColors.color, textTransform: "capitalize" }}>
                    {task.priority}
                  </span>
                </td>
                <td style={tdStyle}>{formatDate(task.dueDate)}</td>
                <td style={tdStyle}>
                  {canUpdate ? (
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange?.(task._id, e.target.value)}
                      style={{ padding: "0.4rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: "0.875rem", background: "var(--surface)", cursor: "pointer", outline: "none" }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{formatStatusLabel(task.status)}</span>
                  )}
                </td>
                {(onEditTask || onDeleteTask) && (
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {onEditTask && <button type="button" onClick={() => onEditTask(task)} disabled={isBusy} style={{ fontSize: "0.875rem", color: "var(--brand)", fontWeight: 500 }}>Edit</button>}
                      {onDeleteTask && <button type="button" onClick={() => onDeleteTask(task)} disabled={isBusy} style={{ fontSize: "0.875rem", color: "var(--danger)", fontWeight: 500 }}>Delete</button>}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
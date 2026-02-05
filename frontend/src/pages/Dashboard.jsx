import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= API ================= */

  const fetchProfile = async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch {
      setError("Failed to load profile");
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return setError("Task title is required");

    try {
      await api.post("/tasks", { title });
      setTitle("");
      fetchTasks();
    } catch {
      setError("Failed to add task");
    }
  };

  const updateTask = async (id) => {
    if (!editingTitle.trim()) return setError("Title cannot be empty");

    try {
      await api.put(`/tasks/${id}`, { title: editingTitle });
      setEditingId(null);
      setEditingTitle("");
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete task");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ===== Header ===== */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
            {user && (
              <p className="text-gray-600 text-xs sm:text-sm">
                {user.name} • {user.email}
              </p>
            )}
          </div>

          <button
            onClick={logout}
            className="text-red-600 hover:underline text-sm self-start sm:self-auto"
          >
            Logout
          </button>
        </div>

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-xl sm:text-2xl font-bold">
              {tasks.length}
            </p>
          </div>
        </div>

        {/* ===== Task Card ===== */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">

          {/* Add Task */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              className="border p-2 rounded w-full"
              placeholder="Add new task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            >
              Add Task
            </button>
          </div>

          {/* Search */}
          <input
            className="border p-2 w-full rounded mb-4"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          {/* ===== Task List ===== */}
          {loading ? (
            <p className="text-sm text-gray-500">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-6">
              No tasks found
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border rounded p-3 gap-3"
                >
                  {editingId === task._id ? (
                    <input
                      className="border p-1 rounded w-full sm:flex-1"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                  ) : (
                    <span className="break-words">{task.title}</span>
                  )}

                  <div className="flex gap-3 text-sm">
                    {editingId === task._id ? (
                      <>
                        <button
                          className="text-green-600"
                          onClick={() => updateTask(task._id)}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-500"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setEditingId(task._id);
                            setEditingTitle(task.title);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => deleteTask(task._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

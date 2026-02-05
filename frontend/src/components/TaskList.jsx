import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function TaskList({ onDelete }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/tasks?search=${search}&status=${status}&page=${page}`
      );

      setTasks(res.data.data);
      setPages(res.data.pages);
      setError("");
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page]);

  // Handle delete
  const handleDelete = async (id) => {
    await onDelete(id);
    fetchTasks();
  };

  return (
    <div className="space-y-4">

      {/* Search + Filter */}
      <div className="flex gap-2">
        <input
          className="border p-2 w-full rounded"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading tasks...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Empty State */}
      {!loading && tasks.length === 0 && (
        <p className="text-gray-500">No tasks found</p>
      )}

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500 capitalize">
                {task.status}
              </p>
            </div>

            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            disabled={page === 1}
            className="border px-3 py-1 rounded disabled:opacity-50"
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span className="px-2">
            {page} / {pages}
          </span>

          <button
            disabled={page === pages}
            className="border px-3 py-1 rounded disabled:opacity-50"
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

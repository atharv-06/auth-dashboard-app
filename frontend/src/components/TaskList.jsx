import { useState } from "react";

export default function TaskList({ tasks, onDelete }) {
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <input
        className="border p-2 w-full mb-4 rounded"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Empty state */}
      {filteredTasks.length === 0 && (
        <p className="text-gray-500">No tasks found</p>
      )}

      {/* Task list */}
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>{task.title}</span>

            <button
              onClick={() => onDelete(task._id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

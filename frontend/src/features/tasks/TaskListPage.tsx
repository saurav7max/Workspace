import { Link } from 'react-router-dom';
import { useTasks, useDeleteTask } from '../../shared/hooks/useTasks';
import type { Task } from '../../shared/types';

export function TaskListPage() {
  const { data: tasks = [], loading, error } = useTasks();
  const deleteTaskMutation = useDeleteTask();

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteTaskMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">Error loading tasks: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (tasks?.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <p className="text-gray-600">Manage and organize your tasks</p>
        </div>

        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">No tasks yet!</h3>
          <p className="text-gray-600 mb-6">Create your first task to get started.</p>
          <Link
            to="/tasks/new"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create First Task
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Tasks ({tasks?.length})</h2>
          <p className="text-gray-600">Manage and organize your tasks</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/tasks/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            New Task
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {tasks?.map((task: Task) => (
          <div
            key={task.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {task.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {task.description || 'No description'}
                </p>
                <small className="text-gray-500">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </small>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Link
                  to={`/tasks/${task.id}/edit`}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(task.id, task.title)}
                  disabled={deleteTaskMutation.loading}
                  className={`px-3 py-1 text-white text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    deleteTaskMutation.loading
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {deleteTaskMutation.loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

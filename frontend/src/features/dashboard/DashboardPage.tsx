import { Link } from 'react-router-dom';
import { useTasksQuery } from '../../shared/hooks/useTasksQuery';
import type { Task } from '../../shared/types';

export function DashboardPage() {
  const { data: tasks = [], isLoading, error } = useTasksQuery();

  const lastUpdatedTask = tasks.length > 0 
    ? tasks.reduce((latest: Task, task: Task) => 
        new Date(task.createdAt) > new Date(latest.createdAt) ? task : latest
      )
    : null;

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
            <div className="bg-gray-200 h-32 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">Error loading tasks: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of your tasks and recent activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Tasks</h3>
          <div className="text-3xl font-bold text-blue-600">
            {tasks.length}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Last Updated</h3>
          <div className="text-sm text-gray-600">
            {lastUpdatedTask 
              ? `${lastUpdatedTask.title} - ${new Date(lastUpdatedTask.createdAt).toLocaleDateString()}`
              : 'No tasks yet'
            }
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link
          to="/tasks/new"
          className="inline-block px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Create Task
        </Link>

        <Link
          to="/tasks"
          className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View Tasks
        </Link>
      </div>

      {tasks.length === 0 && (
        <div className="mt-8 p-8 bg-gray-50 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet!</h3>
          <p className="text-gray-600">Get started by creating your first task.</p>
        </div>
      )}
    </div>
  );
}

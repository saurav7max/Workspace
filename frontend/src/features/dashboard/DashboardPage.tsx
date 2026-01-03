import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import type { Task } from '../../shared/types';

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskData = await taskService.getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const lastUpdatedTask = tasks.length > 0 
    ? tasks.reduce((latest, task) => 
        new Date(task.createdAt) > new Date(latest.createdAt) ? task : latest
      )
    : null;

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Loading your tasks...</p>
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

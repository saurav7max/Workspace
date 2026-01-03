import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTaskQuery, useUpdateTaskMutation } from '../../shared/hooks/useTasksQuery';
import type { Task } from '../../shared/types';

interface EditFormProps {
  task: Task | null;
  taskLoading: boolean;
  taskError: Error | null;
  updateTaskMutation: ReturnType<typeof useUpdateTaskMutation>;
  navigate: ReturnType<typeof useNavigate>;
}

export function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: task, isLoading: taskLoading, error: taskError } = useTaskQuery(id);
  const updateTaskMutation = useUpdateTaskMutation();

  return <EditForm task={task} taskLoading={taskLoading} taskError={taskError} updateTaskMutation={updateTaskMutation} navigate={navigate} />;
}

function EditForm({ task, taskLoading, taskError, updateTaskMutation, navigate }: EditFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    if (!task?.id) {
      setValidationError('Task ID is missing');
      return;
    }

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        updates: {
          title: title.trim(),
          description: description.trim()
        }
      });
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const displayError = validationError || updateTaskMutation.error?.message || taskError?.message;
  const loading = taskLoading || updateTaskMutation.isPending;

  if (taskLoading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Task</h2>
          <p className="text-gray-600">Loading task...</p>
        </div>
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
      </div>
    );
  }

  if (!task && !taskLoading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Task Not Found</h2>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
          <Link
            to="/tasks"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Task</h2>
        <p className="text-gray-600">Update your task details</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 text-sm font-semibold text-gray-700">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {displayError && (
            <div className="text-red-600 mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              {displayError}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-blue-600 text-white rounded-md font-semibold transition-colors ${
                loading 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {updateTaskMutation.isPending ? 'Updating...' : 'Update Task'}
            </button>

            <Link
              to="/tasks"
              className="px-8 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

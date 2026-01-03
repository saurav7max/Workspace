import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateTaskMutation } from '../../shared/hooks/useTasksQuery';

export function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const createTaskMutation = useCreateTaskMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        title: title.trim(),
        description: description.trim()
      });
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const displayError = validationError || (createTaskMutation.error?.message);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Task</h2>
        <p className="text-gray-600">Add a new task to your list</p>
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
              disabled={createTaskMutation.isPending}
              className={`px-8 py-3 bg-green-600 text-white rounded-md font-semibold transition-colors ${
                createTaskMutation.isPending 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              }`}
            >
              {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
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

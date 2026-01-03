import { useState } from 'react';
import { useCommandRegistry } from '../hooks/useCommandRegistry';

export function CommandDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const { getAvailableCommands, getCategories, executeCommand } = useCommandRegistry();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors z-50"
      >
        🐛 Debug Commands
      </button>
    );
  }

  const commands = getAvailableCommands();
  const categories = getCategories();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Command Registry Debug</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            Categories ({categories.length})
          </h4>
          <div className="space-y-1">
            {categories.map(category => (
              <div key={category.id} className="text-xs text-gray-600">
                {category.label} (priority: {category.priority})
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            Available Commands ({commands.length})
          </h4>
          <div className="space-y-2">
            {commands.map(command => (
              <div key={command.id} className="border border-gray-200 rounded p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{command.icon}</span>
                    <span className="text-sm font-medium">{command.label}</span>
                  </div>
                  <button
                    onClick={() => executeCommand(command.id)}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Execute
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {command.description}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Category: {command.category} | ID: {command.id}
                </div>
                {command.keywords && (
                  <div className="text-xs text-gray-400 mt-1">
                    Keywords: {command.keywords.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useCommandRegistry } from '../hooks/useCommandRegistry';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { getAvailableCommands, executeCommand, getCategories } = useCommandRegistry();
  const inputRef = useRef<HTMLInputElement>(null);

  const openPalette = () => setIsOpen(true);
  const closePalette = () => {
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  };

  // Expose openPalette function globally for other components to use
  useEffect(() => {
    const globalWindow = window as typeof window & { openCommandPalette?: () => void };
    globalWindow.openCommandPalette = openPalette;
    return () => {
      delete globalWindow.openCommandPalette;
    };
  }, []);

  // Global keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (isOpen) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Get filtered commands based on search
  const filteredCommands = getAvailableCommands().filter(command => {
    const searchLower = search.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
      command.category.toLowerCase().includes(searchLower)
    );
  });

  // Group commands by category
  const commandsByCategory = getCategories().reduce((acc, category) => {
    const categoryCommands = filteredCommands.filter(cmd => cmd.category === category.id);
    if (categoryCommands.length > 0) {
      acc[category.id] = {
        category,
        commands: categoryCommands
      };
    }
    return acc;
  }, {} as Record<string, { category: import('../types').CommandCategory; commands: import('../types').Command[] }>);

  // Reset selection when search changes (using useMemo instead of useEffect)
  const effectiveSelectedIndex = search !== '' && selectedIndex > filteredCommands.length - 1 ? 0 : selectedIndex;

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closePalette();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[effectiveSelectedIndex]) {
            executeCommand(filteredCommands[effectiveSelectedIndex].id);
            closePalette();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, effectiveSelectedIndex, filteredCommands, executeCommand]);

  return (
    <>
      {/* Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center pt-[15vh] z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
            {/* Search Input */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for commands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-lg border-none outline-none bg-transparent placeholder-gray-400"
                />
              </div>
            </div>

            {/* Commands List */}
            <div className="overflow-y-auto max-h-80">
              {filteredCommands.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="text-5xl mb-4">🔍</div>
                  <div className="text-lg font-medium text-gray-700 mb-2">No commands found</div>
                  <div className="text-sm text-gray-500">Try a different search term</div>
                </div>
              ) : (
                <div className="py-2">
                  {Object.entries(commandsByCategory).map(([categoryId, { category, commands }]) => (
                    <div key={categoryId} className="mb-2">
                      {/* Category Header */}
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                        {category.label}
                      </div>
                      
                      {/* Category Commands */}
                      {commands.map((command) => {
                        const globalIndex = filteredCommands.indexOf(command);
                        const isSelected = globalIndex === effectiveSelectedIndex;
                        
                        return (
                          <div
                            key={command.id}
                            className={`mx-2 px-3 py-3 cursor-pointer flex items-center justify-between transition-all duration-150 rounded-md ${
                              isSelected 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              executeCommand(command.id);
                              closePalette();
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-lg flex-shrink-0">{command.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                  {command.label}
                                </div>
                                {command.description && (
                                  <div className={`text-sm truncate ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                                    {command.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {command.shortcut && (
                              <div className={`text-xs px-2 py-1 rounded border font-mono flex-shrink-0 ${
                                isSelected 
                                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}>
                                {command.shortcut}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">↵</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">Esc</kbd>
                  <span>Close</span>
                </span>
              </div>
              <div className="text-gray-400">
                {filteredCommands.length} result{filteredCommands.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

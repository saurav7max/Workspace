import { useEffect } from 'react';
import { useCommandRegistry } from './useCommandRegistry';

export function useKeyboardShortcuts() {
  const { getAvailableCommands, executeCommand } = useCommandRegistry();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Alt+Left Arrow (Go Back)
      if (event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        const backCommand = getAvailableCommands().find(cmd => cmd.id === 'nav.back');
        if (backCommand) {
          executeCommand('nav.back');
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [getAvailableCommands, executeCommand]);
}

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

      // Check for Ctrl+K or Cmd+K (future command palette trigger)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        console.log('Command palette shortcut triggered! (not implemented yet)');
        console.log('Available commands:', getAvailableCommands());
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [getAvailableCommands, executeCommand]);
}

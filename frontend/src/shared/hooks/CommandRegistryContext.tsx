import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAllCommands } from '../commands/allCommands';

interface CommandRegistryContextType {
  getCommands: () => import('../types').Command[];
  getAvailableCommands: () => import('../types').Command[];
  getCategories: () => import('../types').CommandCategory[];
  executeCommand: (commandId: string) => Promise<void>;
}

const CommandRegistryContext = createContext<CommandRegistryContextType | undefined>(undefined);

export function CommandRegistryProvider({ children }: { children: ReactNode }) {
  const { commands, categories } = useAllCommands();

  const getCommands = () => commands;

  const getAvailableCommands = () => {
    return commands.filter(command => {
      const isVisible = command.isVisible ? command.isVisible() : true;
      const isEnabled = command.isEnabled ? command.isEnabled() : true;
      return isVisible && isEnabled;
    });
  };

  const getCategories = () => categories;

  const executeCommand = async (commandId: string) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (!command) {
      console.warn(`Command with id "${commandId}" not found`);
      return;
    }

    const isEnabled = command.isEnabled ? command.isEnabled() : true;
    if (!isEnabled) {
      console.warn(`Command "${commandId}" is disabled`);
      return;
    }

    try {
      await command.action();
    } catch (error) {
      console.error(`Error executing command "${commandId}":`, error);
    }
  };

  return (
    <CommandRegistryContext.Provider value={{
      getCommands,
      getAvailableCommands,
      getCategories,
      executeCommand
    }}>
      {children}
    </CommandRegistryContext.Provider>
  );
}

export function useCommandRegistry() {
  const context = useContext(CommandRegistryContext);
  if (context === undefined) {
    throw new Error('useCommandRegistry must be used within a CommandRegistryProvider');
  }
  return context;
}

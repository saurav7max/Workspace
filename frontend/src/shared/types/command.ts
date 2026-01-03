export interface Command {
  id: string;
  label: string;
  description?: string;
  category: string;
  keywords?: string[];
  icon?: string;
  shortcut?: string;
  action: () => void | Promise<void>;
  isEnabled?: () => boolean;
  isVisible?: () => boolean;
}

export interface CommandCategory {
  id: string;
  label: string;
  priority: number;
}

export interface CommandRegistryState {
  commands: Map<string, Command>;
  categories: Map<string, CommandCategory>;
}

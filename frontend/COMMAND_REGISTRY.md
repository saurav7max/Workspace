# Command Registry System

## Overview

The Command Registry is a centralized system that allows different features of the app to register their available actions. This creates a single source of truth for "what can the user do right now?" which will power the Command Palette feature.

## Architecture

```
Feature (Dashboard/Tasks/Auth)
    ↓ registers commands
Command Registry (global state)
    ↓ consumed by
Command Palette UI (future)
    ↓ executes
Command Actions
```

## Key Components

### 1. Command Type Definition
```typescript
interface Command {
  id: string;              // Unique identifier
  label: string;           // Display name
  description?: string;    // Help text
  category: string;        // Grouping
  keywords?: string[];     // Search terms
  icon?: string;          // Visual indicator
  shortcut?: string;      // Keyboard shortcut
  action: () => void;     // What happens when executed
  isEnabled?: () => boolean;  // Dynamic availability
  isVisible?: () => boolean;  // Dynamic visibility
}
```

### 2. Command Registry Context
- **CommandRegistryProvider**: Wraps the app to provide command state
- **useCommandRegistry**: Hook to access registry functions
- **useRegisterCommands**: Hook to register/cleanup commands automatically

### 3. Feature Integration

Each page/feature registers its commands:

```typescript
// In a React component
const commands = useMyFeatureCommands();
useRegisterCommands(commands, categories);
```

## Current Implementation

### Dashboard Commands
- Create New Task
- View All Tasks  
- Logout

### Task Commands
- Create Task
- View Tasks
- Go to Dashboard
- Edit Individual Tasks (dynamic based on existing tasks)

### Navigation Commands
- Go to Dashboard (when not on dashboard)
- Go to Tasks (when not on tasks)
- Create New Task (when not on create page)
- Go Back (when history available)

## Benefits

1. **Centralized Actions**: All app actions in one place
2. **Dynamic Commands**: Commands appear/disappear based on context
3. **Searchable**: Keywords make actions discoverable
4. **Keyboard Friendly**: Ready for shortcuts and command palette
5. **Extensible**: Easy to add new commands from any feature

## Testing

Use the **Command Debugger** (purple button in bottom-right) to:
- See all registered commands
- View command categories
- Execute commands directly
- Debug command availability

## Next Steps

This Command Registry is now ready to power a Command Palette UI that will provide:
- Fuzzy search across all commands
- Keyboard shortcuts (Cmd+K / Ctrl+K)
- Quick action execution
- Contextual command suggestions

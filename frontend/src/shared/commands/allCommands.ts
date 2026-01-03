import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../../services/taskService';
import type { Command, CommandCategory, Task } from '../types';
import { useEffect, useState } from 'react';

/**
 * Simple, centralized command definitions
 * All commands are defined here and automatically available everywhere
 * No manual registration needed!
 */
export function useAllCommands(): { commands: Command[], categories: CommandCategory[] } {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Load tasks asynchronously
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskData = await taskService.getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error('Failed to load tasks for commands:', error);
        setTasks([]);
      }
    };
    
    loadTasks();
  }, []);
  
  const categories: CommandCategory[] = [
    { id: 'navigation', label: 'Navigation', priority: 0 },
    { id: 'tasks', label: 'Tasks', priority: 1 },
    { id: 'auth', label: 'Authentication', priority: 2 }
  ];

  const commands: Command[] = [
    // Navigation Commands
    {
      id: 'nav.dashboard',
      label: 'Go to Dashboard',
      description: 'Navigate to the main dashboard',
      category: 'navigation',
      keywords: ['dashboard', 'home', 'main'],
      icon: '🏠',
      action: () => navigate('/dashboard'),
      isVisible: () => location.pathname !== '/dashboard'
    },
    {
      id: 'nav.tasks',
      label: 'Go to Tasks',
      description: 'Navigate to tasks list',
      category: 'navigation',
      keywords: ['tasks', 'list', 'view'],
      icon: '📋',
      action: () => navigate('/tasks'),
      isVisible: () => location.pathname !== '/tasks'
    },
    {
      id: 'nav.create-task',
      label: 'Create New Task',
      description: 'Navigate to create task page',
      category: 'navigation',
      keywords: ['create', 'new', 'task', 'add'],
      icon: '➕',
      action: () => navigate('/tasks/new'),
      isVisible: () => location.pathname !== '/tasks/new'
    },
    {
      id: 'nav.back',
      label: 'Go Back',
      description: 'Navigate to previous page',
      category: 'navigation',
      keywords: ['back', 'previous', 'return'],
      icon: '⬅️',
      shortcut: 'Alt+←',
      action: () => navigate(-1),
      isVisible: () => window.history.length > 1
    },

    // Task Commands
    {
      id: 'tasks.create',
      label: 'Create Task',
      description: 'Create a new task',
      category: 'tasks',
      keywords: ['create', 'new', 'task', 'add'],
      icon: '➕',
      action: () => navigate('/tasks/new')
    },
    {
      id: 'tasks.list',
      label: 'View All Tasks',
      description: 'View all tasks',
      category: 'tasks',
      keywords: ['view', 'list', 'tasks', 'all'],
      icon: '📋',
      action: () => navigate('/tasks')
    },

    // Auth Commands
    {
      id: 'auth.logout',
      label: 'Logout',
      description: 'Sign out of the application',
      category: 'auth',
      keywords: ['logout', 'sign out', 'exit'],
      icon: '🚪',
      action: () => logout()
    },

    // Dynamic Task Edit Commands
    ...tasks.map(task => ({
      id: `tasks.edit.${task.id}`,
      label: `Edit "${task.title}"`,
      description: `Edit task: ${task.title}`,
      category: 'tasks',
      keywords: ['edit', 'task', task.title.toLowerCase()],
      icon: '✏️',
      action: () => navigate(`/tasks/${task.id}/edit`)
    }))
  ];

  return { commands, categories };
}

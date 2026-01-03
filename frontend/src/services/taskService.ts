import type { Task } from '../shared/types';

const STORAGE_KEY = 'task_app_tasks';

export const taskService = {
  getTasks: (): Task[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  createTask: (title: string, description: string): Task => {
    const tasks = taskService.getTasks();
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
    const tasks = taskService.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return null;
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return tasks[taskIndex];
  },

  deleteTask: (id: string): boolean => {
    const tasks = taskService.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
    return true;
  },

  getTaskById: (id: string): Task | null => {
    const tasks = taskService.getTasks();
    return tasks.find(task => task.id === id) || null;
  }
};

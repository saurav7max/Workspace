import { Task } from "../types/task";

const tasks: Task[] = [];

export function getTasks(): Task[] {
  return tasks;
}

export function createTask(data: Omit<Task, "id" | "createdAt">): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  };

  tasks.push(task);
  return task;
}

export function updateTask(
  id: string,
  updates: Partial<Task>
): Task | null {
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return null;
  }

  Object.assign(task, updates); // merge updates into task
  return task;
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1); // remove task from array
  return true;
}

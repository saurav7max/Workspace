import db from "../db/database";
import { Task } from "../types/task";

export function getTasks(): Task[] {
  return db.prepare(`SELECT * FROM tasks`).all() as Task[];
}

export function getTaskById(id: string): Task | null {
  const task = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id) as Task | undefined;
  return task || null;
}

export function createTask(data: Omit<Task, "id" | "createdAt">): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  db.prepare(
    `INSERT INTO tasks (id, title, description, createdAt)
    VALUES (@id, @title, @description, @createdAt)`
  ).run(task);
  return task;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const task = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id) as
    | Task
    | undefined;

  if (!task) {
    return null;
  }

  Object.assign(task, updates);

  db.prepare(
    `UPDATE tasks SET title = @title, description = @description WHERE id = @id`
  ).run(task);

  return task;
}

export function deleteTask(id: string): boolean {
  const result = db
    .prepare("DELETE FROM tasks WHERE id = ?")
    .run(id);

  return result.changes > 0;
}

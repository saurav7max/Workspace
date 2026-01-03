import { Request, Response } from "express";
import * as taskService from "../services/task.service";

export function getTasks(req: Request, res: Response) {
  const tasks = taskService.getTasks();
  res.json(tasks);
}

export function createTask(req: Request, res: Response) {
  const task = taskService.createTask(req.body);
  res.status(201).json(task);
}

export function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  const task = taskService.updateTask(id, req.body);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
}

export function deleteTask(req: Request, res: Response) {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  const success = taskService.deleteTask(id);

  if (!success) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(204).end();
}

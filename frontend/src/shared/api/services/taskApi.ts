import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CreateTaskRequest, UpdateTaskRequest } from '../types';
import type { Task } from '../../types';

// Task API service
export const taskApi = {
  // Get all tasks
  getAll: (): Promise<Task[]> =>
    apiClient.get(API_ENDPOINTS.tasks.list),

  // Get task by ID
  getById: (id: string): Promise<Task> =>
    apiClient.get(API_ENDPOINTS.tasks.get(id)),

  // Create new task
  create: (data: CreateTaskRequest): Promise<Task> =>
    apiClient.post(API_ENDPOINTS.tasks.create, data),

  // Update existing task
  update: (id: string, data: UpdateTaskRequest): Promise<Task> =>
    apiClient.put(API_ENDPOINTS.tasks.update(id), data),

  // Delete task
  delete: (id: string): Promise<void> =>
    apiClient.delete(API_ENDPOINTS.tasks.delete(id)),
};

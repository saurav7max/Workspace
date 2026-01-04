import { useApiQuery, useApiMutation } from './useApi';
import { taskApi } from '../api/services/taskApi';
import { API_ENDPOINTS } from '../api/endpoints';
import type { CreateTaskRequest, UpdateTaskRequest } from '../api/types';
import type { Task } from '../types';

// Hook for fetching all tasks
export function useTasks() {
  const result = useApiQuery<Task[]>(API_ENDPOINTS.tasks.list);
  
  // Sort tasks without mutating the original array
  const sortedData = result.data ? 
    [...result.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
    : null;
  
  return {
    ...result,
    data: sortedData,
  };
}

// Hook for fetching a single task
export function useTask(id: string | undefined) {
  return useApiQuery<Task>(
    id ? API_ENDPOINTS.tasks.get(id) : '',
    {
      enabled: !!id,
    }
  );
}

// Hook for creating tasks
export function useCreateTask(options?: {
  onSuccess?: (task: Task) => void;
}) {
  return useApiMutation(
    (data: CreateTaskRequest) => taskApi.create(data),
    {
      onSuccess: options?.onSuccess,
    }
  );
}

// Hook for updating tasks
export function useUpdateTask(options?: {
  onSuccess?: (task: Task) => void;
}) {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateTaskRequest }) => taskApi.update(id, data),
    {
      onSuccess: options?.onSuccess,
    }
  );
}

// Hook for deleting tasks
export function useDeleteTask(options?: {
  onSuccess?: () => void;
}) {
  return useApiMutation(
    (id: string) => taskApi.delete(id),
    {
      onSuccess: options?.onSuccess,
    }
  );
}

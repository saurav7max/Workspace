import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../../services/taskService';
import type { Task } from '../types';

// Fallback implementation that mimics React Query interface
// This can be used until React Query is properly installed

interface QueryResult<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
  refetch?: () => Promise<void>;
}

interface MutationResult<TData, TVariables> {
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isPending: boolean;
  error: Error | null;
}

export function useTasksQuery(): QueryResult<Task[]> {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tasks = await taskService.getTasks();
      const sortedTasks = tasks.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setData(sortedTasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { data, isLoading, error, refetch: fetchTasks };
}

export function useTaskQuery(id: string | undefined): QueryResult<Task | null> {
  const [data, setData] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchTask = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const task = await taskService.getTaskById(id);
        setData(task);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch task'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  return { data, isLoading, error };
}

export function useCreateTaskMutation(): MutationResult<Task, { title: string; description: string }> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async ({ title, description }: { title: string; description: string }): Promise<Task> => {
    try {
      setIsPending(true);
      setError(null);
      const result = await taskService.createTask(title, description);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create task');
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

export function useUpdateTaskMutation(): MutationResult<Task | null, { 
  id: string; 
  updates: Partial<Omit<Task, 'id' | 'createdAt'>> 
}> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async ({ id, updates }: { 
    id: string; 
    updates: Partial<Omit<Task, 'id' | 'createdAt'>> 
  }): Promise<Task | null> => {
    try {
      setIsPending(true);
      setError(null);
      const result = await taskService.updateTask(id, updates);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update task');
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

export function useDeleteTaskMutation(): MutationResult<boolean, string> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (id: string): Promise<boolean> => {
    try {
      setIsPending(true);
      setError(null);
      const result = await taskService.deleteTask(id);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete task');
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

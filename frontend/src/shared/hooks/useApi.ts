import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/client';
import type { ApiState, MutationState } from '../api/types';

// Generic hook for GET requests
export function useApiQuery<T>(
  endpoint: string,
  options: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
): ApiState<T> & { refetch: () => Promise<void> } {
  const { enabled = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Use refs to avoid recreating fetchData on every render
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const isFetchingRef = useRef(false);
  
  // Update refs when callbacks change
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);
  
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchData = useCallback(async () => {
    if (!enabled || isFetchingRef.current) {
      if (!enabled) {
        setState(prev => ({ ...prev, loading: false }));
      }
      return;
    }

    isFetchingRef.current = true;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await apiClient.get<T>(endpoint);
      setState({ data, loading: false, error: null });
      onSuccessRef.current?.(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      onErrorRef.current?.(errorMessage);
    } finally {
      isFetchingRef.current = false;
    }
  }, [endpoint, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Generic hook for mutations (POST, PUT, DELETE)
export function useApiMutation<TData, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: string, variables: TVariables) => void;
  } = {}
): MutationState & {
  mutate: (variables: TVariables) => Promise<TData | null>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
} {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  // Use refs for callbacks to avoid recreating mutate function
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);
  
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const mutate = useCallback(async (variables: TVariables): Promise<TData | null> => {
    try {
      setState({ loading: true, error: null, success: false });
      const data = await mutationFn(variables);
      setState({ loading: false, error: null, success: true });
      onSuccessRef.current?.(data, variables);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ loading: false, error: errorMessage, success: false });
      onErrorRef.current?.(errorMessage, variables);
      return null;
    }
  }, [mutationFn]);

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    const result = await mutate(variables);
    if (result === null) {
      throw new Error(state.error || 'Mutation failed');
    }
    return result;
  }, [mutate, state.error]);

  return {
    ...state,
    mutate,
    mutateAsync,
  };
}

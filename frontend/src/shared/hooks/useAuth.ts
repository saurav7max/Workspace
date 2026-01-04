import { useCallback } from 'react';
import { authApi, tokenManager } from '../api/services/authApi';
import { useApiMutation } from './useApi';
import { useAuthContext } from '../contexts/AuthProvider';
import type { LoginRequest } from '../api/types';
import type { User } from '../types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const { user, isAuthenticated, setUser } = useAuthContext();

  // Login mutation
  const loginMutation = useApiMutation(
    (credentials: LoginRequest) => authApi.login(credentials),
    {
      onSuccess: (response) => {
        // Store token and user data
        tokenManager.setToken(response.token);
        tokenManager.setUser(response.user);
        setUser(response.user);
      },
    }
  );

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  // Logout function
  const logout = useCallback(() => {
    tokenManager.clear();
    setUser(null);
    // Optionally call backend logout endpoint
    // authApi.logout().catch(console.error);
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    loading: loginMutation.loading,
    error: loginMutation.error,
  };
}

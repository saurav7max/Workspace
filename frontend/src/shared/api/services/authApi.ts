import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { LoginRequest, LoginResponse } from '../types';
import type { User } from '../../types';

// Auth API service
export const authApi = {
  // Login user
  login: (credentials: LoginRequest): Promise<LoginResponse> =>
    apiClient.post(API_ENDPOINTS.auth.login, credentials),

  // Get current user
  me: (): Promise<User> =>
    apiClient.get(API_ENDPOINTS.auth.me),

  // Logout (if backend supports it)
  logout: (): Promise<void> =>
    apiClient.post(API_ENDPOINTS.auth.logout),
};

// Token management utilities
export const tokenManager = {
  TOKEN_KEY: 'task_app_token',
  USER_KEY: 'task_app_user',

  setToken: (token: string): void => {
    localStorage.setItem(tokenManager.TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(tokenManager.TOKEN_KEY);
  },

  removeToken: (): void => {
    localStorage.removeItem(tokenManager.TOKEN_KEY);
  },

  setUser: (user: User): void => {
    localStorage.setItem(tokenManager.USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const stored = localStorage.getItem(tokenManager.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  removeUser: (): void => {
    localStorage.removeItem(tokenManager.USER_KEY);
  },

  clear: (): void => {
    tokenManager.removeToken();
    tokenManager.removeUser();
  },

  isAuthenticated: (): boolean => {
    return !!(tokenManager.getToken() && tokenManager.getUser());
  },
};

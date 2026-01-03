import type { User } from '../shared/types';

const STORAGE_KEY = 'task_app_user';

// Mock credentials
const MOCK_CREDENTIALS = {
  username: 'demo',
  password: 'password'
};

const MOCK_USER: User = {
  id: '1',
  username: 'demo',
  name: 'Demo User'
};

export const authService = {
  login: (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
          resolve(MOCK_USER);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500); // Simulate API delay
    });
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  }
};

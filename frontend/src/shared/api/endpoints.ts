// Centralized API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  
  // Task endpoints
  tasks: {
    list: '/tasks',
    create: '/tasks',
    get: (id: string) => `/tasks/${id}`,
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
  },
  
  // Health check
  health: '/health',
} as const;

// Helper function to build URLs with query parameters
export function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  if (!params) return endpoint;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  
  return `${endpoint}?${searchParams.toString()}`;
}

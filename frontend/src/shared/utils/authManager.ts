// Centralized auth manager to prevent infinite redirects
class AuthManager {
  private isRedirecting = false;
  private readonly TOKEN_KEY = 'task_app_token';
  private readonly USER_KEY = 'task_app_user';

  handleAuthError(error: unknown): void {
    // Type guard to check if error is an axios error
    const isAxiosError = (err: unknown): err is { response?: { status?: number }; config?: { url?: string } } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };

    if (!isAxiosError(error)) {
      return;
    }

    // Only handle 401 errors
    if (error.response?.status !== 401) {
      return;
    }

    // Prevent multiple redirects
    if (this.isRedirecting) {
      return;
    }

    // Don't redirect if already on login page
    if (window.location.pathname === '/login') {
      return;
    }

    // Don't redirect if this is a login request failure
    if (error.config?.url?.includes('/auth/login')) {
      return;
    }

    // Set flag to prevent multiple redirects
    this.isRedirecting = true;

    // Clear auth data
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Redirect to login
    window.location.href = '/login';
  }

  resetRedirectFlag(): void {
    this.isRedirecting = false;
  }
}

export const authManager = new AuthManager();

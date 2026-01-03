import { ReactNode } from 'react';

// Fallback QueryClientProvider that does nothing
// This allows the app to work without React Query installed
export function QueryClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

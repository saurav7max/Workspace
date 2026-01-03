import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../shared/hooks/useAuth';
import { CommandRegistryProvider } from '../shared/hooks/useCommandRegistry';
import { useKeyboardShortcuts } from '../shared/hooks/useKeyboardShortcuts';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { CommandPalette } from '../shared/components/CommandPalette';
import { AppHeader } from '../shared/components/AppHeader';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { TaskListPage } from '../features/tasks/TaskListPage';
import { CreateTaskPage } from '../features/tasks/CreateTaskPage';
import { EditTaskPage } from '../features/tasks/EditTaskPage';

function AppContent() {
  useKeyboardShortcuts();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <AppHeader />
              <main>
                <DashboardPage />
              </main>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <AppHeader />
              <main>
                <TaskListPage />
              </main>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/tasks/new" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <AppHeader />
              <main>
                <CreateTaskPage />
              </main>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/tasks/:id/edit" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <AppHeader />
              <main>
                <EditTaskPage />
              </main>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      {/* Command Palette - Self-contained with trigger and modal */}
      <CommandPalette />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <CommandRegistryProvider>
          <AppContent />
        </CommandRegistryProvider>
      </Router>
    </AuthProvider>
  );
}

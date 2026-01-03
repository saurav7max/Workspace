import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../shared/hooks/useAuth';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { TaskListPage } from '../features/tasks/TaskListPage';
import { CreateTaskPage } from '../features/tasks/CreateTaskPage';
import { EditTaskPage } from '../features/tasks/EditTaskPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TaskListPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks/new" element={
            <ProtectedRoute>
              <CreateTaskPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks/:id/edit" element={
            <ProtectedRoute>
              <EditTaskPage />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

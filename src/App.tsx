import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginForm from './components/auth/LoginForm';
import AdminLoginForm from './components/auth/AdminLoginForm';
import Header from './components/common/Header';
import AdminDashboard from './components/admin/AdminDashboard';
import CandidateManagement from './components/admin/CandidateManagement';
import VoterManagement from './components/admin/VoterManagement';
import VotingInterface from './components/voter/VotingInterface';
import PublicResults from './components/public/PublicResults';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4 tracking-tight">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              There was an error loading the application. Please refresh the page or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-navy-600 text-white px-4 py-2 rounded hover:bg-navy-700 transition-colors"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Admin Layout Component with Sidebar
const AdminLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getNavClass = (path: string) => {
    return location.pathname === path
      ? "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-navy-600 to-navy-700 text-white shadow-md transition-all duration-200"
      : "flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-sm border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:min-h-screen min-h-screen
        `}>
          <div className="p-6 pt-20 lg:pt-6">
            <nav className="space-y-2">
              <Link
                to="/admin"
                className={getNavClass('/admin')}
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link
                to="/admin/candidates"
                className={getNavClass('/admin/candidates')}
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Kandidat
              </Link>
              <Link
                to="/admin/voters"
                className={getNavClass('/admin/voters')}
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Voter
              </Link>
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'} p-6 lg:p-6 pt-20 lg:pt-6`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Voter Layout Component
const VoterLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredUserType?: 'admin' | 'voter'
}> = ({ children, requiredUserType }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin Panel Component - now just a wrapper
const AdminPanel: React.FC = () => {
  return <AdminLayout />;
};

// Main App Component
const AppContent: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userType === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (userType === 'voter') {
    return <Navigate to="/voter" replace />;
  }

  return <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  console.log('App component rendering...');

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/results" element={<PublicResults />} />
              <Route path="/admin/login" element={<AdminLoginForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/voter" element={
                <ProtectedRoute requiredUserType="voter">
                  <VoterLayout>
                    <VotingInterface />
                  </VoterLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }>
                <Route path="" element={<AdminDashboard />} />
                <Route path="candidates" element={<CandidateManagement />} />
                <Route path="voters" element={<VoterManagement />} />
              </Route>
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
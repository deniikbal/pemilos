import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              There was an error loading the application. Please refresh the page or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

// Admin Layout Component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <a 
              href="#dashboard" 
              className="flex-1 py-2 px-4 text-center rounded-md text-sm font-medium bg-blue-600 text-white"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#dashboard';
              }}
            >
              Dashboard
            </a>
            <a 
              href="#candidates" 
              className="flex-1 py-2 px-4 text-center rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#candidates';
              }}
            >
              Kandidat
            </a>
            <a 
              href="#voters" 
              className="flex-1 py-2 px-4 text-center rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#voters';
              }}
            >
              Voter
            </a>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
};

// Voter Layout Component
const VoterLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
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

// Admin Panel Component with Hash Routing
const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderAdminContent = () => {
    switch (activeTab) {
      case 'candidates':
        return <CandidateManagement />;
      case 'voters':
        return <VoterManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout>
      {renderAdminContent()}
    </AdminLayout>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (userType === 'admin') {
    return <AdminPanel />;
  }

  if (userType === 'voter') {
    return (
      <VoterLayout>
        <VotingInterface />
      </VoterLayout>
    );
  }

  return <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/results" element={<PublicResults />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
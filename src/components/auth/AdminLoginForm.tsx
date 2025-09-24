import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginAdmin } from '../../services/auth';

const AdminLoginForm: React.FC = () => {
  console.log('AdminLoginForm rendering...');

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  // Redirect jika sudah terautentikasi
  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      console.log('Already authenticated as admin, redirecting to /admin');
      navigate('/admin');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login attempt:', { username: credentials.username, password: '***' });
    setLoading(true);
    setError('');

    try {
      const response = await loginAdmin(credentials.username, credentials.password);
      console.log('Admin login successful:', { userType: response.userType });

      // Login dan set state
      login(response.user, response.token, response.userType);

      // Tunggu sebentar untuk memastikan state terupdate
      setTimeout(() => {
        console.log('Redirecting to /admin...');
        navigate('/admin');
      }, 100);

    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-navy-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="h-8 w-8 text-navy-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Login</h2>
            <p className="text-gray-600 mt-2">Pemilihan Ketua OSIS SMAN 1 Bantarujeg</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-600 text-white py-2 px-4 rounded-lg hover:bg-navy-700 focus:ring-4 focus:ring-navy-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

            </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
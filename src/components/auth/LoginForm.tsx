import React, { useState } from 'react';
import { User, Lock, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginAdmin, loginVoter } from '../../services/auth';

const LoginForm: React.FC = () => {
  console.log('LoginForm rendering...');
  
  const [loginType, setLoginType] = useState<'admin' | 'voter'>('voter');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    nisn: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { loginType, credentials: { ...credentials, password: '***' } });
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (loginType === 'admin') {
        console.log('Attempting admin login...');
        response = await loginAdmin(credentials.username, credentials.password);
      } else {
        console.log('Attempting voter login...');
        response = await loginVoter(credentials.nisn);
      }

      console.log('Login successful:', { userType: response.userType });
      login(response.user, response.token, response.userType);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Login System</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Pemilihan Ketua OSIS</p>
          </div>

          {/* Login Type Selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={() => setLoginType('voter')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                loginType === 'voter'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Voter
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                loginType === 'admin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {loginType === 'admin' ? (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Password"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  NISN/NIS
                </label>
                <div className="relative">
                  <User className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={credentials.nisn}
                    onChange={(e) => setCredentials(prev => ({ ...prev, nisn: e.target.value }))}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="NISN/NIS"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 space-y-1">
            <p className="font-medium">Demo credentials:</p>
            <div className="space-y-0.5">
              <p>Admin: <span className="font-mono">admin / password</span></p>
              <p>Voter: <span className="font-mono">1001, 1002, 1003, 1004</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
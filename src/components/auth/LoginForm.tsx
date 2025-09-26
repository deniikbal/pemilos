import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginVoter } from '../../services/auth';

const LoginForm: React.FC = () => {
  console.log('Voter LoginForm rendering...');

  const [credentials, setCredentials] = useState({
    nisn: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  // Redirect jika sudah terautentikasi
  useEffect(() => {
    if (isAuthenticated && userType === 'voter') {
      console.log('Already authenticated as voter, redirecting to /voter');
      navigate('/voter');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Voter login attempt:', { nisn: credentials.nisn });
    setLoading(true);
    setError('');

    try {
      const response = await loginVoter(credentials.nisn);
      console.log('Voter login successful:', { userType: response.userType });

      // Login dan set state
      login(response.user, response.token, response.userType);

      // Tunggu sebentar untuk memastikan state terupdate
      setTimeout(() => {
        console.log('Redirecting to /voter...');
        navigate('/voter');
      }, 100);

    } catch (err: any) {
      console.error('Voter login error:', err);
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with back button */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-lg hover:bg-white transition-all duration-300 shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <UserCheck className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Login Voter
              </h2>
              <p className="text-gray-600">
                Pemilihan Ketua OSIS SMAN 1 Bantarujeg 2025
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NISN/NIS
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={credentials.nisn}
                    onChange={(e) => setCredentials(prev => ({ ...prev, nisn: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan NISN/NIS Anda"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </div>
                ) : (
                  'Login & Mulai Voting'
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Belum terdaftar sebagai voter?
              </p>
              <div className="space-y-2">
                <Link
                  to="/admin/login"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm block"
                >
                  Login sebagai Administrator
                </Link>
                <Link
                  to="/results"
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm block"
                >
                  Lihat Hasil Voting
                </Link>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">ℹ️</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Informasi Login</h4>
                <p className="text-sm text-blue-700">
                  Gunakan NISN/NIS yang telah terdaftar di sistem untuk mengakses halaman voting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
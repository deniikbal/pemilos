import React, { useState, useEffect } from 'react';
import {
  Users, Vote, UserCheck, BarChart3, RefreshCw,
  TrendingUp, Clock, CheckCircle, AlertCircle, Activity,
  FileText, Eye, Calendar, X, AlertTriangle, Shield
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  Area, AreaChart, Legend
} from 'recharts';
import { getDashboardStats, resetVoting } from '../../services/api';
import type { DashboardStats } from '../../types';

const COLORS = ['#1e3a5f', '#10B981', '#F59E0B', '#EF4444', '#4e6b8a', '#F97316', '#06B6D4', '#84CC16'];

const AdminDashboard: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState('');

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setLastUpdate(new Date().toLocaleTimeString('id-ID'));
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetVoting = async () => {
    setShowResetModal(true);
    setResetConfirmation('');
  };

  const confirmResetVoting = async () => {
    if (resetConfirmation !== 'RESET') {
      showError('Konfirmasi Diperlukan', 'Ketik "RESET" untuk konfirmasi');
      return;
    }

    try {
      setResetting(true);
      const result = await resetVoting();
      await loadStats();
      setShowResetModal(false);
      setResetConfirmation('');
      showSuccess('Reset Berhasil', `${result.message} (${result.votes_deleted} suara, ${result.voters_reset} voter)`);
    } catch (error: any) {
      showError('Reset Gagal', error.message);
    } finally {
      setResetting(false);
    }
  };

  
  const getParticipationRate = () => {
    if (!stats || stats.total_voters === 0) return 0;
    return Math.round((stats.voted_count / stats.total_voters) * 100);
  };

  const getLeadingCandidate = () => {
    if (!stats?.vote_results || stats.vote_results.length === 0) return null;
    return stats.vote_results.reduce((prev, current) =>
      prev.vote_count > current.vote_count ? prev : current
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">Dashboard Admin</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lastUpdate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Auto-refresh
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                onClick={handleResetVoting}
                disabled={resetting}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-md text-sm font-medium w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 ${resetting ? 'animate-spin' : ''}`} />
                <span className="font-medium">Reset Voting</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Voter Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>+12%</span>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-2">Total Voter</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{stats?.total_voters}</p>
          </div>

          {/* Voted Count Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>+8%</span>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-2">Sudah Memilih</h3>
            <p className="text-xl md:text-2xl font-bold text-green-600">{stats?.voted_count}</p>
          </div>

          {/* Not Voted Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-orange-600 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>-5%</span>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-2">Belum Memilih</h3>
            <p className="text-xl md:text-2xl font-bold text-orange-600">{stats?.not_voted_count}</p>
          </div>

          {/* Candidates Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Vote className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-purple-600 text-xs">
                <Eye className="h-3 w-3" />
                <span>Live</span>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-2">Kandidat</h3>
            <p className="text-xl md:text-2xl font-bold text-purple-600">{stats?.candidates_count}</p>
          </div>
        </div>

        {/* Participation Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Partisipasi Voting</h3>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Activity className="h-3 w-3" />
                <span>Real-time</span>
              </div>
            </div>
            <div className="h-64 sm:h-48 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Target', value: 100, fill: '#E5E7EB' },
                  { name: 'Partisipasi', value: getParticipationRate(), fill: '#10B981' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                  <YAxis stroke="#6B7280" domain={[0, 100]} fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#colorGradient)" strokeWidth={2} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Ringkasan</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Partisipasi</p>
                  <p className="text-xl font-bold text-blue-600">{getParticipationRate()}%</p>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>

              {getLeadingCandidate() && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Terdepan</p>
                    <p className="text-sm font-bold text-green-600 truncate" title={getLeadingCandidate()?.candidate_name}>{getLeadingCandidate()?.candidate_name}</p>
                    <p className="text-xs text-gray-600">{getLeadingCandidate()?.vote_count} suara</p>
                  </div>
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Total Suara</p>
                  <p className="text-xl font-bold text-purple-600">{stats?.voted_count}</p>
                </div>
                <Vote className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Charts */}
        {stats?.vote_results && stats.vote_results.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Perolehan Suara</h3>
                <BarChart3 className="h-4 w-4 text-gray-600" />
              </div>
              <div className="h-64 sm:h-48 md:h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.vote_results} margin={{ top: 10, right: 10, left: 10, bottom: window.innerWidth < 640 ? 100 : 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="candidate_name"
                      angle={window.innerWidth < 640 ? -90 : -45}
                      textAnchor="end"
                      height={window.innerWidth < 640 ? 100 : 80}
                      fontSize={window.innerWidth < 640 ? 8 : 9}
                      interval={0}
                      stroke="#6B7280"
                    />
                    <YAxis stroke="#6B7280" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Bar
                      dataKey="vote_count"
                      fill="url(#barGradient)"
                      radius={[2, 2, 0, 0]}
                      animationDuration={1000}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6"/>
                        <stop offset="100%" stopColor="#8B5CF6"/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Distribusi Suara</h3>
                <PieChart className="h-4 w-4 text-gray-600" />
              </div>
              <div className="h-64 sm:h-48 md:h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.vote_results}
                      cx="50%"
                      cy="50%"
                      innerRadius={window.innerWidth < 640 ? 25 : 30}
                      outerRadius={window.innerWidth < 640 ? 50 : 60}
                      paddingAngle={2}
                      dataKey="vote_count"
                      nameKey="candidate_name"
                      animationDuration={1000}
                      animationBegin={0}
                    >
                      {stats.vote_results.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                      formatter={(value: number, name: string) => [value, name]}
                    />
                    <Legend fontSize={window.innerWidth < 640 ? 8 : 9} verticalAlign="bottom" height={window.innerWidth < 640 ? 80 : 60} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Section */}
        <div className="text-center">
          <button
            onClick={loadStats}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md text-sm font-medium w-full sm:w-auto"
          >
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium">Refresh Data</span>
            </div>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowResetModal(false);
            }
          }}
        >
          {/* Modal Container */}
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all flex flex-col mx-2 md:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 text-white">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold">Konfirmasi Reset Voting</h2>
                  </div>
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="text-white/80 hover:text-white transition-colors p-2"
                    disabled={resetting}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-red-100 text-sm">
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {/* Warning Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 text-sm mb-2">
                      PERINGATAN KRITIS
                    </h3>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Semua suara yang telah masuk akan dihapus</li>
                      <li>• Statistik voting akan direset</li>
                      <li>• Riwayat pemilihan akan hilang</li>
                      <li>• Tindakan ini tidak dapat dibatalkan</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Current Stats */}
              {stats && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Data Saat Ini</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Voter:</span>
                      <span className="font-medium">{stats.total_voters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sudah Memilih:</span>
                      <span className="font-medium text-green-600">{stats.voted_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Belum Memilih:</span>
                      <span className="font-medium text-orange-600">{stats.not_voted_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Suara:</span>
                      <span className="font-medium text-purple-600">{stats.voted_count}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-red-100 rounded-full p-2">
                    <Shield className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-gray-700">Hanya admin yang dapat melakukan reset</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-orange-100 rounded-full p-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700">Pastikan Anda yakin sebelum melanjutkan</span>
                </div>
              </div>

              {/* Confirmation Input */}
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <label className="block text-sm font-medium text-gray-700">
                  Ketik <span className="font-bold text-red-600">RESET</span> untuk konfirmasi:
                </label>
                <input
                  type="text"
                  value={resetConfirmation}
                  onChange={(e) => setResetConfirmation(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Ketik RESET disini..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm uppercase"
                  disabled={resetting}
                />
              </div>

              {/* Final Warning */}
              <div className="text-center">
                <p className="text-base font-semibold text-red-900 mb-2">
                  Apakah Anda benar-benar yakin?
                </p>
                <p className="text-sm text-gray-600">
                  Semua data voting akan hilang permanen
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  disabled={resetting}
                  className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-2 sm:order-1"
                >
                  <X className="h-4 w-4" />
                  <span>Batal</span>
                </button>
                <button
                  onClick={confirmResetVoting}
                  disabled={resetting}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 w-full sm:w-auto order-1 sm:order-2"
                >
                  {resetting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Proses...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      <span>Reset Voting</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {resetting && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl text-center max-w-sm mx-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-pink-600 mx absolute top-0 left-0"></div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                Mereset Data Voting...
              </h3>
              <p className="text-sm text-gray-600">
                Mohon tunggu sebentar, sistem sedang mereset semua data voting
              </p>
            </div>
          </div>
        )}
      </>
      )}
    </div>
  );
};

export default AdminDashboard;
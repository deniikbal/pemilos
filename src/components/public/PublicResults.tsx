import React, { useState, useEffect } from 'react';
import { BarChart3, Trophy, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../../services/api';
import type { DashboardStats } from '../../types';

const PublicResults: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sortedResults = stats?.vote_results.sort((a, b) => b.vote_count - a.vote_count) || [];
  const totalVotes = sortedResults.reduce((sum, result) => sum + result.vote_count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hasil Sementara Pemilihan Ketua OSIS
            </h1>
            <p className="text-gray-600">SMAN 1 Bantarujeg</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Suara</p>
                <p className="text-3xl font-bold text-blue-600">{totalVotes}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Voter</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_voters}</p>
              </div>
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partisipasi</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.total_voters ? Math.round((totalVotes / stats.total_voters) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kandidat</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.candidates_count}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Results */}
        {sortedResults.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ranking Cards */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Perolehan Suara</h2>
              
              {sortedResults.map((result, index) => (
                <div 
                  key={result.candidate_id}
                  className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${
                    index === 0 
                      ? 'border-l-yellow-400'
                      : index === 1
                      ? 'border-l-gray-400'
                      : index === 2
                      ? 'border-l-orange-400'
                      : 'border-l-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 
                          ? 'bg-yellow-500'
                          : index === 1
                          ? 'bg-gray-500'
                          : index === 2
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {result.candidate_name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-2xl font-bold text-blue-600">
                            {result.vote_count} suara
                          </span>
                          <span className="text-sm text-gray-500">
                            ({totalVotes > 0 ? Math.round((result.vote_count / totalVotes) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          index === 0 
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-500'
                            : index === 2
                            ? 'bg-orange-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ 
                          width: `${totalVotes > 0 ? (result.vote_count / totalVotes) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Grafik Perolehan Suara</h2>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedResults} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="candidate_name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`${value} suara`, 'Perolehan']}
                      labelFormatter={(label) => `Kandidat: ${label}`}
                    />
                    <Bar 
                      dataKey="vote_count" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada hasil</h3>
            <p className="mt-1 text-sm text-gray-500">Hasil akan muncul setelah ada yang voting</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">
              Data diperbarui secara real-time • Hasil ini bersifat sementara
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {new Date().toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicResults;
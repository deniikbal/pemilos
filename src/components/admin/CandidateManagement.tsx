import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, User, Eye, Star, Award, Users,
  TrendingUp, Image as ImageIcon, FileText, Crown,
  Sparkles, Zap
} from 'lucide-react';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '../../services/api';
import type { Candidate } from '../../types';

const CandidateManagement: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    foto_url: '',
    visi: '',
    misi: ''
  });

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Failed to load candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCandidate) {
        await updateCandidate(editingCandidate.id, formData);
      } else {
        await createCandidate(formData);
      }
      
      await loadCandidates();
      handleCloseModal();
      alert(editingCandidate ? 'Kandidat berhasil diperbarui!' : 'Kandidat berhasil ditambahkan!');
    } catch (error: any) {
      alert('Gagal menyimpan kandidat: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kandidat ini?')) {
      return;
    }

    try {
      await deleteCandidate(id);
      await loadCandidates();
      alert('Kandidat berhasil dihapus!');
    } catch (error: any) {
      alert('Gagal menghapus kandidat: ' + error.message);
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      nama: candidate.nama,
      foto_url: candidate.foto_url || '',
      visi: candidate.visi,
      misi: candidate.misi
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCandidate(null);
    setFormData({
      nama: '',
      foto_url: '',
      visi: '',
      misi: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data kandidat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kelola Kandidat</h1>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {candidates.length} kandidat
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Aktif
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="font-medium text-sm">Tambah</span>
            </div>
          </button>
        </div>
      </div>

      {/* Candidates Grid */}
      {candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate, index) => (
            <div key={candidate.id} className="group">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                {/* Candidate Header with Modern Design */}
                <div className="relative">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90"></div>
                  <div className="absolute inset-0 bg-black opacity-10"></div>

                  {/* Content Overlay */}
                  <div className="relative h-32 flex flex-col items-center justify-center p-4 text-white">
                    {/* Avatar Section */}
                    <div className="relative mb-3">
                      {/* Outer Ring Decoration */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full animate-pulse opacity-30 blur-sm"></div>

                      {/* Main Avatar Container */}
                      <div className="relative">
                        {candidate.foto_url ? (
                          <div className="relative group">
                            {/* Image Frame */}
                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-2xl overflow-hidden transform transition-all duration-300 group-hover:scale-105">
                              <img
                                src={candidate.foto_url}
                                alt={candidate.nama}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                            {/* Crown Decoration */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                              <Crown className="h-4 w-4 text-white fill-current" />
                            </div>
                          </div>
                        ) : (
                          <div className="relative group">
                            {/* Default Avatar Frame */}
                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                              <div className="relative">
                                <User className="h-10 w-10 text-white drop-shadow-lg" />
                                {/* Inner Glow */}
                                <div className="absolute inset-0 rounded-full bg-white/20 blur-sm"></div>
                              </div>
                            </div>

                            {/* Animated Rings */}
                            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                            <div className="absolute inset-2 rounded-full border border-white/20"></div>

                            {/* Crown Decoration */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                              <Crown className="h-4 w-4 text-white fill-current" />
                            </div>
                          </div>
                        )}

                        {/* Number Badge */}
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* Candidate Name */}
                    <h3 className="text-lg font-bold text-center mb-1 drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300">{candidate.nama}</h3>
                    <div className="flex items-center gap-1 text-blue-100 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-300" />
                        <Award className="h-3 w-3 text-yellow-300" />
                      </div>
                      <span className="font-medium">Kandidat #{index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="p-6 space-y-4">
                  {/* Vision Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Eye className="h-3 w-3 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800">Visi</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 pl-8">
                      {candidate.visi}
                    </p>
                  </div>

                  {/* Mission Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-3 w-3 text-purple-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800">Misi</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 pl-8">
                      {candidate.misi}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium group-hover:shadow-md"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium group-hover:shadow-md"
                      >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                      </button>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">Aktif</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada kandidat</h3>
          <p className="text-gray-600 mb-4 text-sm">Mulai dengan menambahkan kandidat pertama</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="font-medium text-sm">Tambah Kandidat</span>
            </div>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingCandidate ? 'Edit Kandidat' : 'Tambah Kandidat'}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {editingCandidate ? 'Perbarui data kandidat' : 'Tambah kandidat baru'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 text-blue-600" />
                    Nama Kandidat
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama kandidat"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    URL Foto
                  </label>
                  <input
                    type="url"
                    value={formData.foto_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, foto_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Opsional</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Eye className="h-4 w-4 text-blue-600" />
                    Visi
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.visi}
                    onChange={(e) => setFormData(prev => ({ ...prev, visi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Visi kandidat..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Zap className="h-4 w-4 text-purple-600" />
                    Misi
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.misi}
                    onChange={(e) => setFormData(prev => ({ ...prev, misi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Misi kandidat..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm font-medium"
                  >
                    {editingCandidate ? 'Perbarui' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;
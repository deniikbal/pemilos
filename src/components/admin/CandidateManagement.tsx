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
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {candidates.map((candidate, index) => (
            <div key={candidate.id} className="group">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                {/* Candidate Header */}
                <div className="relative h-20 md:h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-t-lg overflow-hidden">
                  {candidate.foto_url ? (
                    <img
                      src={candidate.foto_url}
                      alt={candidate.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-purple-400" />
                    </div>
                  )}

                  {/* Number Badge */}
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="p-2 md:p-3">
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{candidate.nama}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">#{index + 1}</span>
                    </div>
                  </div>

                  {/* Compact Visi & Misi */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Eye className="h-3 w-3 text-purple-600" />
                        <span className="text-xs font-medium text-gray-700">Visi</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                        {candidate.visi}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Zap className="h-3 w-3 text-pink-600" />
                        <span className="text-xs font-medium text-gray-700">Misi</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                        {candidate.misi}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada kandidat</h3>
          <p className="text-gray-600 mb-4 text-sm">Mulai dengan menambahkan kandidat pertama</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md"
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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
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
                    <User className="h-4 w-4 text-purple-600" />
                    Nama Kandidat
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Masukkan nama kandidat"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <ImageIcon className="h-4 w-4 text-purple-600" />
                    URL Foto
                  </label>
                  <input
                    type="url"
                    value={formData.foto_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, foto_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Opsional</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Eye className="h-4 w-4 text-purple-600" />
                    Visi
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.visi}
                    onChange={(e) => setFormData(prev => ({ ...prev, visi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors text-sm font-medium"
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
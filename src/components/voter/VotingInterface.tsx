import React, { useState, useEffect } from 'react';
import {
  User,
  CheckCircle,
  Award,
  Clock,
  Users,
  Calendar,
  Shield,
  Vote,
  Star,
  ChevronRight,
  Leaf,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getCandidates, submitVote, type VoteResult } from '../../services/api';
import type { Candidate, Voter } from '../../types';
import ConfirmVoteModal from './ConfirmVoteModal';

// Add custom styles for line clamping
const styles = `
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .gradient-text {
    background: linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-hover:hover {
    transform: translateY(-4px);
  }
`;

const VotingInterface: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [hoveredCandidate, setHoveredCandidate] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const voter = user as Voter;

  useEffect(() => {
    loadCandidates();

    // Check if voter already voted
    if (voter?.has_voted) {
      setVoted(true);
      console.log('🗳️ Voter already voted:', voter.nama);
    }
  }, [voter]);

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

  const handleVote = async () => {
    if (!selectedCandidate || !voter) return;

    // Show confirmation modal instead of browser confirm
    setShowConfirmModal(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate || !voter) {
      setShowConfirmModal(false);
      return;
    }

    try {
      setVoting(true);
      const result: VoteResult = await submitVote(voter.id, selectedCandidate);

      // Handle response dari API
      if (result.is_success) {
        // Voting berhasil
        setVoted(true);
        setShowConfirmModal(false);
        showSuccess('Voting Berhasil!', 'Suara Anda telah berhasil tercatat dalam sistem.');
      } else {
        // Voting gagal - cek apakah karena sudah voting
        if (result.result_message?.includes('sudah melakukan voting') ||
            result.result_message?.includes('already voted') ||
            result.new_voted_status) {
          // Jika voter sudah voting, tampilkan halaman sukses
          setVoted(true);
          setShowConfirmModal(false);
        } else {
          // Error lainnya
          throw new Error(result.result_message || 'Gagal melakukan voting');
        }
      }
    } catch (error: any) {
      console.error('Vote error:', error);
      const errorMessage = error.message || 'Terjadi kesalahan saat melakukan voting';

      // Cek lagi untuk kasus voter sudah voting (fallback)
      if (errorMessage.includes('sudah melakukan voting') ||
          errorMessage.includes('already voted')) {
        setVoted(true);
        setShowConfirmModal(false);
      } else {
        showError('Gagal Submit Vote', errorMessage);
        setVoting(false);
        setShowConfirmModal(false);
      }
    }
  };

  const handleCancelVote = () => {
    setShowConfirmModal(false);
  };

  const getSelectedCandidate = () => {
    return candidates.find(c => c.id === selectedCandidate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-blue-400 mx absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Memuat Kandidat</h3>
          <p className="text-gray-600">Menyiapkan pilihan terbaik untuk Anda</p>
        </div>
      </div>
    );
  }

  // Show voting status if voter has already voted
  if (voter?.has_voted && !voted) {
    setVoted(true);
    return null; // Will trigger re-render with voted=true
  }

  if (voted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-100 to-indigo-100">
        <div className="text-center max-w-2xl mx-auto p-6 sm:p-8">
          <div className="relative mb-8">
            <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -left-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Leaf className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">Voting Berhasil!</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
            Terima kasih, <span className="font-semibold text-blue-600">{voter?.nama}</span>!
            Suara Anda telah berhasil tercatat dalam sistem pemilihan Ketua OSIS SMAN 1 Bantarujeg.
          </p>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-200">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8">
              <div className="text-center transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Periode Voting</p>
                <p className="font-bold text-gray-900 text-lg">2024</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Peserta</p>
                <p className="font-bold text-gray-900 text-lg">{candidates.length} Kandidat</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mb-3 shadow-md">
                  <Vote className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Status</p>
                <p className="font-bold text-blue-600 text-lg">Selesai</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-5 border border-blue-200 mb-4">
              <p className="text-sm text-blue-800">
                <Shield className="h-5 w-5 inline mr-2" />
                <strong className="font-semibold">Informasi:</strong> Anda telah menggunakan hak voting Anda. Setiap voter hanya dapat melakukan voting satu kali.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
              <p className="text-sm text-blue-800">
                <TrendingUp className="h-5 w-5 inline mr-2" />
                <strong className="font-semibold">Catatan:</strong> Hasil pemilihan akan diumumkan setelah periode voting berakhir.
                Partisipasi Anda sangat berarti untuk kemajuan OSIS kita!
              </p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="font-medium">Waktu voting: {new Date().toLocaleString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 font-sans ${selectedCandidate ? 'pb-24 sm:pb-32' : 'pb-4'}`}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 px-4 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full mb-4 shadow-md">
              <Vote className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="gradient-text">Pemilihan Ketua OSIS</span>
            </h1>
            <p className="text-gray-600 font-medium">SMAN 1 Bantarujeg</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-700">{voter?.nama}</span>
              <span className="text-blue-400">•</span>
              <span className="text-blue-600 font-medium">{voter?.kelas}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-700">{candidates.length} Kandidat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Info */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 rounded-2xl p-6 mb-8 shadow-lg text-white">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-100" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 tracking-tight">Panduan Voting</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Pilih satu kandidat dengan bijak. Setiap pemilih hanya memiliki satu kesempatan voting.
                Suara Anda menentukan masa depan OSIS kita!
              </p>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                <span className="gradient-text">Kandidat</span>
              </h2>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-blue-700">
                {selectedCandidate ? '1 kandidat dipilih' : 'Belum ada pilihan'}
              </span>
            </div>
          </div>

        {candidates.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada kandidat</h3>
            <p className="text-gray-600">Silakan tunggu admin menambahkan kandidat</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`group card-hover bg-white/90 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  selectedCandidate === candidate.id
                    ? 'border-blue-500 ring-4 ring-blue-100 shadow-2xl'
                    : 'border-blue-200 hover:border-blue-300 hover:shadow-xl'
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
                onMouseEnter={() => setHoveredCandidate(candidate.id)}
                onMouseLeave={() => setHoveredCandidate(null)}
              >
                {/* Candidate Image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-100 rounded-t-2xl overflow-hidden relative">
                  {candidate.foto_url ? (
                    <img
                      src={candidate.foto_url}
                      alt={candidate.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-20 w-20 text-blue-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        #{candidates.indexOf(candidate) + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-gradient-to-b from-white to-blue-50/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {candidate.nama}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-blue-600 font-medium">Kandidat #{candidates.indexOf(candidate) + 1}</p>
                      </div>
                    </div>
                    {selectedCandidate === candidate.id && (
                      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full p-2 shadow-lg">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Visi
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {candidate.visi}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Misi
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {candidate.misi}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidate(candidate.id);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 transform hover:scale-105 ${
                      selectedCandidate === candidate.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300'
                    }`}
                  >
                    {selectedCandidate === candidate.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Dipilih
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Vote className="h-4 w-4" />
                        Pilih
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      </div>

      {/* Bottom Action Bar */}
      {selectedCandidate && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 backdrop-blur-sm border-t border-blue-400 px-4 py-6 z-50 shadow-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Vote className="h-6 w-6 text-blue-100" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">Pilihan Anda</p>
                  <p className="text-xs text-blue-100 font-medium">
                    {getSelectedCandidate()?.nama} - #{candidates.findIndex(c => c.id === selectedCandidate) + 1}
                  </p>
                </div>
              </div>

              <button
                onClick={handleVote}
                disabled={voting}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                {voting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Konfirmasi Vote</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmVoteModal
        isOpen={showConfirmModal}
        onClose={handleCancelVote}
        onConfirm={handleConfirmVote}
        candidate={getSelectedCandidate() || null}
        candidateNumber={selectedCandidate ? candidates.findIndex(c => c.id === selectedCandidate) + 1 : 0}
        isLoading={voting}
      />
    </div>
  );
};

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default VotingInterface;
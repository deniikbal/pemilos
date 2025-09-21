import React, { useState, useEffect } from 'react';
import { User, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCandidates, submitVote } from '../../services/api';
import { supabase } from '../../lib/supabase';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';
import type { Candidate, Voter } from '../../types';

const VotingInterface: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  
  const { user, login } = useAuth();
  const voter = user as Voter;

  useEffect(() => {
    // Check if voter already voted by fetching fresh data from database
    const checkVotingStatus = async () => {
      if (voter?.id) {
        try {
          const { data: freshVoterData, error } = await supabase
            .from('voters')
            .select('has_voted')
            .eq('id', voter.id)
            .single();
          
          if (error) {
            console.error('Failed to check voting status:', error);
            return;
          }
          
          if (freshVoterData?.has_voted) {
            setVoted(true);
            // Update auth context with fresh data
            if (voter && 'has_voted' in voter) {
              login({...voter, has_voted: true}, localStorage.getItem('token') || '', 'voter');
            }
          } else {
            // Only load candidates if voter hasn't voted yet
            loadCandidates();
          }
        } catch (error) {
          console.error('Error checking voting status:', error);
          // Load candidates as fallback
          loadCandidates();
        }
      }
    };
    
    checkVotingStatus();
  }, [voter, login]);

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

  const handleConfirmVote = async () => {
    if (!selectedCandidate || !voter) return;

    try {
      setVoting(true);
      await submitVote(voter.id, selectedCandidate);
      
      // Refresh voter data to get updated has_voted status
      const { data: updatedVoter } = await supabase
        .from('voters')
        .select('*')
        .eq('id', voter.id)
        .single();
      
      if (updatedVoter) {
        // Update the auth context with fresh voter data
        login(updatedVoter, localStorage.getItem('token') || '', 'voter');
      }
      
      setVoted(true);
    } catch (error: any) {
      // Show toast notification instead of alert
      setToast({
        message: 'Gagal submit vote: ' + error.message,
        type: 'error'
      });
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (voted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm sm:max-w-md mx-auto">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Terima Kasih Sudah Memilih!
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
            Suara Anda telah berhasil tercatat dalam sistem. Terima kasih atas partisipasi Anda dalam pemilihan Ketua OSIS SMAN 1 Bantarujeg.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Catatan:</strong> Hasil pemilihan akan diumumkan setelah periode voting berakhir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Pemilihan Ketua OSIS
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
          Selamat datang, <strong>{voter?.nama}</strong> dari kelas <strong>{voter?.kelas}</strong>
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-yellow-800">
            <strong>Penting:</strong> Anda hanya dapat memilih sekali. Pilihan tidak dapat diubah setelah dikonfirmasi.
          </p>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {candidates.map((candidate) => (
          <div 
            key={candidate.id}
            className={`bg-white rounded-lg sm:rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
              selectedCandidate === candidate.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              setSelectedCandidate(candidate.id);
              // Show confirmation modal immediately when selecting a candidate
              setShowConfirmModal(true);
            }}
          >
            <div className="aspect-w-16 aspect-h-12">
              {candidate.foto_url ? (
                <img
                  src={candidate.foto_url}
                  alt={candidate.nama}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-lg sm:rounded-t-xl"
                />
              ) : (
                <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center rounded-t-lg sm:rounded-t-xl">
                  <User className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {candidate.nama}
                </h3>
                {selectedCandidate === candidate.id && (
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                )}
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Visi
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {candidate.visi}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Misi
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {candidate.misi}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidate(candidate.id);
                    // Show confirmation modal immediately when selecting a candidate
                    setShowConfirmModal(true);
                  }}
                  className={`w-full py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    selectedCandidate === candidate.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedCandidate === candidate.id ? 'Dipilih' : 'Pilih Kandidat Ini'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada kandidat</h3>
          <p className="mt-1 text-sm text-gray-500">Silakan tunggu admin menambahkan kandidat</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmVote}
        title="Konfirmasi Pilihan"
        message="Apakah Anda yakin dengan pilihan ini? Pilihan tidak dapat diubah setelah dikonfirmasi."
        confirmText="Ya, Saya Yakin"
        cancelText="Batal"
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default VotingInterface;
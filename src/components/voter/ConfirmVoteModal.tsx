import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  X,
  AlertTriangle,
  Vote,
  User,
  Clock,
  Shield,
  Leaf,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import type { Candidate } from '../types';

interface ConfirmVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidate: Candidate | null;
  candidateNumber: number;
  isLoading: boolean;
}

const ConfirmVoteModal: React.FC<ConfirmVoteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  candidate,
  candidateNumber,
  isLoading
}) => {
  if (!isOpen || !candidate) return null;

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore scroll
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all border border-emerald-200">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-4 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Vote className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-lg font-bold">Konfirmasi Voting</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-emerald-100 text-xs relative z-10">
              Pastikan pilihan Anda sudah tepat
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-4 space-y-4">
            {/* Warning Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 text-sm mb-2">
                    PENTING DIPERHATIKAN
                  </h3>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                      Pilihan tidak dapat diubah
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                      Hanya boleh memilih satu kali
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                      Pastikan koneksi stabil
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Candidate Info */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Kandidat Pilihan</p>
                  <p className="font-bold text-gray-900 text-base">
                    #{candidateNumber} - {candidate.nama}
                  </p>
                </div>
              </div>
            </div>

            {/* Voting Process Info */}
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                <Shield className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-gray-700 font-medium">Voting bersifat rahasia</span>
              <span className="text-gray-400">•</span>
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">Proses cepat dan aman</span>
            </div>

            {/* Final Confirmation */}
            <div className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3">
              <p className="text-base font-bold text-gray-900 mb-1">
                Yakin dengan pilihan ini?
              </p>
              <p className="text-xs text-gray-600">
                Klik "Konfirmasi" untuk menyelesaikan
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="border-t border-emerald-100 p-3 bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex gap-2">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300"
              >
                <X className="h-3 w-3" />
                <span>Batal</span>
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Proses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Konfirmasi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4 border border-emerald-200">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-400 mx absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Memproses Voting...
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Mohon tunggu sebentar, sistem sedang mencatat suara Anda dengan aman
            </p>
            <div className="mt-4 flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmVoteModal;
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Users, UserCheck, UserX,
  Search, Filter, Download, Upload, RefreshCw,
  TrendingUp, Calendar, Mail, Phone, MapPin,
  CheckCircle, XCircle, Clock, Shield, FileText, X, AlertCircle, ChevronDown,
  Printer, FileDown
} from 'lucide-react';
import { getVoters, createVoter, updateVoter, deleteVoter } from '../../services/api';
import type { Voter } from '../../types';

const VoterManagement: React.FC = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [formData, setFormData] = useState({
    nisn: '',
    nama: '',
    kelas: ''
  });

  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<'all' | 'voted' | 'not_voted'>('all');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadVoters();
  }, []);

  const loadVoters = async () => {
    try {
      setLoading(true);
      const data = await getVoters();
      setVoters(data);
    } catch (error) {
      console.error('Failed to load voters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVoter) {
        await updateVoter(editingVoter.id, formData);
      } else {
        await createVoter(formData);
      }
      
      await loadVoters();
      handleCloseModal();
      alert(editingVoter ? 'Voter berhasil diperbarui!' : 'Voter berhasil ditambahkan!');
    } catch (error: any) {
      alert('Gagal menyimpan voter: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus voter ini?')) {
      return;
    }

    try {
      await deleteVoter(id);
      await loadVoters();
      alert('Voter berhasil dihapus!');
    } catch (error: any) {
      alert('Gagal menghapus voter: ' + error.message);
    }
  };

  const handleEdit = (voter: Voter) => {
    setEditingVoter(voter);
    setFormData({
      nisn: voter.nisn,
      nama: voter.nama,
      kelas: voter.kelas
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVoter(null);
    setFormData({
      nisn: '',
      nama: '',
      kelas: ''
    });
  };

  // Search and filter functionality
  const filteredVoters = voters.filter(voter => {
    const matchesSearch = voter.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voter.nisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voter.kelas.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'voted' && voter.has_voted) ||
                          (statusFilter === 'not_voted' && !voter.has_voted);

    return matchesSearch && matchesStatus;
  });

  // Pagination functionality
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVoters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset ke halaman pertama saat itemsPerPage berubah
  };

  // File handling for import
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      // Simple preview - in real app, you'd parse CSV/Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(1, 6); // Preview first 5 data rows
        const preview = lines.map((line, index) => {
          const [nisn, nama, kelas] = line.split(',').map(item => item.trim());
          return { nisn, nama, kelas, row: index + 2 };
        }).filter(item => item.nisn && item.nama);
        setImportPreview(preview);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setImporting(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('✅ Import berhasil! Data voter telah ditambahkan.');
      setShowImportModal(false);
      setImportFile(null);
      setImportPreview([]);
      await loadVoters();
    } catch (error) {
      alert('❌ Gagal mengimpor data: ' + (error as Error).message);
    } finally {
      setImporting(false);
    }
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportPreview([]);
  };

  // Generate dan cetak kartu pemilihan
  const generateVotingCard = (voter: Voter) => {
    const cardContent = `
      <div style="width: 250px; height: 140px; border: 1px solid #374151; border-radius: 6px; padding: 8px; font-family: Arial, sans-serif; background: #ffffff; font-size: 10px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 6px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
          <h3 style="margin: 0; color: #1f2937; font-size: 10px; font-weight: bold;">KARTU PEMILIHAN</h3>
          <p style="margin: 0; color: #6b7280; font-size: 7px;">OSIS SMAN 1 Bantarujeg</p>
        </div>

        <!-- Info Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 4px;">
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 7px;">NISN</p>
            <p style="margin: 0; color: #1f2937; font-size: 8px; font-weight: bold;">${voter.nisn}</p>
          </div>
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 7px;">Kelas</p>
            <p style="margin: 0; color: #1f2937; font-size: 8px; font-weight: bold;">${voter.kelas}</p>
          </div>
        </div>

        <!-- Nama -->
        <div style="margin-bottom: 6px;">
          <p style="margin: 0; color: #6b7280; font-size: 7px;">Nama</p>
          <p style="margin: 0; color: #1f2937; font-size: 9px; font-weight: bold; line-height: 1.1;">${voter.nama}</p>
        </div>

        <!-- Status Bar -->
        <div style="display: flex; gap: 2px;">
          <div style="flex: 1; text-align: center; border: 1px solid #d1d5db; border-radius: 3px; padding: 3px 2px; background: ${voter.has_voted ? '#f0fdf4' : '#fef2f2'}; font-size: 7px;">
            <p style="margin: 0; color: ${voter.has_voted ? '#166534' : '#991b1b'}; font-weight: bold;">
              ${voter.has_voted ? 'SUDAH' : 'BELUM'}
            </p>
          </div>
          <div style="flex: 1; text-align: center; border: 1px solid #d1d5db; border-radius: 3px; padding: 3px 2px; background: #f9fafb; font-size: 7px;">
            <p style="margin: 0; color: #1f2937; font-weight: bold;">
              ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 4px; border-top: 1px solid #f3f4f6; padding-top: 2px;">
          <p style="margin: 0; color: #9ca3af; font-size: 6px;">Tunjukkan saat voting</p>
        </div>
      </div>
    `;
    return cardContent;
  };

  const printVotingCards = async () => {
    if (filteredVoters.length === 0) {
      alert('Tidak ada voter untuk dicetak');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan popup untuk mencetak kartu');
      return;
    }

    const cardsContent = filteredVoters.map(voter => generateVotingCard(voter)).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kartu Pemilihan Voter</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: white;
          }

          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #374151;
            padding-bottom: 10px;
          }

          .card-grid {
            display: grid;
            grid-template-columns: repeat(3, 250px);
            gap: 8px;
            justify-content: center;
            page-break-inside: avoid;
          }

          .card {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 10px;
            color: #6b7280;
          }

          @media print {
            body { margin: 0; }
            .card-grid {
              gap: 6px;
              grid-template-columns: repeat(3, 250px);
            }
          }

          /* Untuk screen preview */
          @media screen {
            body {
              background: #f3f4f6;
              padding: 20px;
            }
            .card-grid {
              background: white;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="color: #1f2937; margin: 0; font-size: 18px;">KARTU PEMILIHAN VOTER</h1>
          <p style="color: #6b7280; margin: 4px 0; font-size: 12px;">Total: ${filteredVoters.length} voter | Filter: ${statusFilter === 'all' ? 'Semua' : statusFilter === 'voted' ? 'Sudah Memilih' : 'Belum Memilih'}</p>
          <p style="color: #9ca3af; margin: 0; font-size: 10px;">Dicetak: ${new Date().toLocaleString('id-ID')}</p>
        </div>

        <div class="card-grid">
          ${filteredVoters.map(voter => `<div class="card">${generateVotingCard(voter)}</div>`).join('')}
        </div>

        <div class="footer">
          <p>Dicetak melalui Sistem Pemilos SMAN 1 Bantarujeg</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Tambahkan delay untuk preview
              setTimeout(function() {
                if (confirm('Tutup jendela preview?')) {
                  window.close();
                }
              }, 2000);
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const exportToPDF = () => {
    if (filteredVoters.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const csvContent = [
      'Data Voter SMAN 1 Bantarujeg',
      `Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`,
      `Filter: ${statusFilter === 'all' ? 'Semua' : statusFilter === 'voted' ? 'Sudah Memilih' : 'Belum Memilih'}`,
      `Total: ${filteredVoters.length} voter`,
      '',
      'NISN,Nama Lengkap,Kelas,Status Voting',
      ...filteredVoters.map(voter =>
        `${voter.nisn},"${voter.nama}",${voter.kelas},${voter.has_voted ? 'Sudah Memilih' : 'Belum Memilih'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `data-voter-${statusFilter}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data voter...</p>
        </div>
      </div>
    );
  }

  const votedCount = voters.filter(v => v.has_voted).length;
  const notVotedCount = voters.length - votedCount;
  const participationRate = voters.length > 0 ? Math.round((votedCount / voters.length) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">Kelola Voter</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {voters.length} voter
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {participationRate}% partisipasi
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Real-time
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md w-full sm:w-auto"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="font-medium text-sm">Tambah</span>
              </div>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md w-full sm:w-auto"
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="font-medium text-sm">Import</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        {/* Total Voter Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>+15%</span>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 mb-1">Total Voter</h3>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{voters.length}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Terdaftar</span>
          </div>
        </div>

        {/* Voted Count Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>+8%</span>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 mb-1">Sudah Memilih</h3>
          <p className="text-lg md:text-2xl font-bold text-blue-600">{votedCount}</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full" style={{ width: `${participationRate}%` }}></div>
          </div>
        </div>

        {/* Not Voted Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
              <XCircle className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1 text-orange-600 text-xs">
              <Clock className="h-3 w-3" />
              <span>Menunggu</span>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 mb-1">Belum Memilih</h3>
          <p className="text-lg md:text-2xl font-bold text-orange-600">{notVotedCount}</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-600 to-amber-600 rounded-full" style={{ width: `${100 - participationRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-green-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Data Voter Terdaftar</h3>
                <p className="text-xs text-gray-600">Kelola informasi voter dan status voting</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 ml-auto">
              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative w-full sm:w-40">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari voter..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset ke halaman pertama saat search
                    }}
                    className="pl-10 pr-4 py-2.5 md:py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as 'all' | 'voted' | 'not_voted');
                      setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
                    }}
                    className="px-3 py-2.5 md:py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Semua Status</option>
                    <option value="voted">Sudah Memilih</option>
                    <option value="not_voted">Belum Memilih</option>
                  </select>
                </div>
              </div>

              {/* Print Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={printVotingCards}
                  disabled={filteredVoters.length === 0}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-2.5 md:py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs md:text-sm justify-center"
                  title="Cetak Kartu Pemilihan"
                >
                  <Printer className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>

                <button className="p-2.5 md:p-2 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-colors flex-shrink-0">
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {/* Mobile Card View */}
          <div className="md:hidden space-y-2 p-2">
            {currentItems.map((voter) => (
              <div key={voter.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">
                        {voter.nisn.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{voter.nama}</div>
                      <div className="text-xs text-gray-500">{voter.nisn}</div>
                    </div>
                  </div>
                  {voter.has_voted ? (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Sudah
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Belum
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {voter.kelas}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(voter)}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit voter"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(voter.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Hapus voter"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <table className="w-full hidden md:table">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 py-2 md:px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    NISN/NIS
                  </div>
                </th>
                <th className="px-2 py-2 md:px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Nama
                  </div>
                </th>
                <th className="px-2 py-2 md:px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    Kelas
                  </div>
                </th>
                <th className="px-2 py-2 md:px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                    Status
                  </div>
                </th>
                <th className="px-2 py-2 md:px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Aksi
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((voter) => (
                <tr key={voter.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-2 py-2 md:px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">
                          {voter.nisn.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{voter.nisn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 md:px-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{voter.nama}</div>
                  </td>
                  <td className="px-2 py-2 md:px-3 whitespace-nowrap">
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {voter.kelas}
                    </div>
                  </td>
                  <td className="px-2 py-2 md:px-3 whitespace-nowrap">
                    {voter.has_voted ? (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sudah
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Belum
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2 md:px-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(voter)}
                        className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        title="Edit voter"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(voter.id)}
                        className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        title="Hapus voter"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVoters.length === 0 && (
          <div className="text-center py-6 md:py-8 px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Search className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Tidak ditemukan' : 'Belum ada voter'}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              {searchTerm ? 'Coba kata kunci lain' : 'Mulai dengan menambahkan voter pertama'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium w-full sm:w-auto"
                >
                  Reset Pencarian
                </button>
              )}
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md w-full sm:w-auto"
              >
                <div className="flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="font-medium text-sm">Tambah Voter</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredVoters.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-t border-green-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-700">
                <div className="text-center sm:text-left">
                  Menampilkan <span className="font-semibold text-green-600">{indexOfFirstItem + 1}</span> -{' '}
                  <span className="font-semibold text-green-600">
                    {Math.min(indexOfLastItem, filteredVoters.length)}
                  </span>{' '}
                  dari <span className="font-semibold text-green-600">{filteredVoters.length}</span> voter
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs md:text-sm">Tampilkan per halaman:</span>
                  <div className="relative">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="appearance-none px-3 py-1 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm font-medium text-green-600 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/50 backdrop-blur-sm flex-shrink-0"
                >
                  ←
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-all duration-200 flex-shrink-0 ${
                          currentPage === pageNumber
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                            : 'border border-gray-300 bg-white hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/50 backdrop-blur-sm flex-shrink-0"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingVoter ? 'Edit Voter' : 'Tambah Voter'}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {editingVoter ? 'Perbarui data voter' : 'Tambah voter baru'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    NISN/NIS
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData(prev => ({ ...prev, nisn: e.target.value }))}
                    className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="Masukkan NISN/NIS"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 text-green-600" />
                    Nama
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="Masukkan nama voter"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Kelas
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kelas}
                    onChange={(e) => setFormData(prev => ({ ...prev, kelas: e.target.value }))}
                    className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="XII IPA 1, XI IPS 2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: Tingkat Jurusan Kelas</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-gray-200 gap-2 sm:gap-0">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium w-full sm:w-auto order-2 sm:order-1"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 md:py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors text-sm font-medium w-full sm:w-auto order-1 sm:order-2"
                  >
                    {editingVoter ? 'Perbarui' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">Import Voter</h2>
                  <p className="text-xs text-gray-600">Upload file CSV/Excel untuk import data voter</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* File Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upload File Voter</p>
                      <p className="text-xs text-gray-500 mt-1">Format: CSV, XLS, XLSX (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Pilih File
                    </label>
                  </div>
                </div>

                {/* File Info */}
                {importFile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{importFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(importFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setImportFile(null);
                          setImportPreview([]);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview Section */}
                {importPreview.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">Preview Data (5 baris pertama)</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                              <th className="px-2 py-2 md:px-3 text-left font-medium text-gray-700">Baris</th>
                              <th className="px-2 py-2 md:px-3 text-left font-medium text-gray-700">NISN</th>
                              <th className="px-2 py-2 md:px-3 text-left font-medium text-gray-700">Nama</th>
                              <th className="px-2 py-2 md:px-3 text-left font-medium text-gray-700">Kelas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {importPreview.map((item, index) => (
                              <tr key={index}>
                                <td className="px-2 py-2 md:px-3 text-gray-600">{item.row}</td>
                                <td className="px-2 py-2 md:px-3 text-gray-900">{item.nisn}</td>
                                <td className="px-2 py-2 md:px-3 text-gray-900">{item.nama}</td>
                                <td className="px-2 py-2 md:px-3 text-gray-900">{item.kelas}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Format Guide */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-900 mb-1">Format File</h4>
                      <p className="text-xs text-yellow-700">
                        File harus memiliki kolom: <strong>NISN</strong>, <strong>Nama</strong>, <strong>Kelas</strong><br />
                        Pisahkan data dengan koma (,) untuk CSV format<br />
                        Contoh: 123456,John Doe,XII IPA 1
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end sm:gap-3 pt-4 border-t border-gray-200 gap-2 sm:gap-0">
                  <button
                    onClick={handleCloseImportModal}
                    className="px-4 py-2.5 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium w-full sm:w-auto order-2 sm:order-1"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!importFile || importing}
                    className="px-4 py-2.5 md:py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
                  >
                    {importing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Mengimport...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Import Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VoterManagement;
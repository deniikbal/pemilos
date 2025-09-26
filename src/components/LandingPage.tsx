import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCandidates } from '../services/api';
import type { Candidate } from '../types';

// Add CSS for line clamping
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Failed to load candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "⚡",
      title: "Cepat & Efisien",
      description: "Proses voting hanya membutuhkan waktu kurang dari 5 menit",
      benefits: ["Tidak perlu antri", "Hasil instan", "Mudah digunakan"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: "🔒",
      title: "Keamanan Terjamin",
      description: "Data terenkripsi dan sistem terlindungi dengan teknologi terkini",
      benefits: ["Enkripsi data", "Autentikasi aman", "Privasi terjaga"],
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: "📱",
      title: "Akses Mudah",
      description: "Dapat diakses dari mana saja melalui berbagai perangkat",
      benefits: ["Multi-platform", "Responsive design", "User friendly"],
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: "📊",
      title: "Transparan & Akurat",
      description: "Hasil dapat dipantau secara real-time dengan perhitungan otomatis",
      benefits: ["Real-time count", "Anti kecurangan", "Terpercaya"],
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    }
  ];

  
  const votingSteps = [
    {
      step: 1,
      title: "Login Akun",
      description: "Masuk menggunakan NIS dan password yang telah diberikan",
      icon: "🔐",
      color: "from-blue-500 to-blue-600"
    },
    {
      step: 2,
      title: "Pilih Kandidat",
      description: "Lihat profil setiap kandidat dan pilih pilihan terbaik Anda",
      icon: "🗳️",
      color: "from-purple-500 to-purple-600"
    },
    {
      step: 3,
      title: "Konfirmasi Pilihan",
      description: "Periksa kembali pilihan Anda sebelum mengkonfirmasi",
      icon: "✅",
      color: "from-green-500 to-green-600"
    },
    {
      step: 4,
      title: "Voting Selesai",
      description: "Suara Anda telah tersimpan dengan aman dalam sistem",
      icon: "🎉",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Pemilihan Ketua OSIS
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              SMAN 1 Bantarujeg 2025
            </p>
            <p className="text-lg mb-12 max-w-3xl mx-auto text-blue-50">
              Sistem voting elektronik modern yang transparan, aman, dan mudah digunakan.
              Mari bersama-sama memilih pemimpin masa depan OSIS!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Mulai Voting
              </Link>
              <Link
                to="/results"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Lihat Hasil
              </Link>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <span className="text-3xl">⭐</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Mengapa Sistem Voting Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Pengalaman voting revolusioner dengan teknologi modern yang
              <span className="text-blue-600 font-semibold"> cepat</span>,
              <span className="text-purple-600 font-semibold"> aman</span>, dan
              <span className="text-green-600 font-semibold"> transparan</span>
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                {/* Feature Card */}
                <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">

                  {/* Background Decoration */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bgColor} rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                  <div className={`absolute bottom-0 left-0 w-24 h-24 ${feature.bgColor} rounded-full -ml-12 -mb-12 opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 text-center leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center text-sm text-gray-700">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color} mr-3 flex-shrink-0`}></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                </div>

                {/* Floating Animation */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
            ))}
          </div>

          </div>
      </section>

      {/* Voting Process Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cara Voting
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              4 langkah mudah dan cepat untuk memberikan suara Anda dalam pemilihan Ketua OSIS
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
              <div className="relative flex justify-between">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">
                      {stepNum}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {votingSteps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full">
                  {/* Icon */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>

                  {/* Step Number */}
                  <div className="text-center mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-600 font-bold text-sm">
                      {step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 text-center leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Decorative Elements */}
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${step.color} opacity-60`}></div>
                  <div className={`absolute bottom-4 left-4 w-1 h-1 rounded-full bg-gradient-to-r ${step.color} opacity-40`}></div>
                </div>

                {/* Connector Line (hidden on mobile, visible on desktop) */}
                {index < votingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="flex items-center">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full ml-[-1px]"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-lg">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Proses Cepat & Aman</h3>
              </div>
              <p className="text-gray-600">
                Seluruh proses voting hanya membutuhkan waktu kurang dari 5 menit.
                Data Anda terenkripsi dan tersimpan dengan aman dalam sistem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidates Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calon Ketua OSIS
            </h2>
            <p className="text-xl text-gray-600">
              Kenali calon-calon pemimpin masa depan OSIS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data kandidat...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada kandidat</h3>
                <p className="text-gray-600">Silakan tunggu admin menambahkan kandidat</p>
              </div>
            ) : (
              candidates.map((candidate, index) => (
                <div key={candidate.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  {/* Candidate Photo */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    {candidate.foto_url ? (
                      <img
                        src={candidate.foto_url}
                        alt={candidate.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-2xl font-bold">
                        {candidate.nama.split(' ').pop()?.charAt(0) || candidate.nama.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{candidate.nama}</h3>
                  <p className="text-blue-600 font-medium text-center mb-3">{candidate.motto || 'Calon Ketua OSIS'}</p>
                  <p className="text-gray-600 text-center text-sm mb-4">{candidate.visi}</p>

                  {/* Vision and Mission Preview */}
                  {candidate.misi && (
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-700 font-medium mb-1">Misi</p>
                      <p className="text-xs text-blue-600 line-clamp-2">{candidate.misi}</p>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Kandidat #{index + 1}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap untuk Memberikan Suara?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Bergabunglah dalam pemilihan ketua OSIS yang adil dan transparan
          </p>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
          >
            Login Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Pemilos SMAN 1 Bantarujeg</h3>
              <p className="text-gray-400">
                Sistem voting elektronik untuk pemilihan ketua OSIS yang modern dan transparan.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Login Voter</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Login Admin</Link></li>
                <li><Link to="/results" className="hover:text-white transition-colors">Lihat Hasil</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Informasi</h3>
              <p className="text-gray-400">
                Dikembangkan oleh tim pengembang SMAN 1 Bantarujeg
              </p>
              <p className="text-gray-400 mt-2">
                © 2024 Pemilos. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
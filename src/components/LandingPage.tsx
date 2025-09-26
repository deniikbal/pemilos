import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: "🗳️",
      title: "Voting Elektronik",
      description: "Sistem voting modern yang mudah digunakan dan transparan"
    },
    {
      icon: "🔐",
      title: "Keamanan Terjamin",
      description: "Autentikasi user yang aman dan privasi data terlindungi"
    },
    {
      icon: "📊",
      title: "Hasil Real-time",
      description: "Pantau hasil voting secara langsung dan akurat"
    },
    {
      icon: "🎯",
      title: "Antarmuka Intuitif",
      description: "Desain yang user-friendly untuk semua pengguna"
    }
  ];

  const candidates = [
    {
      name: "Calon 1",
      vision: "Mewujudkan OSIS yang lebih inklusif dan inovatif",
      motto: "Bersama untuk Perubahan"
    },
    {
      name: "Calon 2",
      vision: "Membangun OSIS yang solid dan berprestasi",
      motto: "Komitmen untuk Maju"
    },
    {
      name: "Calon 3",
      vision: "Menyatukan semua elemen untuk OSIS yang hebat",
      motto: "Persatuan dalam Keberagaman"
    }
  ];

  const votingSteps = [
    {
      step: 1,
      title: "Login",
      description: "Gunakan NIS dan password yang telah diberikan"
    },
    {
      step: 2,
      title: "Pilih Calon",
      description: "Lihat profil kandidat dan pilih pilihan Anda"
    },
    {
      step: 3,
      title: "Konfirmasi",
      description: "Pastikan pilihan Anda sudah benar"
    },
    {
      step: 4,
      title: "Selesai",
      description: "Voting Anda telah tersimpan dengan aman"
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Sistem Voting Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pengalaman voting yang lebih baik dengan teknologi modern
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voting Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Voting
            </h2>
            <p className="text-xl text-gray-600">
              4 langkah mudah untuk memberikan suara Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {votingSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < votingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {candidates.map((candidate, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {candidate.name.split(' ')[1]}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{candidate.name}</h3>
                <p className="text-blue-600 font-medium text-center mb-3">{candidate.motto}</p>
                <p className="text-gray-600 text-center text-sm">{candidate.vision}</p>
              </div>
            ))}
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
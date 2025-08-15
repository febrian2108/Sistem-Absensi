'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: "📊",
      title: "Dashboard Analitik",
      description: "Pantau kehadiran siswa dengan visualisasi data yang komprehensif"
    },
    {
      icon: "✅",
      title: "Absensi Real-time",
      description: "Sistem absensi digital yang akurat dan mudah digunakan"
    },
    {
      icon: "👥",
      title: "Manajemen Siswa",
      description: "Kelola data siswa dengan sistem yang terintegrasi"
    },
    {
      icon: "📱",
      title: "Notifikasi WhatsApp",
      description: "Pemberitahuan otomatis kepada orang tua melalui WhatsApp"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 p-6 ${isLoaded ? 'animate-slide-in-down' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <span className="text-white font-bold text-xl">📚</span>
            </div>
            <h1 className="text-2xl font-bold text-white">AbsensiKu</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="btn-ghost">
              Masuk
            </Link>
            <Link href="/register" className="btn-primary">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className={`${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 text-shadow-lg">
              Sistem Absensi
              <span className="block gradient-text-white">Modern & Digital</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed text-shadow">
              Solusi terdepan untuk manajemen kehadiran siswa dengan teknologi real-time, 
              notifikasi otomatis, dan dashboard analitik yang komprehensif.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-20 ${isLoaded ? 'animate-slide-in-up animate-delay-200' : 'opacity-0'}`}>
            <Link href="/register" className="btn-primary text-lg px-8 py-4 hover-glow">
              Mulai Sekarang
              <span className="ml-2">→</span>
            </Link>
            <Link href="/login" className="btn-ghost text-lg px-8 py-4">
              Masuk ke Dashboard
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`card card-interactive p-8 text-center hover-lift ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`}
                style={{animationDelay: `${0.3 + index * 0.1}s`}}
              >
                <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className={`glass rounded-3xl p-12 mb-20 ${isLoaded ? 'animate-fade-in animate-delay-500' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-white mb-8 text-shadow">
              Dipercaya oleh Ribuan Sekolah
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2 gradient-text-white">1000+</div>
                <div className="text-white/80">Sekolah Terdaftar</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2 gradient-text-white">50K+</div>
                <div className="text-white/80">Siswa Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2 gradient-text-white">99.9%</div>
                <div className="text-white/80">Uptime System</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center ${isLoaded ? 'animate-slide-in-up animate-delay-600' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-6 text-shadow">
              Siap Memulai Digitalisasi Absensi?
            </h2>
            <p className="text-xl text-white/90 mb-8 text-shadow">
              Bergabunglah dengan ribuan sekolah yang telah merasakan kemudahan sistem kami
            </p>
            <Link href="/register" className="btn-primary text-xl px-12 py-5 animate-glow">
              Daftar Gratis Sekarang
              <span className="ml-3">🚀</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 mt-20 py-12 border-t border-white/10 ${isLoaded ? 'animate-fade-in animate-delay-700' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
              <span className="text-white font-bold">📚</span>
            </div>
            <span className="text-white font-semibold">AbsensiKu</span>
          </div>
          <p className="text-white/70">
            © 2024 AbsensiKu.
          </p>
        </div>
      </footer>
    </div>
  );
}


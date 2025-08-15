"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Logo } from "../assets/icons";
import { Banner } from "../assets/images";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";

function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const token = await userCredential.user.getIdToken();

            setAuth(token);
            redirectToDashboard();
        } catch (err: any) {
            setError(err.message ?? "Login gagal");
        } finally {
            setLoading(false);
        }
    };

    const redirectToDashboard = () => {
        router.push("/dashboard");
    };

    const setAuth = (token: string) => {
        setCookie("token", token, {
            maxAge: 60 * 60 * 24, // 1 hari
        });
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">

                        {/* Left Panel - Login Form */}
                        <div className="order-2 lg:order-1">
                            <div className="card max-w-md mx-auto p-8 animate-slide-in-left">
                                {/* Logo Section */}
                                <div className="text-center mb-8 animate-fade-in">
                                    <div className="relative inline-block mb-4">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                                            <span className="text-3xl">📚</span>
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <h1 className="text-3xl font-bold gradient-text mb-2">
                                        AbsensiKu
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        Sistem Absensi Digital Modern
                                    </p>
                                </div>

                                {/* Welcome Text */}
                                <div className="text-center mb-8 animate-fade-in animate-delay-200">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Selamat Datang Kembali! 👋
                                    </h2>
                                    <p className="text-gray-600">
                                        Masuk ke akun Anda untuk melanjutkan
                                    </p>
                                </div>

                                {/* Login Form */}
                                <form onSubmit={handleLogin} className="space-y-6 animate-fade-in animate-delay-400">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label htmlFor="email" className="block text-gray-700 font-semibold text-sm mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="masukkan email Anda"
                                                className="input-field pl-4 pr-4"
                                                required
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="password" className="block text-gray-700 font-semibold text-sm mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Masukkan password Anda"
                                                    className="input-field pl-4 pr-12"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    {showPassword ?"🙊" : "🙈" }
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-fade-in flex items-center gap-2">
                                            <span>⚠️</span>
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-4 pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    Memuat...
                                                </>
                                            ) : (
                                                <>
                                                    Masuk ke Dashboard
                                                </>
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <p className="text-gray-600">
                                                Belum punya akun?{" "}
                                                <Link
                                                    href="/register"
                                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                                                >
                                                    Daftar Sekarang
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </form>

                                {/* Footer */}
                                <div className="mt-8 text-center text-gray-500 text-xs animate-fade-in animate-delay-600">
                                    © 2025 AbsensiKu.
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Welcome Content */}
                        <div className="order-1 lg:order-2 text-center lg:text-left animate-slide-in-right">
                            <div className="space-y-6">
                                <div className="animate-fade-in">
                                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 text-shadow-lg">
                                        Kelola Absensi
                                        <span className="block gradient-text-white">dengan Mudah</span>
                                    </h1>
                                    <p className="text-xl text-white/90 leading-relaxed text-shadow max-w-lg">
                                        Sistem absensi digital yang memudahkan guru dan siswa dalam mengelola kehadiran dengan teknologi modern dan notifikasi real-time.
                                    </p>
                                </div>

                                {/* Feature Highlights */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 animate-fade-in animate-delay-300">
                                    <div className="glass rounded-xl p-6 hover-lift">
                                        <div className="text-3xl mb-3">⚡</div>
                                        <h3 className="text-white font-semibold mb-2">Real-time</h3>
                                        <p className="text-white/80 text-sm">Absensi langsung tersimpan dan terkirim</p>
                                    </div>
                                    <div className="glass rounded-xl p-6 hover-lift">
                                        <div className="text-3xl mb-3">📱</div>
                                        <h3 className="text-white font-semibold mb-2">Notifikasi</h3>
                                        <p className="text-white/80 text-sm">WhatsApp otomatis ke orang tua</p>
                                    </div>
                                    <div className="glass rounded-xl p-6 hover-lift">
                                        <div className="text-3xl mb-3">📊</div>
                                        <h3 className="text-white font-semibold mb-2">Analytics</h3>
                                        <p className="text-white/80 text-sm">Dashboard lengkap dan laporan</p>
                                    </div>
                                    <div className="glass rounded-xl p-6 hover-lift">
                                        <div className="text-3xl mb-3">🔒</div>
                                        <h3 className="text-white font-semibold mb-2">Aman</h3>
                                        <p className="text-white/80 text-sm">Data terenkripsi dan terlindungi</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;


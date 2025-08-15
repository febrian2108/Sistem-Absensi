"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Logo } from "../assets/icons";
import Link from "next/link";
import { Banner2 } from "../assets/images";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebaseClient";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Calculate password strength
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/)) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 25;
        setPasswordStrength(strength);
    }, [password]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Password tidak cocok");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password minimal 6 karakter");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const uid = userCredential.user.uid;

            await updateProfile(userCredential.user, {
                displayName: name,
            });

            await setDoc(doc(db, "users", uid), {
                name,
                email,
                role: "teacher",
                createdAt: new Date().toISOString(),
            });

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setLoading(false);
            router.push("/login");
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 25) return "bg-red-500";
        if (passwordStrength <= 50) return "bg-yellow-500";
        if (passwordStrength <= 75) return "bg-blue-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 25) return "Lemah";
        if (passwordStrength <= 50) return "Sedang";
        if (passwordStrength <= 75) return "Kuat";
        return "Sangat Kuat";
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
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700"></div>
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        
                        {/* Left Panel - Welcome Content */}
                        <div className="order-2 lg:order-1 text-center lg:text-left animate-slide-in-left">
                            <div className="space-y-6">
                                <div className="animate-fade-in">
                                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 text-shadow-lg">
                                        Bergabung dengan
                                        <span className="block gradient-text-white">Revolusi Digital</span>
                                    </h1>
                                    <p className="text-xl text-white/90 leading-relaxed text-shadow max-w-lg">
                                        Daftarkan sekolah Anda dan rasakan kemudahan mengelola absensi siswa dengan teknologi terdepan yang telah dipercaya ribuan institusi pendidikan.
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div className="space-y-4 mt-12 animate-fade-in animate-delay-300">
                                    <div className="flex items-center gap-4 glass rounded-xl p-4 hover-lift">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-xl">✅</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Gratis untuk Selamanya</h3>
                                            <p className="text-white/80 text-sm">Tidak ada biaya tersembunyi</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 glass rounded-xl p-4 hover-lift">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-xl">⚡</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Setup dalam 5 Menit</h3>
                                            <p className="text-white/80 text-sm">Langsung bisa digunakan</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 glass rounded-xl p-4 hover-lift">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-xl">🛡️</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Data Aman & Terlindungi</h3>
                                            <p className="text-white/80 text-sm">Enkripsi tingkat enterprise</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mt-8 animate-fade-in animate-delay-500">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white gradient-text-white">1000+</div>
                                        <div className="text-white/70 text-xs">Sekolah</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white gradient-text-white">50K+</div>
                                        <div className="text-white/70 text-xs">Siswa</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white gradient-text-white">99.9%</div>
                                        <div className="text-white/70 text-xs">Uptime</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Register Form */}
                        <div className="order-1 lg:order-2">
                            <div className="card max-w-md mx-auto p-8 animate-slide-in-right">
                                {/* Logo Section */}
                                <div className="text-center mb-8 animate-fade-in">
                                    <div className="relative inline-block mb-4">
                                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                                            <span className="text-3xl">📚</span>
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <h1 className="text-3xl font-bold gradient-text mb-2">
                                        AbsensiKu
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        Daftar untuk memulai
                                    </p>
                                </div>

                                {/* Welcome Text */}
                                <div className="text-center mb-8 animate-fade-in animate-delay-200">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Bergabung dengan Kami!
                                    </h2>
                                    <p className="text-gray-600">
                                        Buat akun baru untuk memulai perjalanan digital
                                    </p>
                                </div>

                                {/* Register Form */}
                                <form onSubmit={handleRegister} className="space-y-6 animate-fade-in animate-delay-400">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label htmlFor="name" className="block text-gray-700 font-semibold text-sm mb-2">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                name="name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Masukkan nama lengkap Anda"
                                                className="input-field pl-4 pr-4"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="relative">
                                            <label htmlFor="email" className="block text-gray-700 font-semibold text-sm mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Masukkan email Anda"
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
                                                    placeholder="Buat password yang kuat"
                                                    className="input-field pl-4 pr-12"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    {showPassword ? "🙊" : "🙈"}
                                                </button>
                                            </div>
                                            {password && (
                                                <div className="mt-2">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-600">Kekuatan Password</span>
                                                        <span className={`font-semibold ${passwordStrength > 50 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {getPasswordStrengthText()}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                            style={{width: `${passwordStrength}%`}}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="relative">
                                            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold text-sm mb-2">
                                                Konfirmasi Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Ulangi password Anda"
                                                    className="input-field pl-4 pr-12"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    {showConfirmPassword ? "🙊" : "🙈"}
                                                </button>
                                            </div>
                                            {confirmPassword && password !== confirmPassword && (
                                                <p className="text-red-500 text-xs mt-1">❌ Password tidak cocok</p>
                                            )}
                                            {confirmPassword && password === confirmPassword && (
                                                <p className="text-green-500 text-xs mt-1">✅ Password cocok</p>
                                            )}
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
                                            disabled={loading || password !== confirmPassword}
                                            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    Mendaftar...
                                                </>
                                            ) : (
                                                <>
                                                    Daftar Sekarang
                                                </>
                                            )}
                                        </button>
                                        
                                        <div className="text-center">
                                            <p className="text-gray-600">
                                                Sudah punya akun?{" "}
                                                <Link 
                                                    href="/login" 
                                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                                                >
                                                    Masuk Sekarang
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </form>

                                {/* Footer */}
                                <div className="mt-8 text-center text-gray-500 text-xs animate-fade-in animate-delay-600">
                                    ©2025 AbsensiKu.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;


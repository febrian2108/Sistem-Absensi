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
import "@/styles/globals.css"; // Ensure global styles are imported

function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

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
        return null;
    }

    return (
        <div className="flex items-center w-screen h-screen justify-between font-inter bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Left Panel - Login Form */}
            <div className="flex flex-col w-2/5 h-full p-16 gap-8 animate-slide-in-left">
                {/* Logo Section */}
                <div className="flex flex-row items-center gap-4 animate-fade-in">
                    <div className="relative">
                        <Image src={Logo} alt="Logo" width={80} className="drop-shadow-lg" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold gradient-text">
                            SekolahKu
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Sekolahku, sekolahmu, sekolah kita semua
                        </p>
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Selamat Datang! 👋
                    </h2>
                    <p className="text-gray-600">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-gray-700 font-semibold text-sm">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Masukkan email Anda"
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-gray-700 font-semibold text-sm">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password Anda"
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Memuat...
                                </>
                            ) : (
                                "Masuk ke SekolahKu"
                            )}
                        </button>
                        
                        <div className="text-center">
                            <p className="text-gray-600">
                                Belum punya akun?{" "}
                                <Link 
                                    href="/register" 
                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                                >
                                    Daftar Sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-auto text-center text-gray-500 text-xs animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    © 2024 SekolahKu. All rights reserved.
                </div>
            </div>

            {/* Right Panel - Banner */}
            <div className="w-3/5 h-full relative overflow-hidden animate-slide-in-right">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
                <Image
                    src={Banner}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
                
                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-32 right-32 w-16 h-16 bg-blue-500/20 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-1/2 right-10 w-12 h-12 bg-purple-500/20 rounded-full backdrop-blur-sm animate-bounce" style={{ animationDelay: '2s' }}></div>
                
                {/* Welcome Message Overlay */}
                <div className="absolute bottom-16 left-16 right-16 glass rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '1s' }}>
                    <h3 className="text-white text-2xl font-bold mb-2">
                        Sistem Absensi Modern
                    </h3>
                    <p className="text-white/90 text-sm">
                        Kelola absensi siswa dengan mudah dan efisien menggunakan teknologi terdepan
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;

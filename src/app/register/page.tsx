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
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

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
            });

            setName("");
            setEmail("");
            setPassword("");
            setLoading(false);
            router.push("/login");
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="w-screen h-screen flex justify-between font-inter bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Left Panel - Register Form */}
            <div className="w-2/5 h-full p-16 flex-col gap-8 flex animate-slide-in-left">
                {/* Logo Section */}
                <div className="flex items-center gap-4 animate-fade-in">
                    <div className="relative">
                        <Image src={Logo} alt="Logo" width={80} className="drop-shadow-lg" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold gradient-text">SekolahKu</h1>
                        <p className="text-gray-600 text-sm">
                            Sekolahku, Sekolahmu, Sekolah kita semua
                        </p>
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Bergabung dengan Kami! 🚀
                    </h2>
                    <p className="text-gray-600">
                        Buat akun baru untuk memulai perjalanan Anda
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-gray-700 font-semibold text-sm">
                                Nama Lengkap
                            </label>
                            <input
                                name="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Masukkan nama lengkap Anda"
                                className="input-field"
                                required
                            />
                        </div>
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
                                placeholder="Buat password yang kuat"
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
                                    Mendaftar...
                                </>
                            ) : (
                                "Daftar Sekarang"
                            )}
                        </button>
                        
                        <div className="text-center">
                            <p className="text-gray-600">
                                Sudah punya akun?{" "}
                                <Link 
                                    href="/login" 
                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                                >
                                    Masuk Sekarang
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 z-10"></div>
                <Image
                    src={Banner2}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
                
                {/* Floating Elements */}
                <div className="absolute top-32 left-20 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-32 w-20 h-20 bg-purple-500/20 rounded-full backdrop-blur-sm animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-1/3 left-10 w-12 h-12 bg-blue-500/20 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                {/* Welcome Message Overlay */}
                <div className="absolute bottom-16 left-16 right-16 glass rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '1s' }}>
                    <h3 className="text-white text-2xl font-bold mb-2">
                        Mulai Perjalanan Anda
                    </h3>
                    <p className="text-white/90 text-sm">
                        Bergabunglah dengan ribuan guru yang telah mempercayai SekolahKu untuk mengelola absensi siswa
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;

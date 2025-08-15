"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

interface Student {
    name: string;
    studentId: string;
    grade: string;
}

interface Attendance {
    name: string;
    studentId: string;
    grade: string;
    status: string;
    date: string;
}

export default function AttendanceTablePage() {
    const [grades, setGrades] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getTodayInWIB = () => {
        const now = new Date();
        const offsetInMs = 7 * 60 * 60 * 1000; // UTC+7
        const wibDate = new Date(now.getTime() + offsetInMs);
        return wibDate.toISOString().split("T")[0];
    };

    const today = getTodayInWIB();

    useEffect(() => {
        const fetchGrades = async () => {
            const snapshot = await getDocs(collection(db, "students"));
            const uniqueGrades = Array.from(
                new Set(snapshot.docs.map((doc) => doc.data().grade))
            );
            setGrades(uniqueGrades.sort());
        };
        fetchGrades();
    }, []);

    const handleFetchAttendance = async () => {
        if (!selectedDate || !selectedGrade) return;

        setLoading(true);
        setDataLoaded(false);
        const snapshot = await getDocs(collection(db, "students"));
        const filteredStudents = snapshot.docs
            .map((doc) => doc.data() as Student)
            .filter((student) => student.grade === selectedGrade);

        const attendanceResults: Attendance[] = [];

        for (const student of filteredStudents) {
            const attendanceDoc = await getDoc(
                doc(db, "attendance", `${student.studentId}_${selectedDate}`)
            );
            if (attendanceDoc.exists()) {
                attendanceResults.push(attendanceDoc.data() as Attendance);
            } else {
                setAttendances([]);
            }
        }

        setAttendances(attendanceResults);
        setLoading(false);
        setDataLoaded(true);
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105";
        switch (status.toLowerCase()) {
            case 'hadir':
                return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300`;
            case 'tidak hadir':
                return `${baseClasses} bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300`;
            case 'izin':
                return `${baseClasses} bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300`;
            case 'sakit':
                return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300`;
            default:
                return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300`;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'hadir': return '✅';
            case 'alpha': return '❌';
            case 'izin': return '📝';
            case 'sakit': return '🏥';
            default: return '❓';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'hadir': return 'from-green-500 to-emerald-600';
            case 'alpha': return 'from-red-500 to-rose-600';
            case 'izin': return 'from-yellow-500 to-amber-600';
            case 'sakit': return 'from-blue-500 to-cyan-600';
            default: return 'from-gray-500 to-slate-600';
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-gray-600">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl"></div>
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-pulse"></div>

                    <div className="relative p-8 md:p-12 text-white animate-fade-in">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-glow">
                                <span className="text-3xl">📊</span>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-shadow">
                                    Dashboard Kehadiran
                                </h1>
                                <p className="text-white/90 text-lg text-shadow">
                                    Kelola dan pantau kehadiran siswa dengan mudah dan efisien
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-8 justify-center">
                            <div className="glass rounded-xl p-4 text-center hover-lift">
                                <div className="text-2xl mb-2">👥</div>
                                <div className="text-2xl font-bold">{grades.length}</div>
                                <div className="text-white/80 text-sm">Total Kelas</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center hover-lift">
                                <div className="text-2xl mb-2">📅</div>
                                <div className="text-2xl font-bold">{new Date().getDate()}</div>
                                <div className="text-white/80 text-sm">Hari Ini</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Filter Section */}
                <div className="card p-6 md:p-8 animate-slide-in-up animate-delay-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white text-lg">🔍</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Filter Data Kehadiran</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                <span>📅</span>
                                Pilih Tanggal
                            </label>
                            <input
                                type="date"
                                max={today}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input-field w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                <span>🏫</span>
                                Pilih Kelas
                            </label>
                            <select
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                className="input-field w-full"
                            >
                                <option value="">Pilih Kelas</option>
                                {grades.map((grade) => (
                                    <option key={grade} value={grade}>
                                        Kelas {grade}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleFetchAttendance}
                            className="btn-primary flex items-center justify-center gap-2 text-lg py-4 hover-glow"
                            disabled={!selectedDate || !selectedGrade || loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Memuat Data...
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    Tampilkan Data
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {dataLoaded && (
                    <div className="card p-6 md:p-8 animate-scale-in animate-delay-400">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    📋 Hasil Kehadiran - Kelas {selectedGrade}
                                </h2>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span>📅</span>
                                    <span className="font-medium">
                                        {new Date(selectedDate).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            {attendances.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                                    <span>👥</span>
                                    <span>Total: {attendances.length} siswa</span>
                                </div>
                            )}
                        </div>

                        {attendances.length === 0 ? (
                            <div className="text-center py-16 animate-fade-in">
                                <div className="text-8xl mb-6 animate-bounce">📭</div>
                                <h3 className="text-2xl font-bold text-gray-600 mb-4">Data Belum Tersedia</h3>
                                <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                                    Belum ada data kehadiran untuk tanggal dan kelas yang dipilih.
                                    Silakan pilih tanggal dan kelas lain.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {['Hadir', 'alpha', 'Izin', 'Sakit'].map((status, index) => {
                                        const count = attendances.filter(a => a.status.toLowerCase() === status.toLowerCase()).length;
                                        const percentage = attendances.length > 0 ? Math.round((count / attendances.length) * 100) : 0;

                                        return (
                                            <div
                                                key={status}
                                                className="relative overflow-hidden rounded-xl p-6 text-center hover-lift card-interactive"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor(status)} opacity-10`}></div>
                                                <div className="relative">
                                                    <div className="text-3xl mb-2">{getStatusIcon(status)}</div>
                                                    <div className="text-3xl font-bold text-gray-800 mb-1">{count}</div>
                                                    <div className="text-sm font-semibold text-gray-700 mb-1">{status}</div>
                                                    <div className="text-xs text-gray-500">{percentage}%</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Data Table */}
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
                                                <th className="text-left p-6 font-bold text-gray-700 rounded-tl-xl">
                                                    <div className="flex items-center gap-2">
                                                        <span>👤</span>
                                                        Nama Siswa
                                                    </div>
                                                </th>
                                                <th className="text-left p-6 font-bold text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <span>🆔</span>
                                                        Nomor Induk
                                                    </div>
                                                </th>
                                                <th className="text-left p-6 font-bold text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <span>🏫</span>
                                                        Kelas
                                                    </div>
                                                </th>
                                                <th className="text-left p-6 font-bold text-gray-700 rounded-tr-xl">
                                                    <div className="flex items-center gap-2">
                                                        <span>📋</span>
                                                        Status Kehadiran
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendances.map((attendance, index) => (
                                                <tr
                                                    key={attendance.studentId}
                                                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
                                                    style={{
                                                        animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                                                    }}
                                                >
                                                    <td className="p-6">
                                                        <div className="font-semibold text-gray-800 text-lg">
                                                            {attendance.name}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block">
                                                            {attendance.studentId}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="text-gray-600 font-medium">
                                                            Kelas {attendance.grade}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={getStatusBadge(attendance.status)}>
                                                            <span className="mr-2">{getStatusIcon(attendance.status)}</span>
                                                            {attendance.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


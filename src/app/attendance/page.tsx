"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    Timestamp,
} from "firebase/firestore";
import Modal from "../../app/components/molecules/modal/modal";

interface Student {
    studentId: string;
    name: string;
    parentPhone: string;
    grade: string;
}

export default function Attendance() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedGrade, setSelectedGrade] = useState("");
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [selectedId, setSelectedId] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getTodayInWIB = () => {
        const now = new Date();
        const offsetInMs = 7 * 60 * 60 * 1000; // 7 jam dalam milidetik
        const wibDate = new Date(now.getTime() + offsetInMs);
        return wibDate.toISOString().split("T")[0]; // yyyy-mm-dd
    };

    const formattedDate = getTodayInWIB();

    useEffect(() => {
        const fetchStudents = async () => {
            const snapshot = await getDocs(collection(db, "students"));
            const data = snapshot.docs.map((doc) => doc.data() as Student);
            setStudents(data);
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedGrade) {
            const filtered = students.filter((s) => s.grade === selectedGrade);
            setFilteredStudents(filtered);
            setSelectedId(""); // reset selected student
            setSelectedStudent(null);
        } else {
            setFilteredStudents([]);
        }
    }, [selectedGrade, students]);

    useEffect(() => {
        if (selectedId) {
            const student = students.find((s) => s.studentId === selectedId);
            setSelectedStudent(student || null);
        } else {
            setSelectedStudent(null);
        }
    }, [selectedId, students]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const student = students.find((s) => s.studentId === selectedId);
        if (!student) {
            setError("Siswa tidak ditemukan");
            setLoading(false);
            return;
        }

        const phone = student.parentPhone.startsWith("0")
            ? "62" + student.parentPhone.slice(1)
            : student.parentPhone;

        try {
            const attendanceRef = doc(
                db,
                "attendance",
                `${selectedId}_${formattedDate}`
            );

            await setDoc(attendanceRef, {
                ...student,
                status: attendanceStatus,
                date: formattedDate,
                timestamp: Timestamp.now(),
            });

            await fetch("/api/send-whatsapp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone,
                    name: student.name,
                    grade: student.grade,
                    date: formattedDate,
                    status: attendanceStatus,
                }),
            });

            setShowModal(true);
            setSelectedGrade("");
            setSelectedId("");
            setAttendanceStatus("");
            setSelectedStudent(null);
        } catch (err: any) {
            setError(err.message ?? "Gagal menyimpan kehadiran");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Hadir': return '✅';
            case 'Sakit': return '🤒';
            case 'Ijin Keperluan Pribadi': return '📝';
            case 'Alpha': return '❌';
            default: return '📋';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Hadir': return 'from-green-500 to-emerald-600';
            case 'Sakit': return 'from-blue-500 to-cyan-600';
            case 'Ijin Keperluan Pribadi': return 'from-yellow-500 to-amber-600';
            case 'Alpha': return 'from-red-500 to-rose-600';
            default: return 'from-gray-500 to-slate-600';
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-gray-600">Memuat halaman absensi...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/20 rounded-full animate-float"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-200/20 rounded-full animate-pulse"></div>
                </div>

                <div className="relative z-10 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        {/* Header Section */}
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-indigo-700 rounded-3xl"></div>
                            <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-pulse"></div>
                            
                            <div className="relative p-8 md:p-12 text-white animate-fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-glow">
                                        <span className="text-3xl">📝</span>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-shadow">
                                            Input Kehadiran Siswa
                                        </h1>
                                        <p className="text-white/90 text-lg text-shadow">
                                            Catat kehadiran siswa hari ini - {new Date(formattedDate).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Quick Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                    <div className="glass rounded-xl p-4 text-center hover-lift">
                                        <div className="text-2xl mb-2">📅</div>
                                        <div className="text-lg font-bold">Hari Ini</div>
                                        <div className="text-white/80 text-sm">Real-time Input</div>
                                    </div>
                                    <div className="glass rounded-xl p-4 text-center hover-lift">
                                        <div className="text-2xl mb-2">📱</div>
                                        <div className="text-lg font-bold">Auto WhatsApp</div>
                                        <div className="text-white/80 text-sm">Notifikasi Orang Tua</div>
                                    </div>
                                    <div className="glass rounded-xl p-4 text-center hover-lift">
                                        <div className="text-2xl mb-2">💾</div>
                                        <div className="text-lg font-bold">Cloud Storage</div>
                                        <div className="text-white/80 text-sm">Data Tersimpan Aman</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Form Section */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            
                            {/* Form Input */}
                            <div className="lg:col-span-2">
                                <div className="card p-8 animate-slide-in-left animate-delay-200">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">📋</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Form Input Kehadiran</h2>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Pilih Kelas */}
                                        <div className="space-y-3 animate-fade-in animate-delay-300">
                                            <label htmlFor="grade" className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                                <span className="text-2xl">🏫</span>
                                                Pilih Kelas
                                            </label>
                                            <select
                                                required
                                                value={selectedGrade}
                                                onChange={(e) => setSelectedGrade(e.target.value)}
                                                className="input-field text-lg py-4"
                                            >
                                                <option value="" disabled>
                                                    Pilih kelas terlebih dahulu...
                                                </option>
                                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                                    <option key={n} value={n.toString()}>
                                                        Kelas {n}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Pilih Siswa */}
                                        <div className="space-y-3 animate-fade-in animate-delay-400">
                                            <label htmlFor="student" className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                                <span className="text-2xl">👤</span>
                                                Pilih Siswa
                                                {selectedGrade && filteredStudents.length > 0 && (
                                                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2">
                                                        {filteredStudents.length} siswa
                                                    </span>
                                                )}
                                            </label>
                                            <select
                                                required
                                                value={selectedId}
                                                onChange={(e) => setSelectedId(e.target.value)}
                                                disabled={!selectedGrade}
                                                className="input-field text-lg py-4"
                                            >
                                                <option value="" disabled>
                                                    {selectedGrade ? "Pilih siswa..." : "Pilih kelas terlebih dahulu"}
                                                </option>
                                                {filteredStudents.map((s) => (
                                                    <option key={s.studentId} value={s.studentId}>
                                                        {s.name} - {s.studentId}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Pilih Status */}
                                        <div className="space-y-3 animate-fade-in animate-delay-500">
                                            <label htmlFor="status" className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                                <span className="text-2xl">📊</span>
                                                Status Kehadiran
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {["Hadir", "Sakit", "Ijin Keperluan Pribadi", "Alpha"].map((status) => (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        onClick={() => setAttendanceStatus(status)}
                                                        disabled={!selectedId}
                                                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover-lift ${
                                                            attendanceStatus === status
                                                                ? `bg-gradient-to-r ${getStatusColor(status)} text-white border-transparent shadow-lg`
                                                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                                        } ${!selectedId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <div className="text-center">
                                                            <div className="text-2xl mb-2">{getStatusIcon(status)}</div>
                                                            <div className="font-semibold">{status}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl animate-fade-in flex items-center gap-3">
                                                <span className="text-xl">⚠️</span>
                                                <span className="font-medium">{error}</span>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="pt-4 animate-fade-in animate-delay-600">
                                            <button
                                                type="submit"
                                                disabled={loading || !selectedId || !attendanceStatus}
                                                className="btn-primary w-full text-xl py-6 hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="spinner mr-3"></div>
                                                        Menyimpan Data...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="mr-3">💾</span>
                                                        Simpan Kehadiran & Kirim Notifikasi
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                
                                {/* Student Preview */}
                                {selectedStudent && (
                                    <div className="card p-6 animate-scale-in animate-delay-400">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>👤</span>
                                            Data Siswa Terpilih
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Nama:</span>
                                                <span className="font-semibold">{selectedStudent.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">NIS:</span>
                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedStudent.studentId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Kelas:</span>
                                                <span className="font-semibold">Kelas {selectedStudent.grade}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">No. HP Ortu:</span>
                                                <span className="font-mono text-sm">{selectedStudent.parentPhone}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Status Preview */}
                                {attendanceStatus && (
                                    <div className="card p-6 animate-scale-in animate-delay-500">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>📊</span>
                                            Status Terpilih
                                        </h3>
                                        <div className={`p-4 rounded-xl bg-gradient-to-r ${getStatusColor(attendanceStatus)} text-white text-center`}>
                                            <div className="text-3xl mb-2">{getStatusIcon(attendanceStatus)}</div>
                                            <div className="font-bold text-lg">{attendanceStatus}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Info Box */}
                                <div className="card p-6 animate-fade-in animate-delay-600">
                                    <div className="flex items-start gap-3">
                                        <div className="text-blue-600 text-2xl">💡</div>
                                        <div>
                                            <h4 className="font-bold text-blue-800 mb-2 text-lg">Informasi Penting</h4>
                                            <ul className="text-blue-700 text-sm space-y-2">
                                                <li>• Data kehadiran tersimpan otomatis</li>
                                                <li>• Notifikasi dikirim via WhatsApp</li>
                                                <li>• Orang tua mendapat info real-time</li>
                                                <li>• Data dapat dilihat di dashboard</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Modal
                title="Sukses! 🎉"
                content="Kehadiran berhasil disimpan dan notifikasi telah dikirim ke orang tua siswa melalui WhatsApp."
                type="success"
                isOpen={showModal}
                buttonText1="OK"
                buttonType1="primary"
                onConfirm={() => setShowModal(false)}
            />
        </>
    );
}


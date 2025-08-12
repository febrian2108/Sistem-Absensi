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
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
        switch (status.toLowerCase()) {
            case 'hadir':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'tidak hadir':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'izin':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'sakit':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white animate-slide-in-left">
                <h1 className="text-3xl font-bold mb-2">📊 Dashboard Kehadiran</h1>
                <p className="text-blue-100">Kelola dan pantau kehadiran siswa dengan mudah</p>
            </div>

            {/* Filter Section */}
            <div className="card p-6 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Data Kehadiran</h2>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-semibold text-sm">Tanggal</label>
                        <input
                            type="date"
                            max={today}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="input-field w-48"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-semibold text-sm">Kelas</label>
                        <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="input-field w-48"
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
                        className="btn-primary flex items-center gap-2"
                        disabled={!selectedDate || !selectedGrade || loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Memuat...
                            </>
                        ) : (
                            <>
                                🔍 Tampilkan Data
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {dataLoaded && (
                <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Hasil Kehadiran - Kelas {selectedGrade}
                        </h2>
                        <div className="text-sm text-gray-600">
                            📅 {new Date(selectedDate).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>

                    {attendances.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Data Belum Tersedia</h3>
                            <p className="text-gray-500">Belum ada data kehadiran untuk tanggal dan kelas yang dipilih</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                                        <th className="text-left p-4 font-semibold text-gray-700 rounded-tl-lg">👤 Nama Siswa</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">🆔 Nomor Induk</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">🏫 Kelas</th>
                                        <th className="text-left p-4 font-semibold text-gray-700 rounded-tr-lg">📋 Status Kehadiran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.map((attendance, index) => (
                                        <tr 
                                            key={attendance.studentId} 
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                            style={{ 
                                                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` 
                                            }}
                                        >
                                            <td className="p-4 font-medium text-gray-800">{attendance.name}</td>
                                            <td className="p-4 text-gray-600">{attendance.studentId}</td>
                                            <td className="p-4 text-gray-600">{attendance.grade}</td>
                                            <td className="p-4">
                                                <span className={getStatusBadge(attendance.status)}>
                                                    {attendance.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Summary Stats */}
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Hadir', 'Tidak Hadir', 'Izin', 'Sakit'].map((status) => {
                                    const count = attendances.filter(a => a.status.toLowerCase() === status.toLowerCase()).length;
                                    const percentage = attendances.length > 0 ? Math.round((count / attendances.length) * 100) : 0;
                                    
                                    return (
                                        <div key={status} className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-gray-800">{count}</div>
                                            <div className="text-sm text-gray-600">{status}</div>
                                            <div className="text-xs text-gray-500">{percentage}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

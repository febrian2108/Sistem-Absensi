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
        } else {
            setFilteredStudents([]);
        }
    }, [selectedGrade, students]);

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

    if (!mounted) {
        return null;
    }

    return (
        <>
            <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
                <div className="p-8 max-w-2xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8 animate-slide-in-left">
                        <h1 className="text-3xl font-bold mb-2">📝 Input Kehadiran Siswa</h1>
                        <p className="text-green-100">Catat kehadiran siswa hari ini - {new Date(formattedDate).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>

                    {/* Form Section */}
                    <div className="card p-8 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Pilih Kelas */}
                            <div className="flex flex-col gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                <label htmlFor="grade" className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                                    🏫 Pilih Kelas
                                </label>
                                <select
                                    required
                                    value={selectedGrade}
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="" disabled>
                                        Pilih Kelas
                                    </option>
                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                        <option key={n} value={n.toString()}>
                                            Kelas {n}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pilih Siswa */}
                            <div className="flex flex-col gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                <label htmlFor="student" className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                                    👤 Pilih Siswa
                                </label>
                                <select
                                    required
                                    value={selectedId}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                    disabled={!selectedGrade}
                                    className="input-field"
                                >
                                    <option value="" disabled>
                                        {selectedGrade ? "Pilih Siswa" : "Pilih Kelas Terlebih Dahulu"}
                                    </option>
                                    {filteredStudents.map((s) => (
                                        <option key={s.studentId} value={s.studentId}>
                                            {s.name} - {s.studentId}
                                        </option>
                                    ))}
                                </select>
                                {selectedGrade && filteredStudents.length > 0 && (
                                    <p className="text-sm text-gray-600">
                                        {filteredStudents.length} siswa tersedia di kelas {selectedGrade}
                                    </p>
                                )}
                            </div>

                            {/* Pilih Status */}
                            <div className="flex flex-col gap-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                                <label htmlFor="status" className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                                    📋 Status Kehadiran
                                </label>
                                <select
                                    required
                                    value={attendanceStatus}
                                    onChange={(e) => setAttendanceStatus(e.target.value)}
                                    disabled={!selectedId}
                                    className="input-field"
                                >
                                    <option value="" disabled>
                                        {selectedId
                                            ? "Pilih Status Kehadiran"
                                            : "Pilih Siswa Terlebih Dahulu"}
                                    </option>
                                    {["Hadir", "Sakit", "Ijin Keperluan Pribadi", "Alpha"].map(
                                        (status) => (
                                            <option key={status} value={status}>
                                                {getStatusIcon(status)} {status}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedId || !attendanceStatus}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            💾 Simpan Kehadiran
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                                <div className="flex items-start gap-3">
                                    <div className="text-blue-600 text-xl">💡</div>
                                    <div>
                                        <h4 className="font-semibold text-blue-800 mb-1">Informasi</h4>
                                        <p className="text-blue-700 text-sm">
                                            Setelah menyimpan kehadiran, notifikasi otomatis akan dikirim ke orang tua siswa melalui WhatsApp.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <Modal
                title="Sukses"
                content="Kehadiran berhasil disimpan. Notifikasi telah dikirim ke orang tua siswa."
                type="success"
                isOpen={showModal}
                buttonText1="OK"
                buttonType1="primary"
                onConfirm={() => setShowModal(false)}
            />
        </>
    );
}

"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import Modal from "../../app/components/molecules/modal/modal";

interface Student {
    name: string;
    studentId: string;
    grade: string;
    parentPhone: string;
}

export default function RegisterStudentPage() {
    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [grade, setGrade] = useState("");
    const [parentPhone, setParentPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [showStudentsList, setShowStudentsList] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const snapshot = await getDocs(collection(db, "students"));
            const studentsData = snapshot.docs.map(doc => doc.data() as Student);
            setStudents(studentsData.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith("0")) {
            return "62" + phone.slice(1);
        }
        return phone;
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^[0-9]{10,13}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validations
        if (studentId.length !== 5) {
            setError("Nomor Induk Siswa harus 5 digit");
            setLoading(false);
            return;
        }

        if (!validatePhoneNumber(parentPhone)) {
            setError("Nomor telepon harus 10-13 digit dan hanya berisi angka");
            setLoading(false);
            return;
        }

        try {
            const ref = doc(db, "students", studentId);
            const existing = await getDoc(ref);

            if (existing.exists()) {
                setError("Nomor Induk Siswa sudah terdaftar");
                setLoading(false);
                return;
            }

            await setDoc(ref, {
                name,
                studentId,
                grade,
                parentPhone: formatPhoneNumber(parentPhone),
            });

            setShowModal(true);
            setName("");
            setStudentId("");
            setGrade("");
            setParentPhone("");
            fetchStudents(); // Refresh the list
        } catch (err: any) {
            setError(err.message ?? "Gagal mendaftarkan siswa");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus siswa ini?")) return;
        
        setDeleteLoading(studentId);
        try {
            await deleteDoc(doc(db, "students", studentId));
            fetchStudents(); // Refresh the list
        } catch (error) {
            console.error("Error deleting student:", error);
        } finally {
            setDeleteLoading(null);
        }
    };

    const getGradeStats = () => {
        const gradeCount: { [key: string]: number } = {};
        students.forEach(student => {
            gradeCount[student.grade] = (gradeCount[student.grade] || 0) + 1;
        });
        return gradeCount;
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-gray-600">Memuat halaman siswa...</p>
                </div>
            </div>
        );
    }

    const gradeStats = getGradeStats();

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full animate-float"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-200/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-200/20 rounded-full animate-pulse"></div>
                </div>

                <div className="relative z-10 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        
                        {/* Header Section */}
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-700 rounded-3xl"></div>
                            <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-pulse"></div>
                            
                            <div className="relative p-8 md:p-12 text-white animate-fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-glow">
                                        <span className="text-3xl">👥</span>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-shadow">
                                            Manajemen Siswa
                                        </h1>
                                        <p className="text-white/90 text-lg text-shadow">
                                            Kelola data siswa dengan mudah dan efisien
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mt-8 place-content-center">
                                    <div className="glass rounded-xl p-4 text-center hover-lift">
                                        <div className="text-2xl mb-2">👥</div>
                                        <div className="text-2xl font-bold">{students.length}</div>
                                        <div className="text-white/80 text-sm">Total Siswa</div>
                                    </div>
                                    <div className="glass rounded-xl p-4 text-center hover-lift">
                                        <div className="text-2xl mb-2">🏫</div>
                                        <div className="text-2xl font-bold">{Object.keys(gradeStats).length}</div>
                                        <div className="text-white/80 text-sm">Kelas Aktif</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up animate-delay-200">
                            <button
                                onClick={() => setShowStudentsList(false)}
                                className={`btn-primary flex items-center justify-center gap-2 ${!showStudentsList ? 'opacity-100' : 'opacity-70'}`}
                            >
                                <span>➕</span>
                                Tambah Siswa Baru
                            </button>
                            <button
                                onClick={() => {
                                    setShowStudentsList(true);
                                    if (!students.length) fetchStudents();
                                }}
                                className={`btn-secondary flex items-center justify-center gap-2 ${showStudentsList ? 'opacity-100' : 'opacity-70'}`}
                            >
                                <span>📋</span>
                                Lihat Daftar Siswa ({students.length})
                            </button>
                        </div>

                        {/* Main Content */}
                        {!showStudentsList ? (
                            /* Add Student Form */
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <div className="card p-8 animate-slide-in-left animate-delay-300">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                                <span className="text-white text-lg">📝</span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-800">Form Pendaftaran Siswa</h2>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-3 animate-fade-in animate-delay-400">
                                                <label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                                    <span className="text-xl">👤</span>
                                                    Nama Lengkap Siswa
                                                </label>
                                                <input
                                                    name="name"
                                                    type="text"
                                                    placeholder="Masukkan nama lengkap siswa"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                    className="input-field text-lg py-4"
                                                />
                                            </div>

                                            <div className="space-y-3 animate-fade-in animate-delay-500">
                                                <label htmlFor="studentId" className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                                    <span className="text-xl">🆔</span>
                                                    Nomor Induk Siswa
                                                </label>
                                                <input
                                                    name="studentId"
                                                    type="number"
                                                    placeholder="Masukkan 5 digit nomor induk siswa"
                                                    maxLength={5}
                                                    value={studentId}
                                                    onChange={(e) => {
                                                        if (e.target.value.length <= 5) {
                                                            setStudentId(e.target.value);
                                                        }
                                                    }}
                                                    required
                                                    className="input-field text-lg py-4 font-mono "
                                                />
                                                <p className="text-sm text-gray-500">
                                                    * Harus tepat 5 digit angka
                                                </p>
                                            </div>

                                            <div className="space-y-3 animate-fade-in animate-delay-600">
                                                <label htmlFor="grade" className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                                    <span className="text-xl">🏫</span>
                                                    Kelas
                                                </label>
                                                <select
                                                    name="grade"
                                                    value={grade}
                                                    onChange={(e) => setGrade(e.target.value)}
                                                    required
                                                    className="input-field text-lg py-4"
                                                >
                                                    <option value="" disabled>
                                                        Pilih kelas siswa
                                                    </option>
                                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                                        <option key={n} value={n}>
                                                            Kelas {n}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-3 animate-fade-in animate-delay-700">
                                                <label htmlFor="parentPhone" className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                                    <span className="text-xl">📱</span>
                                                    Nomor WhatsApp Orang Tua
                                                </label>
                                                <input
                                                    name="parentPhone"
                                                    type="tel"
                                                    placeholder="Contoh: 08123456789"
                                                    value={parentPhone}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        if (value.length <= 13) {
                                                            setParentPhone(value);
                                                        }
                                                    }}
                                                    required
                                                    className="input-field text-lg py-4 font-mono"
                                                />
                                                <p className="text-sm text-gray-500">
                                                    * 10-13 digit, awali dengan 0 (contoh: 08123456789)
                                                </p>
                                            </div>

                                            {error && (
                                                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl animate-fade-in flex items-center gap-3">
                                                    <span className="text-xl">⚠️</span>
                                                    <span className="font-medium">{error}</span>
                                                </div>
                                            )}

                                            <div className="pt-4 animate-fade-in animate-delay-800">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
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
                                                            Daftarkan Siswa Baru
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* Sidebar Info */}
                                <div className="space-y-6">
                                    <div className="card p-6 animate-slide-in-right animate-delay-400">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>📊</span>
                                            Statistik Kelas
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(gradeStats).map(([grade, count]) => (
                                                <div key={grade} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                                    <span className="font-medium text-gray-500">Kelas {grade}</span>
                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                        {count} siswa
                                                    </span>
                                                </div>
                                            ))}
                                            {Object.keys(gradeStats).length === 0 && (
                                                <p className="text-gray-500 text-center py-4">Belum ada data siswa</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card p-6 animate-fade-in animate-delay-600">
                                        <div className="flex items-start gap-3">
                                            <div className="text-blue-600 text-2xl">💡</div>
                                            <div>
                                                <h4 className="font-bold text-blue-800 mb-2 text-lg">Tips Penting</h4>
                                                <ul className="text-blue-700 text-sm space-y-2">
                                                    <li>• NIS harus unik untuk setiap siswa</li>
                                                    <li>• Pastikan nomor WhatsApp aktif</li>
                                                    <li>• Data dapat diubah setelah disimpan</li>
                                                    <li>• Notifikasi otomatis ke orang tua</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Students List */
                            <div className="card p-8 animate-scale-in animate-delay-300">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg">📋</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Daftar Siswa Terdaftar</h2>
                                    </div>
                                    <button
                                        onClick={fetchStudents}
                                        disabled={loadingStudents}
                                        className="btn-secondary flex items-center gap-2"
                                    >
                                        {loadingStudents ? (
                                            <>
                                                <div className="spinner"></div>
                                                Memuat...
                                            </>
                                        ) : (
                                            <>
                                                <span>🔄</span>
                                                Refresh
                                            </>
                                        )}
                                    </button>
                                </div>

                                {loadingStudents ? (
                                    <div className="text-center py-12">
                                        <div className="spinner mb-4"></div>
                                        <p className="text-gray-600">Memuat data siswa...</p>
                                    </div>
                                ) : students.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-8xl mb-6 animate-bounce">👥</div>
                                        <h3 className="text-2xl font-bold text-gray-600 mb-4">Belum Ada Siswa Terdaftar</h3>
                                        <p className="text-gray-500 text-lg mb-8">
                                            Mulai dengan mendaftarkan siswa pertama Anda
                                        </p>
                                        <button
                                            onClick={() => setShowStudentsList(false)}
                                            className="btn-primary"
                                        >
                                            <span className="mr-2">➕</span>
                                            Tambah Siswa Pertama
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50">
                                                    <th className="text-left p-6 font-bold text-gray-700 rounded-tl-xl">
                                                        <div className="flex items-center gap-2">
                                                            <span>👤</span>
                                                            Nama Siswa
                                                        </div>
                                                    </th>
                                                    <th className="text-left p-6 font-bold text-gray-700">
                                                        <div className="flex items-center gap-2">
                                                            <span>🆔</span>
                                                            NIS
                                                        </div>
                                                    </th>
                                                    <th className="text-left p-6 font-bold text-gray-700">
                                                        <div className="flex items-center gap-2">
                                                            <span>🏫</span>
                                                            Kelas
                                                        </div>
                                                    </th>
                                                    <th className="text-left p-6 font-bold text-gray-700">
                                                        <div className="flex items-center gap-2">
                                                            <span>📱</span>
                                                            No. HP Ortu
                                                        </div>
                                                    </th>
                                                    <th className="text-center p-6 font-bold text-gray-700 rounded-tr-xl">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span>⚙️</span>
                                                            Aksi
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map((student, index) => (
                                                    <tr 
                                                        key={student.studentId} 
                                                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300"
                                                        style={{ 
                                                            animation: `slideInUp 0.6s ease-out ${index * 0.1}s both` 
                                                        }}
                                                    >
                                                        <td className="p-6">
                                                            <div className="font-semibold text-gray-800 text-lg">
                                                                {student.name}
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block">
                                                                {student.studentId}
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="text-gray-600 font-medium">
                                                                Kelas {student.grade}
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="text-gray-600 font-mono text-sm">
                                                                +{student.parentPhone}
                                                            </div>
                                                        </td>
                                                        <td className="p-6 text-center">
                                                            <button
                                                                onClick={() => handleDeleteStudent(student.studentId)}
                                                                disabled={deleteLoading === student.studentId}
                                                                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                                            >
                                                                {deleteLoading === student.studentId ? (
                                                                    <div className="spinner"></div>
                                                                ) : (
                                                                    "🗑️"
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <Modal
                title="Sukses! 🎉"
                content="Siswa baru berhasil didaftarkan ke dalam sistem. Data telah tersimpan dengan aman."
                type="success"
                isOpen={showModal}
                buttonText1="OK"
                buttonType1="primary"
                onConfirm={() => setShowModal(false)}
            />
        </>
    );
}


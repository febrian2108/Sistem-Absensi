'use client';
import { AttendanceIcon, DashboardIcon, LogoutIcon, RegisterIcon } from '@/app/assets/icons';
import { auth } from '@/lib/firebaseClient';
import { deleteCookie } from 'cookies-next';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Modal from '../modal/modal';
import Image from 'next/image';

function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            deleteCookie('token', { path: '/' });
            handleCloseLogoutModal();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleShowLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const handleCloseLogoutModal = () => {
        setShowLogoutModal(false);
    };

    const itemsMenu = [
        {
            category: 'Administrasi',
            items: [
                {
                    name: 'Beranda',
                    href: '/dashboard',
                    icon: DashboardIcon,
                    type: 'link',
                    function: () => { },
                    emoji: '🏠'
                },
                {
                    name: 'Kehadiran',
                    href: '/attendance',
                    icon: AttendanceIcon,
                    type: 'link',
                    function: () => { },
                    emoji: '📝'
                },
                {
                    name: 'Pendaftaran Siswa',
                    href: '/students',
                    icon: RegisterIcon,
                    type: 'link',
                    function: () => { },
                    emoji: '👥'
                },
            ],
        },
        {
            category: 'Akun',
            items: [
                {
                    name: 'Keluar',
                    href: '',
                    icon: LogoutIcon,
                    type: 'button',
                    function: handleShowLogoutModal,
                    emoji: '🚪'
                },
            ],
        },
    ];

    if (!mounted) {
        return null;
    }

    return (
        <>
            <div className="h-screen w-64 font-inter bg-gradient-to-b from-blue-600 to-purple-700 fixed py-8 top-20 left-0 flex flex-col gap-8 overflow-y-auto shadow-xl animate-slide-in-left">
                {/* Sidebar Header */}
                <div className="px-5 mb-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-white font-semibold text-lg mb-1">Menu Navigasi</h3>
                        <p className="text-blue-100 text-sm">Sistem Absensi SekolahKu</p>
                    </div>
                </div>

                {itemsMenu.map((item, categoryIndex) => (
                    <div 
                        className="flex flex-col transition-all duration-300" 
                        key={item.category}
                        style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                    >
                        <div className="px-5 mb-3">
                            <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                                {item.category}
                            </p>
                            <div className="w-8 h-0.5 bg-blue-300 mt-1 rounded-full"></div>
                        </div>
                        
                        {item.items.map((menu, itemIndex) =>
                            menu.type === 'button' ? (
                                <button
                                    onClick={menu.function}
                                    className={`
                                        ${pathname === menu.href 
                                            ? 'bg-white/20 border-r-4 border-white shadow-lg' 
                                            : 'hover:bg-white/10'
                                        } 
                                        flex items-center transition-all duration-300 px-5 py-4 gap-4 text-white text-base
                                        hover:translate-x-2 hover:shadow-md group relative overflow-hidden
                                        animate-fade-in
                                    `}
                                    style={{ animationDelay: `${(categoryIndex * 0.1) + (itemIndex * 0.05)}s` }}
                                    key={menu.name}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        <span className="text-xl">{menu.emoji}</span>
                                        <p className="font-medium">{menu.name}</p>
                                    </div>
                                    {pathname === menu.href && (
                                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={menu.href}
                                    className={`
                                        ${pathname === menu.href 
                                            ? 'bg-white/20 border-r-4 border-white shadow-lg' 
                                            : 'hover:bg-white/10'
                                        } 
                                        flex items-center transition-all duration-300 px-5 py-4 gap-4 text-white text-base
                                        hover:translate-x-2 hover:shadow-md group relative overflow-hidden
                                        animate-fade-in
                                    `}
                                    style={{ animationDelay: `${(categoryIndex * 0.1) + (itemIndex * 0.05)}s` }}
                                    key={menu.name}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        <span className="text-xl">{menu.emoji}</span>
                                        <p className="font-medium">{menu.name}</p>
                                    </div>
                                    {pathname === menu.href && (
                                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full animate-pulse"></div>
                                    )}
                                </Link>
                            ),
                        )}
                    </div>
                ))}
            </div>
            
            <Modal
                title="Konfirmasi Keluar"
                content="Apakah Anda yakin ingin keluar dari sistem?"
                type="warning"
                isOpen={showLogoutModal}
                buttonText1="Ya, Keluar"
                buttonType1="primary"
                buttonText2="Batal"
                buttonType2="secondary"
                onConfirm={handleLogout}
                onClose={() => setShowLogoutModal(false)}
            />
        </>
    );
}

export default Sidebar;

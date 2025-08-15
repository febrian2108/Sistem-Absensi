import { Logo } from '@/app/assets/icons';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

function Header() {
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        setMounted(true);
        
        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(user.displayName);
            } else {
                setDisplayName(null);
            }
        });
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const getGreetingEmoji = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return '👤';
        if (hour < 15) return '👤';
        if (hour < 18) return '👤';
        return '👤';
    };

    if (!mounted) {
        return null;
    }

    return (
        <header className="w-screen h-20 bg-white px-8 py-5 flex items-center justify-between shadow-lg fixed top-0 z-50 border-b border-gray-100 animate-slide-in-left">
            {/* Logo Section */}
            <div className="flex items-center gap-4 animate-fade-in">
                <div className="relative">
                    <Image src={Logo} alt="Logo" width={50} height={50} className="drop-shadow-md" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold gradient-text">Absensi.Ku</h1>
                    <p className="text-xs text-gray-600">Sistem Absensi Digital</p>
                </div>
            </div>

            {/* User Info Section */}
            <div className="flex items-center gap-6 animate-slide-in-right">
                {/* Time Display */}
                <div className="hidden md:flex flex-col items-end text-sm">
                    <div className="text-gray-600">
                        {currentTime.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    <div className="text-blue-600 font-semibold">
                        {currentTime.toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })} WIB
                    </div>
                </div>

                {/* User Greeting */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-100">
                    <div className="text-xl" style={{ animationDelay: '1s' }}>
                        {getGreetingEmoji()}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs text-gray-600">{getGreeting()}</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {displayName || 'Pengguna'}
                        </p>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600 hidden lg:block">Online</span>
                </div>
            </div>
        </header>
    );
}

export default Header;

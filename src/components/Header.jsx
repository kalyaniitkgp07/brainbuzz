import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const isLobby = location.pathname === '/';

    return (
        <header className="w-full bg-slate-800 border-b-4 border-yellow-500 p-4 flex justify-between items-center shadow-xl fixed top-0 left-0 z-50">
            <Link to="/" className="text-3xl font-black text-yellow-400 tracking-tighter uppercase">
                Brain Buzz
            </Link>
            {!isLobby && (
                <Link
                    to="/"
                    className="bg-yellow-400 text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors flex items-center gap-2"
                >
                    🏠 Home
                </Link>
            )}
        </header>
    );
}

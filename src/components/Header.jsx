import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const isLobby = location.pathname === '/';

    return (
        <header className="w-full bg-slate-800 border-b-4 border-yellow-500 p-4 flex justify-between items-center shadow-xl fixed top-0 left-0 z-50">
            <Link to="/" className="flex items-center gap-3">
                <img src={`${import.meta.env.BASE_URL}brain_buzz.svg`} alt="Brain Buzz Logo" className="w-10 h-10" />
                <span className="text-3xl font-black text-yellow-400 tracking-tighter uppercase">
                    Brain Buzz
                </span>
            </Link>
            <div className="flex gap-4 items-center">
                <Link
                    to="/admin"
                    className="p-2 text-slate-400 hover:text-yellow-400 transition-colors"
                    title="Admin"
                >
                    ⚙️
                </Link>
                {!isLobby && (
                    <Link
                        to="/"
                        className="bg-yellow-400 text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors flex items-center gap-2"
                    >
                        🎮 Lobby
                    </Link>
                )}
            </div>
        </header>
    );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useGame, ALL_GAMES } from '../context/GameContext';

export default function Lobby() {
    const { enabledGames } = useGame();

    return (
        <div className="text-center animate-fade-in w-full max-w-4xl">
            <h1 className="text-6xl font-black mb-12 text-yellow-400 tracking-tighter uppercase drop-shadow-2xl">Quiz Show Lobby</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ALL_GAMES.map((game, i) => {
                    const path = game.toLowerCase().replace(/\s+/g, '-');
                    const isEnabled = enabledGames.includes(game);

                    return isEnabled ? (
                        <Link
                            key={game}
                            to={`/${path}`}
                            className="p-8 text-3xl font-black rounded-3xl border-4 border-yellow-400 bg-yellow-400 text-slate-900 hover:scale-105 hover:rotate-1 shadow-2xl transition-all text-center flex items-center justify-center min-h-[160px]"
                        >
                            {game}
                        </Link>
                    ) : (
                        <div
                            key={game}
                            className="p-8 text-3xl font-black rounded-3xl border-4 border-slate-700 bg-slate-800/50 text-slate-600 cursor-not-allowed text-center flex flex-col items-center justify-center min-h-[160px] opacity-50"
                        >
                            <span>{game}</span>
                            <span className="text-xs uppercase tracking-widest mt-2 font-bold opacity-30">Disabled by Admin</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

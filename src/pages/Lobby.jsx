import React from 'react';
import { Link } from 'react-router-dom';
import { GAMES } from '../data/gameData';

export default function Lobby() {
    return (
        <div className="text-center animate-fade-in">
            <h1 className="text-6xl font-black mb-12 text-yellow-400 tracking-tighter uppercase">Quiz Show Lobby</h1>
            <div className="grid grid-cols-1 gap-6 w-96">
                {GAMES.map((game, i) => {
                    const path = game.toLowerCase().replace(/\s+/g, '-');
                    const isAvailable = i === 0; // Only ClueDown is available for now

                    return isAvailable ? (
                        <Link
                            key={game}
                            to={`/${path}`}
                            className="p-6 text-2xl font-bold rounded-xl border-4 border-yellow-400 bg-yellow-400 text-slate-900 hover:scale-105 transition-all text-center"
                        >
                            {game}
                        </Link>
                    ) : (
                        <div
                            key={game}
                            className="p-6 text-2xl font-bold rounded-xl border-4 border-slate-700 text-slate-500 cursor-not-allowed text-center"
                        >
                            {game} (Locked)
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

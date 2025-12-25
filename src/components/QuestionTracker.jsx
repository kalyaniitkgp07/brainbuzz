import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuestionTracker({ game, questions, visitedIds, currentPath, onReset }) {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-800/50 p-8 rounded-[40px] border-2 border-slate-800 h-full flex flex-col">
            <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Question Tracker</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {questions.map((q, idx) => {
                        const isVisited = visitedIds.includes(q.id);
                        return (
                            <button
                                key={q.id}
                                onClick={() => navigate(`/${game.toLowerCase()}/question/${q.id}`)}
                                className={`
                                    aspect-square rounded-2xl flex items-center justify-center text-xl font-black transition-all
                                    ${isVisited
                                        ? 'bg-slate-700/50 text-slate-500 border-2 border-slate-700/50 grayscale'
                                        : 'bg-yellow-400 text-slate-900 hover:scale-110 shadow-[0_0_15px_rgba(251,191,36,0.2)]'}
                                `}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>
                {questions.length === 0 && (
                    <p className="text-slate-500 italic">No questions available.</p>
                )}
            </div>

            {onReset && (
                <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-center">
                    <button
                        onClick={onReset}
                        className="text-slate-500 hover:text-red-400 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
                    >
                        <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Clear Progress
                    </button>
                </div>
            )}
        </div>
    );
}

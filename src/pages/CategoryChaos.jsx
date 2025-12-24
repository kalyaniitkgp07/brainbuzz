import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function CategoryChaos() {
    const { questions } = useGame();
    const { id } = useParams();
    const QUESTIONS = questions.CategoryChaos || [];
    const [view, setView] = useState('rules'); // rules, game
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [revealedCount, setRevealedCount] = useState(0);
    const navigate = useNavigate();

    const currentQuestion = QUESTIONS[currentQIndex];

    useEffect(() => {
        if (id && QUESTIONS.length > 0) {
            const index = QUESTIONS.findIndex(q => q.id === parseInt(id));
            if (index !== -1) {
                setCurrentQIndex(index);
                setView('game');
                setRevealedCount(0);
            }
        } else if (!id) {
            setView('rules');
        }
    }, [id, QUESTIONS]);

    const handleNextQuestion = () => {
        if (currentQIndex < QUESTIONS.length - 1) {
            const nextId = QUESTIONS[currentQIndex + 1]?.id;
            if (nextId) navigate(`/category-chaos/${nextId}`);
        } else {
            navigate('/');
        }
    };

    if (QUESTIONS.length === 0) {
        return (
            <div className="max-w-4xl text-center p-12 bg-slate-800 rounded-3xl border-b-8 border-red-500">
                <h2 className="text-4xl font-black text-red-500 mb-6 uppercase">No questions available</h2>
                <p className="text-xl text-slate-300 mb-8">An admin needs to add questions for this game in the settings.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-full font-bold uppercase"
                >
                    Back to Lobby
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl animate-fade-in py-12">
            {view === 'rules' ? (
                <div className="bg-slate-800 p-12 rounded-3xl shadow-2xl border-b-8 border-purple-500">
                    <h2 className="text-5xl font-black mb-8 text-purple-400 uppercase">Rules: Category Chaos</h2>
                    <p className="text-2xl mb-12 text-slate-300">
                        A category will be shown. Your goal is to name as many items belonging to that category as possible!
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => {
                                const firstId = QUESTIONS[0]?.id;
                                if (firstId) navigate(`/category-chaos/${firstId}`);
                            }}
                            className="bg-purple-500 text-white px-12 py-4 rounded-full text-3xl font-black hover:bg-purple-400 transition-all shadow-xl uppercase"
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="bg-slate-800 p-12 rounded-3xl shadow-2xl border-b-8 border-purple-500">
                        <h3 className="text-purple-400 text-xl font-bold mb-4 uppercase tracking-widest text-center">Category</h3>
                        <h2 className="text-6xl font-black text-white text-center uppercase mb-12 drop-shadow-lg">{currentQuestion.category}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentQuestion.items.map((item, i) => (
                                <div
                                    key={i}
                                    className={`p-6 rounded-2xl border-2 font-black text-2xl text-center transition-all duration-500 h-[80px] flex items-center justify-center ${revealedCount > i ? 'bg-white text-slate-900 border-white scale-105' : 'bg-slate-900 text-slate-700 border-slate-700 opacity-50'}`}
                                >
                                    {revealedCount > i ? item : '?'}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-800 p-8 rounded-3xl shadow-xl">
                        <div className="text-2xl font-black text-slate-400">
                            Revealed: <span className="text-purple-400">{revealedCount}</span> / {currentQuestion.items.length}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => { if (revealedCount < currentQuestion.items.length) setRevealedCount(revealedCount + 1); }}
                                disabled={revealedCount >= currentQuestion.items.length}
                                className={`px-8 py-4 rounded-xl font-black text-xl transition-all uppercase ${revealedCount >= currentQuestion.items.length ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`}
                            >
                                Reveal Next
                            </button>

                            {revealedCount >= currentQuestion.items.length && (
                                <button
                                    onClick={handleNextQuestion}
                                    className="bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-xl font-black text-xl shadow-lg uppercase animate-bounce"
                                >
                                    {currentQIndex < QUESTIONS.length - 1 ? 'Next Category →' : 'Finish Game 🏠'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

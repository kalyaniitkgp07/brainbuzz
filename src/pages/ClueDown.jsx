import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../data/gameData';

export default function ClueDown() {
    const [view, setView] = useState('rules'); // rules, question, answer
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [hintLevel, setHintLevel] = useState(0); // 0 = none, 1 = first, 2 = second, 3 = third
    const navigate = useNavigate();

    const currentQuestion = QUESTIONS[currentQIndex];

    const showQuestion = (index) => {
        setCurrentQIndex(index);
        setHintLevel(1);
        setView('question');
    };

    const nextHint = () => {
        if (hintLevel < 3) setHintLevel(hintLevel + 1);
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* RULES VIEW */}
            {view === 'rules' && (
                <div className="max-w-4xl w-full bg-slate-800 p-12 rounded-3xl shadow-2xl border-b-8 border-yellow-500">
                    <h2 className="text-5xl font-black mb-8 text-yellow-400">Rules: ClueDown</h2>
                    <ul className="text-2xl space-y-6 mb-12">
                        <li>🎯 <span className="text-yellow-400 font-bold">Goal:</span> Guess the object in 3 hints.</li>
                        <li>🏆 <span className="text-green-400 font-bold">20 pts:</span> Answer after Hint 1</li>
                        <li>🏆 <span className="text-blue-400 font-bold">15 pts:</span> Answer after Hint 2</li>
                        <li>🏆 <span className="text-orange-400 font-bold">10 pts:</span> Answer after Hint 3</li>
                    </ul>
                    <div className="flex justify-center">
                        <button
                            onClick={() => showQuestion(0)}
                            className="bg-yellow-400 text-slate-900 px-12 py-4 rounded-full text-3xl font-black hover:bg-yellow-300 transition-colors"
                        >
                            START GAME
                        </button>
                    </div>
                </div>
            )}

            {/* QUESTION VIEW */}
            {view === 'question' && (
                <div className="w-full max-w-5xl h-[600px] bg-slate-800 rounded-3xl p-12 flex flex-col justify-between shadow-2xl relative">
                    <div>
                        <h3 className="text-yellow-500 text-2xl font-bold mb-8 italic uppercase tracking-widest">Round {currentQuestion.id}</h3>
                        <div className="space-y-6">
                            {currentQuestion.hints.map((hint, i) => (
                                <div
                                    key={i}
                                    className={`text-3xl p-6 rounded-xl border-2 transition-all duration-500 ${hintLevel > i ? 'opacity-100 translate-x-0 border-yellow-400 bg-slate-700' : 'opacity-0 -translate-x-10 pointer-events-none'}`}
                                >
                                    <span className="text-yellow-400 mr-4 font-black">{i + 1}.</span> {hint}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={nextHint}
                            disabled={hintLevel >= 3}
                            className={`px-8 py-4 rounded-xl font-bold text-xl ${hintLevel >= 3 ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                        >
                            Next Hint
                        </button>
                        <button
                            onClick={() => setView('answer')}
                            className="bg-green-500 hover:bg-green-400 text-white px-12 py-4 rounded-xl font-black text-2xl shadow-lg"
                        >
                            REVEAL ANSWER
                        </button>
                    </div>
                </div>
            )}

            {/* ANSWER VIEW */}
            {view === 'answer' && (
                <div className="w-full max-w-6xl flex gap-8 animate-slide-up">
                    {/* Left Side: Hints */}
                    <div className="w-1/2 bg-slate-800 p-10 rounded-3xl border-l-8 border-green-500">
                        <h2 className="text-3xl font-bold text-green-400 mb-6 uppercase">The Clues</h2>
                        <div className="space-y-4">
                            {currentQuestion.hints.map((hint, i) => (
                                <p key={i} className="text-xl bg-slate-700 p-4 rounded-lg"><span className="font-bold text-green-500">#</span> {hint}</p>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Answer + Image */}
                    <div className="w-1/2 bg-white rounded-3xl p-10 text-slate-900 flex flex-col items-center justify-center shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-400 uppercase mb-2">The Answer is...</h2>
                        <h1 className="text-6xl font-black text-slate-900 mb-8">{currentQuestion.answer}</h1>
                        <img
                            src={currentQuestion.image}
                            alt={currentQuestion.answer}
                            className="w-full h-64 object-cover rounded-2xl shadow-inner mb-8"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    if (currentQIndex < QUESTIONS.length - 1) {
                                        showQuestion(currentQIndex + 1);
                                    } else {
                                        navigate('/');
                                    }
                                }}
                                className="bg-green-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-400"
                            >
                                Next Round →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

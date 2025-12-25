import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import QuestionTracker from '../components/QuestionTracker';

export default function ClueDown() {
    const { questions, visitedQuestions, markAsVisited, resetVisited } = useGame();
    const { id } = useParams();
    const { pathname } = useLocation();
    const QUESTIONS = questions.ClueDown || [];
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [hintLevel, setHintLevel] = useState(0);
    const navigate = useNavigate();

    const currentQuestion = QUESTIONS[currentQIndex];

    // Determine view from URL
    const isRules = pathname.includes('/rules');
    const isAnswer = pathname.includes('/answer/');
    const isQuestion = pathname.includes('/question/');

    useEffect(() => {
        if (id && QUESTIONS.length > 0) {
            const index = QUESTIONS.findIndex(q => q.id === parseInt(id));
            if (index !== -1) {
                setCurrentQIndex(index);
                if (hintLevel === 0) setHintLevel(1);
                markAsVisited('ClueDown', QUESTIONS[index].id);
            }
        } else if (isRules) {
            setHintLevel(0);
        }
    }, [id, QUESTIONS, isRules, isQuestion]);

    const showQuestion = (index) => {
        const questionId = QUESTIONS[index]?.id;
        if (questionId) navigate(`/cluedown/question/${questionId}`);
    };

    const nextHint = () => {
        if (hintLevel < 3) setHintLevel(hintLevel + 1);
    };

    if (QUESTIONS.length === 0) {
        return (
            <div className="max-w-4xl text-center p-12 bg-slate-800 rounded-3xl border-b-8 border-red-500">
                <h2 className="text-4xl font-black text-red-500 mb-6 uppercase">No questions available</h2>
                <p className="text-xl text-slate-300 mb-8">An admin needs to add questions for this game in the settings.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-full font-bold uppercase transition-all hover:scale-105"
                >
                    Back to Lobby
                </button>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center animate-fade-in">
            {/* RULES VIEW */}
            {isRules && (
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800 p-12 rounded-[40px] shadow-2xl border-b-8 border-yellow-500 flex flex-col justify-between">
                        <div>
                            <h2 className="text-5xl font-black mb-8 text-yellow-400 uppercase tracking-tight">Rules: ClueDown</h2>
                            <ul className="text-2xl space-y-6 mb-12">
                                <li>🎯 <span className="text-yellow-400 font-bold">Goal:</span> Guess the object in 3 hints.</li>
                                <li>🏆 <span className="text-green-400 font-bold">20 pts:</span> Answer after Hint 1</li>
                                <li>🏆 <span className="text-blue-400 font-bold">15 pts:</span> Answer after Hint 2</li>
                                <li>🏆 <span className="text-orange-400 font-bold">10 pts:</span> Answer after Hint 3</li>
                            </ul>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => showQuestion(0)}
                                className="w-full bg-yellow-400 text-slate-900 px-12 py-6 rounded-[30px] text-3xl font-black hover:bg-yellow-300 transition-all shadow-[0_15px_30px_rgba(251,191,36,0.3)] uppercase active:scale-95"
                            >
                                START GAME
                            </button>
                        </div>
                    </div>

                    <QuestionTracker
                        game="ClueDown"
                        questions={QUESTIONS}
                        visitedIds={visitedQuestions.ClueDown || []}
                        onReset={() => resetVisited('ClueDown')}
                    />
                </div>
            )}

            {/* QUESTION VIEW */}
            {isQuestion && currentQuestion && (
                <div className="w-full max-w-5xl h-[700px] bg-slate-800 rounded-3xl p-10 flex flex-col shadow-2xl relative border-b-8 border-blue-500 overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex-none">
                            {currentQuestion.title && (
                                <div className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-black uppercase mb-4 w-fit shadow-md">
                                    {currentQuestion.title}
                                </div>
                            )}
                            <h3 className="text-blue-400 text-2xl font-bold mb-6 italic uppercase tracking-widest">Question {currentQuestion.id} of {QUESTIONS.length}</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar mb-8">
                            {currentQuestion.hints.map((hint, i) => (
                                <div
                                    key={i}
                                    className={`text-2xl p-6 rounded-2xl border-2 transition-all duration-700 ${hintLevel > i ? 'opacity-100 translate-x-0 border-yellow-400 bg-slate-700 shadow-lg' : 'opacity-0 -translate-x-20 pointer-events-none'}`}
                                >
                                    <span className="text-yellow-400 mr-4 font-black">{i + 1}.</span> {hint}
                                </div>
                            ))}
                        </div>

                        <div className="flex-none flex justify-between items-center bg-slate-800/90 pt-4 border-t border-slate-700">
                            <button
                                onClick={nextHint}
                                disabled={hintLevel >= 3}
                                className={`px-8 py-4 rounded-xl font-bold text-xl transition-all ${hintLevel >= 3 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95 uppercase'}`}
                            >
                                Next Hint
                            </button>
                            <button
                                onClick={() => navigate(`/cluedown/answer/${currentQuestion.id}`)}
                                className="bg-green-500 hover:bg-green-400 text-white px-12 py-4 rounded-xl font-black text-2xl shadow-xl active:scale-95 uppercase"
                            >
                                REVEAL ANSWER
                            </button>
                        </div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                </div>
            )}

            {/* ANSWER VIEW */}
            {isAnswer && currentQuestion && (
                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 animate-slide-up">
                    {/* Left Side: Hints */}
                    <div className="md:w-1/2 bg-slate-800 p-10 rounded-3xl border-l-8 border-green-500 shadow-2xl">
                        <h2 className="text-3xl font-bold text-green-400 mb-6 uppercase tracking-wider">The Clues</h2>
                        <div className="space-y-4">
                            {currentQuestion.hints.map((hint, i) => (
                                <p key={i} className="text-xl bg-slate-900/50 p-4 rounded-xl border border-slate-700"><span className="font-bold text-green-500 mr-2">#</span> {hint}</p>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Answer + Image */}
                    <div className="md:w-1/2 bg-white rounded-3xl p-10 text-slate-900 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                        <h2 className="text-2xl font-bold text-slate-400 uppercase mb-2 tracking-widest relative z-10">The Answer is...</h2>
                        <h1 className="text-6xl font-black text-slate-900 mb-8 relative z-10 drop-shadow-sm uppercase">{currentQuestion.answer}</h1>

                        {currentQuestion.image && (
                            <div className="w-full h-80 relative overflow-hidden rounded-2xl shadow-inner mb-8 border-4 border-slate-100 flex items-center justify-center bg-slate-100">
                                {/* Blurred Background Layer */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110"
                                    style={{ backgroundImage: `url(${currentQuestion.image})` }}
                                />
                                {/* Main Sharp Image */}
                                <img
                                    src={currentQuestion.image}
                                    alt={currentQuestion.answer}
                                    className="relative z-10 max-w-full max-h-full object-contain"
                                />
                            </div>
                        )}

                        <div className="flex gap-4 relative z-10 w-full">
                            <button
                                onClick={() => navigate('/cluedown/rules')}
                                className="flex-1 bg-green-500 text-white px-8 py-5 rounded-2xl font-black text-2xl hover:bg-green-400 active:scale-95 transition-all shadow-xl uppercase"
                            >
                                Return to Rules & Tracker →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

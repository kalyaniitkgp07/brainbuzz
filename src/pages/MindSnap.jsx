import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import QuestionTracker from '../components/QuestionTracker';

export default function MindSnap() {
    const { questions, visitedQuestions, markAsVisited, resetVisited } = useGame();
    const { id } = useParams();
    const { pathname } = useLocation();
    const QUESTIONS = questions.MindSnap || [];
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [showClue, setShowClue] = useState(false);
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
                setShowClue(false);
                markAsVisited('MindSnap', QUESTIONS[index].id);
            }
        }
    }, [id, QUESTIONS, isQuestion]);

    const showQuestion = (index) => {
        const questionId = QUESTIONS[index]?.id;
        if (questionId) navigate(`/mindsnap/question/${questionId}`);
    };

    if (QUESTIONS.length === 0) {
        return (
            <div className="max-w-4xl text-center p-12 bg-slate-800 rounded-3xl border-b-8 border-red-500">
                <h2 className="text-4xl font-black text-red-500 mb-6 uppercase">No riddles available</h2>
                <p className="text-xl text-slate-300 mb-8">An admin needs to add riddles for MindSnap in the settings.</p>
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
                            <h2 className="text-5xl font-black mb-8 text-yellow-400 uppercase tracking-tight">Rules: MindSnap</h2>
                            <p className="text-2xl text-slate-300 mb-8">Test your logic and lateral thinking with these brain-teasing riddles!</p>
                            <ul className="text-2xl space-y-4 mb-12">
                                <li>🧩 <span className="text-yellow-400 font-bold">Riddle:</span> Read the question carefully.</li>
                                <li>💡 <span className="text-blue-400 font-bold">Clue:</span> Use the clue if you're stuck (optional).</li>
                                <li>🏆 <span className="text-green-400 font-bold">Goal:</span> Solve it before revealing the answer!</li>
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
                        game="MindSnap"
                        questions={QUESTIONS}
                        visitedIds={visitedQuestions.MindSnap || []}
                        onReset={() => resetVisited('MindSnap')}
                    />
                </div>
            )}

            {/* QUESTION VIEW */}
            {isQuestion && currentQuestion && (
                <div className="w-full max-w-5xl bg-slate-800 rounded-3xl p-10 flex flex-col shadow-2xl border-b-8 border-blue-500 overflow-hidden min-h-[600px]">
                    <div className="flex justify-between items-start mb-8">
                        <h3 className="text-blue-400 text-2xl font-bold italic uppercase tracking-widest">Riddle {currentQuestion.id} of {QUESTIONS.length}</h3>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-4xl italic">
                            "{currentQuestion.question}"
                        </h2>

                        {currentQuestion.question_image && (
                            <img
                                src={currentQuestion.question_image}
                                alt="Riddle Hint"
                                className="max-h-64 rounded-2xl shadow-2xl border-4 border-slate-700 object-contain"
                            />
                        )}

                        {currentQuestion.clue && (
                            <div className="w-full max-w-2xl">
                                {showClue ? (
                                    <div className="bg-blue-900/40 p-6 rounded-2xl border-2 border-dashed border-blue-400 animate-pulse-slow">
                                        <p className="text-xl text-blue-200"><span className="font-black">CLUE:</span> {currentQuestion.clue}</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowClue(true)}
                                        className="text-blue-400 font-bold hover:text-blue-300 border-b-2 border-blue-400/30 pb-1 uppercase tracking-widest"
                                    >
                                        Reveal Clue?
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => navigate(`/mindsnap/answer/${currentQuestion.id}`)}
                            className="bg-green-500 hover:bg-green-400 text-white px-16 py-5 rounded-2xl font-black text-3xl shadow-xl active:scale-95 transition-all uppercase"
                        >
                            REVEAL ANSWER
                        </button>
                    </div>
                </div>
            )}

            {/* ANSWER VIEW */}
            {isAnswer && currentQuestion && (
                <div className="w-full max-w-6xl flex flex-col items-center gap-8 animate-slide-up">
                    <div className="w-full bg-slate-800 p-10 rounded-3xl border-t-8 border-green-500 shadow-2xl text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest mb-4">The Riddle was:</p>
                        <h3 className="text-2xl text-slate-300 italic mb-10">"{currentQuestion.question}"</h3>

                        <div className="flex flex-col items-center">
                            <h2 className="text-3xl font-black text-green-400 uppercase mb-2">The Answer is...</h2>
                            <h1 className="text-7xl font-black text-white mb-8 drop-shadow-[0_5px_15px_rgba(34,197,94,0.4)] uppercase">
                                {currentQuestion.answer}
                            </h1>

                            {currentQuestion.answer_image && (
                                <div className="w-full max-w-2xl h-80 relative overflow-hidden rounded-[40px] shadow-2xl border-4 border-white/10 mb-8 flex items-center justify-center bg-slate-900/50">
                                    {/* Blurred Background Layer */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110"
                                        style={{ backgroundImage: `url(${currentQuestion.answer_image})` }}
                                    />
                                    {/* Main Sharp Image */}
                                    <img
                                        src={currentQuestion.answer_image}
                                        alt={currentQuestion.answer}
                                        className="relative z-10 max-w-full max-h-full object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/mindsnap/rules')}
                            className="bg-green-500 text-white px-12 py-5 rounded-2xl font-black text-2xl hover:bg-green-400 active:scale-95 transition-all shadow-xl uppercase w-full max-w-md"
                        >
                            Return →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

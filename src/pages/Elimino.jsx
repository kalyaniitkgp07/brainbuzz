import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import QuestionTracker from '../components/QuestionTracker';
import confetti from 'canvas-confetti';

const SOUNDS = {
    correct: '/audio/correct.mp3',
    wrong: '/audio/wrong.mp3'
};

export default function Elimino() {
    const { questions, visitedQuestions, markAsVisited, resetVisited } = useGame();
    const { id } = useParams();
    const { pathname, state } = useLocation();
    const QUESTIONS = questions.Elimino || [];
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [eliminatedIndices, setEliminatedIndices] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const currentQuestion = QUESTIONS[currentQIndex];
    const userResult = state?.result; // 'correct' or 'wrong'

    // Determine view from URL
    const isRules = pathname.includes('/rules');
    const isAnswer = pathname.includes('/answer/');
    const isQuestion = pathname.includes('/question/');

    useEffect(() => {
        if (id && QUESTIONS.length > 0) {
            const index = QUESTIONS.findIndex(q => q.id === parseInt(id));
            if (index !== -1) {
                setCurrentQIndex(index);
                setEliminatedIndices([]);
                setIsProcessing(false);
            }
        }

        if (isQuestion && currentQuestion) {
            markAsVisited('Elimino', currentQuestion.id);
        }
    }, [id, QUESTIONS, isQuestion, currentQuestion]);

    const playSound = (type) => {
        const audio = new Audio(SOUNDS[type]);
        audio.play().catch(e => console.log("Audio play blocked", e));
    };

    const handleOptionSelect = (option) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const answerText = typeof currentQuestion.answer === 'object'
            ? currentQuestion.answer.text
            : currentQuestion.answer;

        const isCorrect = option === answerText;

        if (isCorrect) {
            playSound('correct');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22c55e', '#ffffff', '#fbbf24']
            });
        } else {
            playSound('wrong');
        }

        // Short delay to let sound/visual sink in before navigating
        setTimeout(() => {
            navigate(`/elimino/answer/${currentQuestion.id}`, {
                state: { result: isCorrect ? 'correct' : 'wrong' }
            });
        }, 1200);
    };

    const handleEliminate = () => {
        if (currentQuestion.eliminated && currentQuestion.eliminated.length > 0) {
            setEliminatedIndices(currentQuestion.eliminated);
        } else {
            // Randomly eliminate 2 wrong options
            const wrongIndices = currentQuestion.options
                .map((_, i) => i)
                .filter(i => {
                    const optionText = currentQuestion.options[i];
                    const answerText = typeof currentQuestion.answer === 'object'
                        ? currentQuestion.answer.text
                        : currentQuestion.answer;
                    return optionText !== answerText;
                });

            const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
            setEliminatedIndices(shuffled.slice(0, 2));
        }
    };

    const showQuestion = (index) => {
        const questionId = QUESTIONS[index]?.id;
        if (questionId) navigate(`/elimino/question/${questionId}`);
    };

    if (QUESTIONS.length === 0) {
        return (
            <div className="max-w-4xl text-center p-12 bg-slate-800 rounded-3xl border-b-8 border-red-500">
                <h2 className="text-4xl font-black text-red-500 mb-6 uppercase">No questions available</h2>
                <p className="text-xl text-slate-300 mb-8">An admin needs to add questions for Elimino in the settings.</p>
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
        <div className="w-full max-w-5xl animate-fade-in py-12 flex flex-col items-center">
            {/* RULES VIEW */}
            {isRules && (
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800 p-12 rounded-[40px] shadow-2xl border-b-8 border-purple-500 flex flex-col justify-between">
                        <div>
                            <h2 className="text-5xl font-black mb-8 text-purple-400 uppercase tracking-tight">Rules: Elimino</h2>
                            <div className="text-2xl mb-12 text-slate-300 space-y-6">
                                <p>Pick the correct answer from four options!</p>
                                <ul className="text-left max-w-md mx-auto space-y-4 bg-slate-900/50 p-6 rounded-2xl border-2 border-slate-700">
                                    <li>💡 <span className="text-white font-bold">50/50:</span> You can eliminate two wrong options if you're stuck.</li>
                                    <li>🏆 <span className="text-green-400 font-bold">Goal:</span> Identify the one true answer.</li>
                                </ul>
                            </div>
                        </div>
                        <button
                            onClick={() => showQuestion(0)}
                            className="w-full bg-purple-500 text-white px-12 py-6 rounded-[30px] text-3xl font-black hover:bg-purple-400 transition-all shadow-[0_15px_30px_rgba(168,85,247,0.3)] uppercase active:scale-95"
                        >
                            Start Game
                        </button>
                    </div>

                    <QuestionTracker
                        game="Elimino"
                        questions={QUESTIONS}
                        visitedIds={visitedQuestions.Elimino || []}
                        onReset={() => resetVisited('Elimino')}
                    />
                </div>
            )}

            {/* QUESTION VIEW */}
            {isQuestion && currentQuestion && (
                <div className="w-full flex flex-col gap-8">
                    <div className="bg-slate-800 p-12 rounded-3xl shadow-2xl border-b-8 border-purple-500 text-center">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-purple-400 text-xl font-bold uppercase tracking-widest italic">Question {currentQuestion.id} of {QUESTIONS.length}</h3>
                            <button
                                onClick={handleEliminate}
                                disabled={eliminatedIndices.length > 0 || isProcessing}
                                className={`px-6 py-3 rounded-xl font-black text-sm transition-all uppercase shadow-lg ${eliminatedIndices.length > 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white animate-pulse-slow'}`}
                            >
                                ⚡ Eliminate 2
                            </button>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-12 drop-shadow-lg leading-tight">
                            "{currentQuestion.question}"
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            {currentQuestion.options.map((option, i) => {
                                const isEliminated = eliminatedIndices.includes(i);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={isEliminated || isProcessing}
                                        className={`p-6 rounded-2xl border-4 font-black text-2xl transition-all duration-300 min-h-[100px] flex items-center justify-center ${isEliminated ? 'opacity-0 scale-90 pointer-events-none' : 'bg-slate-700/30 text-white border-slate-700 hover:border-purple-500 hover:bg-slate-700/50 hover:scale-[1.02] active:scale-95'}`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ANSWER VIEW */}
            {isAnswer && currentQuestion && (
                <div className="w-full space-y-8 animate-slide-up">
                    {/* Feedback Header */}
                    <div className={`w-full p-6 rounded-3xl text-center font-black text-4xl uppercase shadow-2xl border-b-4 ${userResult === 'correct' ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-red-500/20 text-red-500 border-red-500'}`}>
                        {userResult === 'correct' ? '🎉 Correct! Well Done!' : '❌ Not Quite Right!'}
                    </div>

                    <div className="w-full bg-slate-800 p-12 rounded-3xl shadow-2xl border-b-8 border-green-500 text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest mb-4 italic">The Question was:</p>
                        <h3 className="text-2xl text-slate-200 mb-10 italic">"{currentQuestion.question}"</h3>

                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-green-400 uppercase mb-4">The Correct Answer is...</h2>
                            <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_10px_20px_rgba(34,197,94,0.4)] uppercase">
                                {typeof currentQuestion.answer === 'object' ? currentQuestion.answer.text : currentQuestion.answer}
                            </h1>
                        </div>

                        {(typeof currentQuestion.answer === 'object' && currentQuestion.answer.image_url) && (
                            <div className="flex justify-center mb-10">
                                <img
                                    src={currentQuestion.answer.image_url}
                                    alt="Answer Reference"
                                    className="max-h-80 rounded-3xl border-4 border-white/10 shadow-2xl object-contain"
                                />
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/elimino/rules')}
                            className="bg-green-500 hover:bg-green-400 text-white px-16 py-5 rounded-2xl font-black text-3xl shadow-xl transition-all uppercase w-full max-w-md"
                        >
                            Return to Rules & Tracker →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

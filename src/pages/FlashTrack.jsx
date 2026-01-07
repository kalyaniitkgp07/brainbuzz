import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import QuestionTracker from '../components/QuestionTracker';

export default function FlashTrack() {
    const { questions, visitedQuestions, markAsVisited, resetVisited } = useGame();
    const { id } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const QUESTIONS = questions.FlashTrack || [];

    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAudioPaused, setIsAudioPaused] = useState(false);
    const [visibleImages, setVisibleImages] = useState([]);
    const [visibleEmojis, setVisibleEmojis] = useState([]);
    const [mediaDuration, setMediaDuration] = useState(0);

    const videoRef = useRef(null);
    const audioRef = useRef(null);

    const isRules = pathname.includes('/rules');
    const isQuestion = pathname.includes('/question/');
    const isAnswer = pathname.includes('/answer/');

    const currentQuestion = QUESTIONS.find(q => q.id === parseInt(id)) || QUESTIONS[currentQIndex];

    useEffect(() => {
        if (id) {
            const idx = QUESTIONS.findIndex(q => q.id === parseInt(id));
            if (idx !== -1) {
                setCurrentQIndex(idx);
                markAsVisited('FlashTrack', QUESTIONS[idx].id);
            }
        }
    }, [id, QUESTIONS, isQuestion]);

    // Handle reveal logic for images and emojis
    useEffect(() => {
        let timers = [];
        if (isPlaying) {
            const images = currentQuestion.images || [];
            const emojis = currentQuestion.emojis || [];
            const totalItems = images.length + emojis.length;

            if (totalItems > 0) {
                const interval = mediaDuration > 0 ? (mediaDuration * 1000) / totalItems : 1000;

                images.forEach((img, idx) => {
                    const timer = setTimeout(() => {
                        setVisibleImages(prev => [...new Set([...prev, img])]);
                    }, idx * interval);
                    timers.push(timer);
                });

                emojis.forEach((emoji, idx) => {
                    const timer = setTimeout(() => {
                        setVisibleEmojis(prev => [...new Set([...prev, emoji])]);
                    }, (images.length + idx) * interval);
                    timers.push(timer);
                });
            }
        }
        return () => timers.forEach(clearTimeout);
    }, [isPlaying, currentQuestion, mediaDuration]);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isModalOpen]);

    useEffect(() => {
        if (isModalOpen && audioRef.current && currentQuestion.audioSpeed) {
            audioRef.current.playbackRate = currentQuestion.audioSpeed;
        }
    }, [isModalOpen, currentQuestion.audioSpeed]);

    const handleStart = () => {
        setIsModalOpen(true);
        setIsPlaying(true);
        setVisibleImages([]);
        setVisibleEmojis([]);

        if (videoRef.current) {
            videoRef.current.playbackRate = currentQuestion.videoSpeed || 1;
            videoRef.current.muted = currentQuestion.videoMuted || false;
            videoRef.current.play();
        }
        if (audioRef.current) {
            audioRef.current.playbackRate = currentQuestion.audioSpeed || 1;
            audioRef.current.play();
        }
    };

    const handleStop = () => {
        setIsPlaying(false);
        setIsModalOpen(false);
        if (videoRef.current) videoRef.current.pause();
        if (audioRef.current) audioRef.current.pause();
    };

    const toggleAudioPlayback = () => {
        if (audioRef.current) {
            if (isAudioPaused) {
                audioRef.current.play();
                setIsAudioPaused(false);
            } else {
                audioRef.current.pause();
                setIsAudioPaused(true);
            }
        }
    };

    const getAnswerTextSize = (text, hasImage) => {
        const len = text.length;
        if (hasImage) {
            if (len > 30) return 'text-2xl md:text-3xl';
            if (len > 15) return 'text-3xl md:text-4xl';
            return 'text-4xl md:text-5xl';
        } else {
            if (len > 40) return 'text-3xl md:text-4xl';
            if (len > 25) return 'text-4xl md:text-5xl';
            if (len > 15) return 'text-5xl md:text-6xl';
            return 'text-6xl md:text-7xl';
        }
    };

    const onMediaLoaded = (e) => {
        const duration = e.target.duration;
        if (duration > mediaDuration) setMediaDuration(duration);
    };

    if (!currentQuestion) return <div>No Questions Found</div>;

    if (isRules) {
        return (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <div className="p-8 bg-slate-900/50 backdrop-blur-xl rounded-[40px] border-2 border-slate-800 shadow-2xl flex flex-col justify-between">
                    <div>
                        <h1 className="text-6xl font-black text-yellow-400 mb-8 uppercase italic tracking-tighter text-center">FlashTrack</h1>
                        <div className="space-y-6 text-xl text-slate-300 mb-8">
                            <p className="flex items-center gap-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                                <span className="bg-yellow-400 text-slate-900 w-10 h-10 rounded-full flex items-center justify-center font-black">1</span>
                                Identify the subject from a fast-paced media mix!
                            </p>
                            <p className="flex items-center gap-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                                <span className="bg-yellow-400 text-slate-900 w-10 h-10 rounded-full flex items-center justify-center font-black">2</span>
                                Watch the video or listen to the audio carefully.
                            </p>
                            <p className="flex items-center gap-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                                <span className="bg-yellow-400 text-slate-900 w-10 h-10 rounded-full flex items-center justify-center font-black">3</span>
                                Images will reveal sequentially as the media plays.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/flashtrack/question/${currentQuestion.id}`)}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black py-6 rounded-3xl text-3xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(251,191,36,0.3)] uppercase"
                    >
                        Start Round
                    </button>
                </div>

                <QuestionTracker
                    game="FlashTrack"
                    questions={QUESTIONS}
                    visitedIds={visitedQuestions.FlashTrack || []}
                    onReset={() => resetVisited('FlashTrack')}
                />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto space-y-8 p-4">
            {/* Type Header */}
            <div className="text-center">
                <span className="bg-yellow-400/10 text-yellow-400 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest border border-yellow-400/20">
                    {currentQuestion.type}
                </span>
                <h2 className="text-4xl font-black text-white mt-4 uppercase tracking-tight">{currentQuestion.title}</h2>
            </div>

            <div className={`grid gap-8 ${isAnswer ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-5xl mx-auto'}`}>
                {/* Left Column: Media Container */}
                <div className="space-y-6">
                    <div className="relative aspect-video bg-slate-900 rounded-[40px] overflow-hidden border-2 border-slate-800 shadow-2xl group">
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20">
                            <button
                                onClick={handleStart}
                                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 p-10 rounded-full font-black text-4xl shadow-2xl transition-all hover:scale-110 flex items-center justify-center group"
                            >
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </button>
                            <p className="mt-6 text-slate-400 font-black uppercase tracking-widest">Click to Start Media</p>
                        </div>

                        {/* Hidden Media Elements (for metadata & control) */}
                        <div className="hidden">
                            {currentQuestion.videoUrl && (
                                <video
                                    src={currentQuestion.videoUrl}
                                />
                            )}
                            {currentQuestion.audioUrl && (
                                <audio
                                    src={currentQuestion.audioUrl}
                                />
                            )}
                        </div>
                    </div>

                    {isQuestion && (
                        <div className="flex justify-center uppercase">
                            <button
                                onClick={() => navigate(`/flashtrack/answer/${currentQuestion.id}`)}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase transition-all tracking-widest border border-slate-700"
                            >
                                Reveal Answer
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Answer Section */}
                {isAnswer && (
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20 text-center space-y-6 animate-in slide-in-from-right duration-700 h-full flex flex-col justify-center">
                        <div className="space-y-4">
                            <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm">Correct Answer</h3>
                            <p className={`${getAnswerTextSize(currentQuestion.answer, !!currentQuestion.answerImage)} font-black text-white uppercase leading-tight`}>
                                {currentQuestion.answer}
                            </p>
                        </div>

                        {currentQuestion.answerImage && (
                            <div className="relative group w-full max-w-2xl mx-auto h-72 overflow-hidden rounded-[30px] border-4 border-yellow-400 shadow-2xl bg-white/5 flex items-center justify-center">
                                {/* Blurred Background Layer */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                                    style={{ backgroundImage: `url(${currentQuestion.answerImage})` }}
                                />
                                {/* Glow Effect Background */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                {/* Main Sharp Image */}
                                <img
                                    src={currentQuestion.answerImage}
                                    alt="Answer"
                                    className="relative z-10 max-w-full max-h-full object-contain"
                                />
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                onClick={() => navigate('/flashtrack/rules')}
                                className="flex-1 bg-green-500 text-white px-8 py-5 rounded-2xl font-black text-2xl hover:bg-green-400 active:scale-95 transition-all shadow-xl uppercase"
                            >
                                Return →
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* MEDIA MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
                    {/* Background Blur Effect */}
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" />

                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-10">
                        <div className="flex flex-col">
                            <span className="text-yellow-400 font-black uppercase tracking-[0.3em] text-sm mb-1">{currentQuestion.type}</span>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">{currentQuestion.title}</h2>
                        </div>
                        <button
                            onClick={handleStop}
                            className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all hover:rotate-90"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Content Container */}
                    <div className="relative w-full max-w-7xl aspect-video bg-black/40 rounded-[40px] overflow-hidden border-2 border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center group">
                        {/* Video Layer */}
                        {currentQuestion.videoUrl && (
                            <video
                                ref={videoRef}
                                autoPlay
                                src={currentQuestion.videoUrl}
                                className="w-full h-full object-contain"
                                onLoadedMetadata={onMediaLoaded}
                                muted={currentQuestion.videoMuted || false}
                            />
                        )}

                        {/* Single Image Layer (when no video) */}
                        {!currentQuestion.videoUrl && currentQuestion.imageUrl && (
                            <img
                                src={currentQuestion.imageUrl}
                                alt="Question"
                                className="w-full h-full object-contain"
                                onLoad={onMediaLoaded}
                            />
                        )}

                        {/* Audio Visualizer Layer */}
                        {!currentQuestion.videoUrl && currentQuestion.audioUrl && (
                            <div className="relative flex flex-col items-center gap-8">
                                <audio
                                    ref={audioRef}
                                    autoPlay
                                    src={currentQuestion.audioUrl}
                                    onLoadedMetadata={onMediaLoaded}
                                />
                                {/* Subtle Visualizer */}
                                <div className="flex gap-2 items-end h-24">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 bg-yellow-400/60 rounded-full animate-bounce shadow-[0_0_10px_rgba(251,191,36,0.15)]"
                                            style={{ animationDelay: `${i * 0.05}s`, height: `${40 + Math.random() * 60}%` }}
                                        />
                                    ))}
                                </div>
                                {/* Status Text */}
                                <div className="text-center space-y-2">
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">Audio Playing</span>
                                    </div>
                                    <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Listen Carefully</p>
                                </div>
                                {/* Play/Pause Button */}
                                <button
                                    onClick={toggleAudioPlayback}
                                    className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all border border-white/20"
                                    title={isAudioPaused ? "Play Audio" : "Pause Audio"}
                                >
                                    {isAudioPaused ? (
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Image and Emoji Overlay Grid */}
                        {(visibleImages.length > 0 || visibleEmojis.length > 0) && (
                            <div className="absolute inset-0 z-10 p-8 grid grid-cols-2 md:grid-cols-3 gap-6 pointer-events-none">
                                {visibleImages.map((img, i) => (
                                    <div key={`img-${i}`} className="relative group/img animate-in fade-in zoom-in duration-700">
                                        <div className="absolute -inset-1 bg-white/20 blur opacity-25 rounded-3xl" />
                                        <img
                                            src={img}
                                            alt=""
                                            className="relative w-full h-full object-cover rounded-3xl border-2 border-white/20 shadow-2xl"
                                        />
                                    </div>
                                ))}
                                {visibleEmojis.map((emoji, i) => (
                                    <div key={`emoji-${i}`} className="relative flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-3xl border-2 border-yellow-400/30 shadow-2xl animate-in fade-in zoom-in duration-700">
                                        <span className="text-8xl">{emoji}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="absolute bottom-12 flex flex-col items-center gap-6 z-10">
                        <div className="flex gap-4">
                            <button
                                onClick={handleStop}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-10 py-4 rounded-2xl font-black text-xl border-2 border-red-500/30 transition-all active:scale-95 uppercase tracking-widest"
                            >
                                Stop Round
                            </button>
                            <button
                                onClick={() => {
                                    handleStop();
                                    navigate(`/flashtrack/answer/${currentQuestion.id}`);
                                }}
                                className="bg-green-500 hover:bg-green-400 text-white px-12 py-4 rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all active:scale-95 uppercase tracking-tighter"
                            >
                                Reveal Answer →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

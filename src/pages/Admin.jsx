import React, { useState } from 'react';
import { useGame, ALL_GAMES } from '../context/GameContext';

export default function Admin() {
    const { questions, addQuestion, updateQuestion, bulkAddQuestions, removeQuestion, clearQuestions, enabledGames, toggleGame } = useGame();
    const [activeGame, setActiveGame] = useState('ClueDown');
    const [editingId, setEditingId] = useState(null);

    // Form States
    const [clueDownForm, setClueDownForm] = useState({ title: '', hints: ['', '', ''], answer: '', image: '' });
    const [mindSnapForm, setMindSnapForm] = useState({ question: '', question_image: '', clue: '', answer: '', answer_image: '' });
    const [eliminoForm, setEliminoForm] = useState({ question: '', options: ['', '', '', ''], answer: '', eliminated: '' });
    const [flashTrackForm, setFlashTrackForm] = useState({
        type: 'MacroMatch',
        title: '',
        images: '',
        videoUrl: '',
        audioUrl: '',
        answer: '',
        answerImage: '',
        audioSpeed: '1',
        videoSpeed: '1',
        videoMuted: false
    });

    const handleAddClueDown = (e) => {
        e.preventDefault();
        if (clueDownForm.answer && clueDownForm.hints.every(h => h)) {
            if (editingId) {
                updateQuestion('ClueDown', editingId, clueDownForm);
                setEditingId(null);
            } else {
                addQuestion('ClueDown', clueDownForm);
            }
            setClueDownForm({ title: '', hints: ['', '', ''], answer: '', image: '' });
        }
    };

    const handleAddMindSnap = (e) => {
        e.preventDefault();
        if (mindSnapForm.question && mindSnapForm.answer) {
            if (editingId) {
                updateQuestion('MindSnap', editingId, mindSnapForm);
                setEditingId(null);
            } else {
                addQuestion('MindSnap', mindSnapForm);
            }
            setMindSnapForm({ question: '', question_image: '', clue: '', answer: '', answer_image: '' });
        }
    };

    const handleAddElimino = (e) => {
        e.preventDefault();
        if (eliminoForm.question && eliminoForm.answer && eliminoForm.options.every(o => o)) {
            const data = {
                question: eliminoForm.question,
                options: eliminoForm.options,
                answer: eliminoForm.answer,
                eliminated: eliminoForm.eliminated
                    ? eliminoForm.eliminated.split(',').map(s => parseInt(s.trim()))
                    : []
            };

            if (editingId) {
                updateQuestion('Elimino', editingId, data);
                setEditingId(null);
            } else {
                addQuestion('Elimino', data);
            }
            setEliminoForm({ question: '', options: ['', '', '', ''], answer: '', eliminated: '' });
        }
    };

    const handleAddFlashTrack = (e) => {
        e.preventDefault();

        const hasMedia = flashTrackForm.images.trim() || flashTrackForm.videoUrl.trim() || flashTrackForm.audioUrl.trim();

        if (!hasMedia) {
            alert("Please provide at least one media source: Images, Video URL, or Audio URL.");
            return;
        }

        if (flashTrackForm.title && flashTrackForm.answer) {
            const data = {
                ...flashTrackForm,
                images: flashTrackForm.images ? flashTrackForm.images.split(',').map(s => s.trim()).filter(s => s) : [],
                audioSpeed: parseFloat(flashTrackForm.audioSpeed) || 1,
                videoSpeed: parseFloat(flashTrackForm.videoSpeed) || 1
            };

            if (editingId) {
                updateQuestion('FlashTrack', editingId, data);
                setEditingId(null);
            } else {
                addQuestion('FlashTrack', data);
            }
            setFlashTrackForm({
                type: 'MacroMatch', title: '', images: '', videoUrl: '', audioUrl: '',
                answer: '', answerImage: '', audioSpeed: '1', videoSpeed: '1', videoMuted: false
            });
        }
    };

    const handleEdit = (q) => {
        setEditingId(q.id);
        if (activeGame === 'ClueDown') {
            setClueDownForm({
                title: q.title || '',
                hints: q.hints,
                answer: q.answer,
                image: q.image || ''
            });
        } else if (activeGame === 'MindSnap') {
            setMindSnapForm({
                question: q.question,
                question_image: q.question_image || '',
                clue: q.clue || '',
                answer: q.answer,
                answer_image: q.answer_image || ''
            });
        } else if (activeGame === 'Elimino') {
            setEliminoForm({
                question: q.question,
                options: q.options || ['', '', '', ''],
                answer: typeof q.answer === 'object' ? q.answer.text : q.answer,
                eliminated: q.eliminated ? q.eliminated.join(', ') : ''
            });
        } else if (activeGame === 'FlashTrack') {
            setFlashTrackForm({
                type: q.type || 'MacroMatch',
                title: q.title || '',
                images: Array.isArray(q.images) ? q.images.join(', ') : (q.images || ''),
                videoUrl: q.videoUrl || '',
                audioUrl: q.audioUrl || '',
                answer: q.answer,
                answerImage: q.answerImage || '',
                audioSpeed: q.audioSpeed?.toString() || '1',
                videoSpeed: q.videoSpeed?.toString() || '1',
                videoMuted: q.videoMuted || false
            });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setClueDownForm({ title: '', hints: ['', '', ''], answer: '', image: '' });
        setMindSnapForm({ question: '', question_image: '', clue: '', answer: '', answer_image: '' });
        setEliminoForm({ question: '', options: ['', '', '', ''], answer: '', eliminated: '' });
        setFlashTrackForm({
            type: 'MacroMatch', title: '', images: '', videoUrl: '', audioUrl: '',
            answer: '', answerImage: '', audioSpeed: '1', videoSpeed: '1', videoMuted: false
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!Array.isArray(data)) throw new Error("JSON must be an array of questions.");

                // Final validation could be added here based on activeGame
                bulkAddQuestions(activeGame, data);
            } catch (err) {
                alert("Failed to load JSON: " + err.message);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-12 animate-fade-in">

            {/* 1. Game Configuration */}
            <div className="bg-slate-800 p-8 rounded-3xl shadow-xl h-fit border-b-8 border-blue-500">
                <h2 className="text-2xl font-black mb-6 text-blue-400 uppercase">Game Visibility</h2>
                <div className="space-y-4">
                    {ALL_GAMES.map(game => (
                        <label key={game} className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-slate-700 transition-colors">
                            <input
                                type="checkbox"
                                checked={enabledGames.includes(game)}
                                onChange={() => toggleGame(game)}
                                className="w-6 h-6 rounded-md accent-blue-500"
                            />
                            <span className={`text-xl font-bold ${enabledGames.includes(game) ? 'text-white' : 'text-slate-500'}`}>{game}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 2. Question Editor */}
            <div className="md:col-span-2 space-y-8">
                <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border-b-8 border-yellow-500">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-yellow-400 uppercase">{activeGame} Editor</h2>
                            <p className="text-slate-500 text-sm italic">Add individually or bulk upload</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto items-end">
                            <label className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-all text-center flex items-center justify-center gap-2 h-[42px]">
                                📤 Bulk Upload
                                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                            </label>
                            <div className="flex-1 sm:flex-none">
                                <label htmlFor="game-select" className="block text-slate-400 text-[10px] font-black uppercase mb-1 ml-1 text-right">Game</label>
                                <select
                                    id="game-select"
                                    value={activeGame}
                                    onChange={(e) => setActiveGame(e.target.value)}
                                    className="bg-slate-900 text-white p-2 rounded-xl border-2 border-slate-700 outline-none focus:border-yellow-400 h-[42px] w-full"
                                >
                                    {ALL_GAMES.map(game => (
                                        <option key={game} value={game}>{game}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {activeGame === 'ClueDown' && (
                        <form onSubmit={handleAddClueDown} className="space-y-6">
                            <div>
                                <label htmlFor="clue-title" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Question Title</label>
                                <input
                                    id="clue-title"
                                    placeholder="Optional - e.g. Category, Era"
                                    value={clueDownForm.title}
                                    onChange={(e) => setClueDownForm({ ...clueDownForm, title: e.target.value })}
                                    className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {clueDownForm.hints.map((hint, i) => (
                                    <div key={i}>
                                        <label htmlFor={`hint-${i}`} className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Hint {i + 1}</label>
                                        <input
                                            id={`hint-${i}`}
                                            placeholder={`Description for hint ${i + 1}`}
                                            value={hint}
                                            onChange={(e) => {
                                                const newHints = [...clueDownForm.hints];
                                                newHints[i] = e.target.value;
                                                setClueDownForm({ ...clueDownForm, hints: newHints });
                                            }}
                                            className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="clue-answer" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Answer</label>
                                    <input
                                        id="clue-answer"
                                        placeholder="The correct answer"
                                        value={clueDownForm.answer}
                                        onChange={(e) => setClueDownForm({ ...clueDownForm, answer: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="clue-image" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Image URL</label>
                                    <input
                                        id="clue-image"
                                        placeholder="https://example.com/image.jpg"
                                        value={clueDownForm.image}
                                        onChange={(e) => setClueDownForm({ ...clueDownForm, image: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className={`flex-1 ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-yellow-400 hover:bg-yellow-300'} text-slate-900 py-4 rounded-xl font-black text-xl transition-all uppercase`}>
                                    {editingId ? 'Update ClueDown Question' : 'Add ClueDown Question'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 bg-slate-700 text-white py-4 rounded-xl font-black text-xl hover:bg-slate-600 transition-all uppercase"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {activeGame === 'MindSnap' && (
                        <form onSubmit={handleAddMindSnap} className="space-y-6">
                            <div>
                                <label htmlFor="snap-question" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Riddle / Question</label>
                                <textarea
                                    id="snap-question"
                                    placeholder="Enter the riddle here..."
                                    value={mindSnapForm.question}
                                    onChange={(e) => setMindSnapForm({ ...mindSnapForm, question: e.target.value })}
                                    className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="snap-q-image" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Question Image URL (Optional)</label>
                                    <input
                                        id="snap-q-image"
                                        placeholder="https://example.com/riddle.jpg"
                                        value={mindSnapForm.question_image}
                                        onChange={(e) => setMindSnapForm({ ...mindSnapForm, question_image: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="snap-clue" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Clue (Optional)</label>
                                    <input
                                        id="snap-clue"
                                        placeholder="A little hint..."
                                        value={mindSnapForm.clue}
                                        onChange={(e) => setMindSnapForm({ ...mindSnapForm, clue: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="snap-answer" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Answer</label>
                                    <input
                                        id="snap-answer"
                                        placeholder="The correct answer"
                                        value={mindSnapForm.answer}
                                        onChange={(e) => setMindSnapForm({ ...mindSnapForm, answer: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="snap-a-image" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Answer Image URL (Optional)</label>
                                    <input
                                        id="snap-a-image"
                                        placeholder="https://example.com/answer.jpg"
                                        value={mindSnapForm.answer_image}
                                        onChange={(e) => setMindSnapForm({ ...mindSnapForm, answer_image: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className={`flex-1 ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-yellow-400 hover:bg-yellow-300'} text-slate-900 py-4 rounded-xl font-black text-xl transition-all uppercase`}>
                                    {editingId ? 'Update MindSnap Riddle' : 'Add MindSnap Riddle'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 bg-slate-700 text-white py-4 rounded-xl font-black text-xl hover:bg-slate-600 transition-all uppercase"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {activeGame === 'Elimino' && (
                        <form onSubmit={handleAddElimino} className="space-y-6">
                            <div>
                                <label htmlFor="elim-question" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Question</label>
                                <textarea
                                    id="elim-question"
                                    placeholder="Enter the MCQ question here..."
                                    value={eliminoForm.question}
                                    onChange={(e) => setEliminoForm({ ...eliminoForm, question: e.target.value })}
                                    className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none min-h-[80px]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {eliminoForm.options.map((option, i) => (
                                    <div key={i}>
                                        <label htmlFor={`option-${i}`} className="block text-slate-400 text-[10px] font-black uppercase mb-1 ml-1">Option {i + 1}</label>
                                        <input
                                            id={`option-${i}`}
                                            placeholder={`Option ${i + 1}`}
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...eliminoForm.options];
                                                newOptions[i] = e.target.value;
                                                setEliminoForm({ ...eliminoForm, options: newOptions });
                                            }}
                                            className="w-full bg-slate-900 p-3 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="elim-answer" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Correct Answer</label>
                                    <input
                                        id="elim-answer"
                                        placeholder="Must match one of the options"
                                        value={eliminoForm.answer}
                                        onChange={(e) => setEliminoForm({ ...eliminoForm, answer: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="elim-manual" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Eliminated Indices (Optional)</label>
                                    <input
                                        id="elim-manual"
                                        placeholder="Comma separated: 1, 2"
                                        value={eliminoForm.eliminated}
                                        onChange={(e) => setEliminoForm({ ...eliminoForm, eliminated: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1 ml-1 italic">(0-indexed. If empty, 2 wrong options will be picked randomly)</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className={`flex-1 ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-yellow-400 hover:bg-yellow-300'} text-slate-900 py-4 rounded-xl font-black text-xl transition-all uppercase`}>
                                    {editingId ? 'Update Elimino Question' : 'Add Elimino Question'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 bg-slate-700 text-white py-4 rounded-xl font-black text-xl hover:bg-slate-600 transition-all uppercase"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {activeGame === 'FlashTrack' && (
                        <form onSubmit={handleAddFlashTrack} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Question Type</label>
                                    <select
                                        value={flashTrackForm.type}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, type: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    >
                                        <option value="MacroMatch">MacroMatch</option>
                                        <option value="BeatGlyph">BeatGlyph</option>
                                        <option value="DarkDial">DarkDial</option>
                                        <option value="ClipClick">ClipClick</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Title</label>
                                    <input
                                        placeholder="e.g., Identify this Theme"
                                        value={flashTrackForm.title}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, title: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Images (Comma separated URLs)</label>
                                <textarea
                                    placeholder="image1.jpg, image2.jpg..."
                                    value={flashTrackForm.images}
                                    onChange={(e) => setFlashTrackForm({ ...flashTrackForm, images: e.target.value })}
                                    className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none min-h-[60px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Video URL (Optional)</label>
                                    <input
                                        placeholder="/assets/video/..."
                                        value={flashTrackForm.videoUrl}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, videoUrl: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Audio URL (Optional)</label>
                                    <input
                                        placeholder="/assets/audio/..."
                                        value={flashTrackForm.audioUrl}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, audioUrl: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Correct Answer</label>
                                    <input
                                        placeholder="The correct answer text"
                                        value={flashTrackForm.answer}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, answer: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Answer Image (Optional)</label>
                                    <input
                                        placeholder="URL of image to show with answer"
                                        value={flashTrackForm.answerImage}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, answerImage: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Audio Speed</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={flashTrackForm.audioSpeed}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, audioSpeed: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Video Speed</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={flashTrackForm.videoSpeed}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, videoSpeed: e.target.value })}
                                        className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <input
                                        type="checkbox"
                                        id="video-muted"
                                        checked={flashTrackForm.videoMuted}
                                        onChange={(e) => setFlashTrackForm({ ...flashTrackForm, videoMuted: e.target.checked })}
                                        className="w-5 h-5 accent-yellow-400"
                                    />
                                    <label htmlFor="video-muted" className="text-slate-400 text-xs font-black uppercase">Video Muted</label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className={`flex-1 ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-yellow-400 hover:bg-yellow-300'} text-slate-900 py-4 rounded-xl font-black text-xl transition-all uppercase`}>
                                    {editingId ? 'Update FlashTrack Question' : 'Add FlashTrack Question'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 bg-slate-700 text-white py-4 rounded-xl font-black text-xl hover:bg-slate-600 transition-all uppercase"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                {/* 3. Questions List */}
                <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border-b-8 border-green-500">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-green-400 uppercase">Existing Questions ({activeGame})</h2>
                        {(questions[activeGame] || []).length > 0 && (
                            <button
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ALL questions for ${activeGame}? This cannot be undone.`)) {
                                        clearQuestions(activeGame);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all uppercase shadow-lg"
                            >
                                🗑️ Delete All
                            </button>
                        )}
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {(questions[activeGame] || []).length === 0 && <p className="text-slate-500 italic">No questions added yet.</p>}
                        {(questions[activeGame] || []).map((q) => (
                            <div key={q.id} className="bg-slate-900 p-5 rounded-2xl flex justify-between items-center border border-slate-700 transition-all">
                                <div>
                                    <h4 className="font-black text-white">{q.title || q.answer || q.category}</h4>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(q)}
                                        className="bg-blue-900/50 text-blue-400 p-2 rounded-lg hover:bg-blue-800 transition-colors font-bold text-sm px-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => removeQuestion(activeGame, q.id)}
                                        className="bg-red-900/50 text-red-500 p-2 rounded-lg hover:bg-red-800 transition-colors font-bold text-sm px-4"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

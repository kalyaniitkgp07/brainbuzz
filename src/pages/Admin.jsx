import React, { useState } from 'react';
import { useGame, ALL_GAMES } from '../context/GameContext';

export default function Admin() {
    const { questions, addQuestion, updateQuestion, bulkAddQuestions, removeQuestion, clearQuestions, enabledGames, toggleGame } = useGame();
    const [activeGame, setActiveGame] = useState('ClueDown');
    const [editingId, setEditingId] = useState(null);

    // Form States
    const [clueDownForm, setClueDownForm] = useState({ title: '', hints: ['', '', ''], answer: '', image: '' });
    const [categoryChaosForm, setCategoryChaosForm] = useState({ category: '', items: '' });

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

    const handleAddCategoryChaos = (e) => {
        e.preventDefault();
        if (categoryChaosForm.category && categoryChaosForm.items) {
            const data = {
                category: categoryChaosForm.category,
                items: typeof categoryChaosForm.items === 'string'
                    ? categoryChaosForm.items.split(',').map(i => i.trim())
                    : categoryChaosForm.items
            };

            if (editingId) {
                updateQuestion('CategoryChaos', editingId, data);
                setEditingId(null);
            } else {
                addQuestion('CategoryChaos', data);
            }
            setCategoryChaosForm({ category: '', items: '' });
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
        } else {
            setCategoryChaosForm({
                category: q.category,
                items: Array.isArray(q.items) ? q.items.join(', ') : q.items
            });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setClueDownForm({ title: '', hints: ['', '', ''], answer: '', image: '' });
        setCategoryChaosForm({ category: '', items: '' });
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
                            <h2 className="text-3xl font-black text-yellow-400 uppercase">Question Editor</h2>
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
                                    <option value="ClueDown">ClueDown</option>
                                    <option value="CategoryChaos">CategoryChaos</option>
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

                    {activeGame === 'CategoryChaos' && (
                        <form onSubmit={handleAddCategoryChaos} className="space-y-6">
                            <div>
                                <label htmlFor="cat-name" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Category Name</label>
                                <input
                                    id="cat-name"
                                    placeholder="e.g., Programming Languages"
                                    value={categoryChaosForm.category}
                                    onChange={(e) => setCategoryChaosForm({ ...categoryChaosForm, category: e.target.value })}
                                    className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="cat-items" className="block text-slate-400 text-xs font-black uppercase mb-2 ml-1">Items</label>
                                <textarea
                                    id="cat-items"
                                    placeholder="Comma separated: Javascript, Python, Go..."
                                    value={categoryChaosForm.items}
                                    onChange={(e) => setCategoryChaosForm({ ...categoryChaosForm, items: e.target.value })}
                                    className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button className={`flex-1 ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-yellow-400 hover:bg-yellow-300'} text-slate-900 py-4 rounded-xl font-black text-xl transition-all uppercase`}>
                                    {editingId ? 'Update CategoryChaos Question' : 'Add CategoryChaos Question'}
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

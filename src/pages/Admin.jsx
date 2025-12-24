import React, { useState } from 'react';
import { useGame, ALL_GAMES } from '../context/GameContext';

export default function Admin() {
    const { questions, addQuestion, removeQuestion, enabledGames, toggleGame } = useGame();
    const [activeGame, setActiveGame] = useState('ClueDown');

    // Form States
    const [clueDownForm, setClueDownForm] = useState({ hints: ['', '', ''], answer: '', image: '' });
    const [categoryChaosForm, setCategoryChaosForm] = useState({ category: '', items: '' });

    const handleAddClueDown = (e) => {
        e.preventDefault();
        if (clueDownForm.answer && clueDownForm.hints.every(h => h)) {
            addQuestion('ClueDown', clueDownForm);
            setClueDownForm({ hints: ['', '', ''], answer: '', image: '' });
        }
    };

    const handleAddCategoryChaos = (e) => {
        e.preventDefault();
        if (categoryChaosForm.category && categoryChaosForm.items) {
            addQuestion('CategoryChaos', {
                category: categoryChaosForm.category,
                items: categoryChaosForm.items.split(',').map(i => i.trim())
            });
            setCategoryChaosForm({ category: '', items: '' });
        }
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
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-yellow-400 uppercase">Question Editor</h2>
                        <select
                            value={activeGame}
                            onChange={(e) => setActiveGame(e.target.value)}
                            className="bg-slate-900 text-white p-3 rounded-xl border-2 border-slate-700 outline-none focus:border-yellow-400"
                        >
                            <option value="ClueDown">ClueDown</option>
                            <option value="CategoryChaos">CategoryChaos</option>
                        </select>
                    </div>

                    {activeGame === 'ClueDown' && (
                        <form onSubmit={handleAddClueDown} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {clueDownForm.hints.map((hint, i) => (
                                    <input
                                        key={i}
                                        placeholder={`Hint ${i + 1}`}
                                        value={hint}
                                        onChange={(e) => {
                                            const newHints = [...clueDownForm.hints];
                                            newHints[i] = e.target.value;
                                            setClueDownForm({ ...clueDownForm, hints: newHints });
                                        }}
                                        className="bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Answer"
                                    value={clueDownForm.answer}
                                    onChange={(e) => setClueDownForm({ ...clueDownForm, answer: e.target.value })}
                                    className="bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                    required
                                />
                                <input
                                    placeholder="Image URL"
                                    value={clueDownForm.image}
                                    onChange={(e) => setClueDownForm({ ...clueDownForm, image: e.target.value })}
                                    className="bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                />
                            </div>
                            <button className="w-full bg-yellow-400 text-slate-900 py-4 rounded-xl font-black text-xl hover:bg-yellow-300 transition-all uppercase">
                                Add ClueDown Question
                            </button>
                        </form>
                    )}

                    {activeGame === 'CategoryChaos' && (
                        <form onSubmit={handleAddCategoryChaos} className="space-y-6">
                            <input
                                placeholder="Category Name (e.g., Programming Languages)"
                                value={categoryChaosForm.category}
                                onChange={(e) => setCategoryChaosForm({ ...categoryChaosForm, category: e.target.value })}
                                className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none"
                                required
                            />
                            <textarea
                                placeholder="Items (comma separated: Javascript, Python, Go...)"
                                value={categoryChaosForm.items}
                                onChange={(e) => setCategoryChaosForm({ ...categoryChaosForm, items: e.target.value })}
                                className="w-full bg-slate-900 p-4 rounded-xl border-2 border-slate-700 focus:border-yellow-400 outline-none min-h-[100px]"
                                required
                            />
                            <button className="w-full bg-yellow-400 text-slate-900 py-4 rounded-xl font-black text-xl hover:bg-yellow-300 transition-all uppercase">
                                Add CategoryChaos Question
                            </button>
                        </form>
                    )}
                </div>

                {/* 3. Questions List */}
                <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border-b-8 border-green-500">
                    <h2 className="text-2xl font-black mb-6 text-green-400 uppercase">Existing Questions ({activeGame})</h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {(questions[activeGame] || []).length === 0 && <p className="text-slate-500 italic">No questions added yet.</p>}
                        {(questions[activeGame] || []).map((q) => (
                            <div key={q.id} className="bg-slate-900 p-5 rounded-2xl flex justify-between items-center border border-slate-700">
                                <div>
                                    <h4 className="font-black text-white">{activeGame === 'ClueDown' ? q.answer : q.category}</h4>
                                    <p className="text-sm text-slate-500">Question ID: {q.id}</p>
                                </div>
                                <button
                                    onClick={() => removeQuestion(activeGame, q.id)}
                                    className="bg-red-900/50 text-red-500 p-2 rounded-lg hover:bg-red-800 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

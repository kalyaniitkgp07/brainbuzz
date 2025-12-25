import React, { createContext, useContext, useState, useEffect } from 'react';
import { QUESTIONS as defaultClueDownQuestions, MIND_SNAP_QUESTIONS as defaultMindSnapQuestions } from '../data/gameData';

const GameContext = createContext();

export const ALL_GAMES = ["ClueDown", "MindSnap", "Category Chaos", "The Final Face-Off"];

export function GameProvider({ children }) {
    const [questions, setQuestions] = useState(() => {
        const saved = localStorage.getItem('bb_questions_v2');
        return saved ? JSON.parse(saved) : {
            ClueDown: defaultClueDownQuestions,
            MindSnap: defaultMindSnapQuestions,
            CategoryChaos: []
        };
    });

    const [enabledGames, setEnabledGames] = useState(() => {
        const saved = localStorage.getItem('bb_enabled_games');
        return saved ? JSON.parse(saved) : ["ClueDown"]; // Default to just ClueDown
    });

    useEffect(() => {
        localStorage.setItem('bb_questions_v2', JSON.stringify(questions));
    }, [questions]);

    useEffect(() => {
        localStorage.setItem('bb_enabled_games', JSON.stringify(enabledGames));
    }, [enabledGames]);

    const addQuestion = (game, question) => {
        setQuestions(prev => ({
            ...prev,
            [game]: [...(prev[game] || []), { ...question, id: (prev[game]?.length || 0) + 1 }]
        }));
    };

    const updateQuestion = (game, id, updatedData) => {
        setQuestions(prev => ({
            ...prev,
            [game]: prev[game].map(q => q.id === id ? { ...q, ...updatedData } : q)
        }));
    };

    const bulkAddQuestions = (game, questionList) => {
        setQuestions(prev => ({
            ...prev,
            [game]: questionList.map((q, idx) => ({ ...q, id: idx + 1 }))
        }));
    };

    const removeQuestion = (game, id) => {
        setQuestions(prev => ({
            ...prev,
            [game]: prev[game].filter(q => q.id !== id)
        }));
    };

    const clearQuestions = (game) => {
        setQuestions(prev => ({
            ...prev,
            [game]: []
        }));
    };

    const toggleGame = (game) => {
        setEnabledGames(prev =>
            prev.includes(game)
                ? prev.filter(g => g !== game)
                : [...prev, game]
        );
    };

    return (
        <GameContext.Provider value={{
            questions,
            setQuestions,
            enabledGames,
            setEnabledGames,
            addQuestion,
            updateQuestion,
            bulkAddQuestions,
            removeQuestion,
            clearQuestions,
            toggleGame,
            ALL_GAMES
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}

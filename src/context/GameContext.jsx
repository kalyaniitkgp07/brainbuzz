import React, { createContext, useContext, useState, useEffect } from 'react';
import { QUESTIONS as defaultClueDownQuestions, MIND_SNAP_QUESTIONS as defaultMindSnapQuestions, ELIMINO_QUESTIONS as defaultEliminoQuestions, FLASH_TRACK_QUESTIONS as defaultFlashTrackQuestions } from '../data/gameData';

const GameContext = createContext();

export const ALL_GAMES = ["ClueDown", "MindSnap", "Elimino", "FlashTrack"];

export function GameProvider({ children }) {
    const [questions, setQuestions] = useState(() => {
        const saved = localStorage.getItem('bb_questions_v2');
        const defaults = {
            ClueDown: defaultClueDownQuestions,
            MindSnap: defaultMindSnapQuestions,
            Elimino: defaultEliminoQuestions,
            FlashTrack: defaultFlashTrackQuestions
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge defaults for any missing keys (e.g. FlashTrack which was added later)
            return {
                ...defaults,
                ...parsed
            };
        }
        return defaults;
    });

    const [enabledGames, setEnabledGames] = useState(() => {
        const saved = localStorage.getItem('bb_enabled_games');
        return saved ? JSON.parse(saved) : ALL_GAMES; // Default to all games
    });

    const [visitedQuestions, setVisitedQuestions] = useState(() => {
        const saved = localStorage.getItem('bb_visited_questions');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('bb_questions_v2', JSON.stringify(questions));
    }, [questions]);

    useEffect(() => {
        localStorage.setItem('bb_enabled_games', JSON.stringify(enabledGames));
    }, [enabledGames]);

    useEffect(() => {
        localStorage.setItem('bb_visited_questions', JSON.stringify(visitedQuestions));
    }, [visitedQuestions]);

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

    const resetVisited = (game) => {
        setVisitedQuestions(prev => ({
            ...prev,
            [game]: []
        }));
    };

    const markAsVisited = (game, id) => {
        setVisitedQuestions(prev => ({
            ...prev,
            [game]: [...new Set([...(prev[game] || []), id])]
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
            visitedQuestions,
            markAsVisited,
            resetVisited,
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

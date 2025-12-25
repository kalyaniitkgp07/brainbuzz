export const GAMES = ["ClueDown", "MindSnap", "Elimino", "FlashTrack"];

export const QUESTIONS = [
    {
        id: 1,
        title: "Transportation",
        hints: [
            "My design was patented by James Knibbs in 1867.",
            "I am a simple machine used for transport.",
            "I am round and you find four of me on a car."
        ],
        answer: "The Wheel",
        image: "https://images.unsplash.com/photo-1594731802114-039722be74d7?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "Inventions",
        hints: [
            "Joseph Swan and Thomas Edison perfected me.",
            "I used to rely on a tungsten filament to glow.",
            "I am the glass object you screw into a lamp."
        ],
        answer: "The Lightbulb",
        image: "https://images.unsplash.com/photo-1543051932-6ef9fec6cb80?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        title: "Category: Literature",
        hints: ["Famous playwright", "Wrote 'Romeo and Juliet'", "Born in Stratford-upon-Avon"],
        answer: "William Shakespeare",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Shakespeare.jpg"
    }
];

export const MIND_SNAP_QUESTIONS = [
    {
        id: 1,
        question: "What has 13 hearts, but no lungs, feet or bellybuttons?",
        clue: "You might find it in a casino or a magic trick.",
        answer: "A deck of cards.",
        answer_image: "https://images.unsplash.com/photo-1543332145-6e8de5e00344?q=80&w=1000&auto=format&fit=crop"
    }
];
export const ELIMINO_QUESTIONS = [
    {
        id: 1,
        question: "Which of these animals is the only one that can't fly?",
        options: ["Ostrich", "Hummingbird", "Eagle", "Bat"],
        eliminated: [1, 2],
        answer: "Ostrich"
    }
];

export const FLASH_TRACK_QUESTIONS = [
    {
        id: 1,
        type: "MacroMatch",
        title: "Identify this Animated Classic",
        images: [
            "https://images.unsplash.com/photo-1543332145-6e8de5e00344?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1543332145-6e8de5e00344?q=80&w=1000&auto=format&fit=crop"
        ],
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        answer: "The Jungle Book",
        answerImage: "https://upload.wikimedia.org/wikipedia/en/1/1d/The_Jungle_Book_1967_poster.jpg",
        audioSpeed: 1,
        videoSpeed: 1,
        videoMuted: false
    },
    {
        id: 2,
        type: "BeatGlyph",
        title: "Name the Artist",
        images: [],
        audioUrl: "https://www.w3schools.com/html/horse.mp3",
        answer: "The Beatles",
        answerImage: "https://upload.wikimedia.org/wikipedia/en/a/a4/Beatles_-_Abbey_Road.jpg",
        audioSpeed: 1.2,
        videoSpeed: 1,
        videoMuted: false
    },
    {
        id: 3,
        type: "ClipClick",
        title: "Which Country?",
        images: [
            "https://images.unsplash.com/photo-1524413845963-1a251b6540b3?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1000&auto=format&fit=crop"
        ],
        videoUrl: "",
        audioUrl: "",
        answer: "Japan",
        answerImage: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000&auto=format&fit=crop",
        audioSpeed: 1,
        videoSpeed: 1,
        videoMuted: false
    }
];

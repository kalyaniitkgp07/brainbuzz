export const GAMES = ["ClueDown", "MindSnap", "Elimino", "FlashTrack"];

export const QUESTIONS = [
    {
        "id": 1,
        "title": "The Potash Pack (Fruit)",
        "hints": [
            "I am technically a herb, not a tree, and I grow in large clusters called 'hands.'",
            "I am famous for being high in potassium and I am slightly radioactive (but totally safe to eat!).",
            "I am a long, curved yellow fruit that you have to peel before eating."
        ],
        "answer": "Banana",
        "image": "https://cdnb.artstation.com/p/assets/images/images/036/830/237/large/flora-golshan-img-20200603-160814-535.jpg?1618754191"
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
        image: "https://www.creativeteaching.com/cdn/shop/files/10591_1_d2852eba-b9d9-454c-893d-f685677a0f12_1024x1024.jpg?v=1758784347"
    }
];

export const MIND_SNAP_QUESTIONS = [
    {
        id: 1,
        question: "What has 13 hearts, but no lungs, feet or bellybuttons?",
        clue: "You might find it in a casino or a magic trick.",
        answer: "A deck of cards.",
        answer_image: "https://as1.ftcdn.net/jpg/00/14/69/56/1000_F_14695688_HxxyWTu2fyOCnQIWUWPIDZBu4FulXU2e.jpg"
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
        type: "MacroMatch",
        title: "Golden Bubbles",
        imageUrl: "https://www.dropbox.com/scl/fi/vm40mcsrzu0hd51ghuggx/honeybeeonflower_macro.tiff?rlkey=ytac18kt78cfsjzpqxoj468o1&st=fg69g7c1&raw=1",
        audioUrl: "https://www.dropbox.com/scl/fi/qn1e62o0ji1y0zk50mj27/bbc_honey-bee-_nhu0508218.mp3?rlkey=2c63ezql26iphmh2b4ay7nw4e&st=gtm5qhfc&raw=1",
        answer: "Bee Hive",
        answerImage: "https://www.dropbox.com/scl/fi/kn0bkj0csbspo4g891880/honeybeeonflower_full.tiff?rlkey=aflte6t4pw7qyekohh2vmnsge&st=xu0ku4xz&raw=1",
        difficulty: "Easy"
    },
    // {
    //     type: "MacroMatch",
    //     title: "Identify this Animated Character",
    //     images: [],
    //     videoUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmt3ZG5vdzJzdWd2cmliY2hlOWtnY3ZxMm9qYzcwaDEwa25pZWY2aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/Ymt6N7O93ixVVbmBNl/giphy1080p.mp4?cc=en",
    //     answer: "Anna",
    //     answerImage: "https://taylorramage.files.wordpress.com/2014/04/anna_frozen.jpg",
    //     audioSpeed: 1,
    //     videoSpeed: 1,
    //     videoMuted: false
    // }
];

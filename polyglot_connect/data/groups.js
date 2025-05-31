// data/groups.js
console.log('data/groups.js loading...');

window.polyglotGroupsData = [
    {
        id: "french_learners_main_fr",
        name: "French Conversation Club",
        language: "French", // Matches connector.language NAME
        description: "Casual chat and practice for all levels of French learners. Discuss daily life, hobbies, and culture.",
        tutorId: "emile_fra_tutor",
        maxLearners: 5, // Number of AI learners excluding tutor
        tags: ["general practice", "casual", "culture", "all levels"]
    },
    {
        id: "spanish_beginners_cafe_es",
        name: "Café Español - Beginners",
        language: "Spanish",
        description: "A friendly and supportive space for A1-A2 Spanish learners to build confidence in speaking. Basic topics and role-play.",
        tutorId: "sofia_spa_tutor",
        maxLearners: 4,
        tags: ["beginner friendly", "roleplay", "daily life", "A1-A2"]
    },
    {
        id: "german_grammar_talk_de",
        name: "German Grammar Q&A",
        language: "German",
        description: "Stuck on cases or verb conjugations? Join this group to discuss German grammar with a tutor and fellow learners.",
        tutorId: "liselotte_ger_tutor",
        maxLearners: 3,
        tags: ["grammar focus", "Q&A", "intermediate"]
    },
    {
        id: "italian_film_buffs_it",
        name: "Italian Film & Cinema Fans",
        language: "Italian",
        description: "Parliamo di cinema italiano! Discuss classic and modern Italian films, directors, and actors.",
        tutorId: "giorgio_ita_tutor",
        maxLearners: 5,
        tags: ["cinema", "culture", "intermediate", "advanced"]
    },
    {
        id: "portuguese_travel_chat_pt",
        name: "Portuguese for Travelers",
        language: "Portuguese",
        description: "Planning a trip to a Portuguese-speaking country? Practice useful phrases and discuss travel tips.",
        tutorId: "mateus_por_tutor",
        maxLearners: 4,
        tags: ["travel", "practical phrases", "beginner", "intermediate"]
    },
    {
        id: "russian_literature_circle_ru",
        name: "Russian Literature Circle",
        language: "Russian",
        description: "Discuss famous Russian authors, novels, and poetry. For intermediate to advanced learners.",
        tutorId: "yelena_rus_tutor",
        maxLearners: 3,
        tags: ["literature", "culture", "advanced", "discussion"]
    },
    {
        id: "swedish_fika_sv",
        name: "Swedish 'Fika' Chat",
        language: "Swedish",
        description: "A relaxed 'fika' (coffee break) style chat in Swedish. All topics welcome!",
        tutorId: "astrid_swe_tutor",
        maxLearners: 5,
        tags: ["casual", "culture", "all levels", "fika"]
    },
    {
        id: "indonesian_daily_life_id",
        name: "Indonesian Daily Conversations",
        language: "Indonesian",
        description: "Practice everyday Bahasa Indonesia by talking about daily routines, food, and local customs.",
        tutorId: "rizki_idn_tutor",
        maxLearners: 4,
        tags: ["daily life", "beginner", "intermediate", "culture"]
    }
    // Add more group definitions for each of your 8 languages,
    // potentially offering different themes or levels per language.
];

console.log("data/groups.js loaded.", (window.polyglotGroupsData || []).length, "group definitions.");
// js/guild-strategy-config.js
const phaseOrder = [
    'phase-beginner',
    'phase-intermediate',
    'phase-advanced',
    'phase-wisdom',
    'phase-warning'
];

const toolsData = {
    // --- A1-A2 Tools ---
    'duolingo-a1': {
        name: "Duolingo (Very Start)",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-duolingo-icon-download-in-svg-png-gif-file-formats--symbol-brand-logo-world-logos-vol-2-pack-icons-282167.png?f=webp", // Ensure this path is correct
        description: "<p>Useful for getting used to the sounds and sentence structure at the very beginning of your journey.</p>",
        aljohnNote: "Use it briefly for the first few lessons to get a feel, then move on quickly. Don't get bogged down here as progress can be slow for serious learners.",
        rating: "Brief Use Only",
        url: "https://www.duolingo.com/"
    },
    'language-transfer-a1': {
        name: "Language Transfer",
        icon: "assets/A2_character_langauge_transfer.png",
        description: "<p>This app gives you the logic of the language and explains grammar in a way that just makes sense. Excellent for building a foundational understanding, especially for Romance languages.</p>",
        aljohnNote: "Highly effective for understanding the 'why' behind grammar. I usually complete a course in a few days to grasp the core structure.",
        rating: "Highly Recommended",
        url: "https://www.languagetransfer.org/"
    },
    'anki-a1': {
        name: "Anki (Spaced Repetition A1-A2)",
        icon: "assets/A2_anki_gem_icon.png",
        description: "<p>Start your digital flashcard deck immediately. Use Spaced Repetition System (SRS) to remember vocabulary and basic sentences long-term. Add new words with images and example sentences from your reading.</p>",
        aljohnNote: "This is NON-NEGOTIABLE for serious, rapid learning. Aim for around 1000 well-reviewed words/sentences to comfortably move on from the A1-A2 phase.",
        rating: "ESSENTIAL!",
        url: "https://apps.ankiweb.net/"
    },
    'simple-texts-a1': { // Corrected key from your HTML example
        name: "Simple Texts", // Matched your HTML display
        icon: "assets/A2_basic_text_icon.png",
        description: "<p>Read books you already know well (e.g., Harry Potter series) in your target language. Use eReader apps like ReadEra with tap-to-translate features or a simple dictionary. Also, navigate your browser in the target language; basic articles and social media comments offer real, informal language.</p>",
        aljohnNote: "Context is king for beginners. Knowing the story helps you focus on acquiring the language, not just deciphering plot. This builds intuitive reading skills.",
        rating: "Recommended"
    },
    'linguno-a1': {
        name: "Linguno (Drills)", // Matched your HTML display
        icon: "assets/A2_linguno_penguin_character.png",
        description: "<p>Use it for conjugation drills, especially for Romance languages. Don’t aim to memorize every verb form instantly — focus on getting familiar with the common patterns. Try to reach at least a Silver II rank as a good benchmark.</p>",
        aljohnNote: "The key is repetition; it can be frustrating at first, but persistence pays off for pattern recognition and making conjugations second nature.",
        rating: "Recommended",
        url: "https://linguno.com/"
    },
    'youtube-grammar-a1': { // Corrected key from your HTML example
        name: "YouTube/Grammar", // Matched your HTML display
        icon: "assets/B2_youtube_crystal_icon.png",
        description: "<p>Watch short grammar explainer videos in your target language (if available at a simple level) or with English support. Use ChatGPT to follow up on confusing parts, ask for examples, or even get quizzed. You can also explore free textbooks or language learning websites to find explanations that click for you.</p>",
        aljohnNote: "The goal isn’t to master grammar instantly — just to build a strong intuitive feel for how the language works, while staying curious and consistent. Find what makes sense to YOU.",
        rating: "Recommended"
    },
   'grammar-tutor-a1': { // This ID matches your HTML: data-tool-id="grammar-tutor-a1"
        name: "Classes (A1-A2)", // Updated name to "Classes"
        icon: "assets/A2_tutor_character.png", // The lady tutor icon
        description: "<p>Structured classes, whether online or in-person, can provide a clear path for beginners. They often cover foundational grammar, basic vocabulary, and offer guided practice.</p>" +
                     "<ul><li>Look for beginner-friendly courses that emphasize clear explanations.</li>" +
                     "<li>Group classes can offer motivation and peer interaction.</li>" +
                     "<li>Individual tutoring (like with the character shown) can provide personalized attention to your specific learning needs.</li></ul>" +
                     "<p>While classes offer structure, remember to supplement them heavily with your own immersion activities like Anki, reading, and listening.</p>",
        aljohnNote: "Classes can be a good starting point if you prefer a guided approach or need external accountability. However, don't rely on them solely. True fluency comes from massive, self-directed immersion. Use classes to understand concepts, then immerse to internalize them.",
        rating: "Optional / Recommended", // Rating can be adjusted
        // url: "" // Optional: Add a URL if there's a general resource page for finding classes
    },

    // --- B1-B2 Tools ---
    'massive-input-reading-b1': { // Making reading more specific
        name: "Native Reading (B1-B2)",
        icon: "assets/B2_books_icon.png",
        description: "<p>Shift to native-level content you genuinely enjoy (novels, news, blogs). Keep adding new vocabulary and interesting sentences to Anki.</p>",
        aljohnNote: "The more you read what you love, the less it feels like study. This is key for sustained immersion and vocabulary growth.",
        rating: "ESSENTIAL!"
    },
    'massive-input-watching-b1': { // Making watching more specific
        name: "Native Watching (B1-B2)",
        icon: "assets/B2_youtube_crystal_icon.png", // Or C2_advanced_content_tv_icon.png if more generic
        description: "<p>Immerse yourself in YouTube, native streaming platforms (use a VPN if needed). Turn on subtitles — in your target language ONLY. This helps link sound with text naturally.</p>",
        aljohnNote: "Pay attention to how people speak, their gestures, and cultural cues. This is more than just understanding words.",
        rating: "ESSENTIAL!"
    },
    'massive-input-podcasts-b1': { // Specific entry for Podcasts
        name: "Podcasts (B1-B2 Listening)",
        icon: "assets/B2_podcasts_icon.png",
        description: "<p>Fill all your “dead time” (commuting, chores, walking) with podcasts in your target language. Find topics that interest you.</p>",
        aljohnNote: "Consistent exposure, even if you don't catch every word, trains your ear to the rhythm and sounds of the language. Pocket Casts is great for offline listening.",
        rating: "Highly Recommended"
    },
    'massive-input-music-b1': { // Specific entry for Music
        name: "Music Immersion (B1-B2)",
        icon: "assets/B2_Musicians_character.png",
        description: "<p>Listen to music extensively in your target language. Pay attention to lyrics, rhythm, and cultural expressions embedded in songs.</p>",
        aljohnNote: "Songs are incredibly powerful for internalizing pronunciation, slang, and common phrases. Plus, they're enjoyable and memorable!",
        rating: "Highly Recommended"
    },
    'anki-b1': {
        name: "Anki (Vocabulary Build B1-B2)",
        icon: "assets/A2_anki_gem_icon.png", // Re-using A2 icon as per your data
        description: "<p>Keep feeding your Anki deck with new words AND full sentences encountered during your massive input activities. Aim for over 2500+ known and well-reviewed words/sentences before considering yourself solid in B2.</p>",
        aljohnNote: "Consistency with Anki is still paramount. Your cards will likely become more complex, focusing on nuanced vocabulary and idiomatic expressions.",
        rating: "ESSENTIAL!",
        url: "https://apps.ankiweb.net/"
    },
    'journaling-b1': {
        name: "Writing (Journal)", // Matched your HTML display
        icon: "assets/B2_journal_icon.png",
        description: "<p>Start journaling daily in your target language. Write about your day, opinions, dreams, or summarize content you've consumed. Use DeepL or ChatGPT initially to help structure your writing, translate untranslatable thoughts, or find alternative phrasings.</p>",
        aljohnNote: "This is your first consistent step into 'gentle output.' Don't aim for perfection; focus on expressing yourself and identifying gaps in your active vocabulary.",
        rating: "Highly Recommended"
    },
    'speaking-practice-b1': {
        name: "Speaking Practice", // Matched your HTML display
        icon: "assets/B2_social_apps_icon.png",
        description: "<ul><li>Record video journals of yourself speaking. Watch them back to notice hesitations and common mistakes.</li><li>Use AI partners like ChatGPT (voice feature) or Gliglish for low-pressure conversation practice.</li><li>Gently start joining platforms like Tandem or Discord to chat with native speakers.</li></ul>",
        aljohnNote: "Start getting comfortable forming thoughts aloud. Video journaling is surprisingly effective for self-correction. Don't rush into speaking with natives until you have a decent comprehension base.",
        rating: "Recommended"
    },
    'immersion-tracker-b1': {
        name: "Tracking Immersion", // Matched your HTML display
        icon: "assets/B2_immersion_tracker_icon.png",
        description: "<p>Track your hours spent actively engaging with the language (reading, watching, listening). This is crucial! You need to know if you’ve hit 300, 500, or 1000 hours of focused immersion.</p>",
        aljohnNote: "Fluency isn’t about days or months; it’s about total hours of quality contact. Track it, or you’ll never know where you really stand or why you might be progressing slower than expected.",
        rating: "ESSENTIAL!"
    },
    'chatgpt-b1': {
        name: "ChatGPT (Assistant)", // Matched your HTML display
        icon: "assets/B2_ChatGPT_Companion_character.png",
        description: "<p>At this stage, you need feedback, correction, and real conversation simulation. ChatGPT provides all of that instantly. Use it to practice writing, simulate dialogues, get your grammar checked, or ask for more natural ways to phrase things.</p>",
        aljohnNote: "Invaluable for bridging the gap between what you intend to say and how a native speaker would actually express it. Don't be afraid to ask it anything language-related.",
        rating: "Highly Recommended",
        url: "https://chat.openai.com/"
    },
    'deepl-b1': { // NEW ENTRY FOR DEEPL
        name: "DeepL Translator (B1-B2)",
        icon: "assets/B2_DeepL_floating_fairy_character.png",
        description: "<p>Use DeepL for high-quality translations when you're stuck on a phrase while writing or want to understand a complex sentence you've read. It can also suggest alternative phrasings.</p>",
        aljohnNote: "Excellent for checking your understanding or finding natural ways to express thoughts. Use it as a helper, not a crutch for full translation of your work.",
        rating: "Highly Recommended",
        url: "https://www.deepl.com"
    },

    // --- C1-C2 Tools ---
    'native-interaction-c1': {
        name: "Native Interaction", // Matched your HTML display
        icon: "assets/C2_scholars_character.png",
        description: "<p>Converse regularly and deeply with native speakers. Use platforms like Italki (for paid tutors), Tandem, or Discord (for language exchange partners). Invest in targeted sessions with tutors who can point out your specific, subtle flaws.</p>",
        aljohnNote: "This is where you polish your fluency and naturalness. Seek constructive criticism and push yourself into complex discussions.",
        rating: "ESSENTIAL!"
    },
    'shadowing-c1': {
        name: "Shadowing", // Matched your HTML display
        icon: "assets/C2_shadowing_ghost_character.png",
        description: "<p>Choose one or two native speakers whose accent and style you admire to be your “accent model(s).” Mimic their tone, rhythm, intonation, and pronunciation down to the syllable.</p>",
        aljohnNote: "This is hard work but incredibly effective for sounding more natural and improving your overall flow and confidence in speaking.",
        rating: "Highly Recommended"
    },
    'advanced-content-c1': {
        name: "Advanced Content", // Matched your HTML display
        icon: "assets/C2_advanced_content_tv_icon.png",
        description: "<p>Watch debates, academic lectures, documentaries on complex subjects, or even dialect-heavy content. Read complex articles, literature, and academic papers. Push your understanding to its absolute limits.</p>",
        aljohnNote: "Continuously challenge yourself with material that's a bit beyond your current comfort zone to keep expanding your vocabulary and comprehension of nuance.",
        rating: "Highly Recommended"
    },
    'refining-output-c1': {
        name: "Refining Output", // Matched your HTML display
        icon: "assets/C2_advanced_text_icon.png",
        description: "<p>Journal with increased complexity and depth. Speak and write about abstract themes and sophisticated topics. Practice writing complex essays or arguments. Get detailed feedback from advanced speakers or tutors.</p>",
        aljohnNote: "Move beyond everyday topics. Focus on expressing sophisticated ideas with clarity, precision, and appropriate style.",
        rating: "Highly Recommended"
    },
    'targeted-vocab-c1': {
        name: "Targeted Vocab/Grammar", // Matched your HTML display
        icon: "assets/C2_academic_papers_icon.png",
        description: "<p>Focus on any tricky grammatical points you still struggle with. Use monolingual dictionaries to understand nuances or tools like Reverso Context to dig deeper into native-like usage of specific vocabulary or idioms.</p>",
        aljohnNote: "Address your specific, lingering weaknesses methodically. This is about fine-tuning, not broad learning.",
        rating: "Recommended"
    },
    'chatgpt-c1-mastery': {
        name: "ChatGPT (Mastery)", // Matched your HTML display
        icon: "assets/C2_ChatGPT_floating_fairy_character.png",
        description: "<p>Use ChatGPT to help refine complex ideas, explore nuanced expressions, practice advanced conversational scenarios, or get feedback on the style and tone of your writing and speaking.</p>",
        aljohnNote: "An incredibly versatile partner for exploring the subtleties of advanced language use and getting instant, detailed feedback.",
        rating: "Highly Recommended",
        url: "https://chat.openai.com/"
    },
    'cultural-nuance-c1': {
        name: "Cultural Nuance", // Matched your HTML display
        icon: "assets/C2_cultural_understanding_icon.png",
        description: "<p>Deepen your understanding of cultural context, subtext, humor, historical references, and appropriate register for different social situations. This often comes from wide reading and interaction.</p>",
        aljohnNote: "Essential for truly native-like communication and avoiding misunderstandings. This is less about a specific 'tool' and more about deep immersion in the culture itself.",
        rating: "Highly Recommended"
    }
};

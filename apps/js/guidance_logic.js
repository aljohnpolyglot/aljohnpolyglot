// D:\website\apps\js\guidance_logic.js

const guidanceTexts = {
    "default": "<p>Welcome to Aljohn's Polyglot Arsenal! Select filters to see Aljohn's personalized advice and app recommendations. Your strategic journey starts here!</p>",
    "no_cefr_for_immersion": "<p><strong>Heads up!</strong> To get specific advice for your chosen immersion strategies, please select a CEFR level. Different levels require different approaches to make the most of these strategies!</p>",
    "only_tooltype_selected": "<p>You've filtered by Tool Type: <strong>[PLACEHOLDER_TOOL_TYPES]</strong>. These apps are generally good for these functions. For Aljohn's strategic advice on *how* to use them effectively, combine this with a CEFR level selection.</p>",
    "only_cost_selected": "<p>You're looking for <strong>[PLACEHOLDER_COSTS]</strong> apps. Great! Now, match these with your current CEFR level to find tools Aljohn recommends for optimal progress at your stage.</p>",
    "only_platform_selected": "<p>Searching for apps on <strong>[PLACEHOLDER_PLATFORMS]</strong>. To see which of these Aljohn suggests for your learning phase, please also select your CEFR level.</p>",
    "generic_filter_mix": "<p>You've applied several filters. For Aljohn's most targeted strategic advice, please select a primary CEFR level. Adding an Immersion Strategy will refine it further!</p>",
    "no_results_advice": "<p><strong>No tools currently match all your selected filters.</strong> Aljohn's advice: Try broadening your search! Perhaps adjust the CEFR level, select fewer immersion strategies, or explore different tool types. Language learning is about adapting your toolkit!</p>",
    "proactive_synergy_example_B1_Reading_Vocab": "<p><strong>Strategic Combo!</strong> Focusing on Reading and Vocabulary Building at B1 is a powerful approach Aljohn champions. Use a good reading tool and diligently add new words to Anki for massive input and retention.</p>",
    "proactive_next_step_A2": "<p><strong>Leveling Up from A2?</strong> As you master A2, start preparing for B1 by gradually increasing your exposure to unassisted native content and looking for low-pressure opportunities to start speaking or writing more.</p>",


    // --- A1 Guidance (Titles are part of the string) ---
    "A1_general": "<p><strong>A1 - The Absolute Beginning:</strong> Your mission is to build the raw frame of the language. Focus on absorbing sounds, basic sentence structures, and core vocabulary (Anki is your best friend!). Don't stress about perfect output yet. This is about input and familiarization, like laying the groundwork before construction. What works now won't work later, so embrace this input-heavy phase.</p>",
    "A1_Reading": "<p><strong>Reading at A1:</strong> Start with what's familiar! Re-read books you love (like Harry Potter) but in your target language, or find super simple graded readers/children's stories. Use tools like ReadEra with tap-to-translate. The goal is GIST comprehension. Add new words WITH example sentences to Anki. Even simple online comments in your target language are valuable.</p>",
    "A1_Listening": "<p><strong>Listening at A1:</strong> Tune into 'learner podcasts' designed for beginners, ideally with transcripts you can follow. Watch very basic videos with clear visuals (e.g., Peppa Pig, if available). Use Language Reactor for dual subtitles initially. The aim is to get your ear accustomed to the sounds and rhythm. Full understanding isn't the goal yet.</p>",
    "A1_Writing": "<p><strong>Writing at A1:</strong> Keep it simple and pressure-free. Copy sentences from your lessons, write basic phrases about your day (e.g., 'I eat apple'). The goal is to start forming connections, not to produce essays. Reinforce vocabulary with Anki.</p>",
    "A1_Speaking": "<p><strong>Speaking at A1:</strong> Focus on mimicking sounds and repeating phrases from your learning materials. Active listening IS your primary speaking prep now. Don't force full conversations; that can be demotivating. Getting used to the *feel* of the sounds is key. Intensive speaking now can be counterproductive if you lack basic vocabulary and comprehension; gentle, guided output is better.</p>", // Incorporated A1_Speaking_Caution
    "A1_Watching": "<p><strong>Watching at A1:</strong> Choose content made for learners or very simple native content with strong visual cues (cartoons are great). Dual subtitles (Language Reactor) are your friend here. Link sounds to meaning and visuals. No shame in re-watching many times!</p>",
    "A1_VocabularyBuilding": "<p><strong>Vocabulary at A1:</strong> Anki is non-negotiable from DAY ONE. Start with 30-50 new, high-frequency words/phrases daily, ideally with images and contextual sentences from your learning. Consistency in reviewing is more important than learning hundreds of new words you'll forget.</p>",
    "A1_GrammarFocus": "<p><strong>Grammar at A1:</strong> Don't get bogged down in complex rules. Focus on understanding basic sentence structure (SVO, etc.) through courses like Language Transfer or the intro sections of grammar books. See patterns in your reading/listening rather than memorizing rules in isolation.</p>",

    // --- A2 Guidance ---
    "A2_general": "<p><strong>A2 - Building on the Foundation:</strong> You're past the initial shock! Now, expand your vocabulary (Anki!) and start engaging with more varied, but still very comprehensible, simple native content. Comprehension is still king, but you can begin very gentle, structured output. As you master A2, start preparing for B1 by gradually increasing your exposure to unassisted native content and looking for low-pressure opportunities to start speaking or writing more.</p>", // Added proactive next step
    "A2_Reading": "<p><strong>Reading at A2:</strong> Move to slightly more complex texts – extensive reading with graded readers, simple news articles, or Webtoons (visuals help immensely!). Continue to add new words WITH context to Anki. If your English is good, Immersive Translate can make English books accessible in your TL.</p>",
    "A2_Listening": "<p><strong>Listening at A2:</strong> Transition from learner podcasts to simpler native podcasts on familiar topics, or YouTube channels with clear speakers. Continue using target language subtitles. You should be able to grasp main ideas now. Re-listening is powerful.</p>",
    "A2_Writing": "<p><strong>Writing at A2:</strong> Start a simple daily diary. Describe your day, what you learned, your opinions. Don't worry about perfection. Use translators like DeepL to help phrase things initially, but *try* to construct your own sentences first. This is active recall!</p>",
    "A2_Speaking": "<p><strong>Speaking at A2:</strong> This is still not a primary focus for high-intensity output. Practice with AI tools like Gliglish (if it supports beginner scenarios) or ChatGPT's voice mode for low-pressure drills. Focus on forming basic sentences and pronunciation based on what you're learning.</p>",
    "A2_Watching": "<p><strong>Watching at A2:</strong> Increase your intake of native YouTube content with target language subtitles. Start to notice common phrases. Explore content related to your hobbies, even if you only understand 50-70%.</p>",
    "A2_VocabularyBuilding": "<p><strong>Vocabulary at A2:</strong> Keep hammering Anki! Your deck should be growing steadily. Focus on words from your authentic reading and listening. Context is crucial for retention. Aim for the most frequent 1000-2000 words.</p>",
    "A2_GrammarFocus": "<p><strong>Grammar at A2:</strong> Solidify your understanding of core tenses and grammatical structures. Use tools like Linguno for targeted conjugation practice. Notice grammar in action during your immersion, don't just study rules.</p>",

    // --- B1 Guidance ---
    "B1_general": "<p><strong>B1 - The Intermediate Leap:</strong> This is where intuition starts to build! Massive comprehensible input is your mantra. Aim to *feel* the language and reduce translation in your head. Start actively using the language in writing and speaking more consistently. Track your immersion hours – they are a better measure than days!</p>",
    "B1_Reading": "<p><strong>Reading at B1:</strong> Dive into native books, blogs, and news on topics you genuinely enjoy. Your reading speed and comprehension should be noticeably increasing. Keep Anki updated with nuanced vocabulary and useful phrases. If you're also focusing on Vocabulary Building, this is a killer combo Aljohn champions for massive input and retention!</p>", // Added synergy example
    "B1_Listening": "<p><strong>Listening at B1:</strong> Fill ALL your 'dead time' (exercise, chores, commute) with target language podcasts and audiobooks (Pocket Casts is great). Listen to diverse native content on various topics. Aim for understanding the main flow and arguments, even if details are missed.</p>",
    "B1_Writing": "<p><strong>Writing at B1:</strong> Daily journaling is crucial! Express opinions, summarize things you've watched/read. Use ChatGPT for phrasing ideas or correcting specific sentences, but ensure the core writing is yours. Consider Aljohn's hack: write school/work assignments in your TL first!</p>",
    "B1_Speaking": "<p><strong>Speaking at B1:</strong> Time to talk more! Use AI partners (Gliglish, ChatGPT voice), join language exchange platforms (Tandem, Discord servers like Language Sloth). Record video journals. Focus on communication and fluency over perfection. Don't be afraid of making mistakes.</p>",
    "B1_Watching": "<p><strong>Watching at B1:</strong> Immerse in native YouTube, TV shows, and movies WITH TARGET LANGUAGE SUBTITLES ONLY. This is critical. Create separate YouTube accounts per language to fine-tune recommendations. A VPN might be needed for geo-restricted content.</p>",
    "B1_VocabularyBuilding": "<p><strong>Vocabulary at B1:</strong> Your Anki deck should be robust (aim for 2500-5000 well-reviewed words/phrases). Focus on nuanced words, collocations, and common idioms from your native content consumption. Pairing this with extensive Reading is a powerful strategy!</p>", // Added synergy example
    "B1_GrammarFocus": "<p><strong>Grammar at B1:</strong> You should have a good grasp of major structures. Now, focus on more complex sentence patterns, conjunctions, and subtleties of tense usage. Learn grammar mostly through input and targeted correction, not by memorizing rules.</p>",

    // --- B2 Guidance ---
    "B2_general": "<p><strong>B2 - Towards Independence:</strong> You can operate quite well. Focus on increasing the complexity and variety of your input. Refine your output for more accuracy, naturalness, and complexity. You should be *thinking* more directly in the language now, with less internal translation.</p>",
    "B2_Reading": "<p><strong>Reading at B2:</strong> Engage with more challenging native texts: literature, opinion pieces, specialized articles. Pay attention to style, tone, author's intent, and implicit meanings.</p>",
    "B2_Listening": "<p><strong>Listening at B2:</strong> Listen to faster-paced conversations, debates, and content with regional accents or slang. Your ability to infer meaning from context should be strong. Try to reduce reliance on subtitles if the content is clear.</p>",
    "B2_Writing": "<p><strong>Writing at B2:</strong> Write more complex texts: argumentative essays, detailed reports, summaries of nuanced topics. Focus on logical structure, cohesion, and appropriate vocabulary for different registers. Seek feedback if possible.</p>",
    "B2_Speaking": "<p><strong>Speaking at B2:</strong> Engage in longer, more complex conversations. Discuss abstract topics, defend your opinions, and use a wider range of vocabulary and grammatical structures. Work on reducing hesitation and improving flow. iTalki sessions can be very beneficial here.</p>",
    "B2_Watching": "<p><strong>Watching at B2:</strong> Watch a wide range of native content, trying to do so without subtitles if comprehension allows. Understand cultural references, humor, and different registers of speech.</p>",
    "B2_VocabularyBuilding": "<p><strong>Vocabulary at B2:</strong> Focus on synonyms with different connotations, antonyms, idiomatic expressions, and collocations. Use monolingual dictionaries when possible to deepen understanding. Your active vocabulary should be significant.</p>",
    "B2_GrammarFocus": "<p><strong>Grammar at B2:</strong> Fine-tune your understanding of advanced grammar, conditional sentences, subjunctive mood (if applicable), and complex sentence linking. Identify and correct fossilized errors. Remember Aljohn's principle: acquire grammar through massive input and targeted correction of your own output, not just rule study.</p>", // Incorporated B2_GrammarFocus_Reminder

    // --- C1 Guidance ---
    "C1_general": "<p><strong>C1 - Advanced Fluency & Precision:</strong> You're highly proficient. The game now is about nuance, style, and mastering subtle aspects. Engage with complex, authentic material and interact with native speakers on a deep, intellectual level. This stage is about refinement and sounding truly natural.</p>",
    "C1_Reading": "<p><strong>Reading at C1:</strong> Tackle sophisticated literature, academic texts, and culturally dense material. Analyze writing styles, rhetorical devices, and implicit cultural assumptions.</p>",
    "C1_Listening": "<p><strong>Listening at C1:</strong> Understand virtually all spoken language, including fast native speech, lectures, and media with complex language or strong accents. Pick up on implied meanings, speaker's attitude, and irony.</p>",
    "C1_Writing": "<p><strong>Writing at C1:</strong> Produce well-structured, clear, and stylistically appropriate texts on complex subjects. Use a wide range of vocabulary and grammatical structures with precision and flair. Get feedback on nuance, register, and idiomaticity.</p>",
    "C1_Speaking": "<p><strong>Speaking at C1:</strong> Express yourself fluently, spontaneously, and precisely. Differentiate finer shades of meaning. Participate effectively in demanding conversations, debates, and professional discussions. Shadow native speakers for advanced accent refinement.</p>",
    "C1_Watching": "<p><strong>Watching at C1:</strong> Enjoy all forms of native media without difficulty. Understand implicit cultural references, sophisticated humor, and satire. Analyze language use for its artistic or persuasive effect.</p>",
    "C1_VocabularyBuilding": "<p><strong>Vocabulary at C1:</strong> Master low-frequency vocabulary, specialized terminology in your fields of interest, and subtle idiomatic expressions. Understand the connotations and register of words with precision.</p>",
    "C1_GrammarFocus": "<p><strong>Grammar at C1:</strong> Your grammar should be intuitive. Focus on eliminating any remaining subtle errors and mastering highly idiomatic or complex grammatical constructions used by educated native speakers.</p>",

    // --- C2 Guidance ---
    "C2_general": "<p><strong>C2 - Mastery & Native-Like Nuance:</strong> You have an exceptional command, similar to an educated native speaker. Focus on maintaining this high level, exploring highly specialized topics, and appreciating the deepest cultural and linguistic subtleties. This is about living *in* the language at its most sophisticated.</p>",
    "C2_Reading": "<p><strong>Reading at C2:</strong> Read any form of the written language, including abstract, structurally complex, or highly colloquial literary and non-literary writings. Appreciate stylistic subtleties and authorial voice with ease.</p>",
    "C2_Listening": "<p><strong>Listening at C2:</strong> Effortlessly understand any kind of spoken language, whether live or broadcast, even when delivered at fast native speed with heavy colloquialisms and regional accents.</p>",
    "C2_Writing": "<p><strong>Writing at C2:</strong> Write clear, smoothly flowing, complex texts in an appropriate and effective style and a logical structure that helps the recipient to find significant points. Produce high-quality academic, professional, or creative writing that is indistinguishable from a native's.</p>",
    "C2_Speaking": "<p><strong>Speaking at C2:</strong> Converse with the fluency, accuracy, and spontaneity of a highly articulate native speaker. Handle complex, sensitive, and contentious issues with sophisticated linguistic tools. Use intonation and stress to convey subtle shades of meaning effortlessly.</p>",
    "C2_Watching": "<p><strong>Watching at C2:</strong> Fully appreciate all forms of audio-visual media, understanding sophisticated humor, irony, and cultural subtext as a native would, across all genres and registers.</p>",
    "C2_VocabularyBuilding": "<p><strong>Vocabulary at C2:</strong> Your vocabulary is extensive, precise, and nuanced. Continue to explore neologisms, archaic forms, and highly specific jargon as your interests dictate. Understand the full spectrum of word meanings and uses.</p>",
    "C2_GrammarFocus": "<p><strong>Grammar at C2:</strong> Your grammatical command is near-perfect. Any focus would be on understanding or employing exceptionally rare or complex stylistic variations, or the historical evolution of grammar.</p>"
};

function updateGuidancePanel(currentFilters, cefrOrder, resultsFound) { // Added resultsFound parameter
    const guidancePanel = document.getElementById('dynamic-guidance-panel');
    if (!guidancePanel) return;

    let htmlOutput = "";
    const { cefr = [], immersion = [], category = [], cost = [], platform = [], keyword = "" } = currentFilters;

    let primaryCefrForGuidance = null;
    if (cefr.length === 1) { // If only one CEFR level is selected, that's our primary
        primaryCefrForGuidance = cefr[0];
    } else if (cefr.length > 1) {
        // If multiple CEFR levels are selected, we might just show a generic message or pick one.
        // For now, let's not pick a primary if multiple are selected, to avoid confusion.
        // Or, you could decide to always pick the 'lowest' selected as primary.
        // For this version: if multiple CEFRs, we won't show general CEFR advice unless an immersion is also picked.
    }


    if (primaryCefrForGuidance && immersion.length > 0) {
        // Scenario 1: Specific CEFR + Immersion(s) selected
        // Show advice for each selected immersion strategy AT that primary CEFR level.
        immersion.forEach(immTypeRaw => {
            let immTypeKeyPart = immTypeRaw.replace(/\s+/g, '');
            let specificKey = `${primaryCefrForGuidance}_${immTypeKeyPart}`;
            let cautionKey = `${primaryCefrForGuidance}_${immTypeKeyPart}_Caution`; // Not currently used, but structure is there

            if (guidanceTexts[specificKey]) {
                htmlOutput += guidanceTexts[specificKey]; // The text itself contains the bolded title
            } else if (guidanceTexts[cautionKey]) { // Fallback to caution if specific not found
                 htmlOutput += guidanceTexts[cautionKey];
            } else {
                // Generic fallback for CEFR + Immersion combo without very specific text
                htmlOutput += `<p><strong>Focusing on ${immTypeRaw} at ${primaryCefrForGuidance}:</strong> Aljohn advises tailoring your ${immTypeRaw.toLowerCase()} activities to be challenging yet comprehensible for the ${primaryCefrForGuidance} level. Ensure active engagement and consistent practice.</p>`;
            }
        });
    } else if (primaryCefrForGuidance) {
        // Scenario 2: Only a single CEFR level selected
        const generalKey = `${primaryCefrForGuidance}_general`;
        if (guidanceTexts[generalKey]) {
            htmlOutput += guidanceTexts[generalKey];
        }
    } else if (immersion.length > 0 && cefr.length === 0) {
        // Scenario 3: Only Immersion strategy selected, no CEFR
        htmlOutput = guidanceTexts["no_cefr_for_immersion"];
    } else if (category.length > 0 && cefr.length === 0 && immersion.length === 0) {
        // Scenario 4: Only Tool Type selected
        const selectedToolTypesText = category.join(', ');
        htmlOutput = guidanceTexts["only_tooltype_selected"].replace('[PLACEHOLDER_TOOL_TYPES]', `<strong>${selectedToolTypesText}</strong>`);
    } else if (cost.length > 0 && cefr.length === 0 && immersion.length === 0 && category.length === 0) {
        // Scenario 5: Only Cost selected
        const selectedCostsText = cost.join(', ');
        htmlOutput = guidanceTexts["only_cost_selected"].replace('[PLACEHOLDER_COSTS]', `<strong>${selectedCostsText}</strong>`);
    } else if (platform.length > 0 && cefr.length === 0 && immersion.length === 0 && category.length === 0 && cost.length === 0) {
        // Scenario 6: Only Platform selected
        const selectedPlatformsText = platform.join(', ');
        htmlOutput = guidanceTexts["only_platform_selected"].replace('[PLACEHOLDER_PLATFORMS]', `<strong>${selectedPlatformsText}</strong>`);
    } else {
        // Scenario 7: No results found from filtering OR default state
        if (!resultsFound && (keyword || cefr.length || immersion.length || category.length || cost.length || platform.length)) {
            // Filters are active, but no apps match
            htmlOutput = guidanceTexts["no_results_advice"];
        } else if (keyword && !cefr.length && !immersion.length && !category.length && !cost.length && !platform.length) {
            // Only keyword search is active
             htmlOutput = `<p>Showing search results for "<strong>${keyword}</strong>". Add CEFR and Immersion filters for specific advice from Aljohn!</p>`;
        } else if (cefr.length > 1 && immersion.length === 0) {
            // Multiple CEFR levels selected, no immersion strategy yet
            htmlOutput = `<p>You've selected multiple CEFR levels. To get specific advice from Aljohn, please narrow down to one primary CEFR level or select an immersion strategy to focus on.</p>`
        } else if (Object.values(currentFilters).some(val => Array.isArray(val) ? val.length > 0 : val !== '')) {
            // Some other mix of filters is active, but not the primary CEFR/Immersion combo
            htmlOutput = guidanceTexts["generic_filter_mix"];
        } else {
            // Default message if no filters are active at all
            htmlOutput = guidanceTexts["default"];
        }
    }

    guidancePanel.innerHTML = htmlOutput;
}

// Ensure CEFR_ORDER is defined if guidance_logic.js is used standalone or before filter_sort_logic.js
// It's better to have CEFR_ORDER in a shared utility file or defined in arsenal_main.js and passed around.
// For now, make sure it's loaded before this script, or define it here:
// const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"]; // If not already global from filter_sort_logic.js
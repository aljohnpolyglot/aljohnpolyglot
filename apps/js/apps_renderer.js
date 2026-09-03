document.addEventListener('DOMContentLoaded', () => {
    const appGrid = document.getElementById('app-grid');
    const modal = document.getElementById('app-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const resultsCountEl = document.getElementById('results-count');
    const guidancePanel = document.getElementById('dynamic-guidance-panel');

    // Filter elements
    const searchKeywordInput = document.getElementById('search-keyword');
    const cefrCheckboxes = document.querySelectorAll('#cefr-filter-options input[name="cefr"]');
    const immersionCheckboxes = document.querySelectorAll('#immersion-filter-options input[name="immersion"]');
    const categoryCheckboxes = document.querySelectorAll('#category-filter-options input[name="category"]');
    const costCheckboxes = document.querySelectorAll('#cost-filter-options input[name="cost"]');
    const platformCheckboxes = document.querySelectorAll('#platform-filter-options input[name="platform"]');
    const sortBySelect = document.getElementById('sort-by');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    let currentFilters = {
        keyword: '',
        cefr: [],
        immersion: [],
        category: [],
        cost: [],
        platform: []
    };

    function renderAppCards(appsToRender) {
        appGrid.innerHTML = ''; // Clear existing cards
        if (appsToRender.length === 0) {
            appGrid.innerHTML = '<p class="no-results">No tools match your current filters. Try adjusting them!</p>';
            resultsCountEl.textContent = '0 tools found';
            return;
        }

        resultsCountEl.textContent = `${appsToRender.length} tool(s) found`;

        appsToRender.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.dataset.appId = app.id;

            let ratingStarsHtml = '';
            for (let i = 1; i <= 10; i++) {
                ratingStarsHtml += `<i class="fas fa-star${i > app.rating ? ' muted-star' : ''}"></i>`;
            }
            if (app.rating > 0 && app.rating <= 5) { // Adjust if your rating is 1-5
                 ratingStarsHtml = ''; // Reset
                 for (let i = 1; i <= 5; i++) {
                    ratingStarsHtml += `<i class="fas fa-star${i > app.rating ? ' muted-star' : ''}"></i>`;
                }
            }


            let categoriesHtml = '';
            if (app.primaryCategories && app.primaryCategories.length > 0) {
                app.primaryCategories.slice(0, 3).forEach(cat => { // Show max 3 categories on card
                    categoriesHtml += `<span class="app-category-tag">${getCategoryIcon(cat)} ${cat}</span>`;
                });
            } else if (app.immersionTypes && app.immersionTypes.length > 0) {
                 app.immersionTypes.slice(0,1).forEach(type => { // Fallback to one immersion type
                    categoriesHtml += `<span class="app-category-tag">${getCategoryIcon(type)} ${type}</span>`;
                 });
            }


            card.innerHTML = `
                <div class="app-card-header">
                    <img src="${app.logoUrl}" alt="${app.name} Logo" class="app-card-logo">
                    <div class="app-card-title-section">
                        <h3>${app.name}</h3>
                        <div class="rating-stars">${ratingStarsHtml} (${app.rating}/10)</div>
                    </div>
                </div>
                <p class="app-card-tagline">${app.tagline}</p>
                <div class="app-card-categories">
                    ${categoriesHtml}
                </div>
                <button class="app-card-details-btn">View Details</button>
            `;
            card.querySelector('.app-card-details-btn').addEventListener('click', () => openModal(app.id));
            appGrid.appendChild(card);
        });
    }

    function getCategoryIcon(categoryName) {
        // Simple icon mapping, expand as needed
        const lowerCat = categoryName.toLowerCase();
        if (lowerCat.includes('reading')) return '<i class="fas fa-book-open"></i>';
        if (lowerCat.includes('listening')) return '<i class="fas fa-headphones"></i>';
        if (lowerCat.includes('srs') || lowerCat.includes('vocabulary')) return '<i class="fas fa-brain"></i>';
        if (lowerCat.includes('speaking')) return '<i class="fas fa-comments"></i>';
        if (lowerCat.includes('watching') || lowerCat.includes('content')) return '<i class="fas fa-tv"></i>';
        return '<i class="fas fa-tag"></i>'; // Default tag icon
    }


    function openModal(appId) {
        const app = allAppData.find(a => a.id === appId);
        if (!app) return;

        document.getElementById('modal-app-logo').src = app.logoUrl;
        document.getElementById('modal-app-name').textContent = app.name;
        document.getElementById('modal-app-tagline').textContent = app.tagline;

        let ratingStarsHtml = '';
         for (let i = 1; i <= 10; i++) {
            ratingStarsHtml += `<i class="fas fa-star${i > app.rating ? ' muted-star' : ''}"></i>`;
        }
        document.getElementById('modal-app-rating').innerHTML = `${ratingStarsHtml} (${app.rating}/10)`;


        document.getElementById('modal-app-mytake').innerHTML = app.myTake.replace(/\n/g, '<br>'); // Preserve line breaks

        const prosList = document.getElementById('modal-app-pros');
        prosList.innerHTML = '';
        app.pros.forEach(pro => {
            const li = document.createElement('li');
            li.textContent = pro;
            prosList.appendChild(li);
        });

        const consList = document.getElementById('modal-app-cons');
        consList.innerHTML = '';
        app.cons.forEach(con => {
            const li = document.createElement('li');
            li.textContent = con;
            consList.appendChild(li);
        });

        document.getElementById('modal-app-cefr').textContent = app.cefrSuitability.join(', ');
        document.getElementById('modal-app-immersion-types').textContent = app.immersionTypes.join(', ');
        document.getElementById('modal-app-categories').textContent = app.primaryCategories.join(', ');
        document.getElementById('modal-app-cost').textContent = app.cost;
        document.getElementById('modal-app-platforms').textContent = app.platforms.join(', ');

        const linksContainer = document.getElementById('modal-app-links');
        linksContainer.innerHTML = '';
        if (app.websiteUrl) {
            linksContainer.innerHTML += `<a href="${app.websiteUrl}" target="_blank" class="btn-link btn-website"><i class="fas fa-globe"></i> Website</a>`;
        }
        if (app.androidUrl) {
            linksContainer.innerHTML += `<a href="${app.androidUrl}" target="_blank" class="btn-link btn-platform"><i class="fab fa-android"></i> Android</a>`;
        }
        if (app.iosUrl) {
            linksContainer.innerHTML += `<a href="${app.iosUrl}" target="_blank" class="btn-link btn-platform"><i class="fab fa-apple"></i> iOS</a>`;
        }
        if (app.windowsUrl) {
             linksContainer.innerHTML += `<a href="${app.windowsUrl}" target="_blank" class="btn-link btn-platform"><i class="fab fa-windows"></i> Windows</a>`;
        }
        // Future-proof "Full Review" button
        if (app.fullResourcePageUrl && app.fullResourcePageUrl.trim() !== "") {
            linksContainer.innerHTML += `<a href="${app.fullResourcePageUrl}" target="_blank" class="btn-link btn-full-review">Aljohn's Full Review <i class="fas fa-arrow-right"></i></a>`;
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function updateGuidancePanel() {
        const selectedCefr = currentFilters.cefr;
        let guidanceHtml = '';

        if (selectedCefr.length === 0) {
            guidanceHtml = '<p>Select CEFR level(s) to see tailored advice.</p>';
        } else if (selectedCefr.includes('A1')) {
            guidanceHtml = '<p><strong>For A1:</strong> Focus on absolute basics. Use SRS for core vocabulary (greetings, numbers, common objects/verbs). Simple courses like Language Transfer are great. Watch very basic learner videos with clear visuals.</p>';
        } else if (selectedCefr.includes('A2')) {
            guidanceHtml = '<p><strong>For A2:</strong> Build on your foundation. Continue SRS. Start consuming more native content with support (e.g., dual subtitles on Language Reactor, simplified audio). Consider tools that offer contextual learning for new words (e.g., Webtoon with its visual aids, Immersive Translate for simple texts). Basic conversational practice with AI can begin.</p>';
        } else if (selectedCefr.includes('B1')) {
            guidanceHtml = `<p><strong>For B1:</strong> You're ready for more authentic native content!
                ${currentFilters.immersion.includes('Listening') ? 'Dive into podcasts on familiar topics (Pocket Casts), YouTube channels with clear speakers.' : ''}
                ${currentFilters.immersion.includes('Reading') ? 'Explore news articles, blogs, and simpler novels. Tools like Immersive Translate can help bridge gaps.' : ''}
                Don't be afraid to re-listen/re-read and use transcripts/translations when available. Start engaging in language exchange.</p>`;
        } else if (selectedCefr.includes('B2')) {
             guidanceHtml = '<p><strong>For B2:</strong> Increase exposure to diverse native content across various topics and accents. Focus on understanding nuance and idiomatic expressions. Actively use the language in conversations and writing.</p>';
        } else if (selectedCefr.includes('C1') || selectedCefr.includes('C2')) {
             guidanceHtml = '<p><strong>For C1/C2:</strong> Engage with complex and abstract topics. Refine your expression to be precise and natural. Consume specialized content (academic talks, literature, debates). Maintain fluency through regular, high-level use.</p>';
        }
        // This can be made much more complex with more conditions
        guidancePanel.innerHTML = guidanceHtml;
    }


    function applyFiltersAndSort() {
        // 1. Collect Filter Values
        currentFilters.keyword = searchKeywordInput.value.toLowerCase().trim();
        currentFilters.cefr = Array.from(cefrCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        currentFilters.immersion = Array.from(immersionCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        currentFilters.category = Array.from(categoryCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        currentFilters.cost = Array.from(costCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        currentFilters.platform = Array.from(platformCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

        // 2. Filter Data
        let filteredApps = allAppData.filter(app => {
            const keywordMatch = currentFilters.keyword === '' ||
                                 app.name.toLowerCase().includes(currentFilters.keyword) ||
                                 app.tagline.toLowerCase().includes(currentFilters.keyword) ||
                                 (app.tags && app.tags.some(tag => tag.toLowerCase().includes(currentFilters.keyword)));

            const cefrMatch = currentFilters.cefr.length === 0 ||
                              currentFilters.cefr.some(level => app.cefrSuitability.includes(level));

            const immersionMatch = currentFilters.immersion.length === 0 ||
                                   currentFilters.immersion.some(type => app.immersionTypes.includes(type));

            const categoryMatch = currentFilters.category.length === 0 ||
                                  currentFilters.category.some(cat => app.primaryCategories.includes(cat));

            const costMatch = currentFilters.cost.length === 0 ||
                              currentFilters.cost.includes(app.cost); // Simple match for now

            const platformMatch = currentFilters.platform.length === 0 ||
                                  currentFilters.platform.some(plat => app.platforms.includes(plat));

            return keywordMatch && cefrMatch && immersionMatch && categoryMatch && costMatch && platformMatch;
        });

        // 3. Sort Data
        const sortBy = sortBySelect.value;
        switch (sortBy) {
            case 'rating_desc':
                filteredApps.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating_asc':
                filteredApps.sort((a, b) => a.rating - b.rating);
                break;
            case 'name_asc':
                filteredApps.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                filteredApps.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'cefr_asc': // Sort by the lowest CEFR level an app is suitable for
                filteredApps.sort((a, b) => cefrValue(a.cefrSuitability[0]) - cefrValue(b.cefrSuitability[0]));
                break;
            case 'cefr_desc': // Sort by the highest CEFR level
                filteredApps.sort((a, b) => cefrValue(b.cefrSuitability[b.cefrSuitability.length -1]) - cefrValue(a.cefrSuitability[a.cefrSuitability.length -1]));
                break;
        }

        renderAppCards(filteredApps);
        updateGuidancePanel(); // Update guidance based on new CEFR filter state
    }

    function cefrValue(level) { // Helper for sorting by CEFR
        const order = { "A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5, "C2": 6 };
        return order[level] || 0;
    }


    function setupEventListeners() {
        searchKeywordInput.addEventListener('input', applyFiltersAndSort);
        cefrCheckboxes.forEach(cb => cb.addEventListener('change', applyFiltersAndSort));
        immersionCheckboxes.forEach(cb => cb.addEventListener('change', applyFiltersAndSort));
        categoryCheckboxes.forEach(cb => cb.addEventListener('change', applyFiltersAndSort));
        costCheckboxes.forEach(cb => cb.addEventListener('change', applyFiltersAndSort));
        platformCheckboxes.forEach(cb => cb.addEventListener('change', applyFiltersAndSort));
        sortBySelect.addEventListener('change', applyFiltersAndSort);

        modalCloseBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
        // Close modal with Escape key
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });

        resetFiltersBtn.addEventListener('click', () => {
            searchKeywordInput.value = '';
            document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => cb.checked = false);
            // sortBySelect.value = 'rating_desc'; // Optionally reset sort
            applyFiltersAndSort();
        });
    }
const guidanceTexts = {
    "default": "Welcome to Aljohn's Polyglot Arsenal! Select your CEFR level(s) and desired Immersion Strategy to get personalized advice and tool recommendations based on my methods.",
    "multi_cefr_selected": "You've selected multiple CEFR levels. My advice will focus on building from the lowest selected level. Remember, strategies must evolve as you progress!",

    // --- A1 Guidance ---
    "A1_general": "<strong>A1 - The Absolute Beginning:</strong> Your mission is to build the raw frame of the language. Focus on absorbing sounds, basic sentence structures, and core vocabulary. Don't stress about perfect output yet. This is about input and familiarization. Think of it as laying the groundwork before construction.",
    "A1_Reading": "<strong>A1 Reading:</strong> Start with what's familiar! Re-read books you love (like Harry Potter) but in your target language. Use tools like ReadEra with tap-to-translate. The goal is GIST comprehension. Add new words WITH example sentences to Anki. Even simple online comments in your target language are valuable early exposure.",
    "A1_Listening": "<strong>A1 Listening:</strong> Tune into 'learner podcasts' with transcripts. Watch very basic videos with clear visuals (e.g., Peppa Pig if it exists in your TL!). Use Language Reactor for dual subtitles initially. The aim is to get your ear accustomed to the sounds and rhythm. Don't expect full understanding.",
    "A1_Writing": "<strong>A1 Writing:</strong> Keep it simple. Copy sentences, write basic phrases about your day. The goal is to make initial connections, not produce essays. Reinforce with Anki.",
    "A1_Speaking": "<strong>A1 Speaking:</strong> Focus on mimicking sounds. Repeat phrases from your audio/video lessons. Active listening IS your primary speaking prep now. Don't force conversations.",
    "A1_Watching": "<strong>A1 Watching:</strong> Content for learners or simple native content with strong visual cues. Dual subtitles (Language Reactor) are your friend at this stage. The goal is to link sounds to meaning and visuals.",
    "A1_Vocabulary Building": "<strong>A1 Vocabulary:</strong> Anki is your best friend from DAY ONE. Start with 50-100 new, high-frequency words/phrases daily, with images and contextual sentences. Consistency is everything. This is non-negotiable for building your core.",

    // --- A2 Guidance ---
    "A2_general": "<strong>A2 - Building on the Foundation:</strong> You're past the initial shock! Now, expand your vocabulary (Anki!) and start engaging with more varied, simple native content. Comprehension is still key, but you can begin very gentle output.",
    "A2_Reading": "<strong>A2 Reading:</strong> Move to slightly more complex but still comprehensible texts. Graded readers, simple news articles, or Webtoons are great. Continue to add new words WITH context to Anki diligently. If you're brave and know English well, try Immersive Translate for English books into your TL.",
    "A2_Listening": "<strong>A2 Listening:</strong> Transition from learner podcasts to simpler native podcasts on topics you find interesting. Continue using target language subtitles. You should be able to grasp main ideas now.",
    "A2_Writing": "<strong>A2 Writing:</strong> Start a simple daily diary. Write about your day, what you learned. Don't worry about perfection. Use translators like DeepL to help phrase things initially, but try to construct your own sentences first.",
    "A2_Speaking": "<strong>A2 Speaking:</strong> Practice with AI tools like Gliglish or ChatGPT's voice mode. Focus on forming basic sentences and getting comfortable with pronunciation. Low-pressure output is key.",
    "A2_Watching": "<strong>A2 Watching:</strong> Increase your intake of native YouTube content with target language subtitles. Start to notice common phrases and sentence patterns. Explore content related to your hobbies.",
    "A2_Vocabulary Building": "<strong>A2 Vocabulary:</strong> Keep hammering Anki! Your deck should be growing steadily. Focus on words from your authentic reading and listening. Context is crucial for retention.",

    // --- B1 Guidance ---
    "B1_general": "<strong>B1 - The Intermediate Leap:</strong> This is where intuition starts to build! Massive comprehensible input is your mantra. Aim to *feel* the language. Start actively using the language in writing and speaking more consistently. Track your immersion hours – they matter!",
    "B1_Reading": "<strong>B1 Reading:</strong> Dive into native books, blogs, and news on topics you genuinely enjoy. Your reading speed and comprehension should be noticeably increasing. Keep Anki updated!",
    "B1_Listening": "<strong>B1 Listening:</strong> Fill ALL your 'dead time' (exercise, chores, commute) with target language podcasts and audiobooks (Pocket Casts is great for this). Listen to diverse native content. Aim for understanding the main flow and arguments.",
    "B1_Writing": "<strong>B1 Writing:</strong> Daily journaling is crucial. Express opinions, summarize things you've watched/read. Use ChatGPT to get phrasing ideas or correct specific sentences, but write the bulk yourself. Consider writing school/work assignments in your TL first (Aljohn's hack!).",
    "B1_Speaking": "<strong>B1 Speaking:</strong> Actively seek out speaking opportunities. Join language exchange platforms like Tandem or Discord (e.g., Language Sloth). Record video journals. Focus on fluency over perfection. Initial conversations can be challenging but are vital.",
    "B1_Watching": "<strong>B1 Watching:</strong> Immerse in native YouTube, TV shows, and movies WITH TARGET LANGUAGE SUBTITLES ONLY. Create separate YouTube accounts per language to fine-tune your recommendations. A VPN might be needed for geo-restricted content.",
    "B1_Vocabulary Building": "<strong>B1 Vocabulary:</strong> Your Anki deck should be robust (aim for 2500+ well-reviewed words/phrases). Focus on nuanced words and idioms from your native content consumption. Understand collocations.",

    // --- B2 Guidance ---
    "B2_general": "<strong>B2 - Towards Independence:</strong> You can operate quite well in the language. Focus on increasing the complexity and variety of your input. Refine your output for more accuracy and naturalness. You should be able_thinking_ more directly in the language now.",
    "B2_Reading": "<strong>B2 Reading:</strong> Engage with more challenging native texts: literature, opinion pieces, specialized articles. Pay attention to style, tone, and author's intent.",
    "B2_Listening": "<strong>B2 Listening:</strong> Listen to faster-paced conversations, debates, and content with regional accents or slang. Your ability to infer meaning from context should be strong.",
    "B2_Writing": "<strong>B2 Writing:</strong> Write more complex texts: argumentative essays, detailed reports, summaries of nuanced topics. Focus on logical structure and appropriate vocabulary. Seek feedback if possible.",
    "B2_Speaking": "<strong>B2 Speaking:</strong> Engage in longer, more complex conversations. Discuss abstract topics and defend your opinions. Work on reducing hesitation and improving flow. Consider a few iTalki sessions for targeted feedback.",
    "B2_Watching": "<strong>B2 Watching:</strong> Watch a wide range of native content without relying on subtitles if possible, or use them to catch nuances. Understand cultural references and humor.",
    "B2_Vocabulary Building": "<strong>B2 Vocabulary:</strong> Focus on synonyms, antonyms, idiomatic expressions, and collocations. Use monolingual dictionaries when possible to deepen understanding.",

    // --- C1 Guidance ---
    "C1_general": "<strong>C1 - Advanced Fluency & Precision:</strong> You're highly proficient. The game now is about nuance, style, and mastering subtle aspects of the language. Engage with complex, authentic material and interact with native speakers on a deep level.",
    "C1_Reading": "<strong>C1 Reading:</strong> Tackle sophisticated literature, academic texts, and culturally dense material. Analyze writing styles and rhetorical devices.",
    "C1_Listening": "<strong>C1 Listening:</strong> Understand virtually all spoken language, including fast native speech, lectures, and media with complex language or strong accents. Pick up on implied meanings.",
    "C1_Writing": "<strong>C1 Writing:</strong> Produce well-structured, clear, and stylistically appropriate texts on complex subjects. Use a wide range of vocabulary and grammatical structures with precision. Get feedback on nuance and register.",
    "C1_Speaking": "<strong>C1 Speaking:</strong> Express yourself fluently, spontaneously, and precisely. Differentiate finer shades of meaning. Participate effectively in demanding conversations and debates. Shadow native speakers for accent refinement.",
    "C1_Watching": "<strong>C1 Watching:</strong> Enjoy all forms of native media without difficulty. Understand implicit cultural references, humor, and satire. Analyze language use for its artistic or persuasive effect.",
    "C1_Vocabulary Building": "<strong>C1 Vocabulary:</strong> Master low-frequency vocabulary, specialized terminology in your fields of interest, and subtle idiomatic expressions. Understand the connotations of words.",

    // --- C2 Guidance ---
    "C2_general": "<strong>C2 - Mastery & Native-Like Nuance:</strong> You have an exceptional command of the language, similar to an educated native speaker. Focus on maintaining this high level, exploring highly specialized topics, and appreciating the deepest cultural and linguistic subtleties.",
    "C2_Reading": "<strong>C2 Reading:</strong> Read any form of the written language, including abstract, structurally complex, or highly colloquial literary and non-literary writings. Appreciate stylistic subtleties.",
    "C2_Listening": "<strong>C2 Listening:</strong> Effortlessly understand any kind of spoken language, whether live or broadcast, even when delivered at fast native speed with colloquialisms and regional accents.",
    "C2_Writing": "<strong>C2 Writing:</strong> Write clear, smoothly flowing, complex texts in an appropriate and effective style and a logical structure which helps the recipient to find significant points. Produce high-quality academic or professional writing.",
    "C2_Speaking": "<strong>C2 Speaking:</strong> Converse with the fluency, accuracy, and spontaneity of a highly articulate native speaker. Handle complex, sensitive, and contentious issues with ease. Use intonation and stress to convey subtle shades of meaning.",
    "C2_Watching": "<strong>C2 Watching:</strong> Fully appreciate all forms of audio-visual media, understanding sophisticated humor, irony, and cultural subtext as a native would.",
    "C2_Vocabulary Building": "<strong>C2 Vocabulary:</strong> Your vocabulary is extensive and precise. Continue to explore neologisms, archaic forms, and highly specific jargon as your interests dictate."
};

// The rest of your apps_renderer.js (applyFiltersAndSort, openModal, etc.) would remain largely the same.
// The key change is in how `updateGuidancePanel` constructs its output using this richer `guidanceTexts` object.

function updateGuidancePanel() {
    const selectedCefr = currentFilters.cefr;
    const selectedImmersion = currentFilters.immersion;
    let htmlOutput = "";

    if (selectedCefr.length === 0 && selectedImmersion.length === 0) {
        htmlOutput = `<p>${guidanceTexts["default"]}</p>`;
    } else if (selectedCefr.length > 0) {
        const sortedCefr = selectedCefr.sort((a, b) => cefrValue(a) - cefrValue(b)); // Sort A1, A2, B1...
        
        if (selectedCefr.length > 1) {
             htmlOutput += `<p><strong>Multiple Levels Selected:</strong> My advice will build from the foundational levels upwards. Remember, strategies must evolve!</p>`;
        }

        sortedCefr.forEach(level => {
            let generalKey = `${level}_general`;
            if (guidanceTexts[generalKey]) {
                htmlOutput += `<div class="guidance-section"><h4>Guidance for ${level}:</h4><p>${guidanceTexts[generalKey]}</p></div>`;
            }

            if (selectedImmersion.length > 0) {
                selectedImmersion.forEach(immTypeRaw => {
                    // Normalize immersionType key if needed (e.g. "Vocabulary Building" -> "VocabularyBuilding")
                    let immTypeKeyPart = immTypeRaw.replace(/\s+/g, ''); // Remove spaces for key lookup
                    let specificKey = `${level}_${immTypeKeyPart}`;
                    
                    if (guidanceTexts[specificKey]) {
                        htmlOutput += `<div class="guidance-subsection"><h5>${immTypeRaw} at ${level}:</h5><p>${guidanceTexts[specificKey]}</p></div>`;
                    } else {
                        // Generic fallback if very specific advice isn't written yet
                        // You could add a generic "Too high/low for this strategy at this level" message here if desired
                        // For example:
                        // if ( (level === 'A1' || level === 'A2') && (immTypeKeyPart === 'Speaking' || immTypeKeyPart === 'Writing') && some_condition_for_too_high_strategy) {
                        //    htmlOutput += `<p><strong>${immTypeRaw} at ${level}:</strong> While direct ${immTypeRaw.toLowerCase()} is less emphasized at this stage, ensure you're building a strong foundation through input. You can still do very simple exercises.</p>`;
                        // }
                    }
                });
            }
        });
    } else if (selectedImmersion.length > 0 && selectedCefr.length === 0) {
        // Only immersion selected, no CEFR. Provide general advice about that immersion strategy.
        htmlOutput += `<p>Please select a CEFR level to get specific advice on your chosen immersion strategies. In general, for <strong>${selectedImmersion.join('/')}</strong>, ensure you...</p>`; // Add generic advice here
    }


    if (htmlOutput === "") { // Fallback if no conditions met (shouldn't happen with default)
        htmlOutput = `<p>${guidanceTexts["default"]}</p>`;
    }

    guidancePanel.innerHTML = htmlOutput;
}

// Ensure cefrValue is available if you use it within updateGuidancePanel or elsewhere
// function cefrValue(level) { ... } from previous script
    // Initial Render
    applyFiltersAndSort();
    setupEventListeners();
});

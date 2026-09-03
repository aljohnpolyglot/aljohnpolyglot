// D:\website\resources\visualizer\visualizer.js

document.addEventListener('DOMContentLoaded', function() { // Ensure DOM is ready

    const pathwayData = {
        "a1a2": {
            title: "A1 - A2: The Beginner Stage – Laying the Foundation",
            goal: "Build the absolute basics — like constructing the frame of a house. The key here is exposure and comprehension, not output.",
            mindset: "Assume you know nothing. Focus on input and absorption.",
            actions: [
                "Get used to sounds & basic sentence structure (briefly).",
                "Understand the 'logic' and core grammar of the language.",
                "Start building your core vocabulary with Spaced Repetition System (SRS).",
                "Read simple texts (e.g., familiar stories, basic articles).",
                "Focus on understanding the general idea without translating every word."
            ],
            apps: [
                // IMPORTANT: Ensure 'id' matches the id attribute of the app card in apps.html
                // Ensure 'logo' path is correct relative to apps.html (e.g., '../images/logo-name.png')
                { name: "Language Transfer", id: "app-languagetransfer", logo: "../images/logo-languagetransfer.png" },
                { name: "Anki", id: "app-anki", logo: "../images/logo-anki.png" },
                { name: "ReadEra", id: "app-readera", logo: "../images/logo-readera.png" },
                { name: "Duolingo (briefly)", id: "app-duolingo", logo: "../images/logo-duolingo.png" }
            ],
            milestone: "When you can read simple texts and understand the general idea without translating every word, and you’ve got around 1000 well-reviewed words in Anki, move forward."
        },
        "b1b2": {
            title: "B1 - B2: The Intermediate Stage – Building Intuition & Immersion",
            goal: "Transition from conscious learning to subconscious acquisition. The goal is to *feel* the language.",
            mindset: "You understand a good chunk but still think in your native language. It’s time to bridge that gap with massive input and gentle output.",
            actions: [
                "Engage in MASSIVE input: read native content you enjoy, watch videos/shows (target language subtitles), listen to podcasts/audiobooks.",
                "Continuously build vocabulary with Anki (aim for 2500+ words).",
                "Start daily journaling to process thoughts in the language.",
                "Practice speaking: record video journals, use AI partners, chat with native speakers.",
                "Track your immersion hours actively."
            ],
            apps: [
                { name: "YouTube", id: "app-youtube", logo: "../images/logo-youtube.png" },
                { name: "Pocket Casts", id: "app-pocketcasts", logo: "../images/logo-pocketcasts.png" },
                { name: "ReadEra", id: "app-readera", logo: "../images/logo-readera.png" },
                { name: "Anki", id: "app-anki", logo: "../images/logo-anki.png" },
                { name: "ChatGPT (for practice/writing help)", id: "app-chatgpt", logo: "../images/logo-chatgpt.png" },
                { name: "Gliglish", id: "app-gliglish", logo: "../images/logo-gliglish.png" },
                { name: "Tandem", id: "app-tandem", logo: "../images/logo-tandem.png" },
                { name: "Language Sloth Discord", id: "app-languagesloth", logo: "../images/logo-discord.png" },
                { name: "DeepL", id: "app-deepl", logo: "../images/logo-deepl.png" } // Assuming you have a general DeepL card
                // { name: "Google Translate (for lookups)", id: "app-googletranslate", logo: "../images/logo-googletranslate.png" }
            ],
            milestone: "You can now understand most native content without needing subtitles, and hold basic conversations about familiar topics."
        },
        "c1c2": {
            title: "C1 - C2: The Advanced Stage – Polishing & Sounding Native",
            goal: "Fluency, depth, and nuance. You’re functional — now you want to be smooth and natural.",
            mindset: "Focus on subtle details. This is where things like tone, register, idioms, and accent come in.",
            actions: [
                "Engage in intensive native interaction regularly (conversations, debates).",
                "Practice shadowing/mimicking a native speaker's accent and intonation.",
                "Consume advanced content: documentaries, debates, dialect-heavy material.",
                "Refine output: write complex essays, discuss abstract themes, get tutor feedback.",
                "Target tricky grammar points and deepen vocabulary with monolingual dictionaries."
            ],
            apps: [
                { name: "iTalki", id: "app-italki", logo: "../images/logo-italki.png" },
                { name: "Tandem", id: "app-tandem", logo: "../images/logo-tandem.png" },
                { name: "Language Sloth Discord", id: "app-languagesloth", logo: "../images/logo-discord.png" },
                { name: "ChatGPT (for advanced practice/refinement)", id: "app-chatgpt", logo: "../images/logo-chatgpt.png" },
                { name: "Reverso Context", id: "app-reversocontext", logo: "../images/logo-reversocontext.png" },
                { name: "YouTube (advanced content)", id: "app-youtube", logo: "../images/logo-youtube.png" },
                { name: "Pocket Casts (native podcasts)", id: "app-pocketcasts", logo: "../images/logo-pocketcasts.png" }
            ],
            milestone: "This is an ongoing process of refinement and maintaining high-level fluency."
        }
    };

    const levelButtons = document.querySelectorAll('.level-btn');
    const pathwayDetailsOutput = document.getElementById('pathwayDetailsOutput');

    if (pathwayDetailsOutput && levelButtons.length > 0) { // Check if elements exist
        levelButtons.forEach(button => {
            button.addEventListener('click', () => {
                levelButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const level = button.dataset.level;
                const data = pathwayData[level];

                if (data) {
                    let appsHtml = data.apps.map(app =>
                        `<a href="#${app.id}" class="app-link">
                           ${app.logo ? `<img src="${app.logo}" alt="${app.name} logo" class="app-icon-small">` : ''}
                           ${app.name}
                         </a>`
                    ).join('');

                    pathwayDetailsOutput.innerHTML = `
                        <h3>${data.title}</h3>
                        <h4>Your Goal:</h4>
                        <p>${data.goal}</p>
                        <h4>Your Mindset:</h4>
                        <p>${data.mindset}</p>
                        <h4>Key Actions & Focus:</h4>
                        <ul>
                            ${data.actions.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                        <h4>Recommended Tools for this Stage:</h4>
                        <div class="recommended-apps-list">${appsHtml}</div>
                        <h4>Milestone to Aim For:</h4>
                        <p>${data.milestone}</p>
                    `;
                    pathwayDetailsOutput.classList.remove('hidden');

                    const detailsRect = pathwayDetailsOutput.getBoundingClientRect();
                    if (detailsRect.top < 0 || detailsRect.bottom > window.innerHeight) {
                         pathwayDetailsOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } else {
                    pathwayDetailsOutput.innerHTML = `<p>Information for this level is not available yet.</p>`;
                    pathwayDetailsOutput.classList.remove('hidden');
                }
            });
        });
    }


    // Smooth scroll for internal app links and auto-open app details
    document.addEventListener('click', function (event) {
        const link = event.target.closest('.app-link'); // More robust selector
        if (link && link.hash !== "") {
            event.preventDefault();
            const hash = link.hash;
            const targetElement = document.querySelector(hash);

            if (targetElement) {
                const appCardContainer = targetElement.closest('.app-card-container'); // targetElement is the card itself
                if (appCardContainer) { // Should always be true if targetElement is the card
                    const detailsDiv = appCardContainer.querySelector('.app-details');
                    const toggleButton = appCardContainer.querySelector('.toggle-details-btn');

                    if (detailsDiv && !detailsDiv.classList.contains('details-visible') && toggleButton) {
                        toggleButton.click(); // Simulate click to open details
                    }
                }

                setTimeout(() => {
                     targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 100); // Adjust delay if needed for details to expand
            }
        }
    });

    // --- Toggle App Details Functionality (for the main app cards) ---
    const appGrids = document.querySelectorAll('.app-grid');
    if (appGrids.length > 0) { // Check if app grids exist
        appGrids.forEach(grid => {
            grid.addEventListener('click', function(event) {
                const button = event.target.closest('.toggle-details-btn');
                if (!button) return;
                event.preventDefault();
                const appCardContainer = button.closest('.app-card-container');
                if (!appCardContainer) return;
                const detailsDiv = appCardContainer.querySelector('.app-details');
                if (!detailsDiv) return;
                const isVisible = detailsDiv.classList.toggle('details-visible');
                if (isVisible) {
                    button.innerHTML = 'Hide Details <i class="fas fa-chevron-up"></i>';
                } else {
                    button.innerHTML = 'View Details <i class="fas fa-chevron-down"></i>';
                }
            });
        });
    }

}); // End of DOMContentLoaded
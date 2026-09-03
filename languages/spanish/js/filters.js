
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENTOS DEL DOM Y DATOS ---
    const cefrSlider = document.getElementById('cefr-slider');
    const countryFilter = document.getElementById('country-filter');
    const cefrDescription = document.getElementById('cefr-description');
    const shelvesWrapper = document.getElementById('shelves-wrapper');

    if (!cefrSlider || !countryFilter || !shelvesWrapper || typeof creatorsData === 'undefined') {
        console.error("Faltan elementos de filtro o el archivo creators-data.js.");
        return;
    }

    const allCards = Array.from(shelvesWrapper.querySelectorAll('.creator-card'));
    const cefrLevels = ['Todos', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const cefrDescriptions = {
        'Todos': 'Muestra todos los recursos disponibles, sin importar el nivel de dificultad.',
        'A1': '<strong>Qué esperar:</strong> Entenderás palabras y frases muy básicas. El contenido será muy lento, claro y repetitivo, a menudo con mucho apoyo visual.',
        'A2': '<strong>Qué esperar:</strong> Podrás seguir diálogos sencillos sobre temas familiares. El habla sigue siendo lenta, pero con un vocabulario un poco más amplio.',
        'B1': '<strong>Qué esperar:</strong> Comprenderás los puntos principales de conversaciones claras sobre temas cotidianos. El contenido empieza a sentirse más natural.',
        'B2': '<strong>Qué esperar:</strong> Podrás seguir la trama principal de series y entender conversaciones a una velocidad casi normal, siempre que el tema sea familiar.',
        'C1': '<strong>Qué esperar:</strong> Entenderás contenido hecho para nativos sin adaptar, incluyendo algo de jerga y expresiones idiomáticas. El habla será rápida y natural.',
        'C2': '<strong>Qué esperar:</strong> Comprenderás prácticamente todo, incluyendo contenido con mucho humor, dobles sentidos, acentos difíciles o temas muy técnicos.'
    };

    // --- 2. FUNCIONES PRINCIPALES ---
    function populateCountryFilter() {
        countryFilter.innerHTML = '<option value="all">🌍 Todos los países</option>';

        const uniqueCountries = new Map();
        creatorsData.forEach(creator => {
            if (creator.country && creator.country !== 'N/A') {
                const normalized = creator.country.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (!uniqueCountries.has(normalized)) {
                    uniqueCountries.set(normalized, { original: creator.country, code: creator.flagCode });
                }
            }
        });

        const sortedCountries = Array.from(uniqueCountries.values())
            .sort((a, b) => a.original.localeCompare(b.original));

        sortedCountries.forEach(countryInfo => {
            const flagEmoji = countryInfo.code ? getFlagEmoji(countryInfo.code) : '🏳️';
            const option = document.createElement('option');
            option.value = countryInfo.original;
            option.textContent = `${flagEmoji} ${countryInfo.original}`;
            countryFilter.appendChild(option);
        });
    }

    function updateCefrDescription() {
        const level = cefrLevels[cefrSlider.value];
        cefrDescription.innerHTML = cefrDescriptions[level] || cefrDescriptions['Todos'];
    }
    
    function applyFilters() {
        const selectedLevel = cefrLevels[cefrSlider.value];
        const selectedCountry = countryFilter.value;

        allCards.forEach(card => {
            const creatorId = card.dataset.creatorId;
            const creator = creatorsData.find(c => c.id === creatorId);
            if (!creator) return;

            const levelMatch = (selectedLevel === 'Todos') || creator.cefr.includes(selectedLevel);
            const countryMatch = (selectedCountry === 'all') || creator.country === selectedCountry;

            if (levelMatch && countryMatch) {
                card.classList.remove('is-hidden');
            } else {
                card.classList.add('is-hidden');
            }
        });
    }

    function getFlagEmoji(countryCode) {
        const flags = { es: '🇪🇸', mx: '🇲🇽', co: '🇨🇴', ar: '🇦🇷', ve: '🇻🇪', cl: '🇨🇱', pe: '🇵🇪', ec: '🇪🇨', uy: '🇺🇾', pa: '🇵🇦', us: '🇺🇸', ca: '🇨🇦', se: '🇸🇪', au: '🇦🇺', kr: '🇰🇷', za: '🇿🇦', pr: '🇵🇷', ph: '🇵🇭' };
        return flags[countryCode] || '🏳️';
    }

    // --- 3. EVENT LISTENERS ---
    cefrSlider.addEventListener('input', () => {
        updateCefrDescription();
        applyFilters();
    });

    countryFilter.addEventListener('change', applyFilters);

    // --- 4. INICIALIZACIÓN ---
    populateCountryFilter();
    updateCefrDescription();
});
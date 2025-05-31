// js/utils/helpers.js

window.polyglotHelpers = (() => { // Encapsulate in IIFE

    const isConnectorCurrentlyActive = (connector) => {
        if (!connector || !connector.sleepSchedule || !connector.sleepSchedule.wake || !connector.sleepSchedule.sleep) {
            return true;
        }
        try {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            const [wakeHour, wakeMinute] = connector.sleepSchedule.wake.split(':').map(Number);
            const [sleepHour, sleepMinute] = connector.sleepSchedule.sleep.split(':').map(Number);

            if (isNaN(currentHour) || isNaN(currentMinutes) || isNaN(wakeHour) || isNaN(wakeMinute) || isNaN(sleepHour) || isNaN(sleepMinute)) {
                console.warn("polyglotHelpers.isConnectorCurrentlyActive: Invalid time format for", connector.id);
                return true;
            }
            const currentTimeInMinutes = currentHour * 60 + currentMinutes;
            const wakeTimeInMinutes = wakeHour * 60 + wakeMinute;
            let sleepTimeInMinutes = sleepHour * 60 + sleepMinute;

            if (sleepTimeInMinutes < wakeTimeInMinutes) { // Sleep time is on the next day
                return (currentTimeInMinutes >= wakeTimeInMinutes || currentTimeInMinutes < sleepTimeInMinutes);
            } else { // Sleep time is on the same day
                return (currentTimeInMinutes >= wakeTimeInMinutes && currentTimeInMinutes < sleepTimeInMinutes);
            }
        } catch (e) {
            console.error("polyglotHelpers.isConnectorCurrentlyActive: Error for", connector.id, ":", e);
            return true;
        }
    };

    const calculateAge = function(birthdateString) {
        if (!birthdateString) return null;
        try {
            const birthDate = new Date(birthdateString);
            if (isNaN(birthDate.getTime())) {
                console.warn("polyglotHelpers.calculateAge: Invalid date:", birthdateString);
                return null;
            }
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 0 ? age : null;
        } catch (e) {
            console.error("polyglotHelpers.calculateAge: Error for:", birthdateString, e);
            return null;
        }
    };

    // getFlagCdnUrl now delegates to flagLoader
    const getFlagCdnUrl = (countryCode, width = null) => { // width is kept for compatibility but ignored by flagLoader for SVGs
        if (window.flagLoader && typeof window.flagLoader.getFlagUrl === 'function') {
            return window.flagLoader.getFlagUrl(countryCode);
        }
        console.warn("polyglotHelpers.getFlagCdnUrl: flagLoader not available. Returning fallback.");
        return 'images/flags/unknown.png'; // Fallback if flagLoader isn't ready
    };

    const getFlagEmoji = (countryCode) => {
        if (!countryCode || typeof countryCode !== 'string') return '🏳️';
        const cc = countryCode.toUpperCase().trim();
        const flagEmojis = {
            FR: "🇫🇷", ES: "🇪🇸", MX: "🇲🇽", AR: "🇦🇷", CO: "🇨🇴", DE: "🇩🇪", AT: "🇦🇹", CH: "🇨🇭",
            IT: "🇮🇹", PT: "🇵🇹", BR: "🇧🇷", RU: "🇷🇺", SE: "🇸🇪", ID: "🇮🇩", GB: "🇬🇧",
            US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺", NZ: "🇳🇿", PH: "🇵🇭", JP: "🇯🇵", KR: "🇰🇷", CN: "🇨🇳"
        };
        return flagEmojis[cc] || '🏳️';
    };

    const saveToLocalStorage = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error("polyglotHelpers.saveToLocalStorage: Error saving key:", key, e);
        }
    };

    const loadFromLocalStorage = (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("polyglotHelpers.loadFromLocalStorage: Error loading key:", key, e);
            return null;
        }
    };

    const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    const simulateTypingDelay = (baseDelayMs = 1500, messageLength = 0) => {
        const lenF = Math.min(Math.floor(messageLength / 15) * 100, 1500);
        const randF = (Math.random() - 0.5) * 400;
        return Math.max(400, baseDelayMs + lenF + randF);
    };

    const sanitizeTextForDisplay = (text) => {
        if (typeof text !== 'string') return '';
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    };

    const debounce = (func, delay) => {
        let t;
        return function(...a) {
            const c = this;
            clearTimeout(t);
            t = setTimeout(() => func.apply(c, a), delay);
        };
    };

    const speakText = (text, lang = 'en-US', voiceName = null) => {
        if (!text || typeof text !== 'string' || !window.speechSynthesis) {
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        if (voiceName) {
            const voices = window.speechSynthesis.getVoices(); // Call getVoices() inside, after onvoiceschanged might have fired
            const selectedVoice = voices.find(voice => voice.name === voiceName && voice.lang === lang);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            } else {
                const langVoice = voices.find(voice => voice.lang === lang || voice.lang.startsWith(lang.substring(0,2)));
                if (langVoice) utterance.voice = langVoice;
            }
        }
        window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
            // console.log("Speech synthesis voices loaded/changed.");
        };
    } else if (window.speechSynthesis) {
        // For browsers that load voices immediately (e.g., some versions of Chrome)
        // or don't fire onvoiceschanged reliably.
        // We might need to call getVoices() once here to populate the list if 'speakText' is called very early.
        window.speechSynthesis.getVoices();
    }


    console.log("utils/helpers.js loaded.");
    return {
        isConnectorCurrentlyActive,
        calculateAge,
        getFlagCdnUrl,
        getFlagEmoji,
        saveToLocalStorage,
        loadFromLocalStorage,
        generateUUID,
        simulateTypingDelay,
        sanitizeTextForDisplay,
        debounce,
        speakText
    };
})();
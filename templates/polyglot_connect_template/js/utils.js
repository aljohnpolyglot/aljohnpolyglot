// js/utils.js

window.polyglotUtils = {
    // --- TIMEZONE & ACTIVITY ---
    isConnectorCurrentlyActive: (connector, userCurrentUTCDate = new Date()) => {
        if (!connector || !connector.activeTimezone || !connector.sleepSchedule || !connector.sleepSchedule.wake || !connector.sleepSchedule.sleep) {
            // console.warn("Connector active status: Incomplete schedule/timezone data for", connector.id, "defaulting to active.");
            return true; // Default to active if schedule info is missing
        }
        try {
            const now = new Date(); // User's local time

            // THIS IS STILL A SIMPLIFIED PLACEHOLDER FOR TIMEZONE LOGIC.
            // A proper solution requires a timezone library (e.g., date-fns-tz, Moment Timezone)
            // to accurately convert 'now' (user's local time or UTC) to the connector's 'activeTimezone'.
            // For this demo, we are essentially comparing the user's local current hour
            // against the connector's defined schedule hours, assuming they are in a comparable context.
            // This will NOT be accurate for users in different timezones from the server/developer.

            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();

            const [wakeHour, wakeMinute] = connector.sleepSchedule.wake.split(':').map(Number);
            const [sleepHour, sleepMinute] = connector.sleepSchedule.sleep.split(':').map(Number);

            // Validate parsed times
            if (isNaN(currentHour) || isNaN(currentMinutes) || isNaN(wakeHour) || isNaN(wakeMinute) || isNaN(sleepHour) || isNaN(sleepMinute)) {
                // console.warn("Could not parse time components for connector schedule:", connector.id);
                return true; // Default to active if time parsing fails
            }

            const currentTimeInMinutes = currentHour * 60 + currentMinutes;
            const wakeTimeInMinutes = wakeHour * 60 + wakeMinute;
            let sleepTimeInMinutes = sleepHour * 60 + sleepMinute;

            // Handle schedules that cross midnight (e.g., wake 22:00, sleep 06:00)
            if (sleepTimeInMinutes < wakeTimeInMinutes) {
                // Active if current time is after wake time (on the same day)
                // OR current time is before sleep time (on the next day, effectively)
                if (currentTimeInMinutes >= wakeTimeInMinutes || currentTimeInMinutes < sleepTimeInMinutes) {
                    return true;
                }
            } else { // Sleep time is on the same day as wake time (e.g., wake 07:00, sleep 23:00)
                // Active if current time is after wake time AND before sleep time
                if (currentTimeInMinutes >= wakeTimeInMinutes && currentTimeInMinutes < sleepTimeInMinutes) {
                    return true;
                }
            }
            return false; // Asleep
        } catch (e) {
            console.error("Error calculating connector active status for", connector.id, ":", e);
            return true; // Default to active on error
        }
    },

    calculateAge: function(birthdateString) {
        if (!birthdateString) return null;
        try {
            const birthDate = new Date(birthdateString);
            // Check if the birthDate is a valid date
            if (isNaN(birthDate.getTime())) {
                // console.warn("Invalid birthdate string for age calculation:", birthdateString);
                return null;
            }
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 0 ? age : null; // Return null if age is negative (e.g., future birthdate)
        } catch (e) {
            console.error("Error calculating age for:", birthdateString, e);
            return null;
        }
    },

    // --- FLAG CDN & EMOJI ---
    getFlagCdnUrl: (countryCode, width = 20) => {
        if (!countryCode || typeof countryCode !== 'string') {
            // Return a path to a local placeholder unknown flag if desired
            return `images/flags/unknown.png`; // Make sure you have this placeholder
        }
        // Sanitize country code slightly (lowercase, trim)
        const sanitizedCode = countryCode.toLowerCase().trim();
        if (sanitizedCode.length !== 2) {
             // console.warn("Invalid country code for FlagCDN:", countryCode);
             return `images/flags/unknown.png`;
        }
        return `https://flagcdn.com/w${width}/${sanitizedCode}.png`;
    },

    getFlagEmoji: (countryCode) => {
        if (!countryCode || typeof countryCode !== 'string') return '🏳️'; // Default white flag emoji
        const cc = countryCode.toUpperCase().trim();
        // Basic mapping, this can be expanded or a more sophisticated library used for full coverage
        const flagEmojis = {
            FR: "🇫🇷", ES: "🇪🇸", MX: "🇲🇽", AR: "🇦🇷", CO: "🇨🇴", // Spanish speaking countries
            DE: "🇩🇪", AT: "🇦🇹", CH: "🇨🇭", // German speaking
            IT: "🇮🇹",
            PT: "🇵🇹", BR: "🇧🇷", // Portuguese
            RU: "🇷🇺",
            SE: "🇸🇪", // Sweden
            ID: "🇮🇩", // Indonesia
            GB: "🇬🇧", US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺", NZ: "🇳🇿", // English speaking
            // Add more mappings for your languages' common countries
            // e.g., for your 8 languages + Bisaya/Tagalog (PH)
            PH: "🇵🇭",
        };
        return flagEmojis[cc] || '🏳️'; // Fallback to white flag
    },

    // --- LOCAL STORAGE ---
    saveToLocalStorage: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            // console.log(`Data saved to localStorage with key: ${key}`);
        } catch (e) {
            console.error("Error saving to local storage:", key, e);
            // Potentially notify user if storage is full or unsupported
        }
    },
    loadFromLocalStorage: (key) => {
        try {
            const data = localStorage.getItem(key);
            if (data === null) {
                // console.log(`No data found in localStorage for key: ${key}`);
                return null;
            }
            return JSON.parse(data);
        } catch (e) {
            console.error("Error loading from local storage:", key, e);
            // If parsing fails, might be corrupted data. Consider removing the item.
            // localStorage.removeItem(key);
            return null;
        }
    },

    // --- MISC ---
    generateUUID: () => { // Simple UUID v4 generator
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    simulateTypingDelay: (baseDelayMs = 1500, messageLength = 0) => {
        // Add some variability based on message length and randomness
        const lengthFactor = Math.min(Math.floor(messageLength / 10) * 100, 2000); // e.g., 100ms per 10 chars, up to 2s
        const randomFactor = (Math.random() - 0.5) * 500; // Add/subtract up to 250ms randomly
        return Math.max(500, baseDelayMs + lengthFactor + randomFactor); // Ensure a minimum delay
    },

    // Helper to sanitize text for display (prevent basic XSS if displaying user-generated text directly, though Gemini responses should be safe)
    sanitizeTextForDisplay: (text) => {
        if (typeof text !== 'string') return '';
        const element = document.createElement('div');
        element.innerText = text;
        return element.innerHTML; // This will escape <, >, &, etc.
    }
};

// Confirmation log that this file has been loaded and the object is defined
console.log("utils.js loaded. window.polyglotUtils object:", window.polyglotUtils);
if (window.polyglotUtils && typeof window.polyglotUtils.calculateAge === 'function') {
    console.log("utils.js: calculateAge function is correctly defined on polyglotUtils.");
} else {
    console.error("utils.js: calculateAge function IS MISSING or not correctly defined on polyglotUtils!");
}
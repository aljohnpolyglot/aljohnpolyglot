// js/native_comparison_graph.js

// This function will be called to load and initialize the graph.
async function loadAndInitializeNativeComparisonGraph() {
    console.log("Native Comparison Graph (Emoji Buttons, Fetching Template): loadAndInitializeNativeComparisonGraph called.");

    if (typeof siteBasePath === 'undefined') {
        console.warn('siteBasePath is not defined globally. Using default relative path: "../../". This is for template fetching.');
        siteBasePath = '../../'; // Default for D:\website\blog\learn_in_3_months\js\ to reach D:\website\templates\
    }

    const placeholderId = 'nativeComparisonGraphPlaceholder';
    const placeholderElement = document.getElementById(placeholderId);

    if (!placeholderElement) {
        console.error(`CRITICAL ERROR: Placeholder element with ID '${placeholderId}' was NOT FOUND. Cannot load graph.`);
        return; 
    }

    const templateUrl = siteBasePath + 'templates/native-comparison.html'; 

    try {
        console.log(`Native Comparison Graph: Attempting to fetch template from: ${templateUrl}`);
        const response = await fetch(templateUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch template (${response.status} ${response.statusText}) from: ${templateUrl}`);
        }
        const htmlContent = await response.text();
        placeholderElement.innerHTML = htmlContent;
        console.log("Native Comparison Graph: HTML template successfully injected into placeholder.");
        
        initializeInteractiveGraphLogic(placeholderElement); // Pass the placeholder as the root

    } catch (error) {
        console.error("Native Comparison Graph: Error during template fetching or initial setup:", error);
        placeholderElement.innerHTML = `<p style='color:red; text-align:center; font-weight:bold;'>Error loading graph: ${error.message}.</p>`;
    }
}

// This function contains all the graph's interactive logic.
function initializeInteractiveGraphLogic(graphHtmlRoot) { // graphHtmlRoot is the placeholder div
    console.log("Native Comparison Graph: Initializing interactive logic within placeholder (Emoji button icons).");
    
    const immersionGraphContainer = graphHtmlRoot.querySelector('.immersion-comparison-graph-container');

    if (!immersionGraphContainer) {
        console.error("CRITICAL ERROR (post-injection): '.immersion-comparison-graph-container' NOT FOUND inside placeholder.");
        return;
    }
    console.log("Found .immersion-comparison-graph-container in placeholder.");

    // --- DOM Element Selection (Relative to immersionGraphContainer for better scoping) ---
    const ageRangeButtons = immersionGraphContainer.querySelectorAll('.btn-age-range');
    const l2StudyInput = immersionGraphContainer.querySelector('#l2StudyHoursPerDay');
    const l2StudyMessage = immersionGraphContainer.querySelector('#l2StudyMessage');
    
    // IDs from your template file
    const graphTitleElement = immersionGraphContainer.querySelector('#graphTitle'); 
    const nativeDynamicLabelSpan = immersionGraphContainer.querySelector('#nativeDynamicLabel');
    const l2YearlyHoursLabelSpan = immersionGraphContainer.querySelector('#l2YearlyHoursLabel');

    const nativeExposureBar = immersionGraphContainer.querySelector('#nativeExposureBar');
    const l2LearnerBar = immersionGraphContainer.querySelector('#l2LearnerBar');
    const nativeExposureValueText = immersionGraphContainer.querySelector('#nativeExposureValue');
    const l2LearnerValueText = immersionGraphContainer.querySelector('#l2LearnerValue');       
    const nativeIconOnBar = immersionGraphContainer.querySelector('#nativeIcon'); // Bar icon span
    const l2IconOnBar = immersionGraphContainer.querySelector('#l2Icon');         // Bar icon span
    const graphArea = immersionGraphContainer.querySelector('#graphArea'); // ID added to template

    let allElementsFound = true;
    const elementsToCheck = {
        "Age Range Buttons (at least one)": ageRangeButtons.length > 0,
        l2StudyInput, l2StudyMessage, graphTitleElement, nativeDynamicLabelSpan, l2YearlyHoursLabelSpan,
        nativeExposureBar, l2LearnerBar, nativeExposureValueText, l2LearnerValueText,
        nativeIconOnBar, l2IconOnBar, graphArea
    };

    for (const key in elementsToCheck) {
        if (!elementsToCheck[key]) {
            console.error(`Element Check FAILED (post-injection): Essential element NOT FOUND: ${key}.`);
            allElementsFound = false;
        }
    }
    if (!allElementsFound) {
        console.error("Initialization aborted: Not all essential elements were found after template injection.");
        return;
    }
    console.log("All essential DOM elements for graph logic successfully found within injected template.");

    const barEmojiIconMap = {
        baby: "👤", baby_steps: "👣", toddler: "🧸", child_playing: "🎠", 
        child_reading: "📚", teen_student: "🎓", default_l2: "🚶" 
    };
    
    console.log(`Found ${ageRangeButtons.length} age range buttons in template.`);
    ageRangeButtons.forEach(btn => {
        console.log(`Processing Button from template: "${(btn.innerText || btn.textContent).trim().split('\n')[0]}"`);
    });

    const maxBarPixelHeight = 350; 

    let initiallyActiveButton = immersionGraphContainer.querySelector('.btn-age-range.active');
    if (!initiallyActiveButton && ageRangeButtons.length > 0) {
        initiallyActiveButton = ageRangeButtons[0];
        initiallyActiveButton.classList.add('active'); 
    }
    
    let currentNativeHours = 0;
    let currentNativeLabel = "N/A";
    let currentIconTypeForBar = "baby";

    if (initiallyActiveButton) {
        currentNativeHours = parseInt(initiallyActiveButton.dataset.hours) || 0;
        currentNativeLabel = initiallyActiveButton.dataset.label || "Default";
        currentIconTypeForBar = initiallyActiveButton.dataset.iconType || "baby";
    } else {
        console.error("CRITICAL: No age range buttons found in template. Graph cannot function.");
        if (graphArea) graphArea.innerHTML = "<p style='color:var(--accent-yellow);'>Error: No age data.</p>";
        return;
    }

    function formatHoursForDisplay(hours) {
        if (hours === 0) return "~0 hrs";
        if (hours < 1 && hours > 0) return "<1 hr";
        if (hours >= 100000) return `~${(hours / 1000).toFixed(0)}k+ hrs`;
        if (hours >= 1000) return `~${(hours / 1000).toFixed(hours % 1000 === 0 ? 0 : 1)}k hrs`.replace('.0k','k');
        return `~${Math.round(hours).toLocaleString()} hrs`;
    }

    function updateL2StudyMessage() {
        let dailyL2Hours = parseFloat(l2StudyInput.value);
        l2StudyMessage.classList.remove('warning');
        l2StudyMessage.innerHTML = "Enter your planned daily L2 study hours."; // Default message
        const maxInput = parseFloat(l2StudyInput.max) || 16;
        const minInput = parseFloat(l2StudyInput.min) || 0.1;

        if (l2StudyInput.value === "") return; // Keep default if empty

        if (isNaN(dailyL2Hours)) {
            l2StudyMessage.innerHTML = "Please enter a valid number.";
            l2StudyMessage.classList.add('warning');
            return;
        }
        dailyL2Hours = dailyL2Hours || 0;

        if (dailyL2Hours > maxInput) { 
            l2StudyInput.value = maxInput.toString(); 
            l2StudyMessage.innerHTML = `Max ${maxInput} hrs/day!`; l2StudyMessage.classList.add('warning'); 
        }
        else if (dailyL2Hours > 8 && maxInput >=8) { l2StudyMessage.innerHTML = "Intense! Full-time job.";} 
        else if (dailyL2Hours > 4 && maxInput >=4) { l2StudyMessage.innerHTML = "Ambitious! Quick progress.";} 
        else if (dailyL2Hours >= 2 && maxInput >=2) { l2StudyMessage.innerHTML = "Good pace! Fluency in ~1yr.";}
        else if (dailyL2Hours >= 1 && maxInput >=1) { l2StudyMessage.innerHTML = "Solid start!"; } 
        else if (dailyL2Hours > 0 && maxInput >0) { l2StudyMessage.innerHTML = "Every bit helps!";} 
        else if (dailyL2Hours === 0) { l2StudyMessage.innerHTML = "Add study time!";}
        else if (dailyL2Hours < minInput && dailyL2Hours !==0 ) { 
            l2StudyInput.value = minInput.toString(); 
            l2StudyMessage.innerHTML = "Min study is " + minInput + " hrs."; l2StudyMessage.classList.add('warning');
        }
    }
    
    function updateGraph() {
        console.log("updateGraph called.");
        let l2HoursPerDay = parseFloat(l2StudyInput.value) || 0;
        const maxInputVal = parseFloat(l2StudyInput.max) || 16;
        const minInputVal = parseFloat(l2StudyInput.min) || 0.1;

        if (l2HoursPerDay < 0) l2HoursPerDay = 0; 
        if (l2HoursPerDay > maxInputVal) l2HoursPerDay = maxInputVal;
        
        const l2HoursPerYear = Math.round(l2HoursPerDay * 365);

        if (nativeDynamicLabelSpan) nativeDynamicLabelSpan.textContent = `by ${currentNativeLabel}`;
        if (l2YearlyHoursLabelSpan) l2YearlyHoursLabelSpan.textContent = `${l2HoursPerYear.toLocaleString()} hrs/yr`;
        
        nativeExposureValueText.textContent = formatHoursForDisplay(currentNativeHours);
        l2LearnerValueText.textContent = formatHoursForDisplay(l2HoursPerYear);

        const overallMaxHoursForScaling = Math.max(currentNativeHours, l2HoursPerYear, 100);
        const MIN_PIXEL_HEIGHT_FOR_NON_ZERO = 3;
        const MIN_PIXEL_HEIGHT_FOR_TINY_INDICATION = 2; 

        let nativeBarHeight = (currentNativeHours / overallMaxHoursForScaling) * maxBarPixelHeight;
        nativeBarHeight = currentNativeHours > 0 ? Math.max(MIN_PIXEL_HEIGHT_FOR_NON_ZERO, nativeBarHeight) : 0;
        nativeExposureBar.style.height = `${nativeBarHeight}px`;

        let l2BarHeight = (l2HoursPerYear / overallMaxHoursForScaling) * maxBarPixelHeight;
        l2LearnerBar.style.background = ""; 
        l2LearnerBar.style.boxShadow = "";  

        if (l2HoursPerYear > 0) {
            if (l2BarHeight < MIN_PIXEL_HEIGHT_FOR_NON_ZERO && l2BarHeight >= MIN_PIXEL_HEIGHT_FOR_TINY_INDICATION) {
                l2BarHeight = MIN_PIXEL_HEIGHT_FOR_TINY_INDICATION; 
                l2LearnerValueText.textContent = `≈${l2HoursPerYear} hrs (tiny)`; 
                l2LearnerBar.style.background = "var(--theme-biotech-green)"; 
                l2LearnerBar.style.boxShadow = "none"; 
            } else if (l2BarHeight < MIN_PIXEL_HEIGHT_FOR_TINY_INDICATION) {
                l2BarHeight = 0;
                l2LearnerValueText.textContent = formatHoursForDisplay(0);
                l2LearnerBar.style.background = "transparent"; 
                l2LearnerBar.style.boxShadow = "none";
            } else { 
                l2BarHeight = Math.max(MIN_PIXEL_HEIGHT_FOR_NON_ZERO, l2BarHeight);
            }
        } else { 
            l2BarHeight = 0; 
            l2LearnerValueText.textContent = formatHoursForDisplay(0);
            l2LearnerBar.style.background = "transparent";
            l2LearnerBar.style.boxShadow = "none";
        }
        l2LearnerBar.style.height = `${l2BarHeight}px`;

        if(nativeIconOnBar) nativeIconOnBar.textContent = barEmojiIconMap[currentIconTypeForBar] || barEmojiIconMap.baby;
        if(l2IconOnBar) l2IconOnBar.textContent = barEmojiIconMap.default_l2;
        
        nativeExposureBar.classList.toggle('show-icon', nativeBarHeight > 30);
        l2LearnerBar.classList.toggle('show-icon', l2BarHeight > 30 && l2BarHeight >= MIN_PIXEL_HEIGHT_FOR_NON_ZERO);
        
        const tinyThresholdPercent = 0.01; 
        const tinyPixelsForText = 10; 
        if (l2BarHeight >= MIN_PIXEL_HEIGHT_FOR_NON_ZERO && !l2LearnerValueText.textContent.includes('tiny')) {
            if (l2HoursPerYear > 0 && currentNativeHours > 0 && (l2HoursPerYear / currentNativeHours < tinyThresholdPercent) && l2BarHeight <= (MIN_PIXEL_HEIGHT_FOR_NON_ZERO + tinyPixelsForText)) {
                l2LearnerValueText.textContent = `<1% Native (${formatHoursForDisplay(l2HoursPerYear)})`;
            }
        }
        if (currentNativeHours > 0 && l2HoursPerYear > 0 && (currentNativeHours / l2HoursPerYear < tinyThresholdPercent) && nativeBarHeight <= (MIN_PIXEL_HEIGHT_FOR_NON_ZERO + tinyPixelsForText)) {
            nativeExposureValueText.textContent = `<1% L2 (${formatHoursForDisplay(currentNativeHours)})`;
        }
    }

    console.log("Attaching event listeners to buttons and input...");
    ageRangeButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log("Button clicked:", (this.innerText || this.textContent).trim());
            ageRangeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentNativeHours = parseInt(this.dataset.hours) || 0;
            currentNativeLabel = this.dataset.label || "N/A";
            currentIconTypeForBar = this.dataset.iconType || "baby";
            updateGraph();
        });
    });

    l2StudyInput.addEventListener('input', function () {
        updateL2StudyMessage(); 
        updateGraph();        
    });
    l2StudyInput.addEventListener('change', () => { 
        let val = parseFloat(l2StudyInput.value);
        const minVal = parseFloat(l2StudyInput.min) || 0.1;
        const maxVal = parseFloat(l2StudyInput.max) || 16;
        if (isNaN(val) || val < minVal) l2StudyInput.value = minVal.toString();
        else if (val > maxVal) l2StudyInput.value = maxVal.toString();
        updateL2StudyMessage(); 
        updateGraph();
    });

    if (initiallyActiveButton) {
      if (l2StudyInput.value === "" || isNaN(parseFloat(l2StudyInput.value))) {
            l2StudyInput.value = "1"; 
      }
      updateL2StudyMessage();
      updateGraph();
      console.log("Initial graph rendering complete.");
    } else {
        console.warn("Could not perform initial graph update: No initially active button.");
    }
    console.log("Interactive graph logic initialization COMPLETE.");
}

// Auto-initialize when the main page's DOM is ready.
document.addEventListener('DOMContentLoaded', loadAndInitializeNativeComparisonGraph);
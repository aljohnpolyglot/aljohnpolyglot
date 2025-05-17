// js/deliberate_practice.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("Deliberate Practice Section JS Loaded");

    // --- PART 1: Litmus Test Logic ---
    // REMOVE THIS NESTED DOMContentLoaded
    // document.addEventListener('DOMContentLoaded', function() { // <<< PROBLEM: This is redundant and problematic

    const form = document.getElementById('litmusTestForm');
    // Check if the form exists before trying to use it
    if (form) {
        const slidesContainer = form.querySelector('.litmus-slides-container');
        // It's crucial that slidesContainer is found
        if (slidesContainer) {
            const slides = Array.from(slidesContainer.querySelectorAll('.litmus-slide'));
            const nextButton = document.getElementById('litmusTestButton');
            const resultDiv = document.getElementById('litmusTestResult');
            const resultTextElement = document.getElementById('litmusResultText');

            // Check if all necessary elements for the litmus test are present
            if (slides.length > 0 && nextButton && resultDiv && resultTextElement) {
                let currentSlideIndex = 0;
                const totalSlides = slides.length;

                function showSlide(index) {
                    slides.forEach((slide, i) => {
                        slide.style.display = (i === index) ? 'block' : 'none';
                    });

                    if (index === totalSlides - 1) {
                        nextButton.textContent = 'See My Reality Check';
                    } else {
                        nextButton.textContent = 'Next Question';
                    }
                }

                showSlide(currentSlideIndex); // Initialize: Show the first slide

                nextButton.addEventListener('click', function() {
                    const currentSlide = slides[currentSlideIndex];
                    // It's good practice to ensure currentSlide exists, though with this logic it should
                    if (!currentSlide) return; 

                    const radioChecked = currentSlide.querySelector('input[type="radio"]:checked');
                    // Consider if validation is strictly needed. If not, the check can be removed.
                    // if (!radioChecked && currentSlideIndex < totalSlides -1) { // Only validate if not the last step before results
                    //     alert('Please select an answer before proceeding.');
                    //     return;
                    // }

                    if (currentSlideIndex < totalSlides - 1) {
                        currentSlideIndex++;
                        showSlide(currentSlideIndex);
                    } else {
                        collectAndShowResults();
                    }
                });

                function collectAndShowResults() {
                    form.style.display = 'none';
                    if(nextButton) nextButton.style.display = 'none'; // Check if nextButton exists before styling

                    // Ensure form.qX exists before trying to access .value
                    const answers = {
                        q1: form.q1 ? form.q1.value : null,
                        q2: form.q2 ? form.q2.value : null,
                        q3: form.q3 ? form.q3.value : null,
                        q4: form.q4 ? form.q4.value : null,
                    };

                    let score = 0;
                    let feedback = "";

                    if (answers.q1 === 'b') score += 2; else if (answers.q1 === 'c') score += 1;
                    if (answers.q2 === 'b') score += 2; else if (answers.q2 === 'c') score += 1;
                    if (answers.q3 === 'b') score += 2; else if (answers.q3 === 'c') score += 1;
                    if (answers.q4 === 'b') score += 2; else if (answers.q4 === 'c') score += 1;
                    
                    if (score >= 7) {
                        feedback = "Great job! You're likely practicing effectively. Keep pushing those boundaries!";
                    } else if (score >= 4) {
                        feedback = "You're on the right track, but there's room to make your practice more deliberate. Focus on those weaker areas!";
                    } else {
                        feedback = "It seems like your current methods might be more 'playing' than 'practicing.' Time to implement more focused, deliberate strategies!";
                    }

                    resultTextElement.textContent = feedback;
                    resultDiv.style.display = 'block';
                }
                console.log("Litmus Test JS Initialized.");
            } else {
                console.warn("One or more Litmus Test elements are missing. Litmus Test not initialized.");
                // Log which specific elements are missing for easier debugging
                if (slides.length === 0) console.warn("Litmus slides not found.");
                if (!nextButton) console.warn("Litmus nextButton not found.");
                if (!resultDiv) console.warn("Litmus resultDiv not found.");
                if (!resultTextElement) console.warn("Litmus resultTextElement not found.");
            }
        } else {
             console.warn("Litmus Test slides container (.litmus-slides-container) not found within the form. Litmus Test not initialized.");
        }
    } else {
        // console.warn("Litmus Test form (litmusTestForm) not found. Litmus Test not initialized.");
        // This console.warn might be noisy if the form is not on every page.
        // Only log if you expect this script to always find the form.
    }
    // REMOVE THIS CLOSING BRACKET FOR THE NESTED DOMContentLoaded
    // });

    // --- PART 3: Flippable Cards Logic ---
    const flippableCards = document.querySelectorAll('.flippable-card');
    if (flippableCards.length > 0) {
        flippableCards.forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('is-flipped');
            });
            card.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.classList.toggle('is-flipped');
                }
            });
        });
        console.log("Flippable cards initialized for Deliberate Practice section.");
    } else {
        // console.warn("No flippable cards found for Deliberate Practice section.");
    }

    // --- PART 5: Fluency Milestones Animation (Optional - Example using Intersection Observer) ---
    const milestoneCards = document.querySelectorAll('.milestone-card');
    if (milestoneCards.length > 0 && 'IntersectionObserver' in window) {
        const milestoneObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        milestoneCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            milestoneObserver.observe(card);
        });
        console.log("Milestone card animations initialized.");
    }

}); // End of the single, main DOMContentLoaded
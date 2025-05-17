// js/fluency_calculator.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fluency Calculator Script Loaded");

    const calculatorSection = document.getElementById('calculatorSection');
    if (calculatorSection) {
        const langSelect = document.getElementById('languageSelect');
        const targetHoursInput = document.getElementById('targetHours');
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const calculatePaceButton = document.getElementById('calculatePace');
        const resetCalculatorButton = document.getElementById('resetCalculator');
        const calculatorResultDiv = document.getElementById('calculatorResult');

        if (langSelect && targetHoursInput && startDateInput && endDateInput && calculatePaceButton && resetCalculatorButton && calculatorResultDiv) {
            const setTodaysDate = () => new Date().toISOString().split('T')[0];
            
            const setFutureDate = (months) => {
                const date = new Date();
                date.setMonth(date.getMonth() + months);
                return date.toISOString().split('T')[0];
            };

            if (!startDateInput.value) startDateInput.value = setTodaysDate();
            if (!endDateInput.value) endDateInput.value = setFutureDate(3);

            langSelect.addEventListener('change', function() {
                if (this.value !== 'custom') {
                    targetHoursInput.value = this.value;
                }
            });

            targetHoursInput.addEventListener('input', function() { // Changed to 'input' for immediate feedback
                 if (langSelect.querySelector('option[value="custom"]')) {
                    let matchFound = false;
                    for(let option of langSelect.options) {
                        if(option.value === this.value && option.value !== 'custom') {
                            langSelect.value = option.value; // Select the matching language
                            matchFound = true;
                            break;
                        }
                    }
                    if(!matchFound) langSelect.value = 'custom';
                }
            });

            calculatePaceButton.addEventListener('click', function() {
                const totalHours = parseInt(targetHoursInput.value, 10);
                const startDate = new Date(startDateInput.value + "T00:00:00");
                const endDate = new Date(endDateInput.value + "T00:00:00");

                let errors = [];
                if (isNaN(totalHours) || totalHours <= 0) {
                    errors.push("Please enter a valid positive number for total hours.");
                }
                if (!startDateInput.value || isNaN(startDate.getTime())) {
                    errors.push("Please enter a valid start date.");
                }
                if (!endDateInput.value || isNaN(endDate.getTime())) {
                    errors.push("Please enter a valid end date.");
                }
                if (startDate.getTime() && endDate.getTime() && endDate <= startDate) {
                    errors.push("End date must be after start date.");
                }

                if (errors.length > 0) {
                    calculatorResultDiv.innerHTML = `<p style='color:red;'>${errors.join('<br>')}</p>`;
                    calculatorResultDiv.style.display = 'block';
                    return;
                }

                const diffTime = endDate.getTime() - startDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 0) {
                    calculatorResultDiv.innerHTML = "<p style='color:red;'>The duration must be at least one day.</p>";
                    calculatorResultDiv.style.display = 'block';
                    return;
                }

                const hoursPerDay = totalHours / diffDays;
                const hours = Math.floor(hoursPerDay);
                const minutes = Math.round((hoursPerDay - hours) * 60);

                let resultHTML = `
                    <p>To achieve <strong>${totalHours.toLocaleString()} hours</strong> of deliberate practice from <strong>${startDate.toLocaleDateString()}</strong> to <strong>${endDate.toLocaleDateString()}</strong> (${diffDays.toLocaleString()} days):</p>
                    <div class="daily-commitment-result">
                        You need to study approximately <strong class="highlight-focus">${hours} hours and ${minutes} minutes</strong> per day.
                    </div>
                `;
                if (hoursPerDay > 12) {
                    resultHTML += "<p class='result-note warning'>This is an extreme schedule! Ensure it's sustainable and allows for rest.</p>";
                } else if (hoursPerDay > 8) {
                    resultHTML += "<p class='result-note'>This is a very intensive schedule, similar to a full-time job.</p>";
                } else if (hoursPerDay < 0.1 && hoursPerDay > 0) {
                     resultHTML += "<p class='result-note'>This pace is very light. Progress towards significant fluency will be very gradual.</p>";
                }

                calculatorResultDiv.innerHTML = resultHTML;
                calculatorResultDiv.style.display = 'block';
            });

            resetCalculatorButton.addEventListener('click', function() {
                if (langSelect.querySelector('option[value="custom"]')) {
                    langSelect.value = 'custom';
                } else {
                    langSelect.selectedIndex = 0;
                }
                targetHoursInput.value = '500';
                startDateInput.value = setTodaysDate();
                endDateInput.value = setFutureDate(3);
                calculatorResultDiv.innerHTML = '';
                calculatorResultDiv.style.display = 'none';
            });
        } else {
            console.warn("Fluency Calculator: One or more essential HTML elements are missing for setup.");
        }
    } else {
        // console.log("Fluency Calculator Section not found on this page.");
    }
});
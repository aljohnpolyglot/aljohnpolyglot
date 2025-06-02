document.addEventListener('DOMContentLoaded', () => {
    const nextMeetupDateElement = document.getElementById('next-meetup-date');

    if (nextMeetupDateElement) {
        function getNextSecondSaturday(today) {
            let year = today.getFullYear();
            let month = today.getMonth(); // 0-11

            function findSecondSaturday(currentYear, currentMonth) {
                let date = new Date(currentYear, currentMonth, 1);
                let firstDay = date.getDay(); // 0 (Sun) - 6 (Sat)
                let firstSaturdayOffset = (6 - firstDay + 7) % 7; // Days until the first Saturday
                let secondSaturdayDate = 1 + firstSaturdayOffset + 7; // Date of the 2nd Saturday
                
                return new Date(currentYear, currentMonth, secondSaturdayDate);
            }

            let nextMeetup = findSecondSaturday(year, month);

            // If the 2nd Saturday of this month has already passed, or if it's today but past meetup time (approx)
            // For simplicity, just checking if it's past. A more robust check would involve time.
            if (nextMeetup < today || (nextMeetup.toDateString() === today.toDateString() && today.getHours() >= 18)) { // Assuming meetup ends by 6 PM
                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
                nextMeetup = findSecondSaturday(year, month);
            }
            return nextMeetup;
        }

        const today = new Date();
        const nextMeetup = getNextSecondSaturday(today);
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        nextMeetupDateElement.textContent = nextMeetup.toLocaleDateString('en-US', options);
    }
});
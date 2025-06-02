// js/main-script.js
// For Navbar and Footer loading (if you have separate loader scripts)
// document.addEventListener('DOMContentLoaded', () => {
//     if (typeof loadNavbar === 'function') loadNavbar();
//     if (typeof loadFooter === 'function') loadFooter();
// });

// Smooth scroll for internal links (if not handled by CSS `scroll-behavior: smooth;`)
document.querySelectorAll('a.scroll-smooth[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
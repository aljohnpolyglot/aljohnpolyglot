document.addEventListener('DOMContentLoaded', () => {
  const progress = document.querySelector('.reading-progress span');
  if (progress) {
    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${distance > 0 ? Math.min(scrollY / distance, 1) : 0})`;
    };

    addEventListener('scroll', updateProgress, { passive: true });
    addEventListener('resize', updateProgress);
    updateProgress();
  }

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const viewport = carousel.querySelector('[data-viewport]');
    const slides = [...carousel.querySelectorAll('figure')];
    const previous = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const status = carousel.querySelector('[data-status]');

    const update = () => {
      const index = Math.min(Math.round(viewport.scrollLeft / viewport.clientWidth), slides.length - 1);
      status.textContent = `${index + 1} / ${slides.length}`;
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };

    previous.addEventListener('click', () => viewport.scrollBy({ left: -viewport.clientWidth, behavior: 'smooth' }));
    next.addEventListener('click', () => viewport.scrollBy({ left: viewport.clientWidth, behavior: 'smooth' }));
    viewport.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });
});

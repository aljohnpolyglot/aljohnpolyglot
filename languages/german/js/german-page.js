import '../../../js/navbar-loader.js';
import '../../../js/footer-loader.js';
import '../../../library/js/data/book_data.js';
import './data/german-learning-resources-data.js';
import './data/german-books-data.js';
import { germanPodcasts } from './data/german-podcasts-data.js';
import { renderGermanPlaylists } from './renderers/german-playlists-renderer.js';
import { renderGermanBooks } from './renderers/german-books-renderer.js';
import { renderGermanCreators } from './renderers/german-creators-renderer.js';
import { renderGermanPodcasts } from './renderers/german-podcasts-renderer.js';

const initialiseChapterNavigation = () => {
  const links = [...document.querySelectorAll('.chapter-track-de a[href^="#"]')];
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const setActive = sectionId => {
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${sectionId}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  }, {
    rootMargin: '-35% 0px -58% 0px',
    threshold: [0, 0.08, 0.2]
  });

  sections.forEach(section => observer.observe(section));
};

const initialiseImageFallbacks = () => {
  document.querySelectorAll('.learning-de img').forEach(image => {
    image.addEventListener('error', () => {
      image.src = 'images/creators/creator-fallback.svg';
    }, { once: true });
  });
};

const initialiseGermanPage = async () => {
  renderGermanPlaylists();
  renderGermanBooks();
  renderGermanPodcasts(germanPodcasts);
  initialiseChapterNavigation();
  initialiseImageFallbacks();
  await renderGermanCreators();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialiseGermanPage, { once: true });
} else {
  initialiseGermanPage();
}

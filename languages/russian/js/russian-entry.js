import { russianPlaylist } from './data/russian-playlist-data.js';
import { renderRussianPlaylist } from './renderers/russian-playlist-renderer.js';
import { loadRussianCreators } from './renderers/russian-creator-renderer.js';
import { createRussianCreatorModal } from './russian-modal-controller.js';
import { initializeOpenRussian } from './renderers/russian-openrussian-renderer.js';
import { initializeRussianBookshelf } from './renderers/russian-books-renderer.js';
import { russianFilmsData } from './data/russian-films-data.js';

function initializeFilms() {
  const shelf = document.querySelector('#russian-films-grid');
  if (!shelf) return;
  const fallback = '../../images/creators/creator-fallback.svg';
  const fragment = document.createDocumentFragment();
  russianFilmsData.forEach((film) => {
    const item = document.createElement('li'); item.className = 'film-item-ru';
    const link = document.createElement('a');
    link.className = 'film-card-ru'; link.href = film.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Смотреть фильм: ${film.title}`);
    const poster = document.createElement('span'); poster.className = 'film-poster-ru';
    const image = document.createElement('img'); image.src = film.cover; image.alt = `Постер: ${film.title}`; image.width = 640; image.height = 960; image.loading = 'lazy'; image.decoding = 'async';
    image.addEventListener('error', () => { image.src = fallback; image.alt = ''; }, { once: true });
    const badge = document.createElement('span'); badge.className = 'film-level-badge-ru'; badge.textContent = film.level; poster.append(image, badge);
    const copy = document.createElement('div'); copy.className = 'film-copy-ru';
    const tag = document.createElement('span'); tag.className = 'film-tag-ru'; tag.textContent = `${film.tag} • ${film.year}`;
    const title = document.createElement('strong'); title.textContent = film.title;
    const description = document.createElement('p'); description.textContent = film.description;
    const watch = document.createElement('span'); watch.className = 'film-watch-btn-ru'; watch.textContent = 'Смотреть фильм ↗';
    copy.append(tag, title, description, watch); link.append(poster, copy); item.append(link); fragment.append(item);
  });
  shelf.replaceChildren(fragment);
  const scroll = (direction) => shelf.scrollBy({ left: direction * shelf.clientWidth * 0.75, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  document.querySelector('#russian-films-previous')?.addEventListener('click', () => scroll(-1));
  document.querySelector('#russian-films-next')?.addEventListener('click', () => scroll(1));
}

function syncGlobalNavOffset() {
  const setOffset = () => {
    const globalHeader = document.querySelector('body > header:not(#main-header-placeholder)');
    const height = globalHeader ? Math.ceil(globalHeader.getBoundingClientRect().height) : 70;
    document.documentElement.style.setProperty('--global-nav-height', `${height}px`);
  };
  setOffset();
  const observer = new MutationObserver(() => {
    setOffset();
    const globalHeader = document.querySelector('body > header:not(#main-header-placeholder)');
    if (globalHeader && 'ResizeObserver' in window) new ResizeObserver(setOffset).observe(globalHeader);
  });
  observer.observe(document.body, { childList: true });
  window.addEventListener('resize', setOffset, { passive: true });
}

function initializeChapterNav() {
  const links = [...document.querySelectorAll('.chapter-links-ru a')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

function initializeReelGallery() {
  const track = document.querySelector('#reel-track');
  const previous = document.querySelector('#reel-previous');
  const next = document.querySelector('#reel-next');
  const position = document.querySelector('#reel-position');
  if (!track || !previous || !next || !position) return;
  const cards = [...track.querySelectorAll('[data-reel-card]')];
  let activeIndex = 0;

  const update = () => {
    const step = Math.max(1, track.clientWidth + 18);
    activeIndex = Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / step)));
    position.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === cards.length - 1;
  };

  const goTo = (index) => {
    activeIndex = Math.max(0, Math.min(cards.length - 1, index));
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    track.scrollTo({ left: activeIndex * (track.clientWidth + 18), behavior });
    window.setTimeout(update, 220);
  };

  previous.addEventListener('click', () => goTo(activeIndex - 1));
  next.addEventListener('click', () => goTo(activeIndex + 1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initializePage() {
  syncGlobalNavOffset();
  initializeChapterNav();
  initializeReelGallery();
  initializeOpenRussian();
  initializeRussianBookshelf();
  initializeFilms();
  renderRussianPlaylist(russianPlaylist, {
    list: document.querySelector('#russian-playlist-list'),
    player: document.querySelector('#russian-featured-player'),
    number: document.querySelector('#featured-video-number'),
    title: document.querySelector('#featured-video-title'),
    note: document.querySelector('#featured-video-note')
  });

  const modal = createRussianCreatorModal(document.querySelector('#creator-modal'));
  loadRussianCreators({
    container: document.querySelector('#russian-creator-shelves'),
    status: document.querySelector('#creator-library-status'),
    onOpen: modal.open
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePage);
else initializePage();

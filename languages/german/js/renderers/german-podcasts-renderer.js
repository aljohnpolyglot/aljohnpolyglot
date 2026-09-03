const fallbackCover = 'images/podcasts/easy-german.webp';

const linkLabels = {
  pocketCasts: ['In Pocket Casts hören', 'fa-solid fa-headphones'],
  spotify: ['Auf Spotify hören', 'fa-brands fa-spotify'],
  official: ['Offizielle Seite', 'fa-solid fa-arrow-up-right-from-square']
};

const focusable = root => [...root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
  .filter(element => !element.hidden && element.getClientRects().length);

const setImageFallback = image => image.addEventListener('error', () => {
  image.onerror = null;
  image.src = fallbackCover;
}, { once: true });

export function renderGermanPodcasts(podcasts = []) {
  const shelf = document.getElementById('podcasts-shelf-de');
  const previous = document.getElementById('podcasts-prev-de');
  const next = document.getElementById('podcasts-next-de');
  const status = document.getElementById('podcasts-status-de');
  const modal = document.getElementById('podcast-modal-de');
  const dialog = modal?.querySelector('.podcast-dialog-de');
  const closeButton = document.getElementById('podcast-modal-close-de');

  if (!shelf || !previous || !next || !status || !modal || !dialog || !closeButton) return;
  const shows = podcasts.filter(show => show?.id && show.title && show.image);
  let lastTrigger = null;

  const close = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-modal-open-de');
    lastTrigger?.focus();
    lastTrigger = null;
  };

  const open = (show, trigger) => {
    lastTrigger = trigger;
    const image = document.getElementById('podcast-modal-image-de');
    image.src = show.image;
    image.alt = show.imageAlt;
    setImageFallback(image);
    document.getElementById('podcast-modal-format-de').textContent = show.format;
    document.getElementById('podcast-modal-title-de').textContent = show.title;
    document.getElementById('podcast-modal-publisher-de').textContent = show.publisher;
    document.getElementById('podcast-modal-level-de').textContent = `Empfohlen: ${show.cefr}`;
    document.getElementById('podcast-modal-description-de').textContent = show.description;
    document.getElementById('podcast-modal-guidance-de').textContent = show.listening;

    const personal = document.getElementById('podcast-modal-personal-de');
    const personalCopy = document.getElementById('podcast-modal-personal-copy-de');
    const hasNote = typeof show.personalNote === 'string' && show.personalNote.trim();
    personal.hidden = !hasNote;
    personalCopy.textContent = hasNote ? show.personalNote.trim() : '';

    const links = document.getElementById('podcast-modal-links-de');
    links.replaceChildren();
    Object.entries(show.links || {}).forEach(([type, url]) => {
      if (!url) return;
      const [label, iconClass] = linkLabels[type] || ['Offizieller Link', 'fa-solid fa-arrow-up-right-from-square'];
      const anchor = document.createElement('a');
      const icon = document.createElement('i');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = label;
      icon.className = iconClass;
      icon.setAttribute('aria-hidden', 'true');
      anchor.prepend(icon);
      links.append(anchor);
    });

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body-modal-open-de');
    dialog.scrollTop = 0;
    closeButton.focus();
  };

  const createCard = show => {
    const item = document.createElement('article');
    const trigger = document.createElement('button');
    const cover = document.createElement('span');
    const image = document.createElement('img');
    const copy = document.createElement('span');
    const meta = document.createElement('span');
    const title = document.createElement('strong');
    const format = document.createElement('span');
    const action = document.createElement('span');

    item.className = 'podcast-card-de';
    item.setAttribute('role', 'listitem');
    trigger.type = 'button';
    trigger.className = 'podcast-card-trigger-de';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-label', `Details zu ${show.title} öffnen`);
    cover.className = 'podcast-cover-de';
    image.src = show.image;
    image.alt = show.imageAlt;
    image.width = 480;
    image.height = 480;
    image.loading = 'lazy';
    image.decoding = 'async';
    setImageFallback(image);
    cover.append(image);
    copy.className = 'podcast-card-copy-de';
    meta.className = 'podcast-card-meta-de';
    meta.append(Object.assign(document.createElement('span'), { textContent: show.publisher }), Object.assign(document.createElement('span'), { textContent: show.cefr }));
    title.className = 'podcast-card-title-de';
    title.textContent = show.title;
    format.className = 'podcast-card-format-de';
    format.textContent = show.format;
    action.className = 'podcast-card-action-de';
    action.textContent = 'Details öffnen →';
    copy.append(meta, title, format, action);
    trigger.append(cover, copy);
    trigger.addEventListener('click', () => open(show, trigger));
    item.append(trigger);
    return item;
  };

  shelf.replaceChildren(...shows.map(createCard));
  status.hidden = shows.length > 0;
  status.textContent = shows.length ? '' : 'Keine Podcasts verfügbar.';

  const updateControls = () => {
    const max = Math.max(0, shelf.scrollWidth - shelf.clientWidth - 2);
    previous.disabled = shelf.scrollLeft <= 2;
    next.disabled = shelf.scrollLeft >= max;
  };
  const move = direction => shelf.scrollBy({
    left: direction * shelf.clientWidth * 0.82,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  shelf.addEventListener('scroll', updateControls, { passive: true });
  shelf.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      shelf.scrollTo({ left: event.key === 'Home' ? 0 : shelf.scrollWidth, behavior: 'auto' });
    }
  });
  window.addEventListener('resize', updateControls, { passive: true });

  closeButton.addEventListener('click', close);
  modal.querySelector('[data-podcast-close]')?.addEventListener('click', close);
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable(dialog);
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  updateControls();
}

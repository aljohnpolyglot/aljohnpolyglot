const fallbackCover = 'images/podcasts/kakogo-herro.webp';

function focusable(root) {
  return [...root.querySelectorAll('button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hidden && element.getClientRects().length);
}

function videoId(show) {
  return show.sampleVideoId || show.videoId || show.sample?.videoId || null;
}

function linkEntries(links) {
  if (!links) return [];
  if (Array.isArray(links)) return links.filter((link) => link?.url);
  return Object.entries(links).filter(([, url]) => typeof url === 'string').map(([key, url]) => ({
    url,
    label: key === 'pocketCasts' ? 'Слушать в Pocket Casts ↗' : key === 'official' ? 'Официальный сайт ↗' : key === 'spotify' ? 'Слушать в Spotify ↗' : `${key} ↗`
  }));
}

export function renderRussianPodcasts({ podcasts = [], shelf, previousButton, nextButton, status, modal, modalContent }) {
  if (!shelf || !previousButton || !nextButton || !modal || !modalContent) return;
  const shows = Array.isArray(podcasts) ? podcasts.filter((show) => show?.id && show.title) : [];
  const triggers = [];
  let restoreFocus = null;

  const close = () => {
    modal.hidden = true;
    modal.classList.remove('is-open');
    document.body.classList.remove('podcast-modal-open-ru');
    modalContent.replaceChildren();
    restoreFocus?.focus?.();
    restoreFocus = null;
  };

  const open = (show, trigger) => {
    restoreFocus = trigger;
    const cover = show.coverImage || fallbackCover;
    const labels = linkEntries(show.links);
    modalContent.innerHTML = `
      <header class="podcast-modal-head-ru">
        <img src="${cover}" alt="${show.coverAlt || `Обложка подкаста «${show.title}»`}" width="480" height="480" loading="lazy" decoding="async">
        <div>
          <p class="podcast-modal-kicker-ru">${show.format || 'Подкаст'}</p>
          <h2 id="russian-podcast-modal-title">${show.title}</h2>
          <p class="podcast-modal-publisher-ru">${show.publisher || ''}</p>
          <p id="russian-podcast-modal-level" class="creator-level-ru">${show.cefr || (show.levels || []).join(' · ')}</p>
        </div>
      </header>
      <p id="russian-podcast-modal-description" class="podcast-modal-description-ru">${show.description || ''}</p>
      <section class="podcast-guidance-ru" aria-labelledby="russian-podcast-guidance-heading">
        <p id="russian-podcast-guidance-heading">КАК СЛУШАТЬ</p>
        <p id="russian-podcast-modal-guidance">${show.guidance || 'Выбери знакомую тему и слушай в удобном темпе.'}</p>
      </section>
      <section class="creator-note-ru" aria-labelledby="russian-podcast-note-heading" ${show.personalNote ? '' : 'hidden'}>
        <p id="russian-podcast-note-heading">ЗАМЕТКА АЛДЖОНА</p>
        <blockquote>${show.personalNote || ''}</blockquote>
      </section>
      <section class="podcast-sample-ru" aria-labelledby="russian-podcast-sample-heading">
        <p id="russian-podcast-sample-heading">ПРИМЕР ВЫПУСКА</p>
        <div class="podcast-sample-frame-ru">
          ${videoId(show) ? `<iframe src="https://www.youtube-nocookie.com/embed/${videoId(show)}?rel=0&modestbranding=1" title="Пример выпуска: ${show.title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : '<span>Публичный образец выпуска пока недоступен в проверенных данных.</span>'}
        </div>
      </section>
      <div class="podcast-modal-links-ru">
        ${labels.map(({ label, url }) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('')}
      </div>`;
    const image = modalContent.querySelector('img');
    image?.addEventListener('error', () => { image.src = fallbackCover; image.alt = ''; }, { once: true });
    modal.hidden = false;
    document.body.classList.add('podcast-modal-open-ru');
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      modal.querySelector('.podcast-close-ru')?.focus();
    });
  };

  const modalKeydown = (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable(modal);
    if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const fragment = document.createDocumentFragment();
  shows.forEach((show) => {
    const item = document.createElement('article'); item.className = 'podcast-card-ru'; item.setAttribute('role', 'listitem');
    const trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'podcast-card-trigger-ru'; trigger.setAttribute('aria-label', `Открыть сведения о подкасте «${show.title}»`);
    const cover = document.createElement('span'); cover.className = 'podcast-cover-ru';
    const image = document.createElement('img'); image.src = show.coverImage || fallbackCover; image.alt = show.coverAlt || `Обложка подкаста «${show.title}»`; image.width = 480; image.height = 480; image.loading = 'lazy'; image.decoding = 'async';
    image.addEventListener('error', () => { image.src = fallbackCover; image.alt = ''; }, { once: true }); cover.append(image);
    const copy = document.createElement('span'); copy.className = 'podcast-card-copy-ru';
    const meta = document.createElement('span'); meta.className = 'podcast-card-meta-ru'; meta.innerHTML = `<span>${show.publisher || 'Подкаст'}</span><span>${show.cefr || (show.levels || []).join(' · ')}</span>`;
    const title = document.createElement('strong'); title.className = 'podcast-card-title-ru'; title.textContent = show.title;
    const format = document.createElement('span'); format.className = 'podcast-card-format-ru'; format.textContent = show.format || 'Русскоязычные выпуски';
    const action = document.createElement('span'); action.className = 'podcast-card-action-ru'; action.textContent = 'Открыть детали →';
    copy.append(meta, title, format, action); trigger.append(cover, copy); item.append(trigger); fragment.append(item); triggers.push(trigger);
    trigger.addEventListener('click', () => open(show, trigger));
  });
  shelf.replaceChildren(fragment);
  if (status) status.textContent = shows.length ? `${shows.length} подкаста в полке` : 'Подкасты пока не добавлены';
  let index = 0;
  const update = () => {
    index = Math.max(0, Math.min(Math.max(0, triggers.length - 1), Math.round(shelf.scrollLeft / Math.max(1, shelf.clientWidth * .78))));
    previousButton.disabled = index === 0;
    nextButton.disabled = index >= triggers.length - 1;
  };
  const move = (delta) => { const left = delta * shelf.clientWidth * .78; shelf.scrollBy({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); window.setTimeout(update, 220); };
  previousButton.addEventListener('click', () => move(-1)); nextButton.addEventListener('click', () => move(1)); shelf.addEventListener('scroll', update, { passive: true });
  shelf.addEventListener('keydown', (event) => { if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } else if (event.key === 'Home') { event.preventDefault(); shelf.scrollTo({ left: 0, behavior: 'auto' }); } else if (event.key === 'End') { event.preventDefault(); shelf.scrollTo({ left: shelf.scrollWidth, behavior: 'auto' }); } });
  modal.querySelectorAll('[data-podcast-modal-close]').forEach((element) => element.addEventListener('click', close));
  modal.addEventListener('keydown', modalKeydown);
  window.addEventListener('resize', update, { passive: true });
  update();
}

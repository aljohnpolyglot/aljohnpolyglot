const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const CATEGORY_NOTES = {
  'Deutsch lernen': 'Erklärungen, Interviews und verständliche Formate für den direkten Sprachaufbau.',
  'Fußball': 'Spieltage, Nationalmannschaft, Training und Gespräche rund um den deutschen Fußball.',
  'Gesellschaft & Alltag': 'Klima, Arbeit, Beziehungen und heutiges Leben in längeren Gesprächen und Kurzformaten.',
  'Institutionen & Community': 'Offizielle Wege zu Sprache, Kultur und deutsch-philippinischem Austausch.',
  'Leichtathletik': 'Wettkampf, Training und persönliche Perspektiven aus der Leichtathletik.',
  'Medien & Unterhaltung': 'Radio, Fernsehen, Interviews, Humor und aktuelle Popkultur.',
  'Musik': 'Deutschsprachiger Pop, Rap, Liveaufnahmen, Refrains und Künstlergespräche.',
  'Nachrichten & Politik': 'Journalistische Sprache, Interviews und aktuelle gesellschaftliche Debatten.',
  'Persönlichkeiten': 'Öffentliche Gespräche, Alltag, Medienarbeit und persönliche Perspektiven.',
  'Sport & Basketball': 'NBA, Nationalmannschaft, Analyse, Training und deutschsprachiger Basketballtalk.',
  'Turnen & Tischtennis': 'Technik, Wettkampf und Sportalltag aus zwei präzisen Disziplinen.',
  'Wohnen & Design': 'Grundrisse, Häuser und konkrete Sprache rund ums Wohnen.'
};

const LINK_LABELS = {
  youtube: ['YouTube', 'fa-brands fa-youtube'],
  instagram: ['Instagram', 'fa-brands fa-instagram'],
  website: ['Website', 'fa-solid fa-globe'],
  spotify: ['Spotify', 'fa-brands fa-spotify'],
  facebook: ['Facebook', 'fa-brands fa-facebook']
};

const levelsForRange = range => {
  const [first, last = first] = String(range || '').replace(/-/g, '–').split('–');
  const start = CEFR_LEVELS.indexOf(first.trim());
  const end = CEFR_LEVELS.indexOf(last.trim());
  if (start < 0 || end < 0) return [];
  return CEFR_LEVELS.slice(Math.min(start, end), Math.max(start, end) + 1);
};

const getFocusable = root => [...root.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')]
  .filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true');

export async function renderGermanCreators() {
  const shelves = document.getElementById('creator-shelves-de');
  const levelSelect = document.getElementById('creator-level-de');
  const status = document.getElementById('creator-filter-status-de');
  const empty = document.getElementById('creator-empty-de');
  const reset = document.getElementById('creator-reset-de');
  const institutionCards = document.getElementById('institution-cards-de');
  const modal = document.getElementById('creator-modal-de');
  const dialog = modal?.querySelector('.creator-dialog-de');
  const closeButton = document.getElementById('creator-modal-close-de');

  if (!shelves || !levelSelect || !status || !empty || !reset || !modal || !dialog || !closeButton) return;

  let dataset;
  try {
    const response = await fetch('js/data/german-creators-data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    dataset = await response.json();
  } catch (error) {
    status.textContent = 'Die Stimmen konnten nicht geladen werden. Bitte lade die Seite erneut.';
    shelves.replaceChildren();
    empty.hidden = false;
    empty.querySelector('h3').textContent = 'Die Regale sind gerade nicht erreichbar.';
    empty.querySelector('p').textContent = 'Prüfe deine Verbindung und lade die Seite erneut.';
    reset.hidden = true;
    return;
  }

  const allCreators = Array.isArray(dataset.creators) ? dataset.creators : [];
  const institutionIds = ['goethe-institut-philippinen', 'germany-in-the-philippines'];
  const institutions = institutionIds.map(id => allCreators.find(creator => creator.id === id)).filter(Boolean);
  const creators = allCreators.filter(creator => !institutionIds.includes(creator.id));
  const categories = [...new Set(creators.map(creator => creator.category).filter(Boolean))];
  let lastTrigger = null;

  const setModalImageFallback = image => {
    image.addEventListener('error', () => {
      image.src = 'images/creators/creator-fallback.svg';
    }, { once: true });
  };

  const closeModal = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-modal-open-de');
    const player = document.getElementById('creator-modal-video-de');
    if (player) player.src = 'about:blank';
    lastTrigger?.focus();
  };

  const openModal = (creator, trigger) => {
    lastTrigger = trigger;
    const image = document.getElementById('creator-modal-image-de');
    const category = document.getElementById('creator-modal-category-de');
    const title = document.getElementById('creator-modal-title-de');
    const level = document.getElementById('creator-modal-level-de');
    const credit = document.getElementById('creator-modal-credit-de');
    const description = document.getElementById('creator-modal-description-de');
    const personal = document.getElementById('creator-modal-personal-de');
    const personalCopy = document.getElementById('creator-modal-personal-copy-de');
    const guidance = document.getElementById('creator-modal-guidance-de');
    const player = document.getElementById('creator-modal-video-de');
    const unavailable = document.getElementById('creator-video-unavailable-de');
    const links = document.getElementById('creator-modal-links-de');

    image.src = creator.profileImage;
    image.alt = `Porträt oder offizielles Profilbild von ${creator.name}`;
    setModalImageFallback(image);
    category.textContent = creator.category;
    title.textContent = creator.name;
    level.textContent = `Empfohlen: ${creator.cefr}`;
    const hasCredit = Boolean(creator.imageCredit?.label && creator.imageCredit?.url);
    credit.hidden = !hasCredit;
    credit.textContent = hasCredit ? creator.imageCredit.label : '';
    credit.href = hasCredit ? creator.imageCredit.url : '#';
    description.textContent = creator.neutralDescription;
    guidance.textContent = creator.listeningRange;

    const hasPersonalNote = typeof creator.personalComment === 'string' && creator.personalComment.trim();
    personal.hidden = !hasPersonalNote;
    personalCopy.textContent = hasPersonalNote ? creator.personalComment.trim() : '';

    const hasVideo = typeof creator.sampleVideoId === 'string' && creator.sampleVideoId.trim();
    player.hidden = !hasVideo;
    unavailable.hidden = hasVideo;
    player.src = hasVideo ? `https://www.youtube.com/embed/${creator.sampleVideoId}?rel=0` : 'about:blank';
    player.title = hasVideo ? `Beispielvideo von ${creator.name}` : 'Kein Beispielvideo verfügbar';

    links.replaceChildren();
    Object.entries(creator.links || {}).forEach(([type, url]) => {
      if (!url) return;
      const [label, iconClass] = LINK_LABELS[type] || ['Offizieller Link', 'fa-solid fa-arrow-up-right-from-square'];
      const anchor = document.createElement('a');
      const icon = document.createElement('i');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = label;
      icon.className = iconClass;
      icon.setAttribute('aria-hidden', 'true');
      anchor.prepend(icon);
      links.appendChild(anchor);
    });

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body-modal-open-de');
    dialog.scrollTop = 0;
    closeButton.focus();
  };

  const createCard = creator => {
    const button = document.createElement('button');
    const visual = document.createElement('span');
    const image = document.createElement('img');
    const copy = document.createElement('span');
    const category = document.createElement('small');
    const title = document.createElement('strong');
    const meta = document.createElement('span');
    const level = document.createElement('span');
    const action = document.createElement('span');

    button.type = 'button';
    button.className = 'creator-card-de';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', `Details zu ${creator.name} öffnen`);
    visual.className = 'creator-card-image-de';
    image.src = creator.profileImage;
    image.alt = `Porträt oder offizielles Profilbild von ${creator.name}`;
    image.width = 360;
    image.height = 360;
    image.loading = 'lazy';
    image.decoding = 'async';
    setModalImageFallback(image);
    visual.appendChild(image);
    copy.className = 'creator-card-copy-de';
    category.textContent = creator.category;
    title.textContent = creator.name;
    meta.className = 'creator-card-meta-de';
    level.textContent = creator.cefr;
    action.append('Details ', Object.assign(document.createElement('i'), {
      className: 'fa-solid fa-arrow-right',
      ariaHidden: 'true'
    }));
    meta.append(level, action);
    copy.append(category, title, meta);
    button.append(visual, copy);
    button.addEventListener('click', () => openModal(creator, button));
    return button;
  };

  const renderInstitutions = () => {
    if (!institutionCards) return;
    institutionCards.replaceChildren();
    institutions.forEach((institution, index) => {
      const button = document.createElement('button');
      const imageWrap = document.createElement('span');
      const image = document.createElement('img');
      const copy = document.createElement('span');
      const category = document.createElement('small');
      const title = document.createElement('strong');
      const description = document.createElement('span');
      const meta = document.createElement('span');
      const level = document.createElement('span');
      const action = document.createElement('span');

      button.type = 'button';
      button.className = `institution-card-de${index === 0 ? ' institution-lead-de' : ''}`;
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-label', `Details zu ${institution.name} öffnen`);
      imageWrap.className = 'institution-image-de';
      image.src = institution.profileImage;
      image.alt = `Offizielles Profilbild von ${institution.name}`;
      image.width = 420;
      image.height = 420;
      image.loading = 'lazy';
      image.decoding = 'async';
      setModalImageFallback(image);
      imageWrap.appendChild(image);
      copy.className = 'institution-copy-de';
      category.textContent = institution.id === 'goethe-institut-philippinen' ? 'Sprache & Kultur' : 'Diplomatie & Austausch';
      title.textContent = institution.name;
      description.textContent = institution.neutralDescription;
      meta.className = 'institution-meta-de';
      level.textContent = institution.cefr;
      action.append('Details öffnen ', Object.assign(document.createElement('i'), {
        className: 'fa-solid fa-arrow-right',
        ariaHidden: 'true'
      }));
      meta.append(level, action);
      copy.append(category, title, description, meta);
      button.append(imageWrap, copy);
      button.addEventListener('click', () => openModal(institution, button));
      institutionCards.appendChild(button);
    });
  };

  const updateShelfButtons = (row, previous, next) => {
    const max = Math.max(0, row.scrollWidth - row.clientWidth - 2);
    previous.disabled = row.scrollLeft <= 2;
    next.disabled = row.scrollLeft >= max;
  };

  const createShelf = (category, shelfCreators) => {
    const article = document.createElement('article');
    const header = document.createElement('header');
    const heading = document.createElement('div');
    const headingCopy = document.createElement('div');
    const title = document.createElement('h3');
    const note = document.createElement('p');
    const controls = document.createElement('div');
    const previous = document.createElement('button');
    const next = document.createElement('button');
    const row = document.createElement('div');

    article.className = 'creator-shelf-de';
    header.className = 'creator-shelf-header-de';
    heading.className = 'creator-shelf-title-de';
    title.textContent = category;
    note.textContent = CATEGORY_NOTES[category] || 'Deutschsprachige Formate für regelmäßige, thematische Immersion.';
    headingCopy.append(title, note);
    heading.appendChild(headingCopy);
    controls.className = 'creator-shelf-controls-de';
    previous.type = 'button';
    previous.setAttribute('aria-label', `Im Regal ${category} zurückblättern`);
    previous.innerHTML = '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i>';
    next.type = 'button';
    next.setAttribute('aria-label', `Im Regal ${category} weiterblättern`);
    next.innerHTML = '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
    controls.append(previous, next);
    header.append(heading, controls);
    row.className = 'creator-row-de';
    row.setAttribute('role', 'list');
    row.setAttribute('aria-label', category);

    shelfCreators.forEach(creator => {
      const item = document.createElement('div');
      item.setAttribute('role', 'listitem');
      item.appendChild(createCard(creator));
      row.appendChild(item);
    });

    previous.addEventListener('click', () => row.scrollBy({ left: -row.clientWidth * 0.82, behavior: 'smooth' }));
    next.addEventListener('click', () => row.scrollBy({ left: row.clientWidth * 0.82, behavior: 'smooth' }));
    row.addEventListener('scroll', () => updateShelfButtons(row, previous, next), { passive: true });
    new ResizeObserver(() => updateShelfButtons(row, previous, next)).observe(row);
    queueMicrotask(() => updateShelfButtons(row, previous, next));

    article.append(header, row);
    return article;
  };

  const render = () => {
    const selectedLevel = levelSelect.value;
    const fragment = document.createDocumentFragment();
    let visibleShelf = false;

    categories.forEach(category => {
      const shelfCreators = creators.filter(creator => creator.category === category)
        .filter(creator => selectedLevel === 'all' || levelsForRange(creator.cefr).includes(selectedLevel));
      if (!shelfCreators.length) return;
      visibleShelf = true;
      fragment.appendChild(createShelf(category, shelfCreators));
    });

    shelves.replaceChildren(fragment);
    shelves.hidden = !visibleShelf;
    empty.hidden = visibleShelf;
    reset.hidden = false;
    status.textContent = selectedLevel === 'all'
      ? 'Alle thematischen Regale sind geöffnet.'
      : `Geöffnet sind die Regale mit Material für Niveau ${selectedLevel}.`;
  };

  levelSelect.addEventListener('change', render);
  reset.addEventListener('click', () => {
    levelSelect.value = 'all';
    render();
    levelSelect.focus();
  });
  closeButton.addEventListener('click', closeModal);
  modal.querySelector('[data-creator-close]')?.addEventListener('click', closeModal);
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = getFocusable(dialog);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  render();
  renderInstitutions();
}

const COVER_META = {
  de_grimms_maerchen: { src: '../../library/images/books/de/de_grimms_maerchen.webp', width: 720, height: 934 },
  de_max_und_moritz: { src: '../../library/images/books/de/de_max_und_moritz.webp', width: 720, height: 932 },
  de_werther: { src: '../../library/images/books/de/de_werther.webp', width: 629, height: 1000 },
  de_effi_briest: { src: '../../library/images/books/de/de_effi_briest.webp', width: 695, height: 1080 },
  de_zarathustra: { src: '../../library/images/books/de/de_zarathustra.webp', width: 720, height: 949 }
};

const getFocusable = root => [...root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
  .filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true');

const levelLabel = value => Array.isArray(value) ? value.join('–') : String(value || 'Ohne Einstufung');

export function renderGermanBooks() {
  const shelf = document.getElementById('books-shelf-de');
  const status = document.getElementById('books-status-de');
  const previous = document.getElementById('books-prev-de');
  const next = document.getElementById('books-next-de');
  const modal = document.getElementById('book-modal-de');
  const dialog = modal?.querySelector('.book-dialog-de');
  const closeButton = document.getElementById('book-modal-close-de');

  if (!shelf || !status || !previous || !next || !modal || !dialog || !closeButton) return;

  const catalogue = Array.isArray(window.publicDomainBooks) ? window.publicDomainBooks : [];
  const bridge = window.GERMAN_BOOK_RESOURCES;
  const bridgeBooks = Array.isArray(bridge?.books) ? bridge.books : [];
  const books = bridgeBooks
    .filter(item => COVER_META[item.libraryRecordId])
    .map(item => ({ ...catalogue.find(book => book.id === item.libraryRecordId), ...item }))
    .filter(book => book.id && book.title);

  if (!books.length) {
    status.textContent = 'Die Bücher konnten nicht geladen werden. Bitte lade die Seite erneut.';
    previous.disabled = true;
    next.disabled = true;
    return;
  }

  let lastTrigger = null;

  const closeModal = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-modal-open-de');
    lastTrigger?.focus();
  };

  const openModal = (book, trigger) => {
    lastTrigger = trigger;
    const cover = COVER_META[book.id];
    const image = document.getElementById('book-modal-image-de');
    const category = document.getElementById('book-modal-category-de');
    const title = document.getElementById('book-modal-title-de');
    const author = document.getElementById('book-modal-author-de');
    const level = document.getElementById('book-modal-level-de');
    const description = document.getElementById('book-modal-description-de');
    const guidance = document.getElementById('book-modal-guidance-de');
    const links = document.getElementById('book-modal-links-de');

    image.src = cover.src;
    image.width = cover.width;
    image.height = cover.height;
    image.alt = `Buchcover von ${book.title}`;
    image.onerror = () => {
      image.onerror = null;
      image.src = 'images/books/book-fallback.svg';
    };
    category.textContent = Array.isArray(book.genres) ? book.genres.slice(0, 2).join(' · ') : 'Deutsches Buch';
    title.textContent = book.title;
    author.textContent = book.author;
    level.textContent = `Empfohlen: ${levelLabel(book.recommendedCEFR)}`;
    description.textContent = book.descriptionDe;
    guidance.textContent = book.pageNote;
    links.replaceChildren();

    [
      ['PDF öffnen', book.pdfLink, 'fa-solid fa-file-pdf'],
      ['EPUB öffnen', book.epubLink, 'fa-solid fa-book-open']
    ].forEach(([label, url, iconClass]) => {
      if (!url) return;
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

  shelf.replaceChildren();
  books.forEach(book => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const cover = document.createElement('span');
    const image = document.createElement('img');
    const copy = document.createElement('span');
    const title = document.createElement('strong');
    const author = document.createElement('span');
    const level = document.createElement('small');
    const coverMeta = COVER_META[book.id];

    item.className = 'book-card-de';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', `Details zu ${book.title} öffnen`);
    cover.className = 'book-cover-de';
    image.src = coverMeta.src;
    image.width = coverMeta.width;
    image.height = coverMeta.height;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.alt = `Buchcover von ${book.title}`;
    image.addEventListener('error', () => {
      image.src = 'images/books/book-fallback.svg';
    }, { once: true });
    cover.appendChild(image);
    copy.className = 'book-card-copy-de';
    title.textContent = book.title;
    author.textContent = book.author;
    level.textContent = levelLabel(book.recommendedCEFR);
    copy.append(title, author, level);
    button.append(cover, copy);
    button.addEventListener('click', () => openModal(book, button));
    item.appendChild(button);
    shelf.appendChild(item);
  });

  const updateButtons = () => {
    const max = Math.max(0, shelf.scrollWidth - shelf.clientWidth - 2);
    previous.disabled = shelf.scrollLeft <= 2;
    next.disabled = shelf.scrollLeft >= max;
  };

  previous.addEventListener('click', () => shelf.scrollBy({ left: -shelf.clientWidth * 0.82, behavior: 'smooth' }));
  next.addEventListener('click', () => shelf.scrollBy({ left: shelf.clientWidth * 0.82, behavior: 'smooth' }));
  shelf.addEventListener('scroll', updateButtons, { passive: true });
  new ResizeObserver(updateButtons).observe(shelf);
  queueMicrotask(updateButtons);

  closeButton.addEventListener('click', closeModal);
  modal.querySelector('[data-book-close]')?.addEventListener('click', closeModal);
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

  status.hidden = true;
}

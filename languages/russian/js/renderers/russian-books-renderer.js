import { russianBookPageData } from '../data/russian-books-data.js';

const bookOrder = ['ru_skazki_pushkina', 'ru_vishnevy_sad', 'ru_prestuplenie_i_nakazanie', 'ru_mertvye_dushi', 'ru_voina_i_mir'];

function levelLabel(level) {
  return (Array.isArray(level) ? level : [level]).filter(Boolean).join('–') || 'Без ограничения';
}

export function initializeRussianBookshelf() {
  const shelf = document.querySelector('#russian-books-shelf');
  const previous = document.querySelector('#russian-books-previous');
  const next = document.querySelector('#russian-books-next');
  const status = document.querySelector('#russian-books-status');
  const modal = document.querySelector('#russian-book-modal');
  const dialog = modal?.querySelector('.book-dialog-ru');
  const close = modal?.querySelector('[data-book-modal-close-button]');
  if (!shelf || !previous || !next || !status || !modal || !dialog || !close) return;

  const canonicalBooks = Array.isArray(window.publicDomainBooks)
    ? window.publicDomainBooks.filter((book) => book.language === 'ru')
    : [];
  const books = canonicalBooks.sort((a, b) => bookOrder.indexOf(a.id) - bookOrder.indexOf(b.id));
  if (!books.length) {
    status.textContent = 'Книжная полка временно недоступна.';
    previous.disabled = true;
    next.disabled = true;
    return;
  }

  const state = { activeBook: null, trigger: null };
  const cards = books.map((book, index) => {
    const item = document.createElement('li');
    item.className = 'book-item-ru';
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'book-card-ru';
    card.dataset.bookId = book.id;
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-controls', 'russian-book-modal');
    card.setAttribute('aria-label', `Открыть книгу «${book.title}», уровень ${levelLabel(book.recommendedCEFR)}`);
    const cover = document.createElement('span');
    cover.className = 'book-cover-ru';
    const image = document.createElement('img');
    image.src = book.coverImg;
    image.alt = `Обложка книги «${book.title}»`;
    image.width = 360;
    image.height = 540;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      image.src = '/library/images/assets/open_book_flipping_icon.png';
      image.alt = `Обложка для книги «${book.title}» недоступна`;
    }, { once: true });
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    cover.append(image, number);
    const copy = document.createElement('span');
    copy.className = 'book-copy-ru';
    copy.innerHTML = `<small>УРОВЕНЬ ${levelLabel(book.recommendedCEFR)}</small><strong>${book.title}</strong><span>${book.author}</span><b>${russianBookPageData[book.id]?.category || 'Книга на русском'}</b>`;
    card.append(cover, copy);
    item.append(card);
    return item;
  });
  shelf.replaceChildren(...cards);
  status.textContent = 'Полка готова к чтению.';

  const modalCover = modal.querySelector('#russian-book-modal-cover');
  const modalSource = modal.querySelector('#russian-book-modal-source');
  const modalCategory = modal.querySelector('#russian-book-modal-category');
  const modalTitle = modal.querySelector('#russian-book-modal-title');
  const modalAuthor = modal.querySelector('#russian-book-modal-author');
  const modalLevel = modal.querySelector('#russian-book-modal-level');
  const modalDescription = modal.querySelector('#russian-book-modal-description');
  const modalGuidance = modal.querySelector('#russian-book-modal-guidance');
  const modalLinks = modal.querySelector('#russian-book-modal-links');

  const renderLinks = (book) => {
    const links = [];
    if (book.epubLink) links.push({ label: 'Открыть EPUB', href: book.epubLink });
    if (book.pdfLink) links.push({ label: 'Открыть PDF', href: book.pdfLink });
    modalLinks.replaceChildren(...links.map((link) => {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = `${link.label} ↗`;
      return anchor;
    }));
  };

  const openModal = (book, trigger) => {
    const pageCopy = russianBookPageData[book.id] || {};
    state.activeBook = book;
    state.trigger = trigger;
    modalCover.src = book.coverImg;
    modalCover.alt = `Обложка книги «${book.title}»`;
    modalSource.textContent = 'Из общей библиотеки проекта';
    modalCategory.textContent = pageCopy.category || 'Книга на русском';
    modalTitle.textContent = book.title;
    modalAuthor.textContent = book.author;
    modalLevel.textContent = `Рекомендуемый уровень · ${levelLabel(book.recommendedCEFR)}`;
    modalDescription.textContent = pageCopy.description || book.description;
    modalGuidance.textContent = pageCopy.guidance || 'Читайте небольшими фрагментами и возвращайтесь к повторяющимся словам после первого знакомства со сценой.';
    renderLinks(book);
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('book-modal-open-ru');
    window.requestAnimationFrame(() => {
      modal.classList.add('is-open');
      close.focus();
    });
  };

  const closeModal = () => {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('book-modal-open-ru');
    window.setTimeout(() => {
      modal.hidden = true;
      modalLinks.replaceChildren();
      state.trigger?.focus();
      state.activeBook = null;
      state.trigger = null;
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150);
  };

  modalCover.addEventListener('error', () => {
    modalCover.src = '/library/images/assets/open_book_flipping_icon.png';
    modalCover.alt = state.activeBook ? `Обложка для книги «${state.activeBook.title}» недоступна` : '';
  });
  shelf.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-book-id]');
    if (!trigger || !shelf.contains(trigger)) return;
    const book = books.find((item) => item.id === trigger.dataset.bookId);
    if (book) openModal(book, trigger);
  });
  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-book-modal-close]')) closeModal();
  });
  close.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const updateControls = () => {
    const max = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
    previous.disabled = shelf.scrollLeft <= 3;
    next.disabled = shelf.scrollLeft >= max - 3;
  };
  const scrollShelf = (direction) => shelf.scrollBy({ left: direction * Math.max(260, shelf.clientWidth * 0.78), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  previous.addEventListener('click', () => scrollShelf(-1));
  next.addEventListener('click', () => scrollShelf(1));
  shelf.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls, { passive: true });
  window.requestAnimationFrame(updateControls);
}

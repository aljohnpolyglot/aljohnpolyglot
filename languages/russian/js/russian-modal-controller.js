const selectors = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

export function createRussianCreatorModal(root) {
  if (!root) return { open: () => {} };
  const dialog = root.querySelector('.creator-dialog-ru');
  const closeButtons = root.querySelectorAll('[data-modal-close]');
  const image = root.querySelector('#creator-modal-image');
  const categoryNode = root.querySelector('#creator-modal-category');
  const name = root.querySelector('#creator-modal-name');
  const level = root.querySelector('#creator-modal-level');
  const description = root.querySelector('#creator-modal-description');
  const noteSection = root.querySelector('.creator-note-ru');
  const note = root.querySelector('#creator-modal-note');
  const sampleTitle = root.querySelector('#creator-sample-title');
  const sampleFrame = root.querySelector('#creator-sample-frame');
  const links = root.querySelector('#creator-modal-links');
  let trigger = null;
  let bodyOverflow = '';

  image.addEventListener('error', () => {
    image.src = '../../images/creators/creator-fallback.svg';
    image.alt = '';
  });

  const close = () => {
    if (root.hidden) return;
    root.classList.remove('is-open');
    root.hidden = true;
    sampleFrame.replaceChildren();
    document.body.style.overflow = bodyOverflow;
    document.removeEventListener('keydown', onKeydown);
    if (trigger) trigger.focus({ preventScroll: true });
  };

  const onKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll(selectors)].filter((item) => !item.hasAttribute('hidden'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  closeButtons.forEach((button) => button.addEventListener('click', close));

  const open = (creator, category) => {
    trigger = document.activeElement;
    image.src = creator.profilePic || '../../images/creators/creator-fallback.svg';
    image.alt = creator.imageAlt || `Портрет ${creator.name}`;
    categoryNode.textContent = category.title;
    name.textContent = creator.name;
    level.textContent = `Рекомендуемый диапазон: ${creator.levels.join(' · ')}`;
    description.textContent = creator.longDescription;
    const personalNote = creator.personalComment?.trim() || creator.aljohnComment?.trim() || '';
    note.textContent = personalNote;
    if (noteSection) noteSection.hidden = !personalNote;
    sampleTitle.textContent = creator.sampleVideo?.title || 'Пример пока недоступен';
    sampleFrame.replaceChildren();
    if (creator.sampleVideo?.id) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${creator.sampleVideo.id}?rel=0&modestbranding=1`;
      iframe.title = `Пример видео: ${creator.sampleVideo.title || creator.name}`;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      sampleFrame.append(iframe);
    } else {
      const unavailable = document.createElement('p');
      unavailable.textContent = 'Проверенного публичного видео пока нет.';
      sampleFrame.append(unavailable);
    }
    links.replaceChildren(...createLinks(creator.links));
    root.hidden = false;
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      root.classList.add('is-open');
      dialog.querySelector('.creator-close-ru').focus();
    });
    document.addEventListener('keydown', onKeydown);
  };

  return { open, close };
}

function createLinks(linkMap = {}) {
  const labels = { youtube: 'Открыть канал на YouTube', telegram: 'Открыть Telegram', instagram: 'Открыть Instagram', spotify: 'Открыть Spotify', website: 'Открыть официальный сайт' };
  const entries = Object.entries(linkMap).filter(([, url]) => Boolean(url));
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Проверенные внешние ссылки пока не добавлены.';
    return [empty];
  }
  return entries.map(([platform, url]) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = `${labels[platform] || 'Открыть источник'} ↗`;
    return anchor;
  });
}

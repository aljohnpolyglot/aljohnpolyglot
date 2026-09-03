export function renderRussianPlaylist(playlist, elements) {
  const { list, player, number, title, note } = elements;
  if (!list || !player) return;

  const selectVideo = (video, index, button, shouldFocus = false) => {
    player.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&autoplay=1`;
    player.title = video.title;
    number.textContent = String(index + 1).padStart(2, '0');
    title.textContent = video.title;
    note.textContent = video.note;
    list.querySelectorAll('.playlist-item-ru').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (shouldFocus) player.focus({ preventScroll: true });
  };

  const fragment = document.createDocumentFragment();
  playlist.videos.forEach((video, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'playlist-item-ru';
    button.setAttribute('aria-pressed', String(index === 0));
    button.setAttribute('aria-label', `Воспроизвести: ${video.title}`);
    if (index === 0) button.classList.add('is-active');

    const image = document.createElement('img');
    image.src = video.image;
    image.alt = video.imageAlt;
    image.width = 1280;
    image.height = 720;
    image.loading = index === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      image.src = '../../images/creators/creator-fallback.svg';
      image.alt = '';
    }, { once: true });

    const itemNumber = document.createElement('span');
    itemNumber.className = 'playlist-item-number-ru';
    itemNumber.textContent = String(index + 1).padStart(2, '0');

    const itemCopy = document.createElement('span');
    itemCopy.className = 'playlist-item-copy-ru';
    const itemTitle = document.createElement('strong');
    itemTitle.textContent = video.shortTitle;
    const duration = document.createElement('small');
    duration.textContent = video.duration;
    itemCopy.append(itemTitle, duration);
    button.append(itemNumber, image, itemCopy);
    button.addEventListener('click', () => selectVideo(video, index, button));
    fragment.append(button);
  });
  list.replaceChildren(fragment);
}

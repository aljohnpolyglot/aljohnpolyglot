document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('swedish-personal-player');
    const list = document.getElementById('swedish-personal-playlist-list');
    const title = document.getElementById('swedish-player-title');
    const note = document.getElementById('swedish-player-note');
    const count = document.getElementById('swedish-playlist-count');
    const empty = document.getElementById('swedish-playlist-empty');
    const videos = typeof swedishPlaylistData !== 'undefined' && Array.isArray(swedishPlaylistData.videos)
        ? swedishPlaylistData.videos.filter(video => video?.id && video?.title)
        : [];

    if (!player || !list || !title || !note || !count) return;
    if (!videos.length) {
        player.closest('.personal-player-shell')?.setAttribute('hidden', '');
        empty?.removeAttribute('hidden');
        return;
    }

    const buttons = [];
    const selectVideo = (video, index, shouldFocus = false) => {
        const start = Number.isFinite(video.startSeconds) ? `?start=${video.startSeconds}` : '';
        player.src = `https://www.youtube-nocookie.com/embed/${video.id}${start}`;
        player.title = video.title;
        title.textContent = video.title;
        note.textContent = video.note || '';
        buttons.forEach((button, buttonIndex) => {
            const selected = buttonIndex === index;
            button.classList.toggle('is-selected', selected);
            button.setAttribute('aria-current', selected ? 'true' : 'false');
        });
        if (shouldFocus) buttons[index]?.focus({ preventScroll: true });
    };

    const fragment = document.createDocumentFragment();
    videos.forEach((video, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'personal-playlist-item';
        button.innerHTML = `
            <img class="personal-playlist-item-thumb" src="${video.thumbnail || 'images/fallback-resource.svg'}" data-local-fallback="images/fallback-resource.svg" alt="" width="96" height="54" loading="lazy" decoding="async">
            <span class="personal-playlist-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
            <span class="personal-playlist-item-copy">
                <span class="personal-playlist-item-title">${video.title}</span>
                <span class="personal-playlist-action"><i class="fas fa-play" aria-hidden="true"></i> Spela videon</span>
            </span>`;
        button.setAttribute('aria-label', `Spela: ${video.title}`);
        button.addEventListener('click', () => selectVideo(video, index));
        buttons.push(button);
        item.appendChild(button);
        fragment.appendChild(item);
    });

    list.replaceChildren(fragment);
    window.SwedishModalController?.wireLocalImageFallback(list);
    count.textContent = `${videos.length} videor`;
    selectVideo(videos[0], 0);
});

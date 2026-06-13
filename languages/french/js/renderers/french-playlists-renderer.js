function renderFrenchPlaylists() {
    const numberFormatter = new Intl.NumberFormat('fr-FR');

    const escapeHtml = value =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    const buildMetaText = video => {
        const parts = [];

        if (video.date) {
            parts.push(video.date);
        }

        if (video.publishedTime) {
            parts.push(video.publishedTime);
        }

        if (video.duration) {
            parts.push(video.duration);
        }

        if (typeof video.views === 'number') {
            parts.push(`${numberFormatter.format(video.views)} vues`);
        } else if (video.views) {
            parts.push(video.views);
        }

        if (video.channelName) {
            parts.push(video.channelName);
        }

        return parts.join(' • ');
    };

    const getPlaylistId = playlistUrl => {
        if (!playlistUrl) {
            return '';
        }

        try {
            return new URL(playlistUrl).searchParams.get('list') ?? '';
        } catch (error) {
            return '';
        }
    };

    const setupPlaylist = ({
        items,
        playlistUrl,
        playerId,
        titleId,
        metaId,
        linkId,
        listId,
        itemClassName = 'playlist-item-fr',
    }) => {
        const player = document.getElementById(playerId);
        const title = document.getElementById(titleId);
        const meta = document.getElementById(metaId);
        const link = document.getElementById(linkId);
        const list = document.getElementById(listId);

        if (!player || !title || !meta || !link || !list || !Array.isArray(items) || items.length === 0) {
            return;
        }

        const playlistId = getPlaylistId(playlistUrl);

        const updateFeaturedVideo = (video, autoplay = false) => {
            player.src = `https://www.youtube.com/embed/${video.id}${autoplay ? '?autoplay=1' : ''}`;
            title.textContent = video.title;
            meta.textContent = buildMetaText(video);
            link.href = playlistId
                ? `https://www.youtube.com/watch?v=${video.id}&list=${playlistId}`
                : `https://www.youtube.com/watch?v=${video.id}`;
            link.setAttribute('aria-label', `Voir ${video.title} sur YouTube`);
        };

        const setActiveState = activeItem => {
            list.querySelectorAll(`.${itemClassName}`).forEach(item => {
                item.classList.remove('active-video');
                item.setAttribute('aria-pressed', 'false');
            });

            activeItem.classList.add('active-video');
            activeItem.setAttribute('aria-pressed', 'true');
        };

        updateFeaturedVideo(items[0], false);
        list.innerHTML = '';

        items.forEach((video, index) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = itemClassName;
            item.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');

            if (index === 0) {
                item.classList.add('active-video');
            }

            item.innerHTML = `
                <img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="${escapeHtml(video.title)}" class="playlist-thumbnail-fr">
                <div class="playlist-text-fr">
                    <h4 class="playlist-item-title-fr">${escapeHtml(video.title)}</h4>
                    <p class="playlist-item-desc-fr">${escapeHtml(buildMetaText(video))}</p>
                </div>
            `;

            item.addEventListener('click', () => {
                if (item.classList.contains('active-video')) {
                    return;
                }

                setActiveState(item);
                updateFeaturedVideo(video, true);
            });

            list.appendChild(item);
        });
    };

    setupPlaylist({
        items: window.frenchPlaylistData,
        playlistUrl: 'https://www.youtube.com/playlist?list=PLHC88jnBSUqJKNya7qTUk48v9qS28l5I-',
        playerId: 'featured-video-player-fr',
        titleId: 'playlist-title-fr',
        metaId: 'playlist-meta-fr',
        linkId: 'playlist-youtube-link-fr',
        listId: 'playlist-items-container-fr',
    });

    setupPlaylist({
        items: window.extraFrenchPlaylistData ? window.extraFrenchPlaylistData.episodes : [],
        playlistUrl: window.extraFrenchPlaylistData ? window.extraFrenchPlaylistData.playlistUrl : '',
        playerId: 'extra-player-fr',
        titleId: 'extra-title-fr',
        metaId: 'extra-meta-fr',
        linkId: 'extra-youtube-link-fr',
        listId: 'extra-playlist-fr',
    });
}

window.renderFrenchPlaylists = renderFrenchPlaylists;

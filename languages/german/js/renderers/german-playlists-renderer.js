import { germanPlaylist } from '../data/german-playlist-data.js';
import { germanExtraPlaylist } from '../data/german-extra-data.js';

const setImageFallback = image => {
  image.addEventListener('error', () => {
    image.src = 'images/creators/creator-fallback.svg';
  }, { once: true });
};

const formatDate = value => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};

export function renderGermanPlaylists() {
  const personalPlayer = document.getElementById('german-featured-player');
  const personalTitle = document.getElementById('personal-video-heading-de');
  const personalMeta = document.getElementById('german-video-meta');
  const personalLink = document.getElementById('german-playlist-link');
  const personalList = document.getElementById('german-playlist-list');

  if (personalPlayer && personalTitle && personalMeta && personalLink && personalList) {
    const activatePersonalVideo = (video, autoplay = false) => {
      const params = new URLSearchParams({ rel: '0', list: video.playlistId });
      if (autoplay) params.set('autoplay', '1');
      personalPlayer.src = `https://www.youtube.com/embed/${video.id}?${params}`;
      personalTitle.textContent = video.displayTitle || video.title;
      personalMeta.textContent = [video.duration, formatDate(video.publishedAt)].filter(Boolean).join(' · ');
      personalLink.href = video.playlistUrl;
    };

    personalList.replaceChildren();
    germanPlaylist.forEach((video, index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      const image = document.createElement('img');
      const copy = document.createElement('span');
      const title = document.createElement('strong');
      const meta = document.createElement('small');
      const icon = document.createElement('i');

      button.type = 'button';
      button.className = 'playlist-item-de';
      button.setAttribute('aria-pressed', String(index === 0));
      button.setAttribute('aria-label', `${video.title} abspielen`);
      image.src = video.thumbnail;
      image.alt = video.thumbnailAlt;
      image.width = 1280;
      image.height = 720;
      image.loading = 'lazy';
      image.decoding = 'async';
      setImageFallback(image);
      title.textContent = video.displayTitle || video.title;
      meta.textContent = [video.duration, formatDate(video.publishedAt)].filter(Boolean).join(' · ');
      copy.append(title, meta);
      icon.className = 'fa-solid fa-play';
      icon.setAttribute('aria-hidden', 'true');
      button.append(image, copy, icon);
      button.addEventListener('click', () => {
        personalList.querySelectorAll('button').forEach(candidate => candidate.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        activatePersonalVideo(video, true);
      });
      item.appendChild(button);
      personalList.appendChild(item);
    });
    activatePersonalVideo(germanPlaylist[0]);
  }

  const extraPlayer = document.getElementById('extra-player-de');
  const extraTitle = document.getElementById('extra-title-de');
  const extraMeta = document.getElementById('extra-meta-de');
  const extraLink = document.getElementById('extra-youtube-link-de');
  const extraList = document.getElementById('extra-playlist-list-de');

  if (!extraPlayer || !extraTitle || !extraMeta || !extraLink || !extraList) return;

  const activateExtraEpisode = (episode, autoplay = false) => {
    const params = new URLSearchParams({ rel: '0', list: germanExtraPlaylist.playlistId });
    if (autoplay) params.set('autoplay', '1');
    extraPlayer.src = `https://www.youtube.com/embed/${episode.id}?${params}`;
    extraTitle.textContent = episode.title;
    extraMeta.textContent = episode.duration;
    extraLink.href = `https://www.youtube.com/watch?v=${episode.id}&list=${germanExtraPlaylist.playlistId}`;
    extraLink.setAttribute('aria-label', `${episode.title} auf YouTube öffnen`);
  };

  extraList.replaceChildren();
  germanExtraPlaylist.episodes.forEach((episode, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const image = document.createElement('img');
    const copy = document.createElement('span');
    const title = document.createElement('strong');
    const channel = document.createElement('small');
    const duration = document.createElement('span');

    button.type = 'button';
    button.className = 'extra-playlist-item-de';
    button.setAttribute('aria-pressed', String(index === 0));
    button.setAttribute('aria-label', `${episode.title} abspielen`);
    image.src = episode.thumbnail;
    image.alt = episode.thumbnailAlt;
    image.width = 1280;
    image.height = 720;
    image.loading = 'lazy';
    image.decoding = 'async';
    setImageFallback(image);
    title.textContent = episode.title;
    channel.textContent = germanExtraPlaylist.channel;
    duration.textContent = episode.duration;
    copy.append(title, channel);
    button.append(image, copy, duration);
    button.addEventListener('click', () => {
      extraList.querySelectorAll('button').forEach(candidate => candidate.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      activateExtraEpisode(episode, true);
    });
    item.appendChild(button);
    extraList.appendChild(item);
  });
  activateExtraEpisode(germanExtraPlaylist.episodes[0]);
}

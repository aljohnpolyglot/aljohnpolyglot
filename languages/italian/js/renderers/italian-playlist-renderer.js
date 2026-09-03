(function () {
    "use strict";

    const playlist = window.ITALIAN_PERSONAL_PLAYLIST;
    if (!playlist || !Array.isArray(playlist.videos) || !playlist.videos.length) return;

    const player = document.getElementById("italian-featured-player");
    const title = document.getElementById("italian-featured-title");
    const context = document.getElementById("italian-featured-context");
    const videoLink = document.getElementById("italian-featured-link");
    const playlistLink = document.getElementById("italian-full-playlist-link");
    const channelLink = document.getElementById("italian-channel-link");
    const list = document.getElementById("italian-playlist-list");
    const status = document.getElementById("italian-playlist-status");

    if (!player || !title || !context || !videoLink || !list) return;

    let selectedIndex = 0;
    const buttons = [];

    function selectVideo(index, announce) {
        const video = playlist.videos[index];
        if (!video) return;

        selectedIndex = index;
        player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?rel=0`;
        player.title = `${video.title} — video di Aljohn Polyglot`;
        title.textContent = video.title;
        context.textContent = video.context;
        videoLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;

        buttons.forEach((button, buttonIndex) => {
            const isSelected = buttonIndex === selectedIndex;
            button.setAttribute("aria-pressed", String(isSelected));
            button.classList.toggle("is-selected", isSelected);
        });

        if (announce && status) {
            status.textContent = `Video selezionato: ${video.title}.`;
        }
    }

    playlist.videos.forEach((video, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "playlist-item";
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", `Riproduci ${video.title}, durata ${video.duration}`);

        const number = document.createElement("span");
        number.className = "playlist-item-number";
        number.textContent = String(index + 1).padStart(2, "0");

        const thumbnail = document.createElement("img");
        thumbnail.src = `https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/mqdefault.jpg`;
        thumbnail.alt = "";
        thumbnail.loading = "lazy";

        const copy = document.createElement("span");
        copy.className = "playlist-item-copy";

        const itemTitle = document.createElement("strong");
        itemTitle.textContent = video.title;

        const itemContext = document.createElement("small");
        itemContext.textContent = video.context;

        const duration = document.createElement("span");
        duration.className = "playlist-item-duration";
        duration.textContent = video.duration;

        copy.append(itemTitle, itemContext);
        button.append(number, thumbnail, copy, duration);
        button.addEventListener("click", () => selectVideo(index, true));
        list.appendChild(button);
        buttons.push(button);
    });

    if (playlistLink) playlistLink.href = playlist.playlistUrl;
    if (channelLink) channelLink.href = playlist.channelUrl;
    selectVideo(0, false);
})();

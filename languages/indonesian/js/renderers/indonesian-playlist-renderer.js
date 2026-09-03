export function renderPlaylist({ playlist, list, player, title, context, position }) {
    if (!playlist.length || !list || !player || !title || !context) return;

    const buttons = [];

    const selectVideo = (entry, index, moveFocus = false) => {
        player.src = `https://www.youtube-nocookie.com/embed/${entry.id}?rel=0&modestbranding=1`;
        player.title = `${entry.title} — Aljohn Polyglot`;
        title.textContent = entry.title;
        context.textContent = entry.note;
        if (position) position.textContent = `${index + 1} / ${playlist.length}`;

        buttons.forEach((button, buttonIndex) => {
            button.setAttribute("aria-current", buttonIndex === index ? "true" : "false");
        });

        if (moveFocus) buttons[index]?.focus();
    };

    playlist.forEach((entry, index) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const thumbnail = document.createElement("img");
        const copy = document.createElement("span");
        const name = document.createElement("strong");
        const meta = document.createElement("span");

        button.type = "button";
        button.className = "playlist-item-id";
        button.setAttribute("aria-label", `Putar ${entry.title}`);
        thumbnail.src = entry.thumbnail;
        thumbnail.alt = `Pratinjau video ${entry.title}`;
        thumbnail.width = 480;
        thumbnail.height = 360;
        thumbnail.loading = "lazy";
        thumbnail.decoding = "async";
        thumbnail.addEventListener("error", () => {
            if (!thumbnail.src.endsWith("creator-fallback.svg")) thumbnail.src = "../../images/creators/creator-fallback.svg";
        }, { once: true });
        name.textContent = entry.title;
        meta.textContent = entry.context;
        copy.append(name, meta);
        button.append(thumbnail, copy);
        button.addEventListener("click", () => selectVideo(entry, index));
        item.append(button);
        list.append(item);
        buttons.push(button);
    });

    selectVideo(playlist[0], 0);
}

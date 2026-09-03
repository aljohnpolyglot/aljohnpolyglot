import { tagalogLibrary, tagalogPlaylist } from "./data/tagalog-playlist-data.js";

const player = document.getElementById("tagalog-featured-player");
const previous = document.getElementById("tagalog-video-prev");
const next = document.getElementById("tagalog-video-next");
let current = 0;

const selectVideo = index => {
    current = (index + tagalogPlaylist.length) % tagalogPlaylist.length;
    const video = tagalogPlaylist[current];
    player.src = `https://www.youtube-nocookie.com/embed/${video.id}`;
    player.title = video.title;
};

previous.addEventListener("click", () => selectVideo(current - 1));
next.addEventListener("click", () => selectVideo(current + 1));

const libraryPlayer = document.getElementById("tagalog-library-player");
const libraryList = document.getElementById("tagalog-library-list");

tagalogLibrary.forEach((video, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<button type="button" ${index === 0 ? 'aria-current="true"' : ""}><img src="${video.image}" width="160" height="90" alt="" loading="lazy" decoding="async"><span>${video.title}</span></button>`;
    item.querySelector("button").addEventListener("click", event => {
        libraryPlayer.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`;
        libraryPlayer.title = video.title;
        libraryList.querySelector('[aria-current="true"]')?.removeAttribute("aria-current");
        event.currentTarget.setAttribute("aria-current", "true");
    });
    libraryList.appendChild(item);
});

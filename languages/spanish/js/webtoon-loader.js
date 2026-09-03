// D:\website\languages\spanish\js\webtoon-loader.js

document.addEventListener('DOMContentLoaded', () => {
    const webtoonGrid = document.getElementById('webtoon-grid');

    if (!webtoonGrid || typeof webtoonData === 'undefined') {
        console.error("Falta el contenedor #webtoon-grid o el archivo de datos webtoon-data.js.");
        return;
    }

    function loadWebtoons() {
        const webtoonsHTML = webtoonData.map(webtoon => `
            <a href="${webtoon.link}" target="_blank" class="webtoon-item" title="${webtoon.title}">
                <img src="${webtoon.image}" alt="Portada de ${webtoon.title}">
            </a>
        `).join('');

        webtoonGrid.innerHTML = webtoonsHTML;
    }

    loadWebtoons();
});
const shelfDescriptions = {
  language: 'Понятная речь, субтитры и наблюдения о самом языке.',
  culture: 'Личные истории, юмор и современный разговорный ритм.',
  personalities: 'Актёры, ведущие, интервью и узнаваемые публичные голоса.',
  kids: 'Мультфильмы и простая бытовая речь с ясным визуальным контекстом.',
  sport: 'NBA, гимнастика, фигурное катание и язык движения.',
  food: 'Еда, бытовые действия и лексика, которую легко увидеть.'
};

const shelfLeadOrder = {
  language: ['russian-with-max', 'russian-progress'],
  sport: ['kamila-valieva', 'anna-shcherbakova', 'anna-shcherbakova-team', 'alina-zagitova', 'figurnoe-katanie', 'figurka', 'vzyal-myach', 'aanba']
};

export async function loadRussianCreators({ container, status, onOpen }) {
  if (!container) return;
  try {
    const response = await fetch('js/data/russian-creators-data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const levelFilter = document.querySelector('#russian-creator-level-filter');
    let activeLevel = 'all';
    const update = () => {
      renderShelves(data, container, onOpen, activeLevel);
      if (status) {
        status.hidden = true;
        status.textContent = activeLevel === 'all'
          ? 'Показаны все уровни.'
          : `Показаны авторы уровня ${activeLevel}.`;
      }
    };
    levelFilter?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-creator-level]');
      if (!button || !levelFilter.contains(button)) return;
      activeLevel = button.dataset.creatorLevel || 'all';
      levelFilter.querySelectorAll('[data-creator-level]').forEach((option) => {
        option.setAttribute('aria-pressed', String(option === button));
      });
      update();
    });
    update();
    if (status) status.hidden = true;
  } catch (error) {
    console.error('Не удалось загрузить русскую библиотеку авторов:', error);
    if (status) status.textContent = 'Полки временно не загрузились. Обновите страницу, чтобы попробовать ещё раз.';
  }
}

function renderShelves(data, container, onOpen, activeLevel = 'all') {
  const fragment = document.createDocumentFragment();
  let visibleShelfIndex = 0;
  data.categories.forEach((category) => {
    const priority = shelfLeadOrder[category.id] || [];
    const creators = data.creators
      .filter((creator) => creator.categories.includes(category.id))
      .filter((creator) => activeLevel === 'all' || creator.levels.includes(activeLevel))
      .sort((first, second) => {
        const firstRank = priority.includes(first.id) ? priority.indexOf(first.id) : Number.POSITIVE_INFINITY;
        const secondRank = priority.includes(second.id) ? priority.indexOf(second.id) : Number.POSITIVE_INFINITY;
        return firstRank - secondRank;
      });
    if (!creators.length) return;
    visibleShelfIndex += 1;

    const section = document.createElement('section');
    section.className = `creator-shelf-ru shelf-${category.id}-ru`;
    section.id = `shelf-${category.id}`;
    section.setAttribute('aria-labelledby', `shelf-${category.id}-title`);

    const head = document.createElement('header');
    head.className = 'shelf-head-ru';
    const headingGroup = document.createElement('div');
    const index = document.createElement('p');
    index.textContent = `ПОЛКА ${String(visibleShelfIndex).padStart(2, '0')}`;
    const title = document.createElement('h3');
    title.id = `shelf-${category.id}-title`;
    title.textContent = category.title;
    const description = document.createElement('span');
    description.textContent = shelfDescriptions[category.id] || '';
    headingGroup.append(index, title, description);

    const controls = document.createElement('div');
    controls.className = 'shelf-controls-ru';
    const previous = makeArrow('←', `Прокрутить полку «${category.title}» назад`);
    const next = makeArrow('→', `Прокрутить полку «${category.title}» вперёд`);
    controls.append(previous, next);
    head.append(headingGroup, controls);

    const viewport = document.createElement('div');
    viewport.className = 'shelf-viewport-ru';
    viewport.setAttribute('tabindex', '0');
    viewport.setAttribute('aria-label', `Авторы: ${category.title}`);

    const track = document.createElement('div');
    track.className = 'shelf-track-ru';
    creators.forEach((creator, creatorIndex) => track.append(createCreatorCard(creator, category, creatorIndex, onOpen)));
    viewport.append(track);
    previous.addEventListener('click', () => viewport.scrollBy({ left: -viewport.clientWidth * 0.82, behavior: 'smooth' }));
    next.addEventListener('click', () => viewport.scrollBy({ left: viewport.clientWidth * 0.82, behavior: 'smooth' }));
    section.append(head, viewport);
    fragment.append(section);
  });
  container.replaceChildren(fragment);
}

function makeArrow(symbol, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = symbol;
  button.setAttribute('aria-label', label);
  return button;
}

function createCreatorCard(creator, category, index, onOpen) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'creator-card-ru';
  button.setAttribute('aria-label', `Подробнее об авторе ${creator.name}`);
  button.dataset.creatorId = creator.id;

  const imageWrap = document.createElement('span');
  imageWrap.className = 'creator-image-ru';
  const image = document.createElement('img');
  image.src = creator.profilePic;
  image.alt = creator.imageAlt || `Портрет ${creator.name}`;
  image.width = 360;
  image.height = 360;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => {
    image.src = '../../images/creators/creator-fallback.svg';
    image.alt = '';
  }, { once: true });
  const cardIndex = document.createElement('span');
  cardIndex.className = 'creator-card-index-ru';
  cardIndex.textContent = String(index + 1).padStart(2, '0');
  imageWrap.append(image, cardIndex);

  const name = document.createElement('strong');
  name.textContent = creator.name;
  const description = document.createElement('span');
  description.textContent = creator.shortDescription;
  const levels = document.createElement('small');
  levels.textContent = `Уровень ${creator.levels.join(' · ')}`;
  button.append(imageWrap, name, description, levels);
  button.addEventListener('click', () => onOpen(creator, category));
  return button;
}

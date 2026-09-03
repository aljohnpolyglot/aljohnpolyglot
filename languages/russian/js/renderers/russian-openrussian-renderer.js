import { openRussianResource } from '../data/russian-openrussian-data.js';

function insertAtSelection(input, value) {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.setRangeText(value, start, end, 'end');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
}

export function initializeOpenRussian() {
  const form = document.querySelector('#openrussian-search-form');
  const input = document.querySelector('#openrussian-word');
  const status = document.querySelector('#openrussian-status');
  const keyboard = document.querySelector('#openrussian-keyboard');
  const links = document.querySelector('#openrussian-links');
  const suggestions = document.querySelector('#openrussian-suggestions');
  if (!form || !input || !status || !keyboard || !links || !suggestions) return;

  links.replaceChildren(...openRussianResource.links.map((resource) => {
    const anchor = document.createElement('a');
    anchor.href = resource.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.innerHTML = `<strong>${resource.label}</strong><span>${resource.note}</span><b aria-hidden="true">↗</b>`;
    return anchor;
  }));

  let uppercase = false;
  const keyButtons = [];
  const rows = openRussianResource.keyboardRows.map((characters, rowIndex) => {
    const row = document.createElement('div');
    row.className = 'openrussian-keyboard-row-ru';
    if (rowIndex === 1) {
      const shift = document.createElement('button');
      shift.type = 'button';
      shift.className = 'openrussian-key-special-ru';
      shift.dataset.keyboardAction = 'shift';
      shift.setAttribute('aria-label', 'Переключить регистр');
      shift.setAttribute('aria-pressed', 'false');
      shift.textContent = '⇧';
      row.append(shift);
    }
    characters.forEach((character) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.keyboardCharacter = character;
      button.setAttribute('aria-label', `Ввести ${character}`);
      button.textContent = character;
      keyButtons.push(button);
      row.append(button);
    });
    if (rowIndex === 0) {
      const backspace = document.createElement('button');
      backspace.type = 'button';
      backspace.className = 'openrussian-key-special-ru';
      backspace.dataset.keyboardAction = 'backspace';
      backspace.setAttribute('aria-label', 'Удалить символ');
      backspace.textContent = '⌫';
      row.append(backspace);
    }
    return row;
  });
  const spaceRow = document.createElement('div');
  spaceRow.className = 'openrussian-keyboard-row-ru openrussian-keyboard-space-row-ru';
  const space = document.createElement('button');
  space.type = 'button';
  space.dataset.keyboardAction = 'space';
  space.setAttribute('aria-label', 'Ввести пробел');
  space.textContent = 'ПРОБЕЛ';
  spaceRow.append(space);
  keyboard.replaceChildren(...rows, spaceRow);

  keyboard.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !keyboard.contains(button)) return;
    const character = button.dataset.keyboardCharacter;
    if (character) {
      insertAtSelection(input, uppercase ? character.toUpperCase() : character);
      return;
    }
    if (button.dataset.keyboardAction === 'space') insertAtSelection(input, ' ');
    if (button.dataset.keyboardAction === 'backspace') {
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      if (start !== end) input.setRangeText('', start, end, 'end');
      else if (start > 0) input.setRangeText('', start - 1, start, 'end');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
    if (button.dataset.keyboardAction === 'shift') {
      uppercase = !uppercase;
      button.setAttribute('aria-pressed', String(uppercase));
      button.classList.toggle('is-active', uppercase);
      keyButtons.forEach((keyButton) => {
        const baseCharacter = keyButton.dataset.keyboardCharacter;
        keyButton.textContent = uppercase ? baseCharacter.toUpperCase() : baseCharacter;
        keyButton.setAttribute('aria-label', `Ввести ${keyButton.textContent}`);
      });
    }
  });

  let visibleSuggestions = [];
  let activeSuggestion = -1;

  const closeSuggestions = () => {
    visibleSuggestions = [];
    activeSuggestion = -1;
    suggestions.hidden = true;
    suggestions.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  };

  const setActiveSuggestion = (index) => {
    if (!visibleSuggestions.length) return;
    activeSuggestion = (index + visibleSuggestions.length) % visibleSuggestions.length;
    [...suggestions.children].forEach((option, optionIndex) => {
      const active = optionIndex === activeSuggestion;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-selected', String(active));
      if (active) {
        input.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
      }
    });
  };

  const chooseSuggestion = (index) => {
    const word = visibleSuggestions[index];
    if (!word) return;
    input.value = word;
    closeSuggestions();
    status.textContent = `Выбрано: ${word}. Нажмите «Открыть».`;
    input.focus();
  };

  const renderSuggestions = () => {
    const query = input.value.trim().toLocaleLowerCase('ru-RU');
    if (!query || !/^[а-яё-]+$/u.test(query)) {
      closeSuggestions();
      return;
    }
    visibleSuggestions = openRussianResource.suggestions
      .filter((word) => word.startsWith(query) && word !== query)
      .slice(0, 8);
    activeSuggestion = -1;
    if (!visibleSuggestions.length) {
      closeSuggestions();
      return;
    }
    const options = visibleSuggestions.map((word, index) => {
      const option = document.createElement('li');
      option.id = `openrussian-suggestion-${index}`;
      option.role = 'option';
      option.dataset.suggestionIndex = String(index);
      option.setAttribute('aria-selected', 'false');
      option.textContent = word;
      return option;
    });
    suggestions.replaceChildren(...options);
    suggestions.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  input.addEventListener('input', () => {
    status.textContent = '';
    input.removeAttribute('aria-invalid');
    renderSuggestions();
  });

  input.addEventListener('keydown', (event) => {
    if (suggestions.hidden) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion(activeSuggestion + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion(activeSuggestion < 0 ? visibleSuggestions.length - 1 : activeSuggestion - 1);
    } else if (event.key === 'Enter' && activeSuggestion >= 0) {
      event.preventDefault();
      chooseSuggestion(activeSuggestion);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeSuggestions();
    }
  });

  suggestions.addEventListener('mousedown', (event) => {
    const option = event.target.closest('[data-suggestion-index]');
    if (!option) return;
    event.preventDefault();
    chooseSuggestion(Number(option.dataset.suggestionIndex));
  });

  input.addEventListener('blur', () => window.setTimeout(closeSuggestions, 120));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const word = input.value.trim().replace(/[’']/g, '').toLowerCase();
    if (!word || !/^[а-яё-]+$/u.test(word)) {
      input.setAttribute('aria-invalid', 'true');
      status.textContent = 'Введите одно русское слово кириллицей.';
      input.focus();
      return;
    }
    status.textContent = `Открываю словарную статью: ${word}`;
    closeSuggestions();
    const opened = window.open(`${openRussianResource.wordUrl}${encodeURIComponent(word)}`, '_blank', 'noopener,noreferrer');
    if (opened) opened.opener = null;
  });
}

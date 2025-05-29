'use strict';

/**
 * Creates an HTML element with specified tag, classes, and attributes.
 * @param {string} tag - The HTML tag to create (e.g., 'div', 'img').
 * @param {string[]|string} [classes=[]] - A string or array of strings for class names.
 * @param {Object} [attributes={}] - An object of attributes (e.g., { src: 'path/to/img.png', alt: 'Image' }).
 * @param {string} [textContent=''] - Text content for the element.
 * @returns {HTMLElement} The created HTML element.
 */
function createElement(tag, classes = [], attributes = {}, textContent = '') {
    if (!tag || typeof tag !== 'string') {
        console.error('createElement: tag name must be a non-empty string.', tag);
        return document.createElement('div'); // Fallback to a div to prevent further errors
    }
    const element = document.createElement(tag);

    if (typeof classes === 'string') {
        if (classes.trim()) element.className = classes.trim(); // More direct assignment if only one string
    } else if (Array.isArray(classes)) {
        classes.forEach(cls => {
            if (typeof cls === 'string' && cls.trim()) {
                element.classList.add(cls.trim());
            }
        });
    }

    if (attributes && typeof attributes === 'object') {
        for (const key in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, key) && attributes[key] !== null && attributes[key] !== undefined) {
                element.setAttribute(key, attributes[key]);
            }
        }
    }

    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}

/**
 * Selects a single DOM element.
 * @param {string} selector - The CSS selector.
 * @param {HTMLElement|Document} [parent=document] - The parent element to search within.
 * @returns {HTMLElement|null} The found element or null.
 */
function $(selector, parent = document) {
    if (!selector || typeof selector !== 'string') {
        console.warn('$: Selector must be a non-empty string.', selector);
        return null;
    }
    if (!parent || typeof parent.querySelector !== 'function') {
        console.warn('$: Parent element does not support querySelector.', parent);
        return null;
    }
    return parent.querySelector(selector);
}

/**
 * Selects multiple DOM elements.
 * @param {string} selector - The CSS selector.
 * @param {HTMLElement|Document} [parent=document] - The parent element to search within.
 * @returns {NodeListOf<HTMLElement>} A NodeList of found elements (possibly empty).
 */
function $$(selector, parent = document) {
    if (!selector || typeof selector !== 'string') {
        console.warn('$$: Selector must be a non-empty string.', selector);
        return []; // Return empty array for consistency
    }
    if (!parent || typeof parent.querySelectorAll !== 'function') {
        console.warn('$$: Parent element does not support querySelectorAll.', parent);
        return []; // Return empty array
    }
    return parent.querySelectorAll(selector);
}

/**
 * Clears all child elements from a parent element.
 * @param {HTMLElement} parentElement - The parent element to clear.
 */
function clearChildren(parentElement) {
    if (parentElement instanceof HTMLElement) {
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
    } else {
        // console.warn("Attempted to clear children of a non-HTMLElement or null parent element:", parentElement);
        // Do not log for null as it might be a common case when an element is not found
        if (parentElement !== null) {
             console.warn("Attempted to clear children of a non-HTMLElement parent element:", parentElement);
        }
    }
}
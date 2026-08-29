/*
 * Data-only bridge to the canonical catalogue. Do not duplicate cover files or
 * shared bibliography here; resolve these IDs from /library/js/data/book_data.js
 * and /library/js/data/olly_richards_books_data.js during a future UI pass.
 */
window.GERMAN_BOOK_RESOURCES = {
  language: 'de',
  canonicalCatalogue: '../../library/index.html',
  books: [
    { libraryRecordId: 'olly_german_stories_beg', pageNote: 'Kurze Lerngeschichten als Übergang zu längeren Originaltexten.' },
    { libraryRecordId: 'de_grimms_maerchen', pageNote: 'Bekannte Handlungen und wiederkehrende Märchenformeln erleichtern den Einstieg.' },
    { libraryRecordId: 'de_max_und_moritz', pageNote: 'Illustrierte Reime verbinden Sprachrhythmus und sichtbare Handlung.' },
    { libraryRecordId: 'de_werther', pageNote: 'Ein anspruchsvoller Briefroman für fortgeschrittenes Lesen und literarische Gefühlssprache.' },
    { libraryRecordId: 'de_effi_briest', pageNote: 'Realistische Prosa mit gesellschaftlichem und historischem Wortschatz.' },
    { libraryRecordId: 'de_zarathustra', pageNote: 'Dichter philosophischer Text; nur mit langsamer Lektüre und Kontext.' },
    { libraryRecordId: 'de_mein_kampf', pageNote: 'Ausschließlich mit kritischem historischem Kontext; keine neutrale Lernempfehlung.' }
  ]
};

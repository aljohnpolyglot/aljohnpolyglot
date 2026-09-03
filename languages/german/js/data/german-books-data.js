/*
 * Data-only bridge to the canonical catalogue. Do not duplicate cover files or
 * shared bibliography here; resolve these IDs from /library/js/data/book_data.js
 * and /library/js/data/olly_richards_books_data.js during a future UI pass.
 */
window.GERMAN_BOOK_RESOURCES = {
  language: 'de',
  canonicalCatalogue: '../../library/index.html',
  books: [
    {
      libraryRecordId: 'de_grimms_maerchen',
      pageNote: 'Bekannte Handlungen und wiederkehrende Märchenformeln erleichtern den Einstieg.',
      descriptionDe: 'Die Sammlung der Brüder Grimm bündelt bekannte Märchen mit wiederkehrenden Wendungen, klaren Handlungsmustern und älterem Erzählwortschatz.'
    },
    {
      libraryRecordId: 'de_max_und_moritz',
      pageNote: 'Illustrierte Reime verbinden Sprachrhythmus und sichtbare Handlung.',
      descriptionDe: 'Wilhelm Buschs Bildergeschichte erzählt sieben Streiche in Reimen. Die Illustrationen geben Halt, während Rhythmus und ältere Wörter das genaue Lesen fordern.'
    },
    {
      libraryRecordId: 'de_werther',
      pageNote: 'Ein anspruchsvoller Briefroman für fortgeschrittenes Lesen und literarische Gefühlssprache.',
      descriptionDe: 'Goethes Briefroman folgt Werthers intensiver, unerwiderter Liebe und gehört zur Literatur des Sturm und Drang. Satzbau und Gefühlssprache verlangen Geduld.'
    },
    {
      libraryRecordId: 'de_effi_briest',
      pageNote: 'Realistische Prosa mit gesellschaftlichem und historischem Wortschatz.',
      descriptionDe: 'Theodor Fontanes Roman schildert Effis Leben innerhalb enger gesellschaftlicher Konventionen im 19. Jahrhundert. Dialoge und Erzählerkommentare öffnen historischen Alltagswortschatz.'
    },
    {
      libraryRecordId: 'de_zarathustra',
      pageNote: 'Dichter philosophischer Text; nur mit langsamer Lektüre und Kontext.',
      descriptionDe: 'Nietzsches philosophischer Prosatext arbeitet mit Gleichnissen, Wiederholungen und bewusst dichter Sprache. Er eignet sich nur für langsame, kontextreiche Lektüre.'
    },
    { libraryRecordId: 'de_mein_kampf', pageNote: 'Ausschließlich mit kritischem historischem Kontext; keine neutrale Lernempfehlung.' }
  ]
};

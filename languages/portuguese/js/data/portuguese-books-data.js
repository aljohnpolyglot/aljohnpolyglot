/*
 * Ponte de dados para o catálogo canônico. Não duplicar capas nem bibliografia
 * aqui; resolver estes IDs em /library/js/data/book_data.js e
 * /library/js/data/olly_richards_books_data.js durante um futuro passe de UI.
 */
window.PORTUGUESE_BOOK_RESOURCES = {
  language: 'pt',
  canonicalCatalogue: '../../library/index.html',
  books: [
    { libraryRecordId: 'olly_portuguese_stories_beg', pageNote: 'Contos graduados para ganhar fôlego antes de entrar nos clássicos.' },
    { libraryRecordId: 'pt_iracema', pageNote: 'Prosa romântica e muito imagética; pede atenção ao vocabulário histórico e indígena.' },
    { libraryRecordId: 'pt_o_cortico', pageNote: 'Narrativa naturalista com vida urbana, fala socialmente marcada e descrição detalhada.' },
    { libraryRecordId: 'pt_dom_casmurro', pageNote: 'Narrador ambíguo, ironia e memória tornam a leitura especialmente rica a partir de B2.' },
    { libraryRecordId: 'pt_memorias_postumas', pageNote: 'Capítulos curtos, humor e ironia, mas uma voz literária que exige leitura lenta.' },
    { libraryRecordId: 'pt_os_sertoes', pageNote: 'Texto denso entre reportagem, história e literatura; recurso avançado com muito contexto.' }
  ]
};

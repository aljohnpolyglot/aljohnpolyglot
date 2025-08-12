// D:\website\languages\spanish\js\books-loader.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CARGADOR DE LA ESTANTERÍA DE LIBROS ---
    // Función para cargar y mostrar los libros en su estantería
    // ----------------------------------------------------
    function loadBooks() {
        const shelf = document.getElementById('shelf-books');
        if (!shelf) {
            console.error('El contenedor de la estantería de libros (shelf-books) no se encontró.');
            return;
        }

        // Ordenar libros: primero por nivel CEFR (los más fáciles primero), luego alfabéticamente por título
        const sortedBooks = booksData.sort((a, b) => {
            const levelA = a.cefr[0]; // Tomamos el nivel más bajo del rango
            const levelB = b.cefr[0];
            
            if (levelA < levelB) return -1;
            if (levelA > levelB) return 1;
            
            // Si los niveles son iguales, ordena por título
            return a.title.localeCompare(b.title);
        });

        // Crear y añadir la tarjeta de cada libro a la estantería
        sortedBooks.forEach(book => {
            const card = document.createElement('article');
            card.className = 'card book-card';
            card.dataset.bookId = book.id; // Usamos un data-attribute para identificar el libro

            card.innerHTML = `
                <img src="${book.coverImage}" alt="Portada de ${book.title}" class="card-image">
                <div class="card-content">
                    <h4 class="card-title">${book.title}</h4>
                    <p class="card-subtitle">${book.author}</p>
                    <span class="cefr-badge">${book.cefr.join(' - ')}</span>
                </div>
            `;
            shelf.appendChild(card);
        });
    }


    // --- 2. MANEJADOR DEL MODAL DE LIBROS ---
    // Función para abrir y poblar el modal con los detalles de un libro específico
    // -----------------------------------------------------------------------
    function openBookModal(book) {
        const modal = document.getElementById('book-modal');
        if (!modal) {
            console.error('El elemento del modal de libros (book-modal) no se encontró.');
            return;
        }
        
        // Poblar el modal con los datos del libro seleccionado
        document.getElementById('modal-book-cover').src = book.coverImage;
        document.getElementById('modal-book-cover').alt = `Portada de ${book.title}`;
        document.getElementById('modal-book-title').textContent = book.title;
        document.getElementById('modal-book-author').textContent = `por ${book.author}`;
        document.getElementById('modal-book-cefr').textContent = `Nivel Sugerido: ${book.cefr.join(' - ')}`;
        document.getElementById('modal-book-long-desc').textContent = book.longDesc;
        
        // Manejar los enlaces de descarga
        const linksContainer = document.getElementById('modal-book-links');
        linksContainer.innerHTML = ''; // Limpiar enlaces anteriores

        if (book.gdriveLinks.epub) {
            const epubLink = document.createElement('a');
            epubLink.href = book.gdriveLinks.epub;
            epubLink.className = 'button-link';
            epubLink.textContent = 'Descargar EPUB';
            epubLink.target = '_blank';
            linksContainer.appendChild(epubLink);
        }

        if (book.gdriveLinks.pdf) {
            const pdfLink = document.createElement('a');
            pdfLink.href = book.gdriveLinks.pdf;
            pdfLink.className = 'button-link';
            pdfLink.textContent = 'Descargar PDF';
            pdfLink.target = '_blank';
            linksContainer.appendChild(pdfLink);
        }

        // Mostrar el modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
    }


    // --- 3. CIERRE DEL MODAL ---
    // Función para cerrar el modal
    // --------------------------------
    function closeBookModal() {
        const modal = document.getElementById('book-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restaura el scroll del fondo
        }
    }


    // --- 4. EVENT LISTENERS (ESCUCHADORES DE EVENTOS) ---
    // Poner todo en marcha
    // ----------------------------------------------------
    
    // Cargar los libros cuando la página esté lista
    loadBooks();

    // Listener para abrir el modal al hacer clic en una tarjeta de libro
    const bookShelf = document.getElementById('shelf-books');
    if (bookShelf) {
        bookShelf.addEventListener('click', (event) => {
            const card = event.target.closest('.book-card');
            if (card) {
                const bookId = card.dataset.bookId;
                const selectedBook = booksData.find(b => b.id === bookId);
                if (selectedBook) {
                    openBookModal(selectedBook);
                }
            }
        });
    }

    // Listeners para cerrar el modal
    const closeModalButton = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('book-modal-overlay');

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeBookModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeBookModal);
    }
    
    // Listener para cerrar el modal con la tecla "Escape"
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeBookModal();
        }
    });

});
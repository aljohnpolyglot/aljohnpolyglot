// D:\website\languages\spanish\js\creators-loader.js (Versión con Depuración)

document.addEventListener('DOMContentLoaded', () => {
   // --- FUNCIÓN DE AYUDA (HELPER FUNCTION) ---
    // Toma un array de niveles CEFR y devuelve un rango simplificado.
    // Ejemplos:
    // ['B1', 'B2', 'C1'] -> 'B1-C1'
    // ['A2', 'B1'] -> 'A2-B1'
    // ['B2'] -> 'B2'
    function getSimplifiedCefrRange(cefrArray) {
        if (!cefrArray || cefrArray.length === 0) {
            return ''; // Devuelve una cadena vacía si no hay niveles
        }
        if (cefrArray.length === 1) {
            return cefrArray[0]; // Devuelve el único nivel si solo hay uno
        }
        // Devuelve el primer y el último nivel unidos por un guion
        return `${cefrArray[0]}-${cefrArray[cefrArray.length - 1]}`;
    }
    console.log("DEBUG: creators-loader.js ha comenzado a ejecutarse.");

    // --- Definición de Estanterías ---
    const shelves = {
        'input comprensible': document.getElementById('shelf-comprehensible-input'),
        'podcast': document.getElementById('shelf-podcasts'),
        'vlogs y viajes': document.getElementById('shelf-vlogs-lifestyle'),
        'música': document.getElementById('shelf-music'),
        'shows y tv': document.getElementById('shelf-shows-entertainment'),
        'cine y cultura pop': document.getElementById('shelf-movies-popculture'),
        'comedia y animación': document.getElementById('shelf-comedy-animation'),
        'deportes': document.getElementById('shelf-sports'),
        'ciencia y educación': document.getElementById('shelf-science-education'),
        'gaming': document.getElementById('shelf-gaming'),
        'personalidades': document.getElementById('shelf-personalities')
    };

    console.log("DEBUG: Estanterías definidas en el objeto 'shelves':", shelves);

    // --- Definición del Modal ---
    const modal = document.getElementById('creator-modal');

    // --- Comprobaciones Iniciales ---
    if (!modal) {
        console.error("ERROR CRÍTICO: El elemento del modal (<div id='creator-modal'>) no se encontró en el HTML. El script no puede continuar.");
        return;
    }
    if (typeof creatorsData === 'undefined') {
        console.error("ERROR CRÍTICO: El archivo de datos 'creators-data.js' no se ha cargado o la variable 'creatorsData' no está definida. El script no puede continuar.");
        return;
    }
    console.log("DEBUG: Modal y datos de creadores encontrados correctamente.");

    // --- 1. CARGAR TODAS LAS ESTANTERÍAS ---
    function loadAllShelves() {
        console.log(`DEBUG: Iniciando carga de ${creatorsData.length} creadores en las estanterías...`);
        creatorsData.forEach(creator => {
            if (!creator.tags || !Array.isArray(creator.tags)) {
                console.warn(`ADVERTENCIA: El creador '${creator.name}' (ID: ${creator.id}) no tiene una propiedad 'tags' válida. Será omitido.`);
                return; // Saltar este creador si no tiene tags
            }
            creator.tags.forEach(tag => {
                if (shelves[tag]) {
                    const card = createCreatorCard(creator);
                    shelves[tag].appendChild(card);
                    // console.log(`DEBUG: Creador '${creator.name}' añadido a la estantería '${tag}'.`);
                } else {
                    console.warn(`ADVERTENCIA: La estantería para el tag '${tag}' (usado por '${creator.name}') no se encontró en el HTML.`);
                }
            });
        });
        console.log("DEBUG: Carga de estanterías completada.");
    }
    function createCreatorCard(creator) {
        const card = document.createElement('div');
        card.className = 'card creator-card';
        card.dataset.creatorId = creator.id;
    
        const simplifiedCefr = getSimplifiedCefrRange(creator.cefr);
    
        const socialIcons = `
            <div class="card-social-icons">
                ${creator.socialLinks.youtube ? '<i class="fab fa-youtube"></i>' : ''}
                ${creator.socialLinks.instagram ? '<i class="fab fa-instagram"></i>' : ''}
                ${creator.socialLinks.facebook ? '<i class="fab fa-facebook"></i>' : ''}
                ${creator.socialLinks.spotify ? '<i class="fab fa-spotify"></i>' : ''}
                ${creator.socialLinks.website ? '<i class="fas fa-globe"></i>' : ''}
            </div>
        `;
    
        // --- NUEVO: Elemento de la bandera ---
        const flagElement = creator.flagCode 
            ? `<img src="https://flagcdn.com/w40/${creator.flagCode}.png" alt="Bandera de ${creator.country}" class="card-flag">`
            : ''; // Si no hay flagCode, no se añade nada.
    
        card.innerHTML = `
            ${flagElement} 
            <div class="card-visible-area">
                <img src="${creator.profilePic}" alt="Logo de ${creator.name}" class="card-image">
                <div class="card-content">
                    <h4 class="card-title">${creator.name}</h4>
                    <span class="cefr-badge">${simplifiedCefr}</span>
                </div>
            </div>
            <div class="card-hover-details">
                <p>${creator.shortDesc}</p>
                ${socialIcons}
            </div>
            <div class="card-cta">Ver Detalles</div>
        `;
        return card;
    }
    // --- 3. MANEJAR EL MODAL ---
    function openCreatorModal(creator) {
    // --- NUEVO: Elemento de la bandera para el modal ---
    const modalFlagElement = creator.flagCode 
        ? `<img src="https://flagcdn.com/w40/${creator.flagCode}.png" alt="Bandera de ${creator.country}" class="modal-flag">`
        : '';
        
    // --- Rellenar información básica, AHORA INCLUYE LA BANDERA ---
    document.getElementById('modal-creator-img').src = creator.profilePic;
    document.getElementById('creatorModalTitle').innerHTML = `${creator.name} ${modalFlagElement}`; // Se usa innerHTML para añadir la imagen
    document.getElementById('modal-creator-long-desc').textContent = creator.longDesc;
    
        // --- Rellenar comentario de Aljohn (si existe) ---
        const aljohnsTakeContainer = document.getElementById('modal-aljohns-take-container');
        if (creator.aljohnsComment && creator.aljohnsComment.trim() !== '') {
            document.getElementById('modal-creator-aljohns-comment').textContent = creator.aljohnsComment;
            aljohnsTakeContainer.style.display = 'block';
            console.log("DEBUG: Comentario de Aljohn encontrado y mostrado.");
        } else {
            aljohnsTakeContainer.style.display = 'none';
            console.log("DEBUG: No hay comentario de Aljohn para este creador.");
        }
        
        // --- Rellenar vídeo embebido (si existe) ---
        const videoEmbedArea = document.getElementById('modal-video-embed-area');
        if (creator.embeddedId) {
            videoEmbedArea.innerHTML = `
                <div class="video-embed-container">
                    <iframe src="https://www.youtube.com/embed/${creator.embeddedId}" title="${creator.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>`;
            videoEmbedArea.style.display = 'block';
            console.log("DEBUG: Vídeo embebido encontrado y mostrado.");
        } else {
            videoEmbedArea.style.display = 'none';
            console.log("DEBUG: No hay vídeo embebido para este creador.");
        }

        // --- Rellenar puntos CEFR ---
        const cefrContainer = document.getElementById('modal-cefr-dots-container');
        const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        cefrContainer.innerHTML = cefrLevels.map(level => {
            const status = creator.cefr.includes(level) ? 'present' : 'not-present';
            return `<span class="cefr-level-dot level-${level.toLowerCase()} ${status}" title="${level}">${level}</span>`;
        }).join('');
        
        // --- Rellenar enlaces externos ---
        const linksContainer = document.getElementById('modal-creator-links');
        linksContainer.innerHTML = Object.entries(creator.socialLinks).map(([platform, url]) => {
            const iconClass = platform === 'website' ? 'fas fa-globe' : `fab fa-${platform}`;
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-outline"><i class="${iconClass}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}</a>`;
        }).join('');
        
        // --- Mostrar modal ---
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        console.log("DEBUG: Modal mostrado.");
    }
    
    function closeCreatorModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        console.log("DEBUG: Modal cerrado.");
    }

    // --- 4. EVENT LISTENERS ---
    console.log("DEBUG: Añadiendo Event Listeners...");
    const shelvesSection = document.getElementById('content-shelves');
    if (shelvesSection) {
        shelvesSection.addEventListener('click', (event) => {
            console.log("DEBUG: Clic detectado dentro de la sección de estanterías.");
            const card = event.target.closest('.creator-card');
            if (card) {
                console.log("DEBUG: El clic fue en una tarjeta de creador.");
                const creatorId = card.dataset.creatorId;
                console.log(`DEBUG: ID del creador extraído: ${creatorId}`);
                const selectedCreator = creatorsData.find(c => c.id === creatorId);
                if (selectedCreator) {
                    console.log(`DEBUG: Creador '${selectedCreator.name}' encontrado en los datos.`);
                    openCreatorModal(selectedCreator);
                } else {
                    console.error(`ERROR: No se encontró ningún creador con el ID '${creatorId}' en creatorsData.`);
                }
            } else {
                console.log("DEBUG: El clic no fue en una tarjeta de creador.");
            }
        });
    } else {
        console.error("ERROR: No se encontró la sección principal de estanterías (<section id='content-shelves'>). Los clics no funcionarán.");
    }

    const closeModalBtn = document.querySelector('#creator-modal .modal-close-btn');
    const modalOverlay = document.getElementById('creator-modal-overlay');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCreatorModal);
        console.log("DEBUG: Event Listener para el botón de cerrar añadido.");
    } else {
        console.error("ERROR: No se encontró el botón de cerrar del modal.");
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeCreatorModal);
        console.log("DEBUG: Event Listener para el overlay del modal añadido.");
    } else {
        console.error("ERROR: No se encontró el overlay del modal.");
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            console.log("DEBUG: Tecla 'Escape' presionada, cerrando modal.");
            closeCreatorModal();
        }
    });
    console.log("DEBUG: Event Listeners añadidos correctamente.");


    // --- 5. INICIALIZACIÓN ---
    loadAllShelves();
});
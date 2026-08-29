function renderFrenchStudyKit() {
    const container = document.getElementById('french-study-kit-fr');
    const resources = window.frenchStudyKitData?.resources;

    if (!container) return;

    const escapeHtml = value =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    if (!Array.isArray(resources) || resources.length === 0) {
        container.innerHTML = '<p class="study-kit-empty-fr">Le kit d’étude n’est pas disponible pour le moment. Recharge la page ou ouvre les liens source indiqués plus bas.</p>';
        return;
    }

    container.innerHTML = `
        <article class="study-kit-folio-fr" aria-label="Parcours avec les ressources d’étude fournies">
            <div class="study-kit-intro-fr">
                <i class="fa-solid fa-compass-drafting" aria-hidden="true"></i>
                <div>
                    <h3>Un seul atelier, quatre gestes</h3>
                    <p>Les documents restent chez Google : cette page sert de table de travail pour retrouver rapidement le bon point d’entrée.</p>
                </div>
            </div>
            <ol class="study-kit-route-fr">
                ${resources
                    .map(
                        resource => `
                            <li>
                                <a class="study-kit-link-fr" href="${escapeHtml(resource.href)}" target="_blank" rel="noopener noreferrer">
                                    <span class="study-kit-step-fr" aria-hidden="true">${escapeHtml(resource.step)}</span>
                                    <span class="study-kit-icon-fr" aria-hidden="true"><i class="${escapeHtml(resource.icon)}"></i></span>
                                    <span class="study-kit-copy-fr">
                                        <span class="study-kit-action-fr">${escapeHtml(resource.action)} · ${escapeHtml(resource.service)}</span>
                                        <strong>${escapeHtml(resource.name)}</strong>
                                        <span>${escapeHtml(resource.description)}</span>
                                    </span>
                                    <span class="study-kit-cta-fr">${escapeHtml(resource.linkLabel)} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
                                </a>
                            </li>
                        `,
                    )
                    .join('')}
            </ol>
        </article>
    `;
}

window.renderFrenchStudyKit = renderFrenchStudyKit;

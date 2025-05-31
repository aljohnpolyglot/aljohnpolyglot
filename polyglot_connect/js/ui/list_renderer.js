// js/ui/list_renderer.js
window.listRenderer = (() => {
    const getDeps = () => ({
        domElements: window.domElements,
        polyglotHelpers: window.polyglotHelpers,
        activityManager: window.activityManager,
        flagLoader: window.flagLoader,
        shellController: window.shellController
    });

    function createListItemHTML(itemData, type) {
        const { polyglotHelpers, activityManager, flagLoader } = getDeps();
        if (!itemData || !polyglotHelpers || !activityManager || !flagLoader) {
            console.warn(`createListItemHTML: Missing itemData or dependencies for type '${type}'.`);
            return '<div class="list-item-base error-item">Error rendering item</div>';
        }

        const connector = type === 'group' ? null : (itemData.connector || itemData);
        const name = type === 'group' ? (itemData.name || "Unnamed Group") : (connector?.profileName || connector?.name || "Unknown Contact");
        const avatar = type === 'group' ? null : (connector?.avatarModern || 'images/placeholder_avatar.png');

        let flagImageHtml = '';
        let langForFlag = type === 'group' ? itemData.language : null;
        if (!langForFlag && connector) {
            langForFlag = connector.language; // Primary language of the connector
        }

        if (langForFlag) {
            let flagCodeToUse = connector?.flagCode; // Use the top-level processed flagCode

            if (!flagCodeToUse) { // Fallback if top-level wasn't set or item is a group without direct connector
                 const langDef = (window.polyglotFilterLanguages || []).find(l => l.name === langForFlag || l.value === langForFlag);
                 if (langDef && langDef.flagCode) flagCodeToUse = langDef.flagCode;
            }
            if (!flagCodeToUse && langForFlag.length >= 2) {
                flagCodeToUse = langForFlag.substring(0,2).toLowerCase();
            }
             if (!flagCodeToUse) flagCodeToUse = 'xx';


            if (flagCodeToUse && flagCodeToUse !== 'xx') {
                const flagUrl = flagLoader.getFlagUrl(flagCodeToUse);
                flagImageHtml = `<img src="${flagUrl}" alt="${polyglotHelpers.sanitizeTextForDisplay(langForFlag)} flag" class="lang-flag lang-flag-sm" onerror="this.src='${flagLoader.getFlagUrl('')}'">`;
            }
        }


        let subText = '';
        if (type === 'chat') {
            const lastMsg = itemData.messages?.[itemData.messages.length - 1];
            if (lastMsg) {
                let textPreview = lastMsg.text || (lastMsg.type === 'image' ? '[Image Sent]' : '[Interaction]');
                if (lastMsg.sender?.startsWith('user')) textPreview = `You: ${textPreview}`;
                subText = textPreview.length > 30 ? `${textPreview.substring(0, 27)}...` : textPreview;
            } else subText = 'No messages yet';
        } else if (type === 'summary') {
            subText = `Session on ${itemData.date || 'Unknown Date'}`;
            if (itemData.duration) subText += ` (${itemData.duration})`;
        } else if (type === 'group') {
            subText = `${itemData.language || 'N/A'} - ${itemData.description ? itemData.description.substring(0,30)+'...' : 'Join the discussion!'}`;
        }

        let statusDotHtml = '';
        if (type === 'chat' && connector) {
            const isActive = activityManager.isConnectorActive(connector);
            statusDotHtml = `<span class="chat-list-item-status ${isActive ? 'active' : ''}" title="${isActive ? 'Active' : 'Inactive'}"></span>`;
        }

        let itemClass = 'list-item-base';
        let dataIdAttr = '';
        if (type === 'chat' && connector?.id) { itemClass = 'chat-list-item'; dataIdAttr = `data-connector-id="${polyglotHelpers.sanitizeTextForDisplay(connector.id)}"`; }
        else if (type === 'summary' && itemData?.sessionId) { itemClass = 'summary-list-item'; dataIdAttr = `data-session-id="${polyglotHelpers.sanitizeTextForDisplay(itemData.sessionId)}"`; }
        else if (type === 'group' && itemData?.id) { itemClass = 'group-list-item'; dataIdAttr = `data-group-id="${polyglotHelpers.sanitizeTextForDisplay(itemData.id)}"`; }

        return `
            <div class="${itemClass}" ${dataIdAttr}>
                ${(type !== 'group' && avatar) ? `<img src="${polyglotHelpers.sanitizeTextForDisplay(avatar)}" alt="${polyglotHelpers.sanitizeTextForDisplay(name)}" class="list-item-avatar" onerror="this.src='images/placeholder_avatar.png'">` : (type === 'group' ? flagImageHtml : '')}
                <div class="list-item-info">
                    <span class="list-item-name">${polyglotHelpers.sanitizeTextForDisplay(name)}</span>
                    ${subText ? `<span class="list-item-subtext">${polyglotHelpers.sanitizeTextForDisplay(subText)}</span>` : ''}
                </div>
                ${statusDotHtml}
                ${type === 'group' ? `<span class="list-item-action-indicator"><i class="fas fa-chevron-right"></i></span>` : ''}
            </div>`;
    }

    function itemClassFromType(type) {
        if (type === 'chat') return 'chat-list-item';
        if (type === 'summary') return 'summary-list-item';
        if (type === 'group') return 'group-list-item';
        return 'list-item-base';
    }

    function renderList(ulElement, emptyMsgElement, items, itemType, itemClickHandler) {
        const { shellController } = getDeps();
        if (!ulElement) {
            console.warn(`ListRenderer: renderList - UL element not found for type: ${itemType}`);
            return;
        }
        ulElement.innerHTML = '';
        if (!items?.length) {
            if (emptyMsgElement) emptyMsgElement.style.display = 'block';
            if (shellController?.updateEmptyListMessages) shellController.updateEmptyListMessages();
            return;
        }
        if (emptyMsgElement) emptyMsgElement.style.display = 'none';

        const fragment = document.createDocumentFragment();
        items.forEach(item => {
            if (!item) {
                console.warn("ListRenderer: renderList - Skipping null/undefined item in items array for type:", itemType);
                return;
            }
            const li = document.createElement('li');
            const itemHTML = createListItemHTML(item, itemType);
            if (itemHTML.includes('error-item')) {
                console.warn("ListRenderer: renderList - Error rendering list item HTML for item:", item, "Type:", itemType);
                return;
            }
            li.innerHTML = itemHTML;
            const clickableDiv = li.querySelector(`.${itemClassFromType(itemType)}`); // Uses the helper
            if (clickableDiv && itemClickHandler) {
                clickableDiv.addEventListener('click', () => {
                    const clickParam = (itemType === 'chat' && item.connector) ? item.connector : item;
                    console.log("%cListRenderer: Clicked Item", "color: purple; font-weight: bold;", "itemType:", itemType, "Raw item data:", JSON.parse(JSON.stringify(item)), "Resolved clickParam:", JSON.parse(JSON.stringify(clickParam)));
                    itemClickHandler(clickParam);
                });
            } else if (!clickableDiv) {
                console.warn("ListRenderer: renderList - Could not find clickable div with class", itemClassFromType(itemType), "for item:", item);
            }
            fragment.appendChild(li);
        });
        ulElement.appendChild(fragment);
        if (shellController?.updateEmptyListMessages) shellController.updateEmptyListMessages();
    }
    // console.log("ui/list_renderer.js loaded."); // From your paste
    return {
        renderActiveChatList: (conversationsObject, onChatClick) => {
            const { domElements } = getDeps();
            const conversationsArray = Object.values(conversationsObject || {})
                .filter(convo => convo?.connector && convo.messages?.length > 0)
                .sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
            renderList(domElements?.chatListUl, domElements?.emptyChatListMsg, conversationsArray, 'chat', onChatClick);
        },
        renderSummaryList: (sessionsArray, onSummaryClick) => {
            const { domElements } = getDeps();
            const sortedSessions = [...(sessionsArray || [])].sort((a, b) => {
                const timeA = a.rawTranscript?.[0] ? new Date(a.rawTranscript[0].timestamp).getTime() : 0;
                const timeB = b.rawTranscript?.[0] ? new Date(b.rawTranscript[0].timestamp).getTime() : 0;
                const dateA = new Date(a.date || "1970-01-01").setHours(0,0,0,0) + timeA;
                const dateB = new Date(b.date || "1970-01-01").setHours(0,0,0,0) + timeB;
                return dateB - dateA;
            });
            renderList(domElements?.summaryListUl, domElements?.emptySummaryListMsg, sortedSessions, 'summary', onSummaryClick);
        },
        renderAvailableGroupsList: (groupsArray, onGroupClick) => {
            const { domElements } = getDeps();
            const sortedGroups = [...(groupsArray || [])].sort((a,b) => (a.name || "").localeCompare(b.name || ""));
            renderList(domElements?.availableGroupsUl, domElements?.groupLoadingMessage, sortedGroups, 'group', onGroupClick);
        }
    };
})();
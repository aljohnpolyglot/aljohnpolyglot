(async () => {
  /*
   * YouTube Liked Videos console collector.
   *
   * Paste this once on the already-authenticated YouTube Liked Videos page.
   * It reads the active account, scans rendered rows while scrolling, and
   * downloads one account-aware JSON/CSV pair when the playlist completes.
   *
   * Public API:
   *   YTLIKES.status()
   *   YTLIKES.account()
   *   YTLIKES.results()
   *   YTLIKES.download()
   *   YTLIKES.stop()
   *   YTLIKES.scan()
   */

  const previousCollector = window.YTLIKES;

  try {
    if (previousCollector && typeof previousCollector.stop === "function") {
      previousCollector.stop({ reason: "replaced" });
      console.log("Previous collector stopped; replacement starting");
    } else {
      console.log("No previous collector found; replacement starting");
    }
  } catch (error) {
    console.warn("Previous collector could not be stopped cleanly; replacement starting", error);
  }

  document.getElementById("__yt_likes_collector")?.remove();

  const CONFIG = Object.freeze({
    SCROLL_STEP_VIEWPORTS: 0.68,
    NORMAL_WAIT_MS: 850,
    BOTTOM_WAIT_MS: 1600,
    BOTTOM_STABLE_ROUNDS: 8,
    MAX_ROUNDS: 10000,
    AUTO_DOWNLOAD: true,
    ACCOUNT_MENU_WAIT_MS: 700,
    ACCOUNT_SUBMENU_WAIT_MS: 600,
    ROW_WAIT_MS: 10000
  });

  const ACCOUNT_BY_EMAIL = Object.freeze({
    "importantpudding@gmail.com": { email: "importantpudding@gmail.com", language: "indonesian" },
    "holasoyaljohn@gmail.com": { email: "holasoyaljohn@gmail.com", language: "spanish" },
    "monsiuerjeanlelait@gmail.com": { email: "monsiuerjeanlelait@gmail.com", language: "french" },
    "lemakicatta@gmail.com": { email: "lemakicatta@gmail.com", language: "brasil" },
    "paintingprety3489@gmail.com": { email: "paintingprety3489@gmail.com", language: "russian" },
    "pitanbatman@gmail.com": { email: "pitanbatman@gmail.com", language: "italian" },
    "mondwanderer6@gmail.com": { email: "mondwanderer6@gmail.com", language: "german" },
    "magnusmjolkson@gmail.com": { email: "magnusmjolkson@gmail.com", language: "swedish" }
  });

  /*
   * These are intentionally exact, verified display fallbacks. A loose
   * substring match is never accepted. The explicit override below remains
   * available for layouts that expose neither email nor a matching handle.
   */
  const VERIFIED_DISPLAY_FALLBACKS = Object.freeze({
    importantpudding: ACCOUNT_BY_EMAIL["importantpudding@gmail.com"],
    holasoyaljohn: ACCOUNT_BY_EMAIL["holasoyaljohn@gmail.com"],
    monsiuerjeanlelait: ACCOUNT_BY_EMAIL["monsiuerjeanlelait@gmail.com"],
    lemakicatta: ACCOUNT_BY_EMAIL["lemakicatta@gmail.com"],
    paintingprety3489: ACCOUNT_BY_EMAIL["paintingprety3489@gmail.com"],
    pitanbatman: ACCOUNT_BY_EMAIL["pitanbatman@gmail.com"],
    mondwanderer6: ACCOUNT_BY_EMAIL["mondwanderer6@gmail.com"],
    magnusmjolkson: ACCOUNT_BY_EMAIL["magnusmjolkson@gmail.com"]
  });

  const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

  const clean = value => String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const visible = element => Boolean(element && element.getClientRects?.().length);

  const safeText = (element, limit = 300) => clean(element?.textContent).slice(0, limit);

  const textLines = element => String(element?.textContent ?? "")
    .replace(/\u00a0/g, " ")
    .split(/\n|•/)
    .map(clean)
    .filter(Boolean);

  const unique = values => [...new Set(values.filter(Boolean))];

  const state = {
    running: true,
    stopped: false,
    complete: false,
    phase: "starting",
    message: "Starting collector…",
    startedAt: new Date().toISOString(),
    startedAtBottom: false,
    rounds: 0,
    stableBottomRounds: 0,
    endReason: null,
    declaredPlaylistCount: null,
    initialScanCount: 0,
    firstScrollScanCount: 0,
    firstScrollAdded: 0,
    parseErrors: 0,
    relevantMutations: 0,
    autoDownloaded: false,
    account: {
      email: null,
      displayName: null,
      channelName: null,
      channelHandle: null,
      language: "unknown",
      detectedBy: "not-yet-detected",
      confidence: "unknown",
      identitySignals: []
    }
  };

  const videos = new Map();
  let firstSeenCounter = 0;
  let mutationVersion = 0;
  let mutationObserver = null;

  /* ============================================================
     ACCOUNT DETECTION
     ============================================================ */

  const EMAIL_RE = /[A-Z0-9._%+-]+@gmail\.com/i;
  const ACCOUNT_LABEL_RE = /account|profile|avatar|google/i;
  const IDENTITY_LABEL_RE = /account|profile|channel|user|owner|email|handle|name/i;
  const NON_NAME_TEXT = /^(manage your google account|switch account|sign in|sign out|create a channel|youtube|google account)$/i;

  function normalizeEmail(value) {
    const match = clean(value).match(EMAIL_RE);
    return match ? match[0].toLowerCase() : null;
  }

  function normalizeIdentityKey(value) {
    return clean(value)
      .toLowerCase()
      .replace(/^@/, "")
      .replace(/[^a-z0-9._-]/g, "");
  }

  function extractHandle(value) {
    const text = clean(value);
    const match = text.match(/(^|\s)(@[A-Za-z0-9._-]{2,})\b/);
    return match ? match[2] : null;
  }

  function handleFromHref(value) {
    const href = clean(value);
    const match = href.match(/(?:youtube\.com)?\/@([A-Za-z0-9._-]+)/i);
    return match ? `@${match[1]}` : null;
  }

  function addIdentitySignal(evidence, source, value) {
    const text = clean(value).slice(0, 300);
    if (!text || NON_NAME_TEXT.test(text)) return;

    const key = `${source}\u0000${text}`;
    if (evidence.signalKeys.has(key)) return;
    evidence.signalKeys.add(key);

    if (evidence.signals.length < 120) {
      evidence.signals.push({ source, value: text });
    }
  }

  function addEmailCandidate(evidence, value, source, priority, active = false) {
    const email = normalizeEmail(value);
    if (!email) return;

    addIdentitySignal(evidence, source, email);
    evidence.emails.push({ email, source, priority, active });
  }

  function addDisplayCandidate(evidence, value, source, priority) {
    const text = clean(value);
    if (!text || EMAIL_RE.test(text) || NON_NAME_TEXT.test(text) || text.length > 160) return;

    addIdentitySignal(evidence, source, text);
    evidence.displayNames.push({ value: text, source, priority });
  }

  function addChannelCandidate(evidence, value, source, priority) {
    const text = clean(value);
    if (!text || EMAIL_RE.test(text) || text.length > 160) return;

    const handle = extractHandle(text) || handleFromHref(text);
    if (handle) {
      addIdentitySignal(evidence, source, handle);
      evidence.channelHandles.push({ value: handle, source, priority });
      return;
    }

    if (!NON_NAME_TEXT.test(text)) {
      addIdentitySignal(evidence, source, text);
      evidence.channelNames.push({ value: text, source, priority });
    }
  }

  function inspectStateValue(value, path, evidence, depth = 0, visited = new WeakSet()) {
    if (depth > 5 || evidence.nodesVisited >= 6000 || value == null) return;

    if (typeof value === "string") {
      const emails = value.match(new RegExp(EMAIL_RE.source, "ig")) || [];
      const lowerPath = path.toLowerCase();

      for (const email of emails) {
        addEmailCandidate(evidence, email, `youtube-state:${path}`, lowerPath.includes("email") ? 95 : 80);
      }

      if (IDENTITY_LABEL_RE.test(lowerPath)) {
        if (lowerPath.includes("handle") || lowerPath.includes("channel")) {
          addChannelCandidate(evidence, value, `youtube-state:${path}`, 65);
        } else if (!emails.length) {
          addDisplayCandidate(evidence, value, `youtube-state:${path}`, 55);
        }
      }
      return;
    }

    if (typeof value !== "object") return;
    if (visited.has(value)) return;
    visited.add(value);
    evidence.nodesVisited++;

    let entries;
    try {
      entries = Object.entries(value).slice(0, 300);
    } catch {
      return;
    }

    for (const [key, child] of entries) {
      inspectStateValue(child, `${path}.${key}`, evidence, depth + 1, visited);
    }
  }

  function inspectAvailableYouTubeState(evidence) {
    const roots = [
      ["ytcfg.data_", window.ytcfg?.data_],
      ["yt.config_", window.yt?.config_],
      ["ytInitialData", window.ytInitialData]
    ];

    for (const [name, value] of roots) {
      try {
        inspectStateValue(value, name, evidence);
      } catch (error) {
        addIdentitySignal(evidence, `${name}:read-error`, error?.message || "unreadable");
      }
    }

    if (window.ytcfg && typeof window.ytcfg.get === "function") {
      for (const key of ["USER_EMAIL", "ACCOUNT_EMAIL", "EMAIL", "LOGGED_IN_USER_EMAIL"]) {
        try {
          const value = window.ytcfg.get(key);
          if (value) addEmailCandidate(evidence, value, `ytcfg.get:${key}`, 95);
        } catch {
          // YouTube may omit individual configuration keys.
        }
      }
    }

    const directNodes = document.querySelectorAll(
      "[data-email], [data-identifier], [data-account-email], [aria-label*='@'], [title*='@']"
    );

    for (const node of directNodes) {
      if (!visible(node) && !node.matches("[data-email], [data-identifier], [data-account-email]")) continue;
      for (const attribute of ["data-email", "data-identifier", "data-account-email", "aria-label", "title"]) {
        addEmailCandidate(evidence, node.getAttribute(attribute), `youtube-dom:${attribute}`, 75);
      }
    }
  }

  function getAvatarButton() {
    const explicit = [
      "button#avatar-btn",
      "#avatar-btn",
      "ytd-topbar-menu-button-renderer #avatar-btn",
      "ytd-topbar-menu-button-renderer button"
    ];

    for (const selector of explicit) {
      const element = document.querySelector(selector);
      if (visible(element)) return element;
    }

    const candidates = [...document.querySelectorAll("button, [role='button'], yt-icon-button")];
    return candidates.find(element => {
      const label = clean(element.getAttribute("aria-label") || element.getAttribute("title"));
      return visible(element) && ACCOUNT_LABEL_RE.test(label);
    }) || null;
  }

  function getAccountMenu() {
    const selectors = [
      "ytd-multi-page-menu-renderer",
      "tp-yt-iron-dropdown",
      "ytd-popup-container",
      "[role='menu']",
      "ytd-active-account-header-renderer"
    ];

    const candidates = [];
    for (const selector of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        if (!visible(element)) continue;
        const text = `${safeText(element, 900)} ${element.getAttribute("aria-label") || ""}`;
        if (/account|switch|sign out|manage your google|gmail\.com/i.test(text)) candidates.push(element);
      }
    }

    candidates.sort((a, b) => safeText(b, 2000).length - safeText(a, 2000).length);
    return candidates[0] || null;
  }

  function collectElementIdentity(evidence, element, source, priority, active = false, includeText = false) {
    if (!element) return;

    for (const attribute of [
      "aria-label",
      "title",
      "data-email",
      "data-identifier",
      "data-account-email",
      "data-username",
      "data-channel-name",
      "href"
    ]) {
      const value = element.getAttribute?.(attribute);
      if (!value) continue;
      addEmailCandidate(evidence, value, `${source}:${attribute}`, priority + (active ? 20 : 0), active);

      const handle = handleFromHref(value) || extractHandle(value);
      if (handle) {
        addChannelCandidate(evidence, handle, `${source}:${attribute}`, priority + (active ? 20 : 0));
      } else if (attribute !== "href" && !EMAIL_RE.test(value)) {
        addDisplayCandidate(evidence, value, `${source}:${attribute}`, priority + (active ? 20 : 0));
      }
    }

    const handle = extractHandle(safeText(element, 400));
    if (handle) addChannelCandidate(evidence, handle, `${source}:text-handle`, priority + (active ? 20 : 0));

    if (includeText) {
      for (const line of textLines(element).slice(0, 24)) {
        if (line && !EMAIL_RE.test(line) && !NON_NAME_TEXT.test(line)) {
          addDisplayCandidate(evidence, line, `${source}:text`, priority + (active ? 20 : 0));
        }
      }
    }

    for (const anchor of element.querySelectorAll?.("a[href*='/@']") || []) {
      addChannelCandidate(evidence, anchor.getAttribute("href"), `${source}:channel-link`, priority + (active ? 20 : 0));
      addDisplayCandidate(evidence, safeText(anchor), `${source}:channel-link-text`, priority + (active ? 20 : 0));
    }
  }

  function collectAccountMenuIdentity(evidence, menu, activeOnly = false) {
    if (!menu) return;

    const activeSelectors = [
      "ytd-active-account-header-renderer",
      "[aria-current='true']",
      "[aria-selected='true']",
      "[selected]",
      "[data-active='true']",
      "[data-is-active='true']"
    ];

    const activeNodes = unique(activeSelectors.flatMap(selector => [...menu.querySelectorAll(selector)]));
    for (const element of activeNodes) {
      collectElementIdentity(evidence, element, "youtube-account-menu-active", 110, true, true);
    }

    for (const selector of [
      "#account-name",
      "#account-email",
      "[id*='account-name']",
      "[id*='account-email']",
      "ytd-active-account-header-renderer"
    ]) {
      for (const element of menu.querySelectorAll(selector)) {
        collectElementIdentity(evidence, element, "youtube-account-menu-field", 105, true, true);
      }
    }

    if (activeOnly) return;

    collectElementIdentity(evidence, menu, "youtube-account-menu", 25, false, true);

    for (const element of menu.querySelectorAll("ytd-account-item-renderer, [role='menuitem'], a, button")) {
      const isActive = element.matches("[aria-current='true'], [aria-selected='true'], [selected], [data-active='true']");
      collectElementIdentity(evidence, element, "youtube-account-menu-item", isActive ? 100 : 10, isActive, isActive);
    }
  }

  function bestEmailCandidate(evidence) {
    const grouped = new Map();
    for (const candidate of evidence.emails) {
      const existing = grouped.get(candidate.email);
      if (!existing || candidate.priority > existing.priority || (candidate.active && !existing.active)) {
        grouped.set(candidate.email, candidate);
      }
    }

    const candidates = [...grouped.values()].sort((a, b) => b.priority - a.priority);
    if (!candidates.length) return null;

    const topPriority = candidates[0].priority;
    const top = candidates.filter(candidate => candidate.priority === topPriority);
    if (top.length > 1 && new Set(top.map(candidate => candidate.email)).size > 1) return null;
    return candidates[0];
  }

  function bestCandidate(candidates) {
    const grouped = new Map();
    for (const candidate of candidates) {
      const key = normalizeIdentityKey(candidate.value);
      if (!key) continue;
      const existing = grouped.get(key);
      if (!existing || candidate.priority > existing.priority) grouped.set(key, candidate);
    }
    return [...grouped.values()].sort((a, b) => b.priority - a.priority)[0] || null;
  }

  function displayFallback(evidence) {
    const possible = [
      ...evidence.channelHandles.map(candidate => candidate.value),
      ...evidence.channelNames.map(candidate => candidate.value),
      ...evidence.displayNames.map(candidate => candidate.value)
    ];

    for (const value of possible) {
      const match = VERIFIED_DISPLAY_FALLBACKS[normalizeIdentityKey(value)];
      if (match) return { ...match, matchedValue: value };
    }
    return null;
  }

  function explicitOverride() {
    const override = window.YTLIKES_ACCOUNT_OVERRIDE;
    if (!override || typeof override !== "object") return null;

    const email = normalizeEmail(override.email);
    const mapped = email ? ACCOUNT_BY_EMAIL[email] : null;
    if (!mapped || mapped.language !== clean(override.language).toLowerCase()) return null;
    return mapped;
  }

  function chooseCandidate(candidates) {
    return bestCandidate(candidates)?.value || null;
  }

  function makeAccount(evidence) {
    const emailCandidate = bestEmailCandidate(evidence);
    const email = emailCandidate?.email || null;
    const mappedEmail = email ? ACCOUNT_BY_EMAIL[email] : null;
    const fallback = displayFallback(evidence);
    const override = explicitOverride();

    const displayName = chooseCandidate(evidence.displayNames);
    const channelHandle = chooseCandidate(evidence.channelHandles);
    const channelName = chooseCandidate(evidence.channelNames);

    if (mappedEmail) {
      return {
        email: mappedEmail.email,
        displayName,
        channelName,
        channelHandle,
        language: mappedEmail.language,
        detectedBy: emailCandidate.source.includes("account-menu") ? "youtube-account-menu" : "youtube-state",
        confidence: "exact_email",
        identitySignals: evidence.signals
      };
    }

    if (email) {
      return {
        email,
        displayName,
        channelName,
        channelHandle,
        language: "unknown",
        detectedBy: emailCandidate.source.includes("account-menu") ? "youtube-account-menu" : "youtube-state",
        confidence: "exact_email_unmapped",
        identitySignals: evidence.signals
      };
    }

    if (fallback) {
      addIdentitySignal(evidence, "verified-display-fallback", fallback.matchedValue);
      return {
        email: fallback.email,
        displayName,
        channelName,
        channelHandle,
        language: fallback.language,
        detectedBy: "youtube-account-display-fallback",
        confidence: "verified_display_fallback",
        identitySignals: evidence.signals
      };
    }

    if (override) {
      addIdentitySignal(evidence, "explicit-account-override", override.email);
      return {
        email: override.email,
        displayName,
        channelName,
        channelHandle,
        language: override.language,
        detectedBy: "explicit-account-override",
        confidence: "explicit_override",
        identitySignals: evidence.signals
      };
    }

    return {
      email: null,
      displayName,
      channelName,
      channelHandle,
      language: "unknown",
      detectedBy: "youtube-identity-unresolved",
      confidence: "unknown",
      identitySignals: evidence.signals
    };
  }

  async function detectAccount() {
    const evidence = {
      emails: [],
      displayNames: [],
      channelNames: [],
      channelHandles: [],
      signals: [],
      signalKeys: new Set(),
      nodesVisited: 0
    };

    inspectAvailableYouTubeState(evidence);

    let menu = getAccountMenu();
    let openedByCollector = false;

    if (!menu) {
      const avatar = getAvatarButton();
      if (avatar) {
        try {
          collectElementIdentity(evidence, avatar, "youtube-avatar", 90, true, false);
          avatar.click();
          openedByCollector = true;
          await sleep(CONFIG.ACCOUNT_MENU_WAIT_MS);
          menu = getAccountMenu();
        } catch (error) {
          addIdentitySignal(evidence, "youtube-avatar:click-error", error?.message || "click failed");
        }
      }
    }

    if (menu) {
      collectAccountMenuIdentity(evidence, menu);
    }

    const currentEmail = bestEmailCandidate(evidence);
    const currentMapped = currentEmail && ACCOUNT_BY_EMAIL[currentEmail.email];
    const currentFallback = displayFallback(evidence);

    if (menu && !currentMapped && !currentFallback) {
      const switchControl = [...menu.querySelectorAll("a, button, [role='menuitem'], tp-yt-paper-item, ytd-compact-link-renderer")]
        .find(element => /switch account/i.test(`${safeText(element, 160)} ${element.getAttribute("aria-label") || ""}`));

      if (switchControl) {
        try {
          addIdentitySignal(evidence, "youtube-account-menu", "Reading Switch account view without selecting an account");
          switchControl.click();
          await sleep(CONFIG.ACCOUNT_SUBMENU_WAIT_MS);
          const switchMenu = getAccountMenu();
          collectAccountMenuIdentity(evidence, switchMenu, true);
        } catch (error) {
          addIdentitySignal(evidence, "youtube-switch-account:read-error", error?.message || "unreadable");
        }
      }
    }

    if (menu || openedByCollector) {
      try {
        document.dispatchEvent(new KeyboardEvent("keydown", {
          key: "Escape",
          code: "Escape",
          keyCode: 27,
          which: 27,
          bubbles: true,
          cancelable: true
        }));
        await sleep(180);
      } catch {
        // Closing the menu is best effort; collection can continue safely.
      }
    }

    return makeAccount(evidence);
  }

  /* ============================================================
     SAFE OVERLAY UI
     ============================================================ */

  const overlay = document.createElement("div");
  overlay.id = "__yt_likes_collector";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "16px",
    right: "16px",
    zIndex: "2147483647",
    background: "rgba(0,0,0,.92)",
    color: "#fff",
    padding: "14px 17px",
    borderRadius: "12px",
    minWidth: "250px",
    maxWidth: "min(360px, calc(100vw - 32px))",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    lineHeight: "1.45",
    pointerEvents: "none",
    boxShadow: "0 5px 24px rgba(0,0,0,.4)"
  });

  (document.body || document.documentElement).appendChild(overlay);

  function textElement(tag, text, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function overlayLine(label, value) {
    const line = document.createElement("div");
    const labelElement = textElement("span", `${label}: `, "yt-likes-label");
    labelElement.style.opacity = "0.72";
    line.append(labelElement, textElement("span", value));
    return line;
  }

  function accountLabel() {
    return state.account.email || state.account.channelHandle || state.account.channelName || "Unknown account";
  }

  function updateOverlay(message = state.message) {
    const metrics = getScrollMetrics();
    const language = String(state.account.language || "unknown").toUpperCase();
    const fragment = document.createDocumentFragment();

    const heading = textElement("div", language, "yt-likes-language");
    heading.style.fontSize = "19px";
    heading.style.fontWeight = "700";
    heading.style.letterSpacing = "0.06em";
    fragment.append(heading);
    fragment.append(overlayLine("Account", accountLabel()));
    fragment.append(overlayLine("Liked videos", String(videos.size)));
    fragment.append(overlayLine("Playlist total", state.declaredPlaylistCount == null ? "unknown" : String(state.declaredPlaylistCount)));
    fragment.append(overlayLine("Scroll", `${metrics.percent}%`));
    fragment.append(overlayLine("End check", `${state.stableBottomRounds}/${CONFIG.BOTTOM_STABLE_ROUNDS}`));
    fragment.append(overlayLine("State", message));

    if (state.account.language === "unknown") {
      const warning = textElement("div", "Account not confidently matched; output will use an unknown-account filename.");
      warning.style.marginTop = "8px";
      warning.style.color = "#ffd166";
      fragment.append(warning);
    }

    overlay.replaceChildren(fragment);
    overlay.style.background = state.complete
      ? "rgba(0,100,35,.94)"
      : state.stopped
        ? "rgba(100,35,0,.94)"
        : state.account.language === "unknown"
          ? "rgba(80,55,0,.95)"
          : "rgba(0,0,0,.92)";
  }

  /* ============================================================
     VIDEO PARSING
     ============================================================ */

  function getVideoId(href) {
    if (!href) return null;
    try {
      const url = new URL(href, location.origin);
      if (url.pathname === "/watch") return url.searchParams.get("v") || null;
      const pathMatch = url.pathname.match(/^\/(?:shorts|live)\/([A-Za-z0-9_-]{6,})/);
      if (pathMatch) return pathMatch[1];
      if (/(^|\.)youtu\.be$/i.test(url.hostname)) return url.pathname.split("/").filter(Boolean)[0] || null;
    } catch {
      // A malformed row is ignored by parseRow and cannot stop collection.
    }
    return null;
  }

  function parseCompactNumber(raw) {
    if (!raw) return null;
    let value = clean(raw).replace(/\s/g, "");
    let multiplier = 1;
    const suffix = value.slice(-1).toUpperCase();

    if (suffix === "K") {
      multiplier = 1e3;
      value = value.slice(0, -1);
    } else if (suffix === "M") {
      multiplier = 1e6;
      value = value.slice(0, -1);
    } else if (suffix === "B") {
      multiplier = 1e9;
      value = value.slice(0, -1);
    }

    const comma = value.lastIndexOf(",");
    const dot = value.lastIndexOf(".");
    if (comma !== -1 && dot !== -1) {
      value = comma > dot
        ? value.replace(/\./g, "").replace(",", ".")
        : value.replace(/,/g, "");
    } else if (comma !== -1) {
      value = multiplier > 1
        ? value.replace(",", ".")
        : /^\d{1,3}(,\d{3})+$/.test(value)
          ? value.replace(/,/g, "")
          : value.replace(",", ".");
    } else if (dot !== -1 && multiplier === 1 && /^\d{1,3}(\.\d{3})+$/.test(value)) {
      value = value.replace(/\./g, "");
    }

    const number = Number(value);
    return Number.isFinite(number) ? Math.round(number * multiplier) : null;
  }

  function extractViews(metadata) {
    const patterns = [
      /([\d.,]+\s*[KMB]?)\s+(?:views?|visualizaciones?|vues?|visualizzazioni|Aufrufe|visualizações|tayangan|просмотров|回視聴|次觀看)/i,
      /(?:views?|visualizaciones?|vues?|visualizzazioni|Aufrufe|visualizações|tayangan)\s*[:：]?\s*([\d.,]+\s*[KMB]?)/i
    ];

    for (const pattern of patterns) {
      const match = clean(metadata).match(pattern);
      if (match?.[1]) return { text: clean(match[1]), number: parseCompactNumber(match[1]) };
    }
    return { text: null, number: null };
  }

  function metadataParts(row) {
    const elements = [
      ...row.querySelectorAll(
        ".ytContentMetadataViewModelMetadataRow, " +
        ".yt-content-metadata-view-model__metadata-row, " +
        ".inline-metadata-item, #metadata-line, #metadata-line span"
      )
    ];

    return unique(elements.map(element => safeText(element, 240)));
  }

  function duration(row) {
    for (const selector of [
      "ytd-thumbnail-overlay-time-status-renderer #text",
      ".yt-badge-shape__text",
      ".badge-shape-wiz__text",
      "[overlay-style='DEFAULT'] #text"
    ]) {
      const value = safeText(row.querySelector(selector), 30);
      if (/^\d{1,3}:\d{2}(?::\d{2})?$/.test(value)) return value;
    }
    return null;
  }

  function playlistOrder(row) {
    for (const selector of ["#index", ".index", "[id='index']", "[aria-label*='position']"]) {
      const match = safeText(row.querySelector(selector), 80).match(/\d+/);
      if (match && Number.isFinite(Number(match[0]))) return Number(match[0]);
    }
    return null;
  }

  function parseRow(row) {
    const links = [...row.querySelectorAll(
      'a[href*="/watch?v="], a[href*="/shorts/"], a[href*="/live/"]'
    )];

    let videoLink = null;
    let videoId = null;
    for (const link of links) {
      const id = getVideoId(link.getAttribute("href"));
      if (id) {
        videoLink = link;
        videoId = id;
        break;
      }
    }
    if (!videoLink || !videoId) return null;

    const titleElement = row.querySelector(
      "#video-title, .ytLockupMetadataViewModelTitle, .yt-lockup-metadata-view-model__heading-reset, h3 a, a[title]"
    ) || videoLink;
    const title = clean(
      titleElement.getAttribute("title") ||
      titleElement.textContent ||
      titleElement.getAttribute("aria-label")
    ) || null;

    const channelLink = row.querySelector(
      'a[href^="/@"], a[href*="/channel/"], a[href*="/c/"], a[href*="/user/"], #channel-name a'
    );
    const channelName = clean(channelLink?.textContent) || null;
    let channelUrl = null;
    try {
      if (channelLink?.getAttribute("href")) channelUrl = new URL(channelLink.getAttribute("href"), location.origin).href;
    } catch {
      channelUrl = null;
    }

    const avatar = row.querySelector(
      ".ytLockupMetadataViewModelAvatar img, .yt-lockup-metadata-view-model__avatar img, yt-avatar-shape img, .yt-spec-avatar-shape__image"
    );
    const imageUrl = avatar?.currentSrc || avatar?.src || avatar?.getAttribute("src") || null;

    const thumbnail = row.querySelector(
      ".ytThumbnailViewModelImage img, .yt-thumbnail-view-model__image img, ytd-thumbnail img, yt-image img"
    );
    const thumbnailUrl = thumbnail?.currentSrc || thumbnail?.src || thumbnail?.getAttribute("src") ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const parts = metadataParts(row);
    const metadata = parts.join(" • ");
    const views = extractViews(metadata);
    const href = videoLink.getAttribute("href");
    let sourceUrl = `https://www.youtube.com/watch?v=${videoId}`;
    try {
      sourceUrl = new URL(href, location.origin).href;
    } catch {
      // Keep the canonical watch URL.
    }

    return {
      videoId,
      playlistOrder: playlistOrder(row),
      title,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      sourceUrl,
      channel: {
        name: channelName,
        url: channelUrl,
        imageUrl
      },
      thumbnailUrl,
      duration: duration(row),
      views: {
        text: views.text,
        number: views.number,
        note: "Public YouTube view count, NOT personal watch count."
      },
      metadata,
      metadataParts: parts
    };
  }

  function mergeVideo(oldVideo, newVideo) {
    const merged = { ...oldVideo };
    for (const key of ["playlistOrder", "title", "videoUrl", "sourceUrl", "thumbnailUrl", "duration", "metadata"]) {
      if (newVideo[key] != null && newVideo[key] !== "") merged[key] = newVideo[key];
    }
    if (newVideo.metadataParts?.length) merged.metadataParts = newVideo.metadataParts;

    merged.channel = { ...oldVideo.channel };
    for (const key of ["name", "url", "imageUrl"]) {
      if (newVideo.channel?.[key]) merged.channel[key] = newVideo.channel[key];
    }

    merged.views = { ...oldVideo.views };
    if (newVideo.views?.text) merged.views.text = newVideo.views.text;
    if (Number.isFinite(newVideo.views?.number)) merged.views.number = newVideo.views.number;
    return merged;
  }

  /* ============================================================
     PLAYLIST SCANNING AND END DETECTION
     ============================================================ */

  function getRoot() {
    return document.querySelector("ytd-playlist-video-list-renderer") ||
      document.querySelector("ytd-browse[page-subtype='playlist']") ||
      document.querySelector("[page-subtype='playlist']") ||
      document.querySelector("ytd-app") ||
      document.body ||
      document.documentElement;
  }

  function getRows(root = getRoot()) {
    const rows = [
      ...root.querySelectorAll("ytd-playlist-video-renderer, yt-lockup-view-model")
    ];

    if (rows.length) return unique(rows);

    const fallbackRows = [];
    for (const link of root.querySelectorAll('a[href*="/watch?v="], a[href*="/shorts/"], a[href*="/live/"]')) {
      const row = link.closest("ytd-playlist-video-renderer, yt-lockup-view-model, ytd-rich-item-renderer, ytd-video-renderer");
      if (row && !fallbackRows.includes(row)) fallbackRows.push(row);
    }
    return fallbackRows;
  }

  function scan() {
    const rows = getRows();
    let added = 0;
    let updated = 0;
    let errors = 0;

    for (const row of rows) {
      try {
        const parsed = parseRow(row);
        if (!parsed?.videoId) continue;

        const existing = videos.get(parsed.videoId);
        if (!existing) {
          firstSeenCounter++;
          videos.set(parsed.videoId, {
            ...parsed,
            firstSeenOrder: firstSeenCounter,
            firstSeenScrollY: Math.round(window.scrollY || 0),
            collectedAt: new Date().toISOString()
          });
          added++;
        } else {
          videos.set(parsed.videoId, mergeVideo(existing, parsed));
          updated++;
        }
      } catch (error) {
        errors++;
        state.parseErrors++;
        console.warn("Could not parse one YouTube row; continuing", error);
      }
    }

    return { rows: rows.length, added, updated, errors, total: videos.size };
  }

  function detectDeclaredCount() {
    const candidates = [
      document.querySelector("ytd-playlist-header-renderer"),
      document.querySelector("yt-page-header-renderer"),
      document.querySelector("ytd-page-header-renderer"),
      document.querySelector("ytd-browse[page-subtype='playlist']")
    ].filter(Boolean);

    const patterns = [
      /([\d.,\s]+)\s+(?:videos?|vídeos?|vidéos?|video|videos|items?)/i,
      /(?:videos?|vídeos?|vidéos?|items?)\s*[:：]?\s*([\d.,\s]+)/i
    ];

    for (const element of candidates) {
      const text = clean(element.innerText || element.textContent);
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (!match) continue;
        const value = Number(match[1].replace(/[^\d]/g, ""));
        if (Number.isFinite(value) && value > 0) return value;
      }
    }
    return null;
  }

  function getScrollMetrics() {
    const documentElement = document.documentElement;
    const body = document.body;
    const top = window.scrollY || documentElement?.scrollTop || 0;
    const viewport = window.innerHeight || documentElement?.clientHeight || 1;
    const height = Math.max(documentElement?.scrollHeight || 0, body?.scrollHeight || 0);
    const remaining = Math.max(0, height - (top + viewport));
    const denominator = Math.max(1, height - viewport);

    return {
      top,
      viewport,
      height,
      remaining,
      nearBottom: remaining <= Math.max(140, viewport * 0.08),
      percent: height <= viewport ? 100 : Math.min(100, Math.max(0, Math.round((top / denominator) * 100)))
    };
  }

  function loading() {
    const root = getRoot();
    for (const selector of [
      "ytd-continuation-item-renderer tp-yt-paper-spinner[active]",
      "ytd-continuation-item-renderer [role='progressbar']",
      "ytd-continuation-item-renderer yt-spinner",
      "ytd-continuation-item-renderer [aria-busy='true']"
    ]) {
      for (const element of root.querySelectorAll(selector)) {
        if (visible(element)) return true;
      }
    }
    return false;
  }

  function currentSignature() {
    return unique([...getRoot().querySelectorAll('a[href*="/watch?v="], a[href*="/shorts/"], a[href*="/live/"]')]
      .map(anchor => getVideoId(anchor.getAttribute("href"))))
      .slice(-10)
      .join("|");
  }

  function relevantMutation(mutation) {
    const root = getRoot();
    if (mutation.type === "childList") {
      return [...mutation.addedNodes, ...mutation.removedNodes].some(node => {
        if (!(node instanceof Element)) return false;
        return node.matches?.("ytd-playlist-video-renderer, yt-lockup-view-model, ytd-continuation-item-renderer") ||
          Boolean(node.querySelector?.("ytd-playlist-video-renderer, yt-lockup-view-model, ytd-continuation-item-renderer"));
      });
    }
    return root.contains(mutation.target) && mutation.target.closest?.(
      "ytd-playlist-video-renderer, yt-lockup-view-model, ytd-continuation-item-renderer"
    );
  }

  function startMutationObserver() {
    const target = getRoot();
    if (!target || target === document) return;

    try {
      mutationObserver = new MutationObserver(mutations => {
        if (mutations.some(relevantMutation)) {
          mutationVersion++;
          state.relevantMutations++;
        }
      });
      mutationObserver.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    } catch (error) {
      console.warn("YouTube mutation observer unavailable; other end checks remain active", error);
    }
  }

  async function waitForRows() {
    const deadline = Date.now() + CONFIG.ROW_WAIT_MS;
    while (Date.now() < deadline && !getRows().length && !state.stopped) {
      await sleep(500);
    }
  }

  /* ============================================================
     OUTPUT
     ============================================================ */

  function accountForOutput() {
    return {
      email: state.account.email,
      displayName: state.account.displayName,
      channelName: state.account.channelName,
      channelHandle: state.account.channelHandle,
      language: state.account.language,
      detectedBy: state.account.detectedBy,
      confidence: state.account.confidence,
      identitySignals: state.account.identitySignals.map(signal => ({ ...signal }))
    };
  }

  function buildOutput() {
    let list = [...videos.values()].sort((a, b) =>
      (a.playlistOrder ?? a.firstSeenOrder) - (b.playlistOrder ?? b.firstSeenOrder)
    );

    list = list.map((video, index) => ({
      ...video,
      likedOrder: video.playlistOrder ?? index + 1
    }));

    const channelStats = new Map();
    for (const video of list) {
      const key = video.channel?.url || video.channel?.name || "Unknown";
      if (!channelStats.has(key)) {
        channelStats.set(key, {
          channel: video.channel?.name || "Unknown",
          channelUrl: video.channel?.url || null,
          imageUrl: video.channel?.imageUrl || null,
          likedVideoCount: 0,
          totalPublicViews: 0,
          videosWithViewCount: 0,
          videoIds: []
        });
      }

      const stats = channelStats.get(key);
      stats.likedVideoCount++;
      stats.videoIds.push(video.videoId);
      if (Number.isFinite(video.views?.number)) {
        stats.totalPublicViews += video.views.number;
        stats.videosWithViewCount++;
      }
      if (!stats.imageUrl && video.channel?.imageUrl) stats.imageUrl = video.channel.imageUrl;
    }

    const mostLikedChannels = [...channelStats.values()].sort((a, b) =>
      b.likedVideoCount - a.likedVideoCount || b.totalPublicViews - a.totalPublicViews
    );

    const videosByPublicViews = [...list]
      .filter(video => Number.isFinite(video.views?.number))
      .sort((a, b) => b.views.number - a.views.number);

    return {
      generatedAt: new Date().toISOString(),
      source: "YouTube Liked Videos",
      account: accountForOutput(),
      summary: {
        totalLikedVideos: list.length,
        totalChannels: channelStats.size,
        declaredPlaylistCount: state.declaredPlaylistCount,
        endReason: state.endReason
      },
      mostLikedChannels,
      videosByPublicViews,
      videos: list,
      caveat: "Public YouTube view count is not personal watch count. mostLikedChannels ranks channels by the number of liked videos collected from each channel."
    };
  }

  function csvCell(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  function makeCSV(output) {
    const columns = [
      "likedOrder",
      "videoId",
      "title",
      "videoUrl",
      "channelName",
      "channelUrl",
      "duration",
      "publicViews",
      "publicViewsText",
      "metadata",
      "thumbnailUrl",
      "creatorImageUrl"
    ];

    const rows = output.videos.map(video => [
      video.likedOrder,
      video.videoId,
      video.title,
      video.videoUrl,
      video.channel?.name,
      video.channel?.url,
      video.duration,
      video.views?.number,
      video.views?.text,
      video.metadata,
      video.thumbnailUrl,
      video.channel?.imageUrl
    ]);

    return "\uFEFF" + [columns, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
  }

  function outputStem(output) {
    const language = output.account.language;
    const emailLocalPart = output.account.email?.split("@")[0];
    if (language !== "unknown" && emailLocalPart) {
      return `youtube-liked-${language}-${emailLocalPart}`;
    }
    return "youtube-liked-unknown-account";
  }

  function saveBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function download() {
    const output = buildOutput();
    const stem = outputStem(output);
    saveBlob(JSON.stringify(output, null, 2), `${stem}.json`, "application/json;charset=utf-8");
    setTimeout(() => saveBlob(makeCSV(output), `${stem}.csv`, "text/csv;charset=utf-8"), 300);
    console.log(`Saved ${output.summary.totalLikedVideos} liked videos as ${stem}.json and ${stem}.csv`);
    return output;
  }

  /* ============================================================
     PUBLIC API AND RUNNER
     ============================================================ */

  function accountResult() {
    return accountForOutput();
  }

  window.YTLIKES = {
    state,
    status() {
      return {
        ...state,
        account: accountResult(),
        collected: videos.size,
        scroll: getScrollMetrics()
      };
    },
    account: accountResult,
    results: buildOutput,
    download,
    scan,
    stop(options = {}) {
      state.stopped = true;
      state.running = false;
      state.phase = "stopped";
      state.message = "Stopped";
      if (!state.complete) state.endReason = options.reason || "manual_stop";
      updateOverlay(state.message);
      if (!options.silent) console.warn("YouTube collector stopped.");
      return this.status();
    }
  };

  async function run() {
    state.phase = "detecting-account";
    state.message = "Detecting signed-in account…";
    updateOverlay();

    try {
      state.account = await detectAccount();
    } catch (error) {
      state.account = {
        email: null,
        displayName: null,
        channelName: null,
        channelHandle: null,
        language: "unknown",
        detectedBy: "youtube-identity-error",
        confidence: "unknown",
        identitySignals: [{ source: "account-detection-error", value: error?.message || "unknown error" }]
      };
      console.warn("Account-menu detection failed; continuing playlist collection", error);
    }

    if (state.account.language === "unknown") {
      console.warn("Current YouTube account could not be confidently mapped; collection will continue with an unknown-account output.");
    } else {
      console.log(`Detected ${state.account.email || state.account.channelHandle} → language: ${state.account.language}`);
    }

    state.phase = "loading";
    state.message = "Waiting for playlist rows…";
    updateOverlay();
    await waitForRows();

    state.startedAtBottom = getScrollMetrics().nearBottom;
    state.declaredPlaylistCount = detectDeclaredCount();
    const initial = scan();
    state.initialScanCount = initial.total;
    state.phase = "collecting";
    state.message = initial.rows ? "Collecting…" : "No rendered rows yet; continuing to wait/scan…";
    updateOverlay();

    console.log(`Initial screen: ${initial.total} unique videos`);
    if (state.declaredPlaylistCount != null) console.log(`Playlist header reports: ${state.declaredPlaylistCount}`);

    startMutationObserver();

    if (state.declaredPlaylistCount && videos.size >= state.declaredPlaylistCount && !loading()) {
      state.complete = true;
      state.running = false;
      state.phase = "complete";
      state.endReason = "declared_count_already_loaded";
      state.message = "Complete";
      updateOverlay();
      if (CONFIG.AUTO_DOWNLOAD && !state.autoDownloaded) {
        state.autoDownloaded = true;
        download();
      }
      return;
    }

    window.scrollTo(0, 0);
    await sleep(1200);
    const topScan = scan();
    state.firstScrollScanCount = topScan.total;
    state.firstScrollAdded = topScan.added;
    updateOverlay("Collecting from top…");

    let previousHeight = getScrollMetrics().height;
    let previousSignature = currentSignature();
    let previousTotal = videos.size;
    let previousMutationVersion = mutationVersion;

    while (!state.stopped && state.rounds < CONFIG.MAX_ROUNDS) {
      state.rounds++;
      scan();
      const before = getScrollMetrics();
      const step = Math.max(500, Math.round(before.viewport * CONFIG.SCROLL_STEP_VIEWPORTS));
      window.scrollBy(0, step);
      await sleep(before.nearBottom ? CONFIG.BOTTOM_WAIT_MS : CONFIG.NORMAL_WAIT_MS);

      const after = scan();
      const metrics = getScrollMetrics();
      const signature = currentSignature();
      const isLoading = loading();
      const totalChanged = videos.size !== previousTotal || after.added > 0;
      const heightChanged = Math.abs(metrics.height - previousHeight) > 5;
      const signatureChanged = signature !== previousSignature;
      const mutationChanged = mutationVersion !== previousMutationVersion;

      if (metrics.nearBottom) {
        window.scrollTo(0, metrics.height);
        if (!totalChanged && !heightChanged && !signatureChanged && !isLoading && !mutationChanged) {
          state.stableBottomRounds++;
        } else {
          state.stableBottomRounds = 0;
        }
      } else {
        state.stableBottomRounds = 0;
      }

      previousHeight = metrics.height;
      previousSignature = signature;
      previousTotal = videos.size;
      previousMutationVersion = mutationVersion;
      state.message = isLoading
        ? "YouTube loading…"
        : metrics.nearBottom
          ? "Checking true end…"
          : "Collecting…";
      updateOverlay();

      if (after.added > 0 || state.rounds % 10 === 0) {
        console.log(`[YT] ${videos.size} collected | scroll ${metrics.percent}% | +${after.added}`);
      }

      if (state.declaredPlaylistCount && videos.size >= state.declaredPlaylistCount && metrics.nearBottom && state.stableBottomRounds >= 2) {
        state.endReason = "declared_playlist_count_reached";
        break;
      }

      if (state.stableBottomRounds >= CONFIG.BOTTOM_STABLE_ROUNDS) {
        state.endReason = "stable_bottom_no_more_items";
        break;
      }
    }

    if (state.stopped) {
      state.phase = "stopped";
      state.message = "Stopped";
      updateOverlay();
      mutationObserver?.disconnect();
      return;
    }

    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(2200);
    scan();
    await sleep(1000);
    scan();

    state.complete = true;
    state.running = false;
    state.phase = "complete";
    state.message = "Complete";
    state.endReason ||= state.rounds >= CONFIG.MAX_ROUNDS ? "max_round_failsafe" : "complete";
    updateOverlay();
    mutationObserver?.disconnect();
    console.log(`YouTube Likes complete — ${videos.size} videos; end: ${state.endReason}`);

    if (CONFIG.AUTO_DOWNLOAD && !state.autoDownloaded) {
      state.autoDownloaded = true;
      download();
    }
  }

  run().catch(error => {
    state.running = false;
    state.phase = "error";
    state.message = "Error; collection stopped";
    state.endReason = "collector_error";
    updateOverlay(state.message);
    console.error("YouTube collector error; partial results remain available through YTLIKES.results()", error);
  });
})();

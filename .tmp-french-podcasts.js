var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// js/navbar-loader.js
var require_navbar_loader = __commonJS({
  "js/navbar-loader.js"() {
    console.log("navbar-loader.js: Script start. Relies on global 'siteBasePath'.");
    document.addEventListener("DOMContentLoaded", function() {
      console.log("navbar-loader.js: DOMContentLoaded event fired.");
      if (typeof siteBasePath === "undefined") {
        console.error("Navbar Loader: CRITICAL - global 'siteBasePath' is not defined. Navbar cannot load correctly.");
        const errPlaceholder = document.getElementById("main-header-placeholder");
        if (errPlaceholder) errPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding:10px; background:#fff;">Error: Site configuration missing (siteBasePath). Navbar cannot load.</p>';
        return;
      }
      console.log("Navbar Loader: Using global siteBasePath:", siteBasePath);
      const navbarPlaceholder = document.getElementById("main-header-placeholder");
      if (navbarPlaceholder) {
        console.log("navbar-loader.js: Found #main-header-placeholder");
        let templatePath = siteBasePath + "templates/navbar.html";
        const finalTemplatePath = templatePath.replace(/\/\//g, "/");
        console.log(`Navbar Loader: Attempting to fetch template from: ${finalTemplatePath}`);
        fetch(finalTemplatePath).then((response) => {
          console.log(`Navbar Loader: Fetch response received. Status: ${response.status}`);
          if (!response.ok) {
            console.error(`Navbar Loader: Fetch failed for ${response.url}`);
            navbarPlaceholder.innerHTML = `<p style="color:red; text-align:center; padding: 10px; background: #fff;">Error loading navigation data (Status: ${response.status}). Check console and path: ${response.url}</p>`;
            throw new Error(`HTTP error! status: ${response.status} while fetching ${response.url}`);
          }
          console.log("Navbar Loader: Fetch successful, getting text...");
          return response.text();
        }).then((data) => {
          console.log("Navbar Loader: Template text received. Injecting HTML...");
          try {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = data.trim();
            const headerElement = tempDiv.querySelector("header");
            if (!headerElement) {
              throw new Error("Loaded navbar template does not contain a <header> element.");
            }
            navbarPlaceholder.parentNode.replaceChild(headerElement, navbarPlaceholder);
            console.log("Navbar Loader: HTML injected successfully.");
            console.log("Navbar Loader: Calling adjustLinksForBasePath...");
            adjustLinksForBasePath2(headerElement, siteBasePath);
            console.log("Navbar Loader: adjustLinksForBasePath finished.");
            console.log("Navbar Loader: Calling initializeNavbarScripts...");
            initializeNavbarScripts();
            console.log("Navbar Loader: initializeNavbarScripts finished.");
            console.log("Navbar Loader: Calling setActiveLink...");
            setActiveLink(siteBasePath);
            console.log("Navbar Loader: setActiveLink finished.");
          } catch (injectionError) {
            console.error("Navbar Loader: Error during HTML injection or subsequent script initialization:", injectionError);
            const targetPlaceholder = document.querySelector("header#main-header-placeholder") || document.querySelector("header") || navbarPlaceholder;
            if (targetPlaceholder) targetPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">JS Error after loading navigation data. See console.</p>';
          }
        }).catch((error) => {
          console.error("Error loading navbar (fetch or processing):", error);
          if (navbarPlaceholder && !navbarPlaceholder.innerHTML.includes("Error loading")) {
            try {
              navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">Error loading navigation data. See console.</p>';
            } catch (e) {
            }
          }
        });
      } else {
        console.warn("Navbar Loader: #main-header-placeholder NOT FOUND on this page.");
      }
    });
    function adjustLinksForBasePath2(parentElement, basePathToUse) {
      console.log(`adjustLinksForBasePath: Using basePath: '${basePathToUse}' for element:`, parentElement);
      if (!parentElement) {
        console.error("adjustLinksForBasePath: Parent element is null, cannot adjust links.");
        return;
      }
      if (basePathToUse === "/" || !basePathToUse || basePathToUse.trim() === "") {
        console.log("adjustLinksForBasePath: Base path is root ('/'), no path prepending needed for links/images starting with '/'.");
        return;
      }
      const correctBasePath = basePathToUse.endsWith("/") ? basePathToUse : basePathToUse + "/";
      let adjustedLinks = 0;
      let adjustedImages = 0;
      parentElement.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach((link) => {
        const originalHref = link.getAttribute("href");
        if (originalHref && !originalHref.startsWith(correctBasePath)) {
          const pathSegment = originalHref === "/" ? "" : originalHref.substring(1);
          const newHref = (correctBasePath + pathSegment).replace(/\/\//g, "/");
          link.setAttribute("href", newHref);
          adjustedLinks++;
        }
      });
      parentElement.querySelectorAll('img[src^="/"]:not([src^="//"])').forEach((img) => {
        const originalSrc = img.getAttribute("src");
        if (originalSrc && !originalSrc.startsWith(correctBasePath)) {
          const pathSegment = originalSrc === "/" ? "" : originalSrc.substring(1);
          const newSrc = (correctBasePath + pathSegment).replace(/\/\//g, "/");
          img.setAttribute("src", newSrc);
          adjustedImages++;
        }
      });
      console.log(`adjustLinksForBasePath: Adjusted ${adjustedLinks} links and ${adjustedImages} images within`, parentElement);
    }
    function initializeNavbarScripts() {
      const headerElement = document.querySelector("header:not(#main-header-placeholder)");
      if (!headerElement) {
        console.error("initializeNavbarScripts: Injected header element not found.");
        return;
      }
      if (!window.navbarScrollListenerAdded) {
        window.addEventListener("scroll", () => {
          const currentHeader = document.querySelector("header:not(#main-header-placeholder)");
          if (currentHeader) currentHeader.classList.toggle("scrolled", window.scrollY > 50);
        });
        const currentHeaderInitial = document.querySelector("header:not(#main-header-placeholder)");
        if (currentHeaderInitial) currentHeaderInitial.classList.toggle("scrolled", window.scrollY > 50);
        window.navbarScrollListenerAdded = true;
      }
      const menuToggle = headerElement.querySelector(".menu-toggle");
      const navLinksUl = headerElement.querySelector(".nav-links");
      if (menuToggle && navLinksUl) {
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        newMenuToggle.addEventListener("click", () => {
          navLinksUl.classList.toggle("active");
          newMenuToggle.classList.toggle("active");
        });
        navLinksUl.querySelectorAll("a").forEach((link) => {
          const newLink = link.cloneNode(true);
          link.parentNode.replaceChild(newLink, link);
          newLink.addEventListener("click", (e) => {
            const isDropbtn = newLink.classList.contains("dropbtn");
            const isMobile = window.innerWidth <= 768;
            const href = newLink.getAttribute("href");
            const isToggleOnly = href === "javascript:void(0)" || href === "#";
            if (isDropbtn && isMobile && isToggleOnly) return;
            if (navLinksUl.classList.contains("active")) {
              navLinksUl.classList.remove("active");
              const currentToggle = headerElement.querySelector(".menu-toggle.active");
              if (currentToggle) currentToggle.classList.remove("active");
            }
          });
        });
      }
      const dropdowns = headerElement.querySelectorAll(".nav-links .dropdown");
      dropdowns.forEach((dropdown) => {
        const dropbtn = dropdown.querySelector(".dropbtn");
        if (dropbtn) {
          const newDropbtn = dropbtn.cloneNode(true);
          dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
          newDropbtn.addEventListener("click", function(event) {
            handleDropdownClick(this, event, headerElement);
          });
        }
      });
      const internalNavLinks = headerElement.querySelectorAll('.nav-links a[href*="#"]');
      internalNavLinks.forEach((link) => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        newLink.addEventListener("click", function(e) {
          const href = this.getAttribute("href");
          const hashIndex = href.lastIndexOf("#");
          if (hashIndex !== -1) {
            const targetId = href.substring(hashIndex);
            let currentPathForCompare = window.location.pathname;
            if (typeof siteBasePath !== "undefined" && siteBasePath !== "/") {
            } else {
            }
            if (currentPathForCompare.endsWith("/index.html")) currentPathForCompare = currentPathForCompare.slice(0, -10);
            if (currentPathForCompare.length > 1 && currentPathForCompare.endsWith("/")) currentPathForCompare = currentPathForCompare.slice(0, -1);
            if (currentPathForCompare === "" && (typeof siteBasePath === "undefined" || siteBasePath === "/")) currentPathForCompare = "/";
            const linkBasePathOnly = href.substring(0, hashIndex);
            const isSamePage = linkBasePathOnly === "" || linkBasePathOnly === currentPathForCompare || currentPathForCompare.endsWith(linkBasePathOnly);
            if (targetId.length > 1 && isSamePage) {
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                e.preventDefault();
                const headerOffset = headerElement.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
              }
            }
          }
        });
      });
      console.log("initializeNavbarScripts: Sticky, Mobile Nav, Smooth Scroll for nav initialized.");
    }
    function handleDropdownClick(clickedDropbtn, event, headerElement) {
      const isMobile = window.innerWidth <= 768;
      const dropdownContent = clickedDropbtn.nextElementSibling;
      if (isMobile && dropdownContent && dropdownContent.classList.contains("dropdown-content")) {
        event.preventDefault();
        const isActive = dropdownContent.classList.contains("show-mobile");
        headerElement.querySelectorAll(".nav-links .dropdown-content.show-mobile").forEach((openDropdown) => {
          if (openDropdown !== dropdownContent) {
            openDropdown.classList.remove("show-mobile");
            openDropdown.style.maxHeight = null;
            const otherBtn = openDropdown.previousElementSibling;
            if (otherBtn) otherBtn.classList.remove("mobile-dropdown-open");
          }
        });
        dropdownContent.classList.toggle("show-mobile", !isActive);
        clickedDropbtn.classList.toggle("mobile-dropdown-open", !isActive);
        dropdownContent.style.maxHeight = !isActive ? dropdownContent.scrollHeight + "px" : null;
      }
    }
    function setActiveLink(basePathToUse) {
      const headerElement = document.querySelector("header:not(#main-header-placeholder)");
      if (!headerElement) {
        console.log("setActiveLink: Injected header not found.");
        return;
      }
      const urlObject = new URL(window.location.href);
      let currentPathname = urlObject.pathname;
      const currentHash = urlObject.hash;
      if (currentPathname.endsWith("/index.html")) {
        currentPathname = currentPathname.substring(0, currentPathname.length - 10);
      }
      if (currentPathname.length > 1 && currentPathname.endsWith("/") && currentPathname !== basePathToUse) {
        currentPathname = currentPathname.substring(0, currentPathname.length - 1);
      }
      if (currentPathname === "" && basePathToUse === "/") currentPathname = "/";
      if (basePathToUse !== "/" && basePathToUse.endsWith("/") && currentPathname === basePathToUse.slice(0, -1)) {
      }
      console.log(`setActiveLink: Using basePath: '${basePathToUse}'. Normalized Current Path: '${currentPathname}', Hash: '${currentHash}'`);
      const allLinks = headerElement.querySelectorAll(".nav-links a, .dropdown-content a");
      allLinks.forEach((link) => {
        link.classList.remove("active-link");
        const parentDropbtn = link.closest(".dropdown")?.querySelector(".dropbtn");
        if (parentDropbtn) parentDropbtn.classList.remove("active-link");
      });
      let bestMatch = null;
      let bestMatchLevel = -1;
      allLinks.forEach((link) => {
        const linkHrefAttr = link.getAttribute("href");
        if (!linkHrefAttr || linkHrefAttr.startsWith("http") || linkHrefAttr === "#" || linkHrefAttr.startsWith("javascript:")) return;
        let normalizedLinkHref = linkHrefAttr;
        if (normalizedLinkHref.endsWith("/index.html")) {
          normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 10);
        }
        if (normalizedLinkHref.length > 1 && normalizedLinkHref.endsWith("/") && normalizedLinkHref !== basePathToUse) {
          normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 1);
        }
        if (normalizedLinkHref === "" && basePathToUse === "/") normalizedLinkHref = "/";
        if (basePathToUse !== "/" && basePathToUse.endsWith("/") && normalizedLinkHref === basePathToUse.slice(0, -1)) {
        }
        const linkPathPart = normalizedLinkHref.split("#")[0];
        const linkHashPart = normalizedLinkHref.includes("#") ? "#" + normalizedLinkHref.split("#")[1] : "";
        if (linkPathPart === currentPathname) {
          if (linkHashPart === currentHash) {
            if (bestMatchLevel < 2) {
              bestMatch = link;
              bestMatchLevel = 2;
            }
          } else if (currentHash && !linkHashPart) {
            if (bestMatchLevel < 1) {
              bestMatch = link;
              bestMatchLevel = 1;
            }
          } else if (!currentHash && !linkHashPart) {
            if (bestMatchLevel < 0) {
              bestMatch = link;
              bestMatchLevel = 0;
            }
          }
        }
      });
      if (bestMatch) {
        bestMatch.classList.add("active-link");
        activateParentDropdown(bestMatch);
      } else {
        const repoRootPath = basePathToUse !== "/" && basePathToUse.endsWith("/") ? basePathToUse.slice(0, -1) : basePathToUse;
        if (currentPathname === repoRootPath) {
          const rootLinkCandidate1 = headerElement.querySelector(`a[href="${basePathToUse}"]`);
          const rootLinkCandidate2 = headerElement.querySelector(`a[href="${basePathToUse}index.html"]`);
          const rootLinkCandidate3 = basePathToUse !== "/" ? headerElement.querySelector(`a[href="${basePathToUse.slice(0, -1)}"]`) : null;
          const candidates = [rootLinkCandidate1, rootLinkCandidate2, rootLinkCandidate3].filter(Boolean);
          for (const candidate of candidates) {
            if (candidate && !candidate.getAttribute("href").includes("#")) {
              candidate.classList.add("active-link");
              activateParentDropdown(candidate);
              console.log("setActiveLink: Applied active class to a root page link:", candidate.href);
              break;
            }
          }
        } else {
          console.log("setActiveLink: No suitable link found to activate for current path:", currentPathname);
        }
      }
      console.log("setActiveLink: Link highlighting process complete.");
    }
    function activateParentDropdown(linkElement) {
      const dropdownContent = linkElement.closest(".dropdown-content");
      if (dropdownContent) {
        const dropbtn = dropdownContent.previousElementSibling;
        if (dropbtn && dropbtn.classList.contains("dropbtn")) {
          dropbtn.classList.add("active-link");
        }
      }
    }
  }
});

// js/footer-loader.js
var require_footer_loader = __commonJS({
  "js/footer-loader.js"() {
    console.log("footer-loader.js: Script start. Relies on global 'siteBasePath'.");
    document.addEventListener("DOMContentLoaded", function() {
      console.log("footer-loader.js: DOMContentLoaded event fired.");
      if (typeof siteBasePath === "undefined") {
        console.error("Footer Loader: CRITICAL - global 'siteBasePath' is not defined. Footer cannot load correctly.");
        const errPlaceholder = document.getElementById("main-footer-placeholder");
        if (errPlaceholder) errPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding:10px;">Error: Site configuration missing (siteBasePath). Footer cannot load.</p>';
        return;
      }
      console.log("Footer Loader: Using global siteBasePath:", siteBasePath);
      const footerPlaceholder = document.getElementById("main-footer-placeholder");
      if (footerPlaceholder) {
        console.log("footer-loader.js: Found #main-footer-placeholder");
        let templatePath = siteBasePath + "templates/footer.html";
        const finalTemplatePath = templatePath.replace(/\/\//g, "/");
        console.log(`Footer Loader: Attempting to fetch template from: ${finalTemplatePath}`);
        fetch(finalTemplatePath).then((response) => {
          console.log(`Footer Loader: Fetch response received. Status: ${response.status}`);
          if (!response.ok) {
            console.error(`Footer Loader: Fetch failed for ${response.url}`);
            footerPlaceholder.innerHTML = `<p style="color:red; text-align:center; padding: 10px;">Error loading footer data (Status: ${response.status}). Check console and path: ${response.url}</p>`;
            throw new Error(`HTTP error! status: ${response.status} while fetching ${response.url}`);
          }
          console.log("Footer Loader: Fetch successful, getting text...");
          return response.text();
        }).then((data) => {
          console.log("Footer Loader: Template text received. Injecting HTML...");
          try {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = data.trim();
            const footerElement = tempDiv.querySelector("footer");
            if (!footerElement) {
              throw new Error("Loaded footer template does not contain a <footer> element.");
            }
            footerPlaceholder.parentNode.replaceChild(footerElement, footerPlaceholder);
            console.log("Footer Loader: HTML injected successfully.");
            if (typeof adjustLinksForBasePath === "function") {
              console.log("Footer Loader: Calling adjustLinksForBasePath for footer...");
              adjustLinksForBasePath(footerElement, siteBasePath);
              console.log("Footer Loader: adjustLinksForBasePath for footer finished.");
            } else {
              console.warn("Footer Loader: adjustLinksForBasePath function not found. Links in footer might not be adjusted.");
            }
            if (typeof initializeFooterScripts === "function") {
              console.log("Footer Loader: Calling initializeFooterScripts...");
              initializeFooterScripts();
              console.log("Footer Loader: initializeFooterScripts finished.");
            }
          } catch (injectionError) {
            console.error("Footer Loader: Error during HTML injection or subsequent script initialization:", injectionError);
            const targetPlaceholder = document.querySelector("footer#main-footer-placeholder") || document.querySelector("footer") || footerPlaceholder;
            if (targetPlaceholder) targetPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">JS Error after loading footer data. See console.</p>';
          }
        }).catch((error) => {
          console.error("Error loading footer (fetch or processing):", error);
          if (footerPlaceholder && !footerPlaceholder.innerHTML.includes("Error loading")) {
            try {
              footerPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">Error loading footer data. See console.</p>';
            } catch (e) {
            }
          }
        });
      } else {
        console.warn("Footer Loader: #main-footer-placeholder NOT FOUND on this page.");
      }
    });
    function initializeFooterScripts() {
      const footerElement = document.querySelector("footer");
      if (footerElement) {
        const currentYearSpan = footerElement.querySelector("#current-year");
        if (currentYearSpan) {
          currentYearSpan.textContent = (/* @__PURE__ */ new Date()).getFullYear();
        } else {
          console.warn("initializeFooterScripts: #current-year span not found in loaded footer.");
        }
        console.log("initializeFooterScripts: Copyright year updated.");
      } else {
        console.error("initializeFooterScripts: Injected footer element not found.");
      }
    }
  }
});

// languages/french/js/data/french-playlist-data.js
var require_french_playlist_data = __commonJS({
  "languages/french/js/data/french-playlist-data.js"() {
    window.frenchPlaylistData = [
      {
        id: "Y4E7qlHhK84",
        title: "Filipino Guy Impresses French Ambassador with His French Speaking Fluency!",
        duration: "16:06",
        publishedAt: "2024-04-14"
      },
      {
        id: "vlc9mEyBEd8",
        title: "What do French people think of the PHILIPPINES? | Interviews in French",
        duration: "11:37",
        publishedAt: "2023-05-10"
      },
      {
        id: "gOzMcdrX0aU",
        title: "When two FILIPINO POLYGLOTS meet each other...",
        duration: "5:50",
        publishedAt: "2023-05-03"
      },
      {
        id: "RSLDv9dDP8U",
        title: "Filipino Polyglot Talks to Strangers in Multiple Languages",
        duration: "13:36",
        publishedAt: "2023-06-04"
      },
      {
        id: "OrK8PNQEh8w",
        title: "FILIPINOS SPEAKING FRENCH | How did they learn the Language of Love?",
        duration: "10:23",
        publishedAt: "2023-06-19"
      },
      {
        id: "HAHPP1G-Fq4",
        title: "Polyglot makes Friends in DIFFERENT LANGUAGES!",
        duration: "7:39",
        publishedAt: "2023-07-22"
      },
      {
        id: "x3mFQBa9Pk8",
        title: "I Made People Happy When I Spoke Their Language",
        duration: "7:57",
        publishedAt: "2023-08-16"
      },
      {
        id: "MM2HOA-YpmE",
        title: "Filipino Shocks Foreigners in their Native Language! Crazy Reactions!",
        duration: "17:29",
        publishedAt: "2023-10-20"
      },
      {
        id: "hIuIwovQH5I",
        title: "Filipino speaks Fluent French and Pranks Natives",
        duration: "17:38",
        publishedAt: "2023-10-27"
      },
      {
        id: "VjuBvugjaIQ",
        title: "This Happened when a Filipino Teen Suddenly Speaks in 8 Languages!",
        duration: "21:16",
        publishedAt: "2023-12-24"
      },
      {
        id: "jZqZTp_nWro",
        title: "Insane Polyglot Battle in 5 Languages! Filipino vs American ft. Ryan Hale",
        duration: "20:57",
        publishedAt: "2024-06-23"
      },
      {
        id: "dRswor7uF_Y",
        title: "Filipinos speaking French in the Little Paris of the Philippines!",
        duration: "21:44",
        publishedAt: "2024-08-04"
      },
      {
        id: "TupMAAUIgoE",
        title: "Filipino Polyglots Conversation in French and Spanish + HUGE ANNOUNCEMENT!",
        duration: "22:17",
        publishedAt: "2024-11-03"
      },
      {
        id: "7YiDsK3npaY",
        title: "This Filipino Actor acts and speaks in Multiple Languages! ft. Roven Alejandro",
        duration: "20:56",
        publishedAt: "2024-12-01"
      },
      {
        id: "l8QRZCdYWnU",
        title: "Filipino Polyglot Singer Sang in Fluent French-and the Francophone Crowd Went Wild!",
        duration: "12:25",
        publishedAt: "2025-04-27"
      },
      {
        id: "Lq3NZFX1cPg",
        title: "Filipino Guy Survived 24 Hours on P0 Speaking ONLY French",
        duration: "21:01",
        publishedAt: "2025-07-21"
      },
      {
        id: "zizTuIfzHq4",
        title: "Filipinos Had Nowhere to Practice French... So We Created a Community!",
        duration: "12:00",
        publishedAt: "2025-09-23"
      },
      {
        id: "bMaC76z7CDc",
        title: "I Spent 3 Years Studying French... Here's What I Discovered",
        duration: "17:13",
        publishedAt: "2026-03-22"
      }
    ];
  }
});

// languages/french/js/data/french-restaurants-data.js
var require_french_restaurants_data = __commonJS({
  "languages/french/js/data/french-restaurants-data.js"() {
    window.languageRestaurantShelfConfig = {
      idPrefix: "french",
      fallbackImage: "images/textures/patchwork-cream-linen.webp",
      labels: {
        details: "Ouvrir la fiche",
        close: "Fermer la fiche du lieu",
        address: "Adresse",
        contact: "Contact",
        watchVideo: "Voir la vid\xE9o d\u2019Aljohn",
        empty: "Aucune adresse disponible."
      },
      items: [
        {
          id: "paris-delice",
          name: "Paris D\xE9lice",
          city: "Legazpi Village \xB7 Makati",
          logo: "images/restaurants/paris-delice-logo.webp",
          logoAlt: "Logo officiel de Paris D\xE9lice",
          image: "images/restaurants/paris-delice.webp",
          imageAlt: "Croissants et viennoiseries pr\xE9par\xE9s par Paris D\xE9lice",
          summary: "Une boulangerie fran\xE7aise rencontr\xE9e pendant l\u2019October F\xEAte de Makati.",
          description: "Aljohn a pr\xE9sent\xE9 Paris D\xE9lice dans sa vid\xE9o tourn\xE9e pendant l\u2019October F\xEAte, au milieu des conversations en fran\xE7ais et des sp\xE9cialit\xE9s propos\xE9es dans la rue.",
          address: "Mile Long Building, G/F Entrance U-151, Amorsolo corner V.A. Rufino Street, Legazpi Village, Makati 1229",
          contact: "+63 915 906 2083 \xB7 +63 999 337 0708",
          links: [
            { label: "Site officiel", url: "https://www.parisdelice.com.ph/home" },
            { label: "Instagram \xB7 @parisdelice.com.ph", url: "https://www.instagram.com/parisdelice.com.ph/" }
          ],
          videoUrl: "https://www.youtube.com/watch?v=hIuIwovQH5I"
        },
        {
          id: "paris-crepes",
          name: "Paris Cr\xEApes",
          city: "SM City Dasmari\xF1as \xB7 Cavite",
          logo: "images/restaurants/paris-crepes-logo.webp",
          logoAlt: "Logo officiel de Paris Cr\xEApes",
          image: "images/restaurants/paris-crepes.webp",
          imageAlt: "Kiosque Paris Cr\xEApes aux Philippines",
          summary: "Des cr\xEApes fran\xE7aises reli\xE9es \xE0 la m\xEAme journ\xE9e de rencontres \xE0 Makati.",
          description: "Paris Cr\xEApes figure dans la description du reportage d\u2019Aljohn \xE0 l\u2019October F\xEAte, une journ\xE9e o\xF9 la gastronomie a servi de point de d\xE9part aux \xE9changes en fran\xE7ais.",
          address: "Lower Ground Floor, Main Building, SM City Dasmari\xF1as, Governor\u2019s Drive, Dasmari\xF1as, Cavite 4114",
          links: [
            { label: "Facebook", url: "https://www.facebook.com/ParisCrepesSMDasmarinas/" },
            { label: "Instagram \xB7 @pariscrepesph", url: "https://www.instagram.com/pariscrepesph/" }
          ],
          videoUrl: "https://www.youtube.com/watch?v=hIuIwovQH5I"
        },
        {
          id: "la-vie-parisienne",
          name: "La Vie Parisienne",
          city: "Lahug \xB7 Cebu City",
          logo: "images/restaurants/la-vie-parisienne-logo.webp",
          logoAlt: "Logo officiel de La Vie Parisienne Cebu",
          image: "images/restaurants/la-vie-parisienne.webp",
          imageAlt: "Tour Eiffel illumin\xE9e dans le jardin de La Vie Parisienne \xE0 Cebu",
          summary: "Une \xE9tape de la visite d\u2019Aljohn dans le \xAB petit Paris \xBB de Cebu.",
          description: "Apr\xE8s sa rencontre avec l\u2019Alliance Fran\xE7aise de Cebu, Aljohn a reli\xE9 sa d\xE9couverte de la communaut\xE9 francophone locale \xE0 cette adresse de Gorordo Avenue.",
          address: "371 Gorordo Avenue, Lahug, Cebu City 6015",
          contact: "+63 999 885 4318",
          links: [
            { label: "Instagram \xB7 @lavieparisienne.cebu", url: "https://www.instagram.com/lavieparisienne.cebu/" },
            { label: "Facebook", url: "https://www.facebook.com/laparisiennecebu/" }
          ],
          videoUrl: "https://www.youtube.com/watch?v=dRswor7uF_Y"
        },
        {
          id: "crepe-glazik",
          name: "Cr\xEApe Glazik",
          city: "Salcedo Village \xB7 Makati",
          logo: "images/restaurants/crepe-glazik-logo.webp",
          logoAlt: "Logo officiel de Cr\xEApe Glazik",
          image: "images/restaurants/crepe-glazik.webp",
          imageAlt: "Salle de la cr\xEAperie Cr\xEApe Glazik \xE0 Makati",
          summary: "La cr\xEAperie o\xF9 les premi\xE8res rencontres de Saging \xC7a Va ont pris vie.",
          description: "Aljohn y a film\xE9 la Chandeleur et les premiers jeux de conversation de Saging \xC7a Va : une table o\xF9 les apprenants pouvaient enfin oser parler fran\xE7ais ensemble.",
          address: "Cambridge Centre Building, 108 Tordesillas Street, Salcedo Village, Makati",
          contact: "+63 917 163 1130",
          links: [
            { label: "Instagram \xB7 @crepeglazik", url: "https://www.instagram.com/crepeglazik/" },
            { label: "Facebook", url: "https://www.facebook.com/crepeglazik/" }
          ],
          videoUrl: "https://www.youtube.com/watch?v=zizTuIfzHq4"
        }
      ]
    };
  }
});

// languages/french/js/data/extra-french-playlist-data.js
var require_extra_french_playlist_data = __commonJS({
  "languages/french/js/data/extra-french-playlist-data.js"() {
    window.extraFrenchPlaylistData = {
      playlistUrl: "https://www.youtube.com/playlist?list=PLhAxKCm7GPvi1fmbLUbhYhQcLGTZ2Fqwq",
      title: "Extr@ en fran\xE7ais",
      summary: "Une sitcom accessible pour entra\xEEner l'oreille avec des situations quotidiennes, un d\xE9bit clair et beaucoup de r\xE9p\xE9titions utiles. Commence avec les sous-titres fran\xE7ais, puis revois une sc\xE8ne sans les lire.",
      episodes: [
        {
          id: "EaNqp4FXh-s",
          title: "\xC9pisode 1",
          duration: "24:28",
          channelName: "Frenchy french",
          subtitleNote: "Sous-titres fran\xE7ais"
        },
        {
          id: "VOLDwbnpmb0",
          title: "\xC9pisode 2",
          duration: "24:07",
          channelName: "Frenchy french",
          subtitleNote: "Sous-titres fran\xE7ais"
        },
        {
          id: "mNzbzZEJwm0",
          title: "\xC9pisode 3",
          duration: "24:18",
          channelName: "Frenchy french",
          subtitleNote: "Sous-titres fran\xE7ais"
        },
        {
          id: "drdJaBrA3ns",
          title: "\xC9pisode 4",
          duration: "24:27",
          channelName: "Frenchy french",
          subtitleNote: "Sous-titres fran\xE7ais"
        },
        {
          id: "aHBZGWfJ0Q0",
          title: "\xC9pisode 5",
          duration: "24:23",
          channelName: "Frenchy french",
          subtitleNote: "Sans sous-titres fran\xE7ais"
        },
        {
          id: "ePwwpjNXHyM",
          title: "\xC9pisode 6",
          duration: "24:22",
          channelName: "Frenchy french",
          subtitleNote: "Sous-titres fran\xE7ais"
        },
        {
          id: "4AyMirxizzA",
          title: "\xC9pisode 7",
          duration: "24:17",
          channelName: "Frenchy french",
          subtitleNote: "Sous-titres fran\xE7ais"
        },
        {
          id: "gCLRjvVz9Sk",
          title: "\xC9pisode 8",
          duration: "24:33",
          channelName: "2K Entertainment"
        },
        {
          id: "zJS2ljF_QEE",
          title: "\xC9pisode 9",
          duration: "24:15",
          channelName: "2K Entertainment"
        },
        {
          id: "SAJfrNCKylI",
          title: "\xC9pisode 10",
          duration: "24:09",
          channelName: "2K Entertainment"
        },
        {
          id: "BoEIMKrfbe0",
          title: "\xC9pisode 11",
          duration: "24:14",
          channelName: "2K Entertainment"
        },
        {
          id: "MmBFtEGxjGY",
          title: "\xC9pisode 12",
          duration: "24:22",
          channelName: "2K Entertainment"
        },
        {
          id: "-zbe02xGIqQ",
          title: "\xC9pisode 13",
          duration: "24:30",
          channelName: "2K Entertainment"
        }
      ]
    };
  }
});

// languages/french/js/data/french-curated-channels-data.js
var require_french_curated_channels_data = __commonJS({
  "languages/french/js/data/french-curated-channels-data.js"() {
    var frenchCreator = (creator) => ({
      profilePlatform: "youtube",
      imageAlt: `Portrait de ${creator.name}`,
      ...creator
    });
    window.frenchCuratedChannelsData = {
      categories: [
        {
          id: "apprentissage",
          title: "Apprentissage",
          icon: "fa-solid fa-graduation-cap",
          description: "Les profs et formats qui m\u2019aident \xE0 passer de la compr\xE9hension \xE0 une langue que je peux vraiment utiliser."
        },
        {
          id: "personnalites",
          title: "Personnalit\xE9s",
          icon: "fa-solid fa-star",
          description: "Les artistes que je suis r\xE9ellement, au-del\xE0 d\u2019une seule \xE9mission ou d\u2019une seule chanson."
        },
        {
          id: "star-academy-alumni",
          title: "Star Academy \u2014 promotions",
          icon: "fa-solid fa-microphone-lines",
          description: "Des voix r\xE9v\xE9l\xE9es au ch\xE2teau, suivies dans les primes, les tourn\xE9es et leurs projets apr\xE8s l\u2019\xE9mission."
        },
        {
          id: "musique",
          title: "Musique",
          icon: "fa-solid fa-music",
          description: "Les \xE9missions, auditions et sc\xE8nes qui font de l\u2019\xE9coute du fran\xE7ais un rendez-vous."
        },
        {
          id: "humour",
          title: "Humour & cr\xE9ateurs",
          icon: "fa-solid fa-face-laugh-beam",
          description: "Des voix famili\xE8res de YouTube pour entendre le rythme, les blagues et le fran\xE7ais d\u2019Internet."
        },
        {
          id: "culture",
          title: "Culture & curiosit\xE9",
          icon: "fa-solid fa-lightbulb",
          description: "Archives, histoire et explications : apprendre quelque chose donne une raison de rester dans la langue."
        },
        {
          id: "societe",
          title: "Soci\xE9t\xE9 & m\xE9dias",
          icon: "fa-solid fa-newspaper",
          description: "Des formats pour comprendre les conversations, les visages et les sujets du moment."
        },
        {
          id: "fiction",
          title: "Fictions & jeunesse",
          icon: "fa-solid fa-clapperboard",
          description: "Des histoires visuelles qui m\u2019ont permis de comprendre avant de tout savoir traduire."
        },
        {
          id: "quotidien",
          title: "Cuisine & quotidien",
          icon: "fa-solid fa-utensils",
          description: "Le fran\xE7ais dans des gestes et des situations concr\xE8tes : cuisiner, voyager, travailler et vivre."
        },
        {
          id: "sport",
          title: "Basket & mouvement",
          icon: "fa-solid fa-basketball",
          description: "Le terrain, l\u2019entra\xEEnement et l\u2019analyse sportive : des passions qui me font rester longtemps dans le fran\xE7ais."
        }
      ],
      channels: [
        frenchCreator({
          id: "anouk-star-academy-2025",
          name: "Anouk",
          profilePlatform: "instagram",
          profilePic: "images/creators/anouk-star-academy-2025.jpg",
          shortDescription: "La chanteuse belge de la promotion 2025, remarqu\xE9e dans les tableaux o\xF9 l\u2019interpr\xE9tation compte autant que la voix.",
          longDescription: "Originaire de Wanze en Belgique, Anouk Brackelaire Klein s\u2019est distingu\xE9e par des prestations qui passent de la chanson fran\xE7aise \xE0 la pop th\xE9\xE2trale. Ses \xE9valuations, autoportraits et duos donnent \xE0 entendre un fran\xE7ais expressif, souvent m\xEAl\xE9 au vocabulaire du travail vocal, de la sc\xE8ne et des r\xE9p\xE9titions.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "E5WWrQfnVHk", title: "Anouk chante \xAB Aim\xE9e pour de vrai \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/anouklein/" }
        }),
        frenchCreator({
          id: "pierre-garnier",
          name: "Pierre Garnier",
          profilePlatform: "instagram",
          profilePic: "images/creators/pierregarniermusique.jpg",
          shortDescription: "L\u2019artiste derri\xE8re \xAB Ceux qu\u2019on \xE9tait \xBB, la chanson que j\u2019ai choisie pour monter sur sc\xE8ne \xE0 Manille.",
          longDescription: "Pierre Garnier relie pour moi Star Academy \xE0 une chanson devenue un vrai rep\xE8re. Sa voix claire et ses refrains permettent aussi de travailler la compr\xE9hension, la diction et la m\xE9moire sans s\xE9parer musique et apprentissage.",
          aljohnComment: "Chanter \xAB Ceux qu\u2019on \xE9tait \xBB au Grand Karaoke de la Francophonie, devant la communaut\xE9 francophone de Manille, \xE9tait ma mani\xE8re de remercier Pierre et Star Academy pour tout ce qu\u2019ils avaient r\xE9veill\xE9 en moi.",
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "RcFbfDJi3t4", title: "Pierre Garnier raconte les coulisses de son premier album \u2014 BFMTV" },
          links: { instagram: "https://www.instagram.com/pierregarniermusique/", youtube: "https://www.youtube.com/@PierreGarnierVEVO-cf1gi" }
        }),
        frenchCreator({
          id: "helena",
          name: "H\xE9l\xE9na",
          profilePlatform: "instagram",
          profilePic: "images/creators/helena_blly.jpg",
          shortDescription: "Une voix suivie depuis Star Academy, puis retrouv\xE9e dans ses propres chansons et performances.",
          longDescription: "Ses titres prolongent l\u2019histoire apr\xE8s le ch\xE2teau avec une pop intime et des paroles suffisamment nettes pour une \xE9coute attentive. La suivre permet de voir une artiste construire son univers, pas seulement revoir des extraits d\u2019\xE9mission.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "bE7jFJHoHY4", title: "H\xE9l\xE9na \u2014 Aim\xE9e pour de vrai (paroles)" },
          links: { instagram: "https://www.instagram.com/helena_blly/" }
        }),
        frenchCreator({
          id: "lenie",
          name: "L\xE9nie",
          profilePlatform: "instagram",
          profilePic: "images/creators/lenie_v.jpg",
          shortDescription: "Interpr\xE9tation, danse et premiers titres : une artiste dont je continue \xE0 suivre l\u2019\xE9volution apr\xE8s Star Academy.",
          longDescription: "Les performances de L\xE9nie m\xEAlent voix, mouvement et pr\xE9sence sc\xE9nique. Ses reprises puis ses propres chansons offrent plusieurs portes d\u2019entr\xE9e : \xE9motion, vocabulaire des paroles et fran\xE7ais des interviews.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "lKxhTF9RY1g", title: "L\xE9nie \u2014 J\u2019ai plus peur (clip officiel)" },
          links: { instagram: "https://www.instagram.com/lenie_v/", youtube: "https://www.youtube.com/@LenieVEVO" }
        }),
        frenchCreator({
          id: "candice",
          name: "Candice",
          profilePlatform: "instagram",
          profilePic: "images/creators/candiiice-mp3.jpg",
          shortDescription: "Une personnalit\xE9 cr\xE9ative suivie pour ce qu\u2019elle raconte de la musique, des r\xEAves et de l\u2019apr\xE8s-Star Academy.",
          longDescription: "Ses formats longs donnent acc\xE8s \xE0 un fran\xE7ais plus personnel que celui des primes : cr\xE9ation, sant\xE9 mentale, ambitions et travail artistique. Ils demandent davantage d\u2019\xE9coute mais offrent une vraie conversation.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "47nwQEU0O9Q", title: "Candice \u2014 l\u2019interview sans filtre chez POPSLAY" },
          links: { instagram: "https://www.instagram.com/candiiice.mp3/" }
        }),
        frenchCreator({
          id: "marine",
          name: "Marine",
          profilePlatform: "instagram",
          profilePic: "images/creators/marinedmusique.jpg",
          shortDescription: "La gagnante dont je suis maintenant les chansons, les lives et la construction d\u2019un r\xE9pertoire personnel.",
          longDescription: "Entre clips, sessions et interviews, Marine permet de suivre le passage d\u2019une voix de t\xE9l\xE9vision \xE0 une artiste avec ses propres textes. Les refrains donnent un point d\u2019appui accessible avant les conversations plus rapides.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "M4Jjd3pV2t0", title: "Marine \u2014 Ma faute (clip officiel)" },
          links: { instagram: "https://www.instagram.com/marinedmusique/", youtube: "https://www.youtube.com/@MarineVEVO-y7p" }
        }),
        frenchCreator({
          id: "marguerite",
          name: "Marguerite",
          profilePlatform: "instagram",
          profilePic: "images/creators/margueritecommelafleur_.jpg",
          shortDescription: "Une \xE9criture et une identit\xE9 visuelle singuli\xE8res, suivies de l\u2019\xE9mission aux premiers titres personnels.",
          longDescription: "Marguerite propose une pop o\xF9 le texte et le personnage comptent autant que la performance. Ses chansons invitent \xE0 \xE9couter le choix des mots, les r\xE9p\xE9titions et la fa\xE7on de raconter une identit\xE9.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "Ag3E7mJeRYI", title: "Marguerite \u2014 les filles, les meufs" },
          links: { instagram: "https://www.instagram.com/margueritecommelafleur_/", youtube: "https://www.youtube.com/@margueriteVEVO" }
        }),
        frenchCreator({
          id: "ambre-star-academy-2025",
          name: "Ambre",
          profilePlatform: "instagram",
          profilePic: "images/creators/ambre-star-academy-2025.jpg",
          shortDescription: "La gagnante de la promotion 2025, port\xE9e par une voix puissante et une pr\xE9sence tr\xE8s directe sur les grands tableaux.",
          longDescription: "Ambre s\u2019est impos\xE9e au fil des primes par des interpr\xE9tations de vari\xE9t\xE9, des duos et des chansons \xE0 forte amplitude vocale. Suivre son parcours permet de comparer le travail en \xE9valuation, les r\xE9p\xE9titions et la version finale sur sc\xE8ne, avec un fran\xE7ais spontan\xE9 dans les s\xE9quences parl\xE9es et plus articul\xE9 dans les chansons.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "EgbToy8-V8U", title: "Ambre chante \xAB Entrer dans la lumi\xE8re \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/amberjadah/" }
        }),
        frenchCreator({
          id: "bastiaan-star-academy-2025",
          name: "Bastiaan Van Leeuwen",
          profilePlatform: "instagram",
          profilePic: "images/creators/bastiaan-star-academy-2025.jpg",
          shortDescription: "Un interpr\xE8te franco-n\xE9erlandais form\xE9 \xE0 la com\xE9die musicale, \xE0 l\u2019aise dans le chant, la danse et le jeu sc\xE9nique.",
          longDescription: "Bastiaan construit ses prestations comme de v\xE9ritables num\xE9ros : voix, mouvement, intention et narration visuelle avancent ensemble. Ses tableaux chant\xE9s-dans\xE9s et ses autoportraits sont particuli\xE8rement utiles pour entendre le vocabulaire de la com\xE9die musicale et observer comment une performance se transforme entre r\xE9p\xE9tition et prime.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "4Rg0SF78nTk", title: "Bastiaan \u2014 tableau chant\xE9-dans\xE9 sur \xAB Tainted Love \xBB" },
          links: { instagram: "https://www.instagram.com/bastiaanvl/" }
        }),
        frenchCreator({
          id: "ema-star-academy-2025",
          name: "Ema",
          profilePlatform: "instagram",
          profilePic: "images/creators/ema-star-academy-2025.jpg",
          shortDescription: "Une voix pop de la promotion 2025, pr\xE9sente dans les duos acoustiques et les r\xE9cits chant\xE9s de la vie au ch\xE2teau.",
          longDescription: "Ema Cereghino alterne chansons, duos et formats o\xF9 elle raconte la semaine en musique. Cette combinaison fait passer d\u2019un texte pr\xE9par\xE9 \xE0 des r\xE9actions beaucoup plus spontan\xE9es, avec un vocabulaire centr\xE9 sur la vie collective, les r\xE9p\xE9titions et la pression du prime.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "YvZCR_gSTj4", title: "Ema chante sa semaine au ch\xE2teau \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/thereal_emaa/" }
        }),
        frenchCreator({
          id: "emma-star-academy-2024",
          name: "Emma",
          profilePlatform: "instagram",
          profilePic: "images/creators/emma-star-academy-2024.jpg",
          shortDescription: "Une voix pop r\xE9v\xE9l\xE9e dans la promotion 2024, d\xE9sormais port\xE9e par ses propres chansons et son projet \xAB L\u2019Amour reste \xBB.",
          longDescription: "Emma Broyon a prolong\xE9 son passage au ch\xE2teau avec des titres personnels et un univers pop centr\xE9 sur les relations, la m\xE9moire et ce qui demeure apr\xE8s une rupture. Ses clips et sessions officielles offrent des paroles nettes, tandis que ses prises de parole montrent le passage de candidate \xE0 artiste autonome.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "oc4Y9I5rWsk", title: "Emma \u2014 L\u2019Amour reste" },
          links: { instagram: "https://www.instagram.com/emmaaamusic__/", youtube: "https://www.youtube.com/@emmaaamusic663" }
        }),
        frenchCreator({
          id: "lea-star-academy-2025",
          name: "L\xE9a Doffey",
          profilePlatform: "instagram",
          profilePic: "images/creators/lea-star-academy-2025.jpg",
          shortDescription: "Finaliste de la promotion 2025, avec une voix ample et des autoportraits construits comme de petits r\xE9cits musicaux.",
          longDescription: "L\xE9a alterne grandes ballades, titres pop et medleys autobiographiques. Ses passages dans l\u2019\xE9mission associent chansons, commentaires des professeurs et moments de pr\xE9paration : un ensemble riche pour travailler la compr\xE9hension d\u2019un fran\xE7ais \xE9motionnel, rapide et tr\xE8s li\xE9 au vocabulaire de la sc\xE8ne.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "V9_XFVAj11w", title: "L\u2019autoportrait de L\xE9a \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/lea.doffey/" }
        }),
        frenchCreator({
          id: "victor-star-academy-2025",
          name: "Victor Aupecle",
          profilePlatform: "instagram",
          profilePic: "images/creators/victor-star-academy-2025.jpg",
          shortDescription: "Demi-finaliste au profil de com\xE9die musicale, pr\xE9cis dans les grands standards comme dans les tableaux narratifs.",
          longDescription: "Avant l\u2019\xE9mission, Victor est pass\xE9 par la mode, la com\xE9die musicale et une \xE9cole de musique. Cette formation se retrouve dans son attention au personnage, \xE0 la diction et au mouvement. Ses prestations vont du standard international aux duos de vari\xE9t\xE9 et offrent un bon point d\u2019entr\xE9e vers le fran\xE7ais des retours de jury.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "iFib1UUmk2E", title: "Victor chante \xAB My Way \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/victor.apcoff/" }
        }),
        frenchCreator({
          id: "theo-pasquet",
          name: "Th\xE9o Pasquet",
          profilePlatform: "instagram",
          profilePic: "images/creators/theo-pasquet.jpg",
          shortDescription: "Une voix pop acoustique entendue en duo, au piano et dans des tableaux o\xF9 la progression reste visible.",
          longDescription: "Th\xE9o Pasquet a travers\xE9 la promotion 2025 avec des duos, des reprises acoustiques et des exercices chant\xE9s-dans\xE9s. Le contraste entre les chansons anglaises, les titres de vari\xE9t\xE9 fran\xE7aise et les \xE9changes au ch\xE2teau permet de travailler plusieurs vitesses d\u2019\xE9coute sans quitter le m\xEAme parcours.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "0lCbXDbOk6k", title: "Th\xE9o P. chante \xAB Perfect Duet \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/theo_psqt/" }
        }),
        frenchCreator({
          id: "melissa-star-academy-2025",
          name: "M\xE9lissa Fesch",
          profilePlatform: "instagram",
          profilePic: "images/creators/melissa-star-academy-2025.jpg",
          shortDescription: "Une interpr\xE8te au timbre imm\xE9diatement reconnaissable, suivie dans les battles, les duos et les chansons \xE0 texte.",
          longDescription: "M\xE9lissa s\u2019est illustr\xE9e sur des r\xE9pertoires tr\xE8s diff\xE9rents, de Stromae \xE0 Superbus et Hoshi. Ses prestations mettent l\u2019accent sur l\u2019interpr\xE9tation des paroles et sur la fa\xE7on de d\xE9fendre une chanson dans un temps court, tandis que les s\xE9quences de pr\xE9paration font entendre un fran\xE7ais beaucoup plus spontan\xE9.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "QeT_m6Dk-Nk", title: "M\xE9lissa chante \xAB Formidable \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/melissaditquoi/" }
        }),
        frenchCreator({
          id: "jeanne-star-academy-2025",
          name: "Jeanne Viard",
          profilePlatform: "instagram",
          profilePic: "images/creators/jeanne-star-academy-2025.jpg",
          shortDescription: "Une voix de chanson fran\xE7aise suivie dans les solos, les duos et les exercices d\u2019interpr\xE9tation de la promotion 2025.",
          longDescription: "Jeanne aborde la sc\xE8ne avec un r\xE9pertoire o\xF9 le texte reste central. Les primes permettent d\u2019entendre sa diction sur des chansons narratives, tandis que les quotidiennes et \xE9valuations montrent le travail de respiration, d\u2019intention et de pr\xE9sence demand\xE9 avant la performance finale.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "Fv0NPWNeWHU", title: "Jeanne chante \xAB Une autre histoire \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/jeanne.viard/" }
        }),
        frenchCreator({
          id: "leo-star-academy-2025",
          name: "L\xE9o / Lowey",
          profilePlatform: "instagram",
          profilePic: "images/creators/leo-star-academy-2025.jpg",
          shortDescription: "Un profil pop-rock de la promotion 2025, retrouv\xE9 dans des duos de groupe et des interpr\xE9tations tr\xE8s visuelles.",
          longDescription: "Sous son nom public Lowey, L\xE9o Lefebvre prolonge un go\xFBt marqu\xE9 pour la pop et le rock. Dans Star Academy, ses duos avec des groupes comme Kyo donnent un cadre musical clair, tandis que les \xE9changes avant et apr\xE8s la sc\xE8ne exposent un fran\xE7ais familier, rapide et riche en r\xE9actions.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "_DtMRhX5OW8", title: "L\xE9o et Kyo chantent \xAB Le Graal \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/imlowey/" }
        }),
        frenchCreator({
          id: "lily-star-academy-2025",
          name: "Lily Campana",
          profilePlatform: "instagram",
          profilePic: "images/creators/lily-star-academy-2025.jpg",
          shortDescription: "Chanteuse et guitariste marseillaise, entre vari\xE9t\xE9 fran\xE7aise, pop anglo-saxonne, funk et soul.",
          longDescription: "Lily chante depuis l\u2019enfance et joue de la guitare depuis ses premi\xE8res ann\xE9es. Ses prestations m\xEAlent \xE9nergie de groupe, accompagnement instrumental et influences pop-soul. Les chansons offrent des refrains accessibles ; les d\xE9briefs et r\xE9p\xE9titions demandent une \xE9coute plus avanc\xE9e du fran\xE7ais parl\xE9.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "Dv7j2spP1wQ", title: "Lily chante \xAB Messy \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/lily_campaa/" }
        }),
        frenchCreator({
          id: "theo-laurent",
          name: "Th\xE9o Laurent",
          profilePlatform: "instagram",
          profilePic: "images/creators/theo-laurent.jpg",
          shortDescription: "Le \xAB Th\xE9o L. \xBB de la promotion 2025, actif dans les reprises, les rencontres publiques et la pr\xE9paration de ses propres projets.",
          longDescription: "Th\xE9o Laurent s\u2019est fait conna\xEEtre par des prestations de vari\xE9t\xE9, des duos et un personnage sc\xE9nique tr\xE8s spontan\xE9. Apr\xE8s le ch\xE2teau, il partage des reprises et construit son identit\xE9 d\u2019artiste. Ses interviews sont utiles pour entendre un fran\xE7ais naturel autour du parcours, du nom de sc\xE8ne et de l\u2019apr\xE8s-\xE9mission.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "mVpK3x5riBE", title: "Le Flashback de Th\xE9o L. \u2014 NRJ" },
          links: { instagram: "https://www.instagram.com/theomusiqueoff/" }
        }),
        frenchCreator({
          id: "leane-star-academy-2025",
          name: "L\xE9ane N\u2019Gangue",
          profilePlatform: "instagram",
          profilePic: "images/creators/leane-star-academy-2025.jpg",
          shortDescription: "Une artiste de la promotion 2025 qui relie danse, chant et pr\xE9cision chor\xE9graphique dans le m\xEAme tableau.",
          longDescription: "L\xE9ane s\u2019est particuli\xE8rement distingu\xE9e dans les exercices chant\xE9s-dans\xE9s, o\xF9 le souffle, le rythme et l\u2019expression doivent rester lisibles en m\xEAme temps. Ses r\xE9p\xE9titions permettent d\u2019entendre le vocabulaire concret de la chor\xE9graphie ; le prime montre ensuite comment ces consignes deviennent une performance compl\xE8te.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "YLEam9DrSPA", title: "L\xE9ane chante et danse sur \xAB Please Don\u2019t Stop the Music \xBB" },
          links: { instagram: "https://www.instagram.com/leanenganguee/" }
        }),
        frenchCreator({
          id: "noah-star-academy-2025",
          name: "Noah",
          profilePlatform: "instagram",
          profilePic: "images/creators/noah-star-academy-2025.jpg",
          shortDescription: "Une voix de ballade de la promotion 2025, entendue dans les solos sensibles et les prestations collectives.",
          longDescription: "Noah s\u2019est pr\xE9sent\xE9 au public avec un r\xE9pertoire port\xE9 par l\u2019\xE9motion et des m\xE9lodies tr\xE8s lisibles. Les chansons lentes facilitent le rep\xE9rage des paroles, alors que les retours de professeurs et les s\xE9quences de groupe introduisent un fran\xE7ais plus rapide et moins pr\xE9visible.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "GxcUg4vg8MY", title: "Noah chante \xAB Des milliers de je t\u2019aime \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/no.moremusic/" }
        }),
        frenchCreator({
          id: "lenny-dervis",
          name: "Lenny Dervis",
          profilePlatform: "instagram",
          profilePic: "images/creators/lenny-dervis.jpg",
          shortDescription: "Un profil pop de la promotion 2025, d\xE9couvert dans des duos o\xF9 la voix et la complicit\xE9 restent au premier plan.",
          longDescription: "Lenny a \xE9t\xE9 pr\xE9sent\xE9 \xE0 travers des duos acoustiques et des reprises pop, des formats courts qui rendent la structure de la chanson facile \xE0 suivre. Les \xE9changes de r\xE9p\xE9tition ajoutent le vocabulaire du placement vocal, de l\u2019harmonie et de la collaboration entre interpr\xE8tes.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "Z_3uSr9-CKk", title: "Lenny et Ema chantent \xAB Love Yourself \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/lennydervis/" }
        }),
        frenchCreator({
          id: "mehdi-patritti",
          name: "Mehdi Patritti",
          profilePlatform: "instagram",
          profilePic: "images/creators/mehdi-patritti.jpg",
          shortDescription: "Une voix de la promotion 2025 suivie dans les \xE9valuations et les chansons o\xF9 l\u2019interpr\xE9tation doit d\xE9fendre chaque mot.",
          longDescription: "Mehdi travaille surtout sur des ballades et des titres \xE0 forte charge \xE9motionnelle. Les commentaires des professeurs mettent en lumi\xE8re le rapport entre justesse, intention et pr\xE9sence sc\xE9nique, ce qui rend ses s\xE9quences int\xE9ressantes pour comprendre le fran\xE7ais du coaching artistique.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "hhfmbJ9utvM", title: "Mehdi chante \xAB Ind\xE9l\xE9bile \xBB \u2014 Star Academy 2025" },
          links: { instagram: "https://www.instagram.com/mehdipatritti_/" }
        }),
        frenchCreator({
          id: "charles-dore",
          name: "Charles Dor\xE9",
          profilePlatform: "instagram",
          profilePic: "images/creators/charles-dore.jpg",
          shortDescription: "Le demi-finaliste breton de 2024, aujourd\u2019hui dans une pop o\xF9 la fragilit\xE9 des textes rencontre une voix tr\xE8s ample.",
          longDescription: "Charles Dor\xE9 d\xE9veloppe depuis l\u2019\xE9mission un r\xE9pertoire personnel avec \xAB Je pars mais je reste \xBB et \xAB Si demain tout s\u2019arr\xEAte \xBB. Ses clips, concerts et retours comme invit\xE9 sur les primes permettent de comparer chanson enregistr\xE9e, performance en direct et fran\xE7ais d\u2019interview.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "GYbiI-41zEM", title: "Charles Dor\xE9 accompagne Ambre et Sarah sur \xAB Skyfall \xBB" },
          links: { instagram: "https://www.instagram.com/charlesdore/", youtube: "https://www.youtube.com/@charlesdoreofficiel" }
        }),
        frenchCreator({
          id: "franck-lenar",
          name: "Franck Lenar",
          profilePlatform: "instagram",
          profilePic: "images/creators/franck-lenar.jpg",
          shortDescription: "Demi-finaliste de la promotion 2024, suivi pour ses grandes interpr\xE9tations et ses premiers titres apr\xE8s le ch\xE2teau.",
          longDescription: "Franck Lenar s\u2019est fait remarquer par des prestations vocales exigeantes, des duos et un registre tr\xE8s expressif. Depuis la tourn\xE9e, il poursuit ses projets musicaux et a pr\xE9sent\xE9 notamment \xAB Morpheus \xBB. Ses performances sont adapt\xE9es \xE0 une \xE9coute attentive de la diction, des nuances et des retours de sc\xE8ne.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "ohAe50qIiSQ", title: "Franck, Ebony et Marguerite reprennent Billie Eilish" },
          links: { instagram: "https://www.instagram.com/francklenar/" }
        }),
        frenchCreator({
          id: "ulysse-saragas",
          name: "Ulysse Saragas",
          profilePlatform: "instagram",
          profilePic: "images/creators/ulysse-saragas.jpg",
          shortDescription: "Le profil rock marseillais de la promotion 2024, d\xE9sormais auteur de chansons publi\xE9es sur sa cha\xEEne officielle.",
          longDescription: "Ulysse Saragas associe guitare, \xE9nergie rock et textes personnels. Apr\xE8s la tourn\xE9e Star Academy, il a publi\xE9 ses propres titres, dont \xAB Si demain \xBB et \xAB Le trottoir d\u2019en face \xBB. Son catalogue permet de passer des reprises t\xE9l\xE9vis\xE9es \xE0 un univers d\u2019auteur-compositeur plus intime.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "ueJpKSALQvE", title: "Ulysse \u2014 Si demain" },
          links: { instagram: "https://www.instagram.com/ulyssesaragasmusic/", youtube: "https://www.youtube.com/@ulyssesaragasmusic" }
        }),
        frenchCreator({
          id: "axel-marbeuf",
          name: "Axel Marbeuf",
          profilePlatform: "instagram",
          profilePic: "images/creators/axel-marbeuf.jpg",
          shortDescription: "Le demi-finaliste de 2023 devenu chanteur pop, auteur de plusieurs singles et interpr\xE8te de com\xE9die musicale.",
          longDescription: "Axel Marbeuf a quitt\xE9 son m\xE9tier d\u2019ing\xE9nieur chimiste pour d\xE9velopper un projet musical nourri par le piano, la guitare et l\u2019\xE9criture. Ses singles \xAB Pour la premi\xE8re fois \xBB, \xAB Depuis toi \xBB et \xAB Tu m\u2019entendras \xBB privil\xE9gient des refrains directs et une diction claire, compl\xE9t\xE9s par son travail sur sc\xE8ne.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "oIUdxr1mOFo", title: "Axel Marbeuf \u2014 Tu m\u2019entendras" },
          links: { instagram: "https://www.instagram.com/axel.marbeuf/", youtube: "https://www.youtube.com/channel/UC0LwkWEW38Sl-qVNXqwgSiQ" }
        }),
        frenchCreator({
          id: "julien-lieb",
          name: "Julien Lieb",
          profilePlatform: "instagram",
          profilePic: "images/creators/julien-lieb.jpg",
          shortDescription: "Finaliste de la promotion 2023, devenu auteur-interpr\xE8te d\u2019une pop dramatique et tr\xE8s narrative.",
          longDescription: "Julien Lieb construit ses chansons autour de tensions, de choix et de r\xE9cits personnels. Des titres comme \xAB Le Jeu \xBB et \xAB Autrement \xBB combinent une production pop ample avec des paroles nettement articul\xE9es. Ses clips et interviews permettent de suivre la fabrication d\u2019une identit\xE9 artistique apr\xE8s l\u2019\xE9mission.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "5oGxF91pH4Q", title: "Julien Lieb \u2014 Le Jeu" },
          links: { instagram: "https://www.instagram.com/julien__lieb/", youtube: "https://www.youtube.com/@JulienLiebVEVO" }
        }),
        frenchCreator({
          id: "victorien",
          name: "Victorien",
          profilePlatform: "instagram",
          profilePic: "images/creators/victorien.jpg",
          shortDescription: "Un auteur-compositeur r\xE9v\xE9l\xE9 en 2023, entre chanson, pop et passages presque parl\xE9s.",
          longDescription: "Victorien Breux a d\xE9velopp\xE9 avec l\u2019EP \xAB Me Voil\xE0 \xBB un univers d\u2019auteur o\xF9 les r\xE9cits personnels, le slam et la chanson fran\xE7aise se rencontrent. Ses clips mettent les mots au premier plan et ses formats live montrent comment il transforme des textes intimes en pr\xE9sence sc\xE9nique.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "mlrmZ4-2QpY", title: "Victorien \u2014 Comme un enfant" },
          links: { instagram: "https://www.instagram.com/victorienbrx/", youtube: "https://www.youtube.com/@VictorienMusicOff" }
        }),
        frenchCreator({
          id: "enola-cox",
          name: "Enola Cox",
          profilePlatform: "instagram",
          profilePic: "images/creators/enola-cox.jpg",
          shortDescription: "Finaliste de la promotion 2022, avec un univers qui m\xEAle pop, rock, \xE9lectronique et formation de com\xE9die musicale.",
          longDescription: "Form\xE9e au chant, au th\xE9\xE2tre et \xE0 la com\xE9die musicale, Enola Cox poursuit depuis l\u2019\xE9mission une \xE9criture sombre et \xE9motionnelle pens\xE9e pour la sc\xE8ne. L\u2019EP \xAB M\xE9moire d\u2019un \xE9t\xE9 \xBB puis ses singles montrent un travail d\u2019autrice-interpr\xE8te, tandis que ses vid\xE9os de cr\xE9ation d\xE9taillent en fran\xE7ais la naissance de ses chansons.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["star-academy-alumni"],
          sampleVideo: { id: "pfDiAB_6Ctg", title: "Enola Cox raconte la cr\xE9ation de ses chansons" },
          links: { instagram: "https://www.instagram.com/enolacox/", youtube: "https://www.youtube.com/@EnolaCox" }
        }),
        frenchCreator({
          id: "vianney",
          name: "Vianney",
          profilePlatform: "instagram",
          profilePic: "images/creators/vianney.jpg",
          shortDescription: "Un auteur-compositeur suivi dans ses clips, ses reprises, ses duos et ses passages de transmission \xE0 la t\xE9l\xE9vision.",
          longDescription: "Vianney \xE9crit dans un fran\xE7ais direct o\xF9 les images restent accessibles. Ses collaborations et ses prestations live permettent d\u2019entendre le m\xEAme univers dans plusieurs registres, de la chanson \xE0 la conversation.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites"],
          sampleVideo: { id: "2szqiHykCJk", title: "Vianney \u2014 Pour de vrai (clip officiel)" },
          links: { instagram: "https://www.instagram.com/vianney/", youtube: "https://www.youtube.com/@vianneymusique" }
        }),
        frenchCreator({
          id: "louane",
          name: "Louane",
          profilePlatform: "instagram",
          profilePic: "images/creators/watchoutforthetornado.jpg",
          shortDescription: "De The Voice \xE0 l\u2019Eurovision, une trajectoire que je suis \xE0 travers les chansons et les grandes sc\xE8nes.",
          longDescription: "Louane offre une discographie o\xF9 la narration intime et les refrains m\xE9morables facilitent la r\xE9\xE9coute. Ses interviews et prestations font aussi entendre le fran\xE7ais naturel derri\xE8re la chanteuse.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites"],
          sampleVideo: { id: "Pj2DTSLcNnI", title: "Louane \u2014 maman, performance Eurovision 2025" },
          links: { instagram: "https://www.instagram.com/watchoutforthetornado/" }
        }),
        frenchCreator({
          id: "joyce-jonathan",
          name: "Joyce Jonathan",
          profilePlatform: "instagram",
          profilePic: "images/creators/joycejonathan.jpg",
          shortDescription: "Une chanson pop acoustique o\xF9 les relations, les choix et les \xE9motions se racontent avec une diction tr\xE8s nette.",
          longDescription: "Son r\xE9pertoire associe phrases quotidiennes, histoires sentimentales et m\xE9lodies faciles \xE0 reprendre. C\u2019est une bonne passerelle pour \xE9couter des paroles compl\xE8tes sans que la langue disparaisse derri\xE8re la production.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites"],
          sampleVideo: { id: "46yPGJCeJq4", title: "Joyce Jonathan \u2014 Tant pis (clip officiel)" },
          links: { instagram: "https://www.instagram.com/joycejonathan/" }
        }),
        frenchCreator({
          id: "star-academy",
          name: "Star Academy Officiel",
          profilePic: "images/creators/star-academy-officiel.jpg",
          shortDescription: "Mon rendez-vous du dimanche \xE0 3 h du matin aux Philippines \u2014 et bien plus qu\u2019une \xE9mission musicale.",
          longDescription: "Le direct r\xE9unit chansons, r\xE9p\xE9titions, \xE9valuations et vie au ch\xE2teau. Ce m\xE9lange fait travailler l\u2019oreille avec des voix diff\xE9rentes, mais ce qui me touche surtout est de voir des jeunes consacrer tout leur temps \xE0 progresser.",
          aljohnComment: "Je me r\xE9veille \xE0 3 h chaque week-end pour ne pas manquer le direct. Le ch\xE2teau me rappelle mes propres ann\xE9es enferm\xE9 dans ma chambre \xE0 apprendre les langues : le m\xEAme sacrifice, la m\xEAme obsession de progresser, et le r\xEAve de monter un jour sur sc\xE8ne.",
          levels: ["B1", "B2", "C1"],
          categories: ["musique"],
          sampleVideo: { id: "WUnNai_rM4Q", title: "Une performance de Star Academy gard\xE9e dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@StarAcademy", instagram: "https://www.instagram.com/staracademytf1/" }
        }),
        frenchCreator({
          id: "voice-kids-france",
          name: "The Voice Kids France",
          profilePic: "images/creators/voice-kids-france.jpg",
          shortDescription: "Des auditions et duos courts o\xF9 une chanson devient imm\xE9diatement un exercice d\u2019\xE9coute charg\xE9 d\u2019\xE9motion.",
          longDescription: "Les prestations sont assez br\xE8ves pour \xEAtre revues plusieurs fois. Comme le contexte est clair \u2014 une voix, un choix de chanson, une r\xE9action \u2014 on peut se concentrer sur les paroles et les commentaires du jury.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["musique"],
          sampleVideo: { id: "NDsHUimHPhk", title: "Une audition de The Voice Kids France dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@TheVoiceKidsFrance" }
        }),
        frenchCreator({
          id: "the-voice-france",
          name: "The Voice : la plus belle voix",
          profilePic: "images/creators/the-voice-france.jpg",
          shortDescription: "Des voix, des r\xE9arrangements et des artistes que je retrouve ensuite ailleurs dans la chanson fran\xE7aise.",
          longDescription: "La cha\xEEne permet de comparer une chanson connue \xE0 une nouvelle interpr\xE9tation puis d\u2019\xE9couter les \xE9changes du jury. Elle relie musique populaire, d\xE9couverte d\u2019artistes et fran\xE7ais spontan\xE9.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["musique"],
          sampleVideo: { id: "Sc2lZb8vGMg", title: "Une prestation de The Voice France dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@thevoicetf1" }
        }),
        frenchCreator({
          id: "cyprien",
          name: "Cyprien",
          profilePic: "images/creators/cyprien.jpg",
          shortDescription: "Sketches, courts-m\xE9trages et personnages qui transforment les habitudes du quotidien en com\xE9die tr\xE8s \xE9crite.",
          longDescription: "Ses vid\xE9os condensent beaucoup de r\xE9f\xE9rences, de rythme comique et de fran\xE7ais parl\xE9. Elles deviennent plus riches \xE0 chaque retour, surtout quand on commence \xE0 saisir les sous-entendus et le montage.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["humour"],
          sampleVideo: { id: "s-gsIESfkUA", title: "Un sketch de Cyprien gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@cyprien", instagram: "https://www.instagram.com/6pri1/" }
        }),
        frenchCreator({
          id: "michou",
          name: "Michou",
          profilePic: "images/creators/michou.jpg",
          shortDescription: "D\xE9fis, collaborations et conversations tr\xE8s actuelles pour entendre le fran\xE7ais rapide d\u2019une g\xE9n\xE9ration YouTube.",
          longDescription: "Le vocabulaire n\u2019est pas gradu\xE9 et les \xE9changes vont vite, mais les situations restent tr\xE8s visuelles. C\u2019est une immersion utile pour l\u2019argot, les r\xE9actions et les fa\xE7ons de parler entre amis.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["humour"],
          sampleVideo: { id: "2llZFF7Pz5Y", title: "Une vid\xE9o de Michou gard\xE9e dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@Michou", instagram: "https://www.instagram.com/michou/" }
        }),
        frenchCreator({
          id: "mastu",
          name: "Mastu",
          profilePic: "images/creators/mastu.jpg",
          shortDescription: "Histoires, concepts et autod\xE9rision dans un fran\xE7ais contemporain soutenu par le montage.",
          longDescription: "Les images et les situations donnent assez de contexte pour suivre m\xEAme quand certaines expressions \xE9chappent. Ses vid\xE9os permettent de s\u2019habituer \xE0 une narration spontan\xE9e et tr\xE8s orale.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["humour"],
          sampleVideo: { id: "Lhqh1CCWMCk", title: "Une vid\xE9o de Mastu gard\xE9e dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@Mastu", instagram: "https://www.instagram.com/mastuu_/" }
        }),
        frenchCreator({
          id: "mcfly-carlito",
          name: "Mcfly et Carlito",
          profilePic: "images/creators/mcfly-carlito.jpg",
          shortDescription: "Un duo o\xF9 l\u2019humour, la musique et les invit\xE9s produisent beaucoup de fran\xE7ais improvis\xE9.",
          longDescription: "Leurs concepts cr\xE9ent de longues interactions avec des voix et des registres diff\xE9rents. C\u2019est exigeant, mais id\xE9al pour \xE9couter les interruptions, les blagues et les r\xE9actions r\xE9elles.",
          aljohnComment: null,
          levels: ["B2", "C1", "C2"],
          categories: ["humour"],
          sampleVideo: { id: "t4h8j9xLyxQ", title: "Une vid\xE9o de Mcfly et Carlito gard\xE9e dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@LeFatShow" }
        }),
        frenchCreator({
          id: "kevin-tran",
          name: "Kevin Tran",
          profilePic: "images/creators/kevin-tran.jpg",
          shortDescription: "Humour, r\xE9cits et culture internet avec un point de vue franco-asiatique que je reconnais imm\xE9diatement.",
          longDescription: "Ses vid\xE9os passent du sketch au r\xE9cit personnel et donnent acc\xE8s \xE0 un fran\xE7ais familier riche en r\xE9f\xE9rences. Le contexte culturel ajoute une autre couche \xE0 l\u2019\xE9coute.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["humour"],
          sampleVideo: { id: "NNP-x5vgDss", title: "Une vid\xE9o de Kevin Tran gard\xE9e dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@superkevintran" }
        }),
        frenchCreator({
          id: "french-mornings-elisa",
          name: "French mornings with Elisa",
          profilePic: "images/creators/french-mornings-elisa.jpg",
          shortDescription: "Des explications courtes et naturelles que je peux glisser dans une journ\xE9e ordinaire.",
          longDescription: "Elisa part de phrases r\xE9ellement utilis\xE9es et explique la nuance sans alourdir le format. Ses contenus sont assez courts pour \xEAtre revus, mais assez naturels pour rester proches d\u2019une vraie conversation.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["apprentissage"],
          sampleVideo: { id: "u3HeLlgW4sM", title: "Une le\xE7on courte de French mornings with Elisa" },
          links: { youtube: "https://www.youtube.com/@FrenchmorningswithElisa", instagram: "https://www.instagram.com/frenchmorningswithelisa/" }
        }),
        frenchCreator({
          id: "innerfrench",
          name: "innerFrench",
          profilePic: "images/creators/innerfrench.jpg",
          shortDescription: "Le pont que je garde entre contenu p\xE9dagogique et sujets assez int\xE9ressants pour oublier le cours.",
          longDescription: "Le d\xE9bit est clair sans \xEAtre artificiel, et les \xE9pisodes d\xE9veloppent de vraies id\xE9es culturelles ou sociales. C\u2019est une ressource solide pour quitter progressivement les contenus de d\xE9butant.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["apprentissage"],
          sampleVideo: { id: "BsUTTchvpEA", title: "Une vid\xE9o de innerFrench gard\xE9e dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@innerFrench" }
        }),
        frenchCreator({
          id: "easy-french",
          name: "Easy French",
          profilePic: "images/creators/easy-french.jpg",
          shortDescription: "Des francophones dans la rue, des sous-titres et des r\xE9ponses qu\u2019aucun manuel ne peut pr\xE9voir.",
          longDescription: "Les micro-trottoirs font entendre des accents, h\xE9sitations et opinions vari\xE9s. Les sous-titres bilingues aident \xE0 entrer dans le sens avant de r\xE9\xE9couter uniquement en fran\xE7ais.",
          aljohnComment: "Je cherche souvent la version Easy Languages quand j\u2019aborde une langue. Ici, les vraies voix dans la rue m\u2019aident \xE0 relier le fran\xE7ais appris au fran\xE7ais v\xE9cu.",
          levels: ["A2", "B1", "B2"],
          categories: ["apprentissage"],
          sampleVideo: { id: "Av69JMCJSzQ", title: "Un micro-trottoir de Easy French" },
          links: { youtube: "https://www.youtube.com/@EasyFrench" }
        }),
        frenchCreator({
          id: "piece-of-french",
          name: "Piece of French",
          profilePic: "images/creators/piece-of-french.jpg",
          shortDescription: "Des vlogs accessibles o\xF9 le fran\xE7ais accompagne une personne, un lieu et une vraie journ\xE9e.",
          longDescription: "Le format vlog donne une continuit\xE9 visuelle qui facilite la compr\xE9hension. Les explications restent pr\xE9sentes, mais la langue est attach\xE9e \xE0 la vie quotidienne plut\xF4t qu\u2019\xE0 une suite de r\xE8gles.",
          aljohnComment: "Je la garde pour les jours o\xF9 je veux apprendre sans sentir que je suis assis devant une le\xE7on. Le r\xE9cit et les lieux portent le vocabulaire.",
          levels: ["A2", "B1", "B2"],
          categories: ["apprentissage"],
          sampleVideo: { id: "j4WbtdcOg9Y", title: "Un vlog de Piece of French gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@pieceoffrench" }
        }),
        frenchCreator({
          id: "loic-suberville",
          name: "Lo\xEFc Suberville",
          profilePic: "images/creators/loic-suberville.jpg",
          shortDescription: "La langue expliqu\xE9e par ses absurdit\xE9s, avec humour, personnages et comparaisons entre idiomes.",
          longDescription: "Ses sketches rendent visibles les bizarreries du fran\xE7ais et les \xE9carts entre traduction litt\xE9rale et usage. Le format court donne envie de v\xE9rifier une nuance puis de la partager.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["apprentissage"],
          sampleVideo: { id: "ge31bnYVODk", title: "Une capsule de Lo\xEFc Suberville sur les langues" },
          links: { youtube: "https://www.youtube.com/@loic.suberville" }
        }),
        frenchCreator({
          id: "ina-societe",
          name: "INA Soci\xE9t\xE9",
          profilePic: "images/creators/ina-societe.jpg",
          shortDescription: "Des archives o\xF9 l\u2019on entend la France se raconter \xE0 diff\xE9rentes \xE9poques, sans filtre r\xE9trospectif.",
          longDescription: "Interviews, reportages et d\xE9bats anciens donnent acc\xE8s au vocabulaire, aux voix et aux pr\xE9occupations d\u2019un autre moment. C\u2019est une ressource culturelle autant qu\u2019un entra\xEEnement d\u2019\xE9coute.",
          aljohnComment: "Je reviens \xE0 ces archives pour comprendre la soci\xE9t\xE9 derri\xE8re la langue. Une voix, une rue ou une \xE9mission ancienne me donne souvent le contexte qu\u2019une d\xE9finition ne peut pas donner.",
          levels: ["B2", "C1", "C2"],
          categories: ["culture"],
          sampleVideo: { id: "iBwL3uTx0RU", title: "Une archive de INA Soci\xE9t\xE9 gard\xE9e dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@Inasociete" }
        }),
        frenchCreator({
          id: "jamy-epicurieux",
          name: "Jamy \u2014 Epicurieux",
          profilePic: "images/creators/jamy-epicurieux.jpg",
          shortDescription: "Des questions concr\xE8tes expliqu\xE9es avec la p\xE9dagogie et la curiosit\xE9 de Jamy.",
          longDescription: "Chaque \xE9pisode part d\u2019un ph\xE9nom\xE8ne visible et construit une explication claire. Les images, objets et d\xE9monstrations donnent de nombreux indices m\xEAme lorsque le vocabulaire devient technique.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["culture"],
          sampleVideo: { id: "7S05NGojkuc", title: "Une explication de Jamy \u2014 Epicurieux" },
          links: { youtube: "https://www.youtube.com/@JamyEpicurieux" }
        }),
        frenchCreator({
          id: "cesar-culture-g",
          name: "C\xE9sar \u2014 Culture G",
          profilePic: "images/creators/cesar-culture-g.jpg",
          shortDescription: "Des histoires et curiosit\xE9s racont\xE9es vite, avec assez d\u2019images pour garder le fil.",
          longDescription: "Le format va droit au fait et rassemble vocabulaire historique, noms propres et narration. Il convient bien \xE0 une \xE9coute active courte, suivie d\u2019une seconde lecture avec sous-titres.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["culture"],
          sampleVideo: { id: "WnUG7ptR22Y", title: "Une histoire de C\xE9sar \u2014 Culture G" },
          links: { youtube: "https://www.youtube.com/@Cesar_CultureG" }
        }),
        frenchCreator({
          id: "avre",
          name: "AVRE \u2014 Explore Media",
          profilePic: "images/creators/avre.jpg",
          shortDescription: "Des lieux, m\xE9tiers et ph\xE9nom\xE8nes observ\xE9s de pr\xE8s dans des formats visuels tr\xE8s soign\xE9s.",
          longDescription: "Les reportages donnent un contexte fort au vocabulaire et alternent narration, t\xE9moignages et images de terrain. Ils permettent d\u2019entrer dans un sujet avant d\u2019en ma\xEEtriser chaque mot.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["culture"],
          sampleVideo: { id: "1uJAC12WxxU", title: "Un reportage AVRE gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@avre_fr" }
        }),
        frenchCreator({
          id: "le-parisien",
          name: "Le Parisien",
          profilePic: "images/creators/le-parisien.jpg",
          shortDescription: "Actualit\xE9, terrain et culture populaire dans des formats qui documentent le fran\xE7ais du moment.",
          longDescription: "La cha\xEEne passe du reportage court \xE0 l\u2019entretien et couvre aussi les artistes que je suis. Elle expose \xE0 des voix vari\xE9es, \xE0 du vocabulaire actuel et \xE0 des sujets dont le contexte est souvent d\xE9j\xE0 visible.",
          aljohnComment: "Le Parisien me sert souvent de pont entre une actualit\xE9 fran\xE7aise et les artistes ou ph\xE9nom\xE8nes que je suis d\xE9j\xE0. Je commence par un visage connu, puis le sujet s\u2019\xE9largit.",
          levels: ["B2", "C1", "C2"],
          categories: ["societe"],
          sampleVideo: { id: "k-PKGBBt0Ck", title: "Un reportage du Parisien gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@LeParisien" }
        }),
        frenchCreator({
          id: "konbini",
          name: "Konbini",
          profilePic: "images/creators/konbini.jpg",
          shortDescription: "Interviews, archives personnelles et formats courts autour de la musique, du cin\xE9ma et de la culture pop.",
          longDescription: "Les r\xE9ponses rapides, portraits et archives personnelles donnent acc\xE8s \xE0 un fran\xE7ais direct. Le vocabulaire change avec chaque invit\xE9, mais la structure des formats aide \xE0 anticiper les questions.",
          aljohnComment: "Je regarde surtout Konbini autour de la musique et des artistes. Une personne que j\u2019aime m\u2019emm\xE8ne alors vers une nouvelle conversation et un registre plus spontan\xE9.",
          levels: ["B1", "B2", "C1"],
          categories: ["societe"],
          sampleVideo: { id: "N2kqCcKEQYE", title: "Un entretien Konbini gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@konbini" }
        }),
        frenchCreator({
          id: "brut",
          name: "Brut",
          profilePic: "images/creators/brut.jpg",
          shortDescription: "Des t\xE9moignages et explications tr\xE8s visuels, souvent sous-titr\xE9s d\xE8s la publication.",
          longDescription: "Le texte \xE0 l\u2019\xE9cran soutient la compr\xE9hension de voix et de sujets tr\xE8s diff\xE9rents. Les formats peuvent servir de lecture guid\xE9e avant une seconde \xE9coute sans regarder les sous-titres.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["societe"],
          sampleVideo: { id: "jjQh5YKxxTE", title: "Un portrait Brut gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@BrutFR" }
        }),
        frenchCreator({
          id: "hugo-grands-formats",
          name: "HugoD\xE9crypte \u2014 Grands formats",
          profilePic: "images/creators/hugo-grands-formats.jpg",
          shortDescription: "Des entretiens longs o\xF9 l\u2019actualit\xE9 laisse de la place au parcours, aux nuances et \xE0 la personnalit\xE9.",
          longDescription: "Les grands formats demandent plus d\u2019endurance que les r\xE9sum\xE9s quotidiens, mais la conversation suivie donne le temps de s\u2019habituer \xE0 une voix et \xE0 un sujet. C\u2019est une bonne \xE9tape vers l\u2019\xE9coute avanc\xE9e.",
          aljohnComment: null,
          levels: ["B2", "C1", "C2"],
          categories: ["societe"],
          sampleVideo: { id: "nr4UtiZMKPg", title: "Un grand entretien de HugoD\xE9crypte" },
          links: { youtube: "https://www.youtube.com/@hugodecryptegrandsformats", instagram: "https://www.instagram.com/hugodecrypte/" }
        }),
        frenchCreator({
          id: "miraculous-fr",
          name: "Miraculous en fran\xE7ais",
          profilePic: "images/creators/miraculous-francais.jpg",
          shortDescription: "Une s\xE9rie anim\xE9e d\u2019action situ\xE9e \xE0 Paris, port\xE9e par des sc\xE8nes visuelles, des dialogues r\xE9currents et un r\xE9cit suivi.",
          longDescription: "L\u2019animation donne en permanence des indices sur l\u2019action, les \xE9motions et les relations. Regarder un ou deux \xE9pisodes r\xE9guli\xE8rement cr\xE9e une immersion continue, sans exiger de comprendre chaque phrase isol\xE9e.",
          aljohnComment: "Quand j\u2019apprenais seul, je regardais un ou deux \xE9pisodes chaque matin. Les images m\u2019aidaient \xE0 reconstruire le contexte, et cette routine a compt\xE9 directement dans mon passage vers un fran\xE7ais interm\xE9diaire.",
          levels: ["A2", "B1", "B2"],
          categories: ["fiction"],
          sampleVideo: { id: "IcjFBDY4rWM", title: "Un \xE9pisode de Miraculous en fran\xE7ais" },
          links: { youtube: "https://www.youtube.com/@Miraculous_French" }
        }),
        frenchCreator({
          id: "totally-spies-fr",
          name: "Totally Spies! Fran\xE7ais",
          profilePic: "images/creators/totally-spies-fr.jpg",
          shortDescription: "Des \xE9pisodes familiers, rapides et tr\xE8s dialogu\xE9s o\xF9 l\u2019action aide \xE0 suivre le fran\xE7ais.",
          longDescription: "Les missions donnent une structure claire \xE0 l\u2019\xE9pisode et le doublage expose \xE0 beaucoup de r\xE9actions et de langage conversationnel. Une histoire connue lib\xE8re de l\u2019attention pour \xE9couter les formulations.",
          aljohnComment: "Je la garde comme option d\u2019immersion l\xE9g\xE8re : une histoire peut porter l\u2019\xE9coute les jours o\xF9 un podcast ou un reportage me demanderait trop d\u2019\xE9nergie.",
          levels: ["A2", "B1", "B2"],
          categories: ["fiction"],
          sampleVideo: { id: "RoIh-C2qJe8", title: "Un \xE9pisode de Totally Spies! en fran\xE7ais" },
          links: { youtube: "https://www.youtube.com/@TotallySpiesFran%C3%A7ais" }
        }),
        frenchCreator({
          id: "disney-fr",
          name: "Disney FR",
          profilePic: "images/creators/disney-fr.jpg",
          shortDescription: "Des sc\xE8nes et chansons d\xE9j\xE0 connues, r\xE9entendues en fran\xE7ais pour apprendre par comparaison.",
          longDescription: "Conna\xEEtre l\u2019histoire ou la m\xE9lodie r\xE9duit la charge de compr\xE9hension. Les extraits courts sont utiles pour comparer une r\xE9plique, m\xE9moriser un refrain et revenir ensuite au film complet.",
          aljohnComment: "Je ne mets pas Disney ici comme contenu \u201Cpour enfants\u201D. Je le garde parce qu\u2019une sc\xE8ne famili\xE8re permet d\u2019\xE9couter le fran\xE7ais sans perdre du temps \xE0 comprendre ce qui se passe.",
          levels: ["A1", "A2", "B1"],
          categories: ["fiction"],
          sampleVideo: { id: "KUVug77DXKQ", title: "Un extrait Disney en fran\xE7ais gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@DisneyFR" }
        }),
        frenchCreator({
          id: "tibo-entrainement",
          name: "Tibo InShape Entrainement",
          profilePic: "images/creators/tibo-entrainement.jpg",
          shortDescription: "Des consignes sportives dont les gestes montrent presque toujours le sens avant les mots.",
          longDescription: "Les s\xE9ances associent verbes d\u2019action, parties du corps, nombres et encouragements. On peut suivre physiquement la vid\xE9o, ce qui transforme l\u2019\xE9coute en compr\xE9hension imm\xE9diate.",
          aljohnComment: "Le corps donne une r\xE9ponse instantan\xE9e : soit j\u2019ai compris la consigne, soit je regarde le geste et j\u2019essaie encore. Cette boucle rend l\u2019\xE9coute tr\xE8s concr\xE8te.",
          levels: ["A2", "B1", "B2"],
          categories: ["quotidien"],
          sampleVideo: { id: "6PF4xaJaPok", title: "Un entra\xEEnement de Tibo InShape en fran\xE7ais" },
          links: { youtube: "https://www.youtube.com/@TiboInShapeEntrainement" }
        }),
        frenchCreator({
          id: "misha-et-alex",
          name: "Misha et Alex",
          profilePic: "images/creators/misha-et-alex.jpg",
          shortDescription: "Une vie de famille racont\xE9e dans des situations quotidiennes faciles \xE0 reconna\xEEtre.",
          longDescription: "Les \xE9changes familiaux donnent du vocabulaire sur la maison, les sorties, les enfants et les petites d\xE9cisions du jour. La continuit\xE9 des personnes rend les conversations de plus en plus famili\xE8res.",
          aljohnComment: "J\u2019aime pouvoir reconna\xEEtre les voix et les habitudes d\u2019une vid\xE9o \xE0 l\u2019autre : l\u2019immersion devient une relation suivie, pas un exercice isol\xE9.",
          levels: ["B1", "B2", "C1"],
          categories: ["quotidien"],
          sampleVideo: { id: "zNE9hX5F11U", title: "Un vlog de Misha et Alex gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@mishaetalex" }
        }),
        frenchCreator({
          id: "patineuse-a-bord",
          name: "Patineuse \xE0 bord",
          profilePic: "images/creators/patineuse-a-bord.jpg",
          shortDescription: "Patinage, progression et quotidien racont\xE9s depuis une pratique personnelle.",
          longDescription: "La cha\xEEne m\xEAle vocabulaire sportif, sensations, objectifs et vie autour de l\u2019entra\xEEnement. Les images du mouvement rendent les termes techniques plus faciles \xE0 associer \xE0 une r\xE9alit\xE9.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["quotidien"],
          sampleVideo: { id: "XrL_fhNnpc4", title: "Une vid\xE9o de Patineuse \xE0 bord gard\xE9e dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@Patineuseabord" }
        }),
        frenchCreator({
          id: "food-story",
          name: "Food Story",
          profilePic: "images/creators/food-story.jpg",
          shortDescription: "Des reportages o\xF9 la cuisine ouvre sur les m\xE9tiers, les familles et la vie \xE9conomique.",
          longDescription: "Les aliments et les gestes fournissent un contexte concret, tandis que les reportages ajoutent interviews et vocabulaire de soci\xE9t\xE9. C\u2019est plus riche qu\u2019une simple recette film\xE9e.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["quotidien"],
          sampleVideo: { id: "JoxTRkuds6g", title: "Un reportage Food Story gard\xE9 dans ma s\xE9lection" },
          links: { youtube: "https://www.youtube.com/@Food_Story" }
        }),
        frenchCreator({
          id: "ruhi-cenet-fr",
          name: "Ruhi \xC7enet Fran\xE7ais",
          profilePic: "images/creators/ruhi-cenet-fr.jpg",
          shortDescription: "Des voyages et lieux extraordinaires racont\xE9s en doublage fran\xE7ais avec des images tr\xE8s fortes.",
          longDescription: "La narration est dense mais les images documentaires soutiennent constamment le sens. C\u2019est une fa\xE7on de pratiquer l\u2019\xE9coute tout en d\xE9couvrant des lieux que l\u2019on ne verrait pas dans un vlog ordinaire.",
          aljohnComment: "Ma curiosit\xE9 pour ces lieux me fait accepter un fran\xE7ais plus dense que d\u2019habitude. Quand l\u2019image me surprend, je veux comprendre la narration jusqu\u2019au bout.",
          levels: ["B1", "B2", "C1"],
          categories: ["quotidien"],
          sampleVideo: { id: "e7RtkQh2wIU", title: "Un documentaire de Ruhi \xC7enet en fran\xE7ais" },
          links: { youtube: "https://www.youtube.com/@Ruhi%C3%87enetFran%C3%A7ais" }
        }),
        frenchCreator({
          id: "first-team",
          name: "FIRST TEAM",
          profilePic: "images/creators/first-team.jpg",
          shortDescription: "Le basket fran\xE7ais et la NBA racont\xE9s en d\xE9bats, classements et longs entretiens.",
          longDescription: "FIRST TEAM laisse du temps \xE0 l\u2019analyse : histoire de la NBA, trajectoires de joueurs fran\xE7ais et conversations de fond. Le vocabulaire tactique reste li\xE9 \xE0 une passion que je connais d\xE9j\xE0.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["sport"],
          sampleVideo: { id: "1KkowgXiOVQ", title: "Les Fran\xE7ais dans l\u2019histoire de la NBA : notre classement" },
          links: { youtube: "https://www.youtube.com/@FIRSTTEAM" }
        }),
        frenchCreator({
          id: "emilio",
          name: "Emilio",
          profilePic: "images/creators/emilio.jpg",
          shortDescription: "Des conseils directs sur la conversation, les habitudes et les choix de vie.",
          longDescription: "Ses capsules partent d\u2019une situation tr\xE8s concr\xE8te \u2014 \xEAtre interrompu, partir \xE0 l\u2019\xE9tranger, changer une habitude \u2014 et la condensent en fran\xE7ais contemporain, clair et rapide.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["quotidien"],
          sampleVideo: { id: "tk5clyt7Z_0", title: "Comment r\xE9agir quand on te coupe la parole" },
          links: { youtube: "https://www.youtube.com/@emilioab" }
        }),
        frenchCreator({
          id: "elena-boogzel",
          name: "Elena Boogzel",
          profilePic: "images/creators/elena-boogzel.jpg",
          shortDescription: "Langues, \xE9tiquette et \xE9carts culturels entre la France et la Russie.",
          longDescription: "Elena transforme son exp\xE9rience entre deux cultures en comparaisons tr\xE8s situ\xE9es : \xE9tudes, gestes sociaux, fa\xE7ons de parler et r\xE9actions devant les m\xEAmes habitudes.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["quotidien"],
          sampleVideo: { id: "dkSiX-IutTM", title: "\xC9tudes sup\xE9rieures en France vs Russie" },
          links: { youtube: "https://www.youtube.com/@elenaboogzel" }
        }),
        frenchCreator({
          id: "tibo-inshape",
          name: "Tibo InShape",
          profilePic: "images/creators/tibo-inshape.jpg",
          shortDescription: "D\xE9fis physiques, rencontres sportives et humour \xE0 tr\xE8s haute \xE9nergie.",
          longDescription: "La cha\xEEne principale m\xEAle entra\xEEnement, confrontation \xE0 d\u2019autres disciplines et sc\xE8nes de couple. Les gestes rendent le sens visible tandis que le registre change entre d\xE9fi, explication et blague.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["sport"],
          sampleVideo: { id: "t71VvZI-WV4", title: "Je prends un KO par le champion d\u2019Europe de boxe" },
          links: { youtube: "https://www.youtube.com/@TiboInShape" }
        }),
        frenchCreator({
          id: "le-6e-homme",
          name: "Le 6e homme",
          profilePic: "images/creators/le-6e-homme.jpg",
          shortDescription: "Prospects, draft et construction d\u2019\xE9quipe NBA expliqu\xE9s en d\xE9tail.",
          longDescription: "Le canal suit les jeunes joueurs et les choix de franchise avec un vocabulaire pr\xE9cis : profils, fit, potentiel, meneur et rotation deviennent les pi\xE8ces d\u2019un raisonnement.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["sport"],
          sampleVideo: { id: "0ZRcDuUBzi4", title: "Mes pr\xE9visions pour la Draft NBA 2024" },
          links: { youtube: "https://www.youtube.com/@Le6ehomme" }
        }),
        frenchCreator({
          id: "marketing-mania-daily",
          name: "Marketing Mania Daily",
          profilePic: "images/creators/marketing-mania-daily.jpg",
          shortDescription: "Marques, persuasion et erreurs d\u2019entreprise racont\xE9es en \xE9tudes de cas tr\xE8s courtes.",
          longDescription: "Une histoire de marque devient une le\xE7on de strat\xE9gie : cause, d\xE9cision et cons\xE9quence sont comprim\xE9es dans un format rapide, avec un vocabulaire utile du commerce et de l\u2019attention.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["culture"],
          sampleVideo: { id: "Yme_mvTokas", title: "La descente aux enfers de Subway" },
          links: { youtube: "https://www.youtube.com/@MarketingManiaDaily" }
        }),
        frenchCreator({
          id: "brieuc-le-dantec",
          name: "Brieuc Le Dantec",
          profilePic: "images/creators/brieuc-le-dantec.jpg",
          shortDescription: "Callisth\xE9nie, progression et rapport au corps expliqu\xE9s sans perdre le geste.",
          longDescription: "Les mouvements donnent un support imm\xE9diat au vocabulaire de force, d\u2019\xE9tape et de technique. Les vid\xE9os passent aussi de la performance \xE0 des questions plus personnelles sur le fait d\u2019\xEAtre muscl\xE9.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["sport"],
          sampleVideo: { id: "V7TaILIrQ8o", title: "Progresser en callisth\xE9nie de d\xE9butant \xE0 avanc\xE9" },
          links: { youtube: "https://www.youtube.com/@brieucledantec7422" }
        }),
        frenchCreator({
          id: "fuze-iii",
          name: "Fuze III",
          profilePic: "images/creators/fuze-iii.jpg",
          shortDescription: "Minecraft utilis\xE9 comme atelier de construction, de d\xE9fi et m\xEAme de musique.",
          longDescription: "Les \xE9pisodes installent une r\xE8gle puis montrent les d\xE9tours n\xE9cessaires pour la tenir. Le jeu fournit un monde stable o\xF9 le commentaire fran\xE7ais reste continu et tr\xE8s narratif.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["humour"],
          sampleVideo: { id: "tmeszk2BREw", title: "Faire une musique avec les sons de Minecraft" },
          links: { youtube: "https://www.youtube.com/@FuzeIII" }
        }),
        frenchCreator({
          id: "simbaqs",
          name: "simbaqs",
          profilePic: "images/creators/simbaqs.jpg",
          shortDescription: "R\xE9actions tr\xE8s rapides \xE0 des moments absurdes, jeux et questions qui d\xE9rapent.",
          longDescription: "Le format repose sur l\u2019intonation, la surprise et une l\xE9gende courte. C\u2019est du fran\xE7ais Internet compact, o\xF9 comprendre le ton compte autant que traduire les mots.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["humour"],
          sampleVideo: { id: "BkXFqKVvmCM", title: "Y\u2019a rien qui va dans cette vid\xE9o" },
          links: { youtube: "https://www.youtube.com/@simba-qs" }
        }),
        frenchCreator({
          id: "donovan-magicien",
          name: "Donovan",
          profilePic: "images/creators/donovan-magicien.jpg",
          shortDescription: "Magie rapproch\xE9e, r\xE9actions et tours construits autour d\u2019une rencontre.",
          longDescription: "Le tour n\u2019est jamais seulement un r\xE9sultat : pr\xE9paration, adresse au public et \xE9motion cr\xE9ent un r\xE9cit. Les objets visibles soutiennent l\u2019\xE9coute du fran\xE7ais spontan\xE9.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["humour"],
          sampleVideo: { id: "LMhKMib5yZc", title: "Le tour de magie le plus \xE9mouvant avec Ma\xEBlle" },
          links: { youtube: "https://www.youtube.com/@Donovan_magicien" }
        }),
        frenchCreator({
          id: "trashtalkproduction",
          name: "TrashTalkProduction",
          profilePic: "images/creators/trashtalkproduction.jpg",
          shortDescription: "D\xE9briefs NBA, trades et d\xE9bats de saison avec le rythme d\u2019une conversation entre passionn\xE9s.",
          longDescription: "Les formats longs assument le d\xE9tail : statistiques, contexte et d\xE9saccords construisent une \xE9coute proche d\u2019une vraie discussion de basket entre amis.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["sport"],
          sampleVideo: { id: "S7fyf8NcNpY", title: "Finales NBA 2022 : d\xE9brief apr\xE8s deux matchs" },
          links: { youtube: "https://www.youtube.com/@TrashTalkProduction" }
        }),
        frenchCreator({
          id: "eric-flag",
          name: "Eric Flag",
          profilePic: "images/creators/eric-flag.jpg",
          shortDescription: "Street workout, d\xE9fis de force et progression expliqu\xE9s depuis la pratique.",
          longDescription: "Les vid\xE9os montrent les mouvements, les erreurs et la construction du niveau. Le vocabulaire technique devient compr\xE9hensible parce qu\u2019il est toujours reli\xE9 \xE0 un corps en action.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["sport"],
          sampleVideo: { id: "ckndKs4GsL4", title: "Les trois secrets pour d\xE9buter le street workout" },
          links: { youtube: "https://www.youtube.com/@EricFlag" }
        }),
        frenchCreator({
          id: "angele",
          name: "Ang\xE8le",
          profilePlatform: "instagram",
          profilePic: "images/creators/angele.webp",
          shortDescription: "Pop belge francophone, \xE9criture pr\xE9cise et interviews o\xF9 Bruxelles reste audible derri\xE8re la sc\xE8ne internationale.",
          longDescription: "Ang\xE8le passe d\u2019une diction tr\xE8s nette dans ses chansons \xE0 un fran\xE7ais belge naturel dans les entretiens et les sessions radio. Ses textes, ses reprises et son humour visuel offrent plusieurs vitesses d\u2019\xE9coute sans r\xE9duire son travail \xE0 un exercice de langue.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites", "musique"],
          sampleVideo: { id: "1w3VV-ji4h8", title: "Ang\xE8le reprend \xAB Pour que tu m\u2019aimes encore \xBB \u2014 France Inter" },
          links: { instagram: "https://www.instagram.com/angele_vl/", youtube: "https://www.youtube.com/@angelevl" }
        }),
        frenchCreator({
          id: "soprano",
          name: "Soprano",
          profilePlatform: "instagram",
          profilePic: "images/creators/soprano.webp",
          shortDescription: "Rap et pop marseillais port\xE9s par une diction directe, des r\xE9cits familiaux et une pr\xE9sence famili\xE8re de la t\xE9l\xE9vision fran\xE7aise.",
          longDescription: "Soprano construit des chansons narratives avec des refrains imm\xE9diatement rep\xE9rables, puis d\xE9veloppe les m\xEAmes th\xE8mes dans des interviews au d\xE9bit plus spontan\xE9. Son parcours relie rap marseillais, grandes sc\xE8nes et t\xE9l\xE9vision populaire.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites", "musique"],
          sampleVideo: { id: "h7oEuaQqJpU", title: "Soprano \u2014 Forrest (clip officiel)" },
          links: { instagram: "https://www.instagram.com/sopranopsy4/", youtube: "https://www.youtube.com/@soprano" }
        }),
        frenchCreator({
          id: "vitaa",
          name: "Vitaa",
          profilePlatform: "instagram",
          profilePic: "images/creators/vitaa.webp",
          shortDescription: "Autrice-interpr\xE8te fran\xE7aise dont les duos rendent visibles le dialogue, le contraste des voix et le vocabulaire des relations.",
          longDescription: "Ses chansons alternent adresse directe, r\xE9cit intime et conversation chant\xE9e. Les nombreuses performances en duo permettent de comparer prononciation, timbre et mani\xE8re de porter la m\xEAme phrase.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites", "musique"],
          sampleVideo: { id: "Wz86pFtHZqI", title: "Vitaa & Slimane \u2014 \xC7a va \xE7a vient" },
          links: { instagram: "https://www.instagram.com/vitaa/", youtube: "https://www.youtube.com/channel/UC6atFS0kNdJR-EuSa_I1Kkw" }
        }),
        frenchCreator({
          id: "slimane",
          name: "Slimane",
          profilePlatform: "instagram",
          profilePic: "images/creators/slimane.webp",
          shortDescription: "Une voix issue de The Voice, entre ballades tr\xE8s articul\xE9es, duos et fran\xE7ais spontan\xE9 des r\xE9p\xE9titions et entretiens.",
          longDescription: "Slimane met souvent la voix et le texte au premier plan. Les clips donnent un cadre \xE9motionnel clair ; les duos et passages t\xE9l\xE9vis\xE9s ajoutent n\xE9gociation musicale, r\xE9actions et parole moins pr\xE9par\xE9e.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites", "musique"],
          sampleVideo: { id: "uKwzC0kGwEY", title: "\xAB Avant toi \xBB repris en finale de The Voice" },
          links: { instagram: "https://www.instagram.com/slimane/", youtube: "https://www.youtube.com/@slimane_music" }
        }),
        frenchCreator({
          id: "inoxtag",
          name: "Inoxtag",
          profilePlatform: "instagram",
          profilePic: "images/creators/inoxtag.webp",
          shortDescription: "Cr\xE9ateur fran\xE7ais pass\xE9 du jeu vid\xE9o au documentaire d\u2019aventure, avec un fran\xE7ais jeune, rapide et tr\xE8s incarn\xE9.",
          longDescription: "Ses formats longs suivent un objectif, sa pr\xE9paration et ses cons\xE9quences. Le contexte visuel soutient l\u2019\xE9coute tandis que les conversations avec l\u2019\xE9quipe font entendre h\xE9sitations, motivation, humour et vocabulaire de l\u2019effort.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["humour", "culture"],
          sampleVideo: { id: "wrFsapf0Enk", title: "Kaizen : un an pour gravir l\u2019Everest" },
          links: { instagram: "https://www.instagram.com/inoxtag/", youtube: "https://www.youtube.com/@inoxtag" }
        }),
        frenchCreator({
          id: "kylian-mbappe",
          name: "Kylian Mbapp\xE9",
          profilePlatform: "instagram",
          profilePic: "images/creators/kylian-mbappe.webp",
          shortDescription: "Attaquant et capitaine fran\xE7ais, utile pour entendre le registre pos\xE9 des interviews d\u2019apr\xE8s-match et de Clairefontaine.",
          longDescription: "Ses prises de parole passent du vocabulaire tr\xE8s concret du match \xE0 des r\xE9ponses sur la responsabilit\xE9, le collectif et les attentes. Les entretiens de la F\xE9d\xE9ration fran\xE7aise de football donnent un cadre clair et v\xE9rifiable \xE0 cette \xE9coute.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["sport"],
          sampleVideo: { id: "wp81TjQ04JA", title: "Kylian Mbapp\xE9 : \xAB Donner du plaisir aux gens \xBB \u2014 FFF" },
          links: { instagram: "https://www.instagram.com/k.mbappe/", website: "https://kylianmbappe.com/" }
        }),
        frenchCreator({
          id: "olivier-giroud",
          name: "Olivier Giroud",
          profilePlatform: "instagram",
          profilePic: "images/creators/olivier-giroud.webp",
          shortDescription: "Avant-centre fran\xE7ais dont les interviews m\xEAlent vocabulaire du but, lecture collective et r\xE9cit d\u2019une longue carri\xE8re.",
          longDescription: "Les s\xE9quences \xE0 Clairefontaine montrent un fran\xE7ais sportif plus d\xE9velopp\xE9 qu\u2019un simple commentaire de match : pr\xE9paration, confiance, r\xF4le dans le groupe et retour sur une action pr\xE9cise.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["sport"],
          sampleVideo: { id: "rslBI36gU8U", title: "Une journ\xE9e avec Olivier Giroud \xE0 Clairefontaine \u2014 FFF" },
          links: { instagram: "https://www.instagram.com/oliviergiroud/" }
        }),
        frenchCreator({
          id: "ousmane-dembele",
          name: "Ousmane Demb\xE9l\xE9",
          profilePlatform: "instagram",
          profilePic: "images/creators/ousmane-dembele.webp",
          shortDescription: "Attaquant fran\xE7ais dont les conversations font entendre un registre d\xE9tendu, l\u2019humour du vestiaire et le lexique du haut niveau.",
          longDescription: "Les entretiens plus longs donnent davantage de place \xE0 la personnalit\xE9 que les r\xE9sum\xE9s de match. Entre carri\xE8re, co\xE9quipiers et culture populaire, le fran\xE7ais reste naturel et souvent tr\xE8s rapide.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["sport"],
          sampleVideo: { id: "MuygHdX2yaI", title: "The Bridge avec Ousmane Demb\xE9l\xE9, Jules Kound\xE9 et Thomas Ngijol" },
          links: { instagram: "https://www.instagram.com/o.dembele7/" }
        }),
        frenchCreator({
          id: "linh",
          name: "LINH",
          profilePic: "images/creators/linh.webp",
          shortDescription: "Une autrice-compositrice-interpr\xE8te dont la cha\xEEne suit les chansons de \xAB Je pense \xE0 vous \xBB \xE0 son premier album.",
          longDescription: "La cha\xEEne officielle de LINH rassemble clips, lyric videos, versions acoustiques et courtes performances film\xE9es en public. Les refrains reviennent clairement, tandis que les formats face cam\xE9ra ajoutent un fran\xE7ais parl\xE9 bref autour de l\u2019\xE9criture, des concerts et de la sortie de \xAB Bo\xEEte \xE0 musique \xBB.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites"],
          sampleVideo: { id: "UnZa8dBnMHU", title: "LINH \u2014 Immortelle" },
          links: { youtube: "https://www.youtube.com/@LINHOFFICIEL", instagram: "https://www.instagram.com/linhofficial/" }
        }),
        frenchCreator({
          id: "jeck",
          name: "JECK",
          profilePic: "images/creators/jeck.webp",
          shortDescription: "Pop fran\xE7aise, reprises guitare-voix et mises en sc\xE8ne o\xF9 une chanson surgit au milieu d\u2019une situation quotidienne.",
          longDescription: "JECK publie des clips, des versions acoustiques, des reprises de Vianney ou Johnny Hallyday et des formats courts construits autour d\u2019une surprise musicale. La m\xE9lodie soutient l\u2019\xE9coute ; les introductions, r\xE9actions et \xE9changes avec Carla donnent ensuite acc\xE8s \xE0 un fran\xE7ais spontan\xE9 et familier.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites"],
          sampleVideo: { id: "C0cT9A2Q32E", title: "JECK surprend un chanteur avec une chorale" },
          links: { youtube: "https://www.youtube.com/@moicestjeck", instagram: "https://www.instagram.com/moicestjeck/" }
        }),
        frenchCreator({
          id: "maelle",
          name: "Ma\xEBlle",
          profilePic: "images/creators/maelle.webp",
          shortDescription: "Une autrice-compositrice-interpr\xE8te suivie des sessions acoustiques aux chansons de ses albums \xAB Ma\xEBlle \xBB et \xAB Fil Rouge \xBB.",
          longDescription: "La cha\xEEne officielle alterne clips, live acoustiques, extraits de concert et courtes annonces face cam\xE9ra. Les sessions de \xAB L\u2019Effet de masse \xBB ou \xAB Flash \xBB mettent la voix et le texte au premier plan ; les vid\xE9os de tourn\xE9e ajoutent le vocabulaire du travail sc\xE9nique et de la cr\xE9ation.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites"],
          sampleVideo: { id: "C7xAayruTe4", title: "Ma\xEBlle \u2014 Flash (live acoustique)" },
          links: { youtube: "https://www.youtube.com/@maelleofficiel", instagram: "https://www.instagram.com/maelle/" }
        }),
        frenchCreator({
          id: "charles-melanie",
          name: "Charles & M\xE9lanie",
          profilePic: "images/creators/charles-melanie.webp",
          shortDescription: "Un duo de parkour qui transforme cascades de cin\xE9ma, d\xE9fis physiques et jeux grandeur nature en aventures racont\xE9es.",
          longDescription: "Charles et M\xE9lanie testent des sauts, reproduisent des cascades de Spider-Man, gravissent des structures et construisent des d\xE9fis \xE0 niveaux. Le geste rend l\u2019objectif imm\xE9diatement visible ; les consignes, n\xE9gociations et r\xE9actions font entendre un fran\xE7ais oral tr\xE8s \xE9nergique, souvent \xE0 plusieurs voix.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["humour"],
          sampleVideo: { id: "MA8k-PFXAjQ", title: "Sauter par-dessus une piscine : dix niveaux" },
          links: { youtube: "https://www.youtube.com/@CharlesMelanie" }
        }),
        frenchCreator({
          id: "52-minutes-rts",
          name: "52 minutes RTS",
          profilePic: "images/creators/52-minutes-rts.webp",
          shortDescription: "La satire d\u2019actualit\xE9 de la RTS, entre faux reportages, vrais invit\xE9s et observation ironique de la Suisse romande.",
          longDescription: "La cha\xEEne reprend les s\xE9quences de l\u2019\xE9mission de Vincent Kucholl et Vincent Veillon : sketches de plateau, reportages parodiques, entretiens et chroniques comme \xAB Suisse ? \xBB. Les accents, r\xE9f\xE9rences politiques et sous-entendus demandent une \xE9coute avanc\xE9e, mais les personnages et d\xE9cors donnent des rep\xE8res constants.",
          aljohnComment: null,
          levels: ["B2", "C1", "C2"],
          categories: ["humour"],
          sampleVideo: { id: "aCHCPuUMkXg", title: "\xAB Suisse ? \xBB \u2014 La Suisse est-elle plus propre que la France ?" },
          links: { youtube: "https://www.youtube.com/@52minutes" }
        }),
        frenchCreator({
          id: "allocine",
          name: "AlloCin\xE9",
          profilePic: "images/creators/allocine.webp",
          shortDescription: "Cin\xE9ma et s\xE9ries en fran\xE7ais, des entretiens aux analyses de mise en sc\xE8ne et aux \xE9pisodes de \xAB Faux Raccord \xBB.",
          longDescription: "AlloCin\xE9 publie bandes-annonces comment\xE9es, interviews, s\xE9lections de sorties et d\xE9cryptages de films. \xAB Faux Raccord \xBB observe les erreurs de continuit\xE9 image par image ; d\u2019autres formats expliquent un genre, un personnage ou les choix d\u2019un r\xE9alisateur avec un vocabulaire pr\xE9cis du cin\xE9ma.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["culture"],
          sampleVideo: { id: "-snpeAh8Erc", title: "Pourquoi The Batman se d\xE9marque des autres films Batman" },
          links: { youtube: "https://www.youtube.com/@allocine", website: "https://www.allocine.fr/" }
        }),
        frenchCreator({
          id: "blitzstream",
          name: "\xC9checs \u2014 Blitzstream",
          profilePic: "images/creators/blitzstream.webp",
          shortDescription: "Parties comment\xE9es, directs en blitz et analyses de tournois pour suivre les \xE9checs en fran\xE7ais.",
          longDescription: "Blitzstream commente des parties r\xE9centes, re\xE7oit des joueurs comme Maxime Vachier-Lagrave et propose aussi des ouvertures expliqu\xE9es aux d\xE9butants. L\u2019\xE9chiquier rend les relations spatiales visibles, tandis que les directs entra\xEEnent \xE0 suivre hypoth\xE8ses, calculs rapides et vocabulaire de comp\xE9tition.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["sport"],
          sampleVideo: { id: "4HlgTxfKESA", title: "MVL revient sur ses parties de blitz" },
          links: { youtube: "https://www.youtube.com/@VideosEchecs" }
        }),
        frenchCreator({
          id: "pierre-croce",
          name: "Pierre Croce",
          profilePic: "images/creators/pierre-croce.webp",
          shortDescription: "D\xE9fis collectifs, classements et jeux de plateau o\xF9 les invit\xE9s doivent argumenter autant que jouer.",
          longDescription: "Pierre Croce construit des formats autour d\u2019une r\xE8gle simple : classer des sportifs, traverser un tournoi de cr\xE9ateurs ou r\xE9pondre dans \xAB Le Jeu de la Scolarit\xE9 \xBB. Les \xE9changes sont rapides et se chevauchent souvent ; les cat\xE9gories affich\xE9es \xE0 l\u2019\xE9cran aident \xE0 suivre d\xE9saccords, justifications et chutes comiques.",
          aljohnComment: null,
          levels: ["B1", "B2", "C1"],
          categories: ["humour"],
          sampleVideo: { id: "euaEW05lk4I", title: "Elle a une particularit\xE9 physique folle" },
          links: { youtube: "https://www.youtube.com/@pierrecroce", instagram: "https://www.instagram.com/pierrecroce/" }
        }),
        frenchCreator({
          id: "le-monde",
          name: "Le Monde",
          profilePic: "images/creators/le-monde.webp",
          shortDescription: "Actualit\xE9 expliqu\xE9e, enqu\xEAtes vid\xE9o et documentaires sur la politique, les sciences, l\u2019histoire et la culture populaire.",
          longDescription: "La r\xE9daction du Monde publie r\xE9sum\xE9s d\u2019actualit\xE9, enqu\xEAtes fond\xE9es sur des images et documents, cartes g\xE9opolitiques dans \xAB Mappemonde \xBB et r\xE9cits visuels dans \xAB Flashback \xBB. La narration est structur\xE9e et illustr\xE9e, mais le vocabulaire journalistique et la densit\xE9 des sujets conviennent surtout aux niveaux avanc\xE9s.",
          aljohnComment: null,
          levels: ["B2", "C1", "C2"],
          categories: ["societe"],
          sampleVideo: { id: "0Zs-f-DsLxQ", title: "Victor Wembanyama : les basketteurs peuvent-ils \xEAtre trop grands ?" },
          links: { youtube: "https://www.youtube.com/@lemondefr", website: "https://www.lemonde.fr/" }
        }),
        frenchCreator({
          id: "cest-pas-sorcier",
          name: "C\u2019est pas sorcier",
          profilePic: "images/creators/cest-pas-sorcier.webp",
          shortDescription: "Le magazine de Fred, Jamy et Sabine qui explique sciences, m\xE9tiers et patrimoine depuis le camion-laboratoire.",
          longDescription: "La cha\xEEne officielle classe les \xE9pisodes par grands th\xE8mes : espace, climat, transports, histoire, animaux ou industrie. Maquettes, visites de terrain et reformulations rendent les explications faciles \xE0 reconstruire ; certains chiffres anciens doivent toutefois \xEAtre v\xE9rifi\xE9s avec des sources plus r\xE9centes.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["culture"],
          sampleVideo: { id: "777KcVTcwmg", title: "Pourquoi Pluton n\u2019est pas une plan\xE8te ?" },
          links: { youtube: "https://www.youtube.com/@Cestpassorcierofficiel" }
        }),
        frenchCreator({
          id: "squeezie",
          name: "SQUEEZIE",
          profilePic: "images/creators/squeezie.webp",
          shortDescription: "Des concepts de divertissement \xE0 grande \xE9chelle, des histoires d\u2019horreur et des d\xE9fis men\xE9s avec un groupe d\u2019invit\xE9s.",
          longDescription: "SQUEEZIE alterne r\xE9cits face cam\xE9ra, jeux sociaux, d\xE9fis physiques et productions collectives comme le GP Explorer. Le montage est rapide, les voix se chevauchent et l\u2019argot est fr\xE9quent ; les r\xE8gles visuelles des concepts offrent n\xE9anmoins un fil solide pour une \xE9coute avanc\xE9e.",
          aljohnComment: null,
          levels: ["B2", "C1", "C2"],
          categories: ["humour"],
          sampleVideo: { id: "72mo70CeSHE", title: "On affronte les plus grandes peurs de l\u2019humanit\xE9" },
          links: { youtube: "https://www.youtube.com/@Squeezie", instagram: "https://www.instagram.com/xsqueezie/" }
        }),
        frenchCreator({
          id: "david-castello-lopes",
          name: "David Castello-Lopes",
          profilePic: "images/creators/david-castello-lopes.webp",
          shortDescription: "Journalisme, humour et chansons pour remonter l\u2019origine d\u2019un objet banal ou d\xE9caler une question de soci\xE9t\xE9.",
          longDescription: "David Castello-Lopes construit des chroniques comme \xAB Depuis quand \xBB et \xAB Suisse ? \xBB \xE0 partir d\u2019archives, d\u2019entretiens, de montage comique et de refrains volontairement insistants. Ses formats \xAB Small Talk \xBB d\xE9placent l\u2019attention vers les d\xE9tails ordinaires de la vie des invit\xE9s plut\xF4t que vers leur promotion.",
          aljohnComment: "J\u2019ai beaucoup regard\xE9 ses vid\xE9os : je les trouve \xE0 la fois int\xE9ressantes et dr\xF4les.",
          levels: ["B1", "B2", "C1"],
          categories: ["culture"],
          sampleVideo: { id: "0seGFyKqIrw", title: "\xAB Suisse ? \xBB \u2014 Le d\xE9briefing de David Castello-Lopes" },
          links: { youtube: "https://www.youtube.com/@MrDastiz", website: "https://davidcastellolopes.com/" }
        })
      ]
    };
  }
});

// languages/french/js/data/french-instagram-creators-data.js
var require_french_instagram_creators_data = __commonJS({
  "languages/french/js/data/french-instagram-creators-data.js"() {
    (function extendFrenchInstagramLibrary() {
      const library = window.frenchCuratedChannelsData;
      if (!library || !Array.isArray(library.channels)) return;
      library.channels.push(
        {
          id: "matt-pokora",
          name: "M. Pokora",
          profilePlatform: "instagram",
          imageAlt: "Portrait de M. Pokora",
          profilePic: "images/creators/matt-pokora.webp",
          shortDescription: "Une pr\xE9sence pop et sc\xE9nique suivie dans les clips, les refrains et les grandes performances fran\xE7aises.",
          longDescription: "M. Pokora circule entre pop, danse, spectacle et t\xE9l\xE9vision. Les clips offrent un point d\u2019entr\xE9e clair pour la diction et les refrains, tandis que les interviews et les sc\xE8nes permettent d\u2019entendre un fran\xE7ais plus spontan\xE9 autour du travail artistique.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites", "musique"],
          sampleVideo: { id: "qcA07gL7WEw", title: "M. Pokora \u2014 Les plan\xE8tes (clip officiel)" },
          links: { instagram: "https://www.instagram.com/mattpokora/", youtube: "https://www.youtube.com/user/mpofficial" }
        },
        {
          id: "kendji",
          name: "Kendji Girac",
          profilePlatform: "instagram",
          imageAlt: "Portrait de Kendji Girac",
          profilePic: "images/creators/kendji.webp",
          shortDescription: "Chanson fran\xE7aise, guitare et h\xE9ritage gitan : une voix suivie entre The Voice, clips et sc\xE8nes.",
          longDescription: "Kendji Girac apporte \xE0 l\u2019\xE9coute une articulation tr\xE8s musicale, des refrains m\xE9morables et un parcours qui relie The Voice \xE0 la chanson populaire. Les chansons donnent un contexte imm\xE9diat avant de passer aux interviews et aux \xE9changes plus rapides.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites", "musique"],
          sampleVideo: { id: "4ySIi8EtEQg", title: "Kendji Girac \u2014 Si seulement\u2026 (clip officiel)" },
          links: { instagram: "https://www.instagram.com/kendji/", youtube: "https://www.youtube.com/@KendjiGirac" }
        },
        {
          id: "amel-bent",
          name: "Amel Bent",
          profilePlatform: "instagram",
          imageAlt: "Portrait d\u2019Amel Bent",
          profilePic: "images/creators/amel-bent.webp",
          shortDescription: "Une voix narrative entre chanson, t\xE9l\xE9vision et textes o\xF9 les \xE9motions restent faciles \xE0 suivre.",
          longDescription: "Les chansons d\u2019Amel Bent mettent l\u2019accent sur la phrase, l\u2019adresse directe et la nuance \xE9motionnelle. Ses passages t\xE9l\xE9vis\xE9s ajoutent un fran\xE7ais parl\xE9 diff\xE9rent du texte chant\xE9, avec des r\xE9ponses, des r\xE9actions et des r\xE9cits personnels.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites", "musique"],
          sampleVideo: { id: "Uzuspeneepc", title: "Amel Bent \u2014 Ton nom (clip officiel)" },
          links: { instagram: "https://www.instagram.com/amelbent/", youtube: "https://www.youtube.com/@amelbentvideo" }
        },
        {
          id: "danse-avec-les-stars",
          name: "Danse Avec Les Stars",
          profilePlatform: "instagram",
          imageAlt: "Logo de Danse Avec Les Stars",
          profilePic: "images/creators/danse-avec-les-stars.webp",
          shortDescription: "Danse, musique et r\xE9actions de plateau : le fran\xE7ais d\u2019un spectacle qui se regarde autant qu\u2019il s\u2019\xE9coute.",
          longDescription: "Le programme combine pr\xE9sentation, consignes, commentaires du jury et r\xE9cits de participants. Les chor\xE9graphies rendent la situation lisible, puis les \xE9changes permettent de travailler le vocabulaire de l\u2019effort, de la sc\xE8ne et de l\u2019\xE9motion.",
          aljohnComment: null,
          levels: ["A2", "B1", "B2"],
          categories: ["personnalites", "culture"],
          sampleVideo: { id: "Lg2CpczgiNw", title: "La promesse de Billy Crawford dans Danse Avec Les Stars" },
          links: { instagram: "https://www.instagram.com/dals_tf1/", youtube: "https://www.youtube.com/@Danseaveclesstarstf1" }
        },
        {
          id: "comedie-francaise",
          name: "Com\xE9die-Fran\xE7aise",
          profilePlatform: "instagram",
          imageAlt: "Embl\xE8me de la Com\xE9die-Fran\xE7aise",
          profilePic: "images/creators/comedie-francaise.webp",
          shortDescription: "Th\xE9\xE2tre, po\xE9sie et transmission : une institution pour entendre le fran\xE7ais port\xE9 par le texte.",
          longDescription: "La Com\xE9die-Fran\xE7aise r\xE9unit spectacles, \xE9missions, lectures et ressources en ligne. Les extraits de th\xE9\xE2tre et de po\xE9sie donnent acc\xE8s \xE0 une diction travaill\xE9e, \xE0 des textes classiques et \xE0 des registres que les conversations quotidiennes ne montrent pas toujours.",
          aljohnComment: null,
          levels: ["B2", "C1", "C2"],
          categories: ["culture"],
          sampleVideo: { id: "zyE5HW4zfWM", title: "Le Tartuffe ou l\u2019Hypocrite \u2014 bande-annonce" },
          links: {
            instagram: "https://www.instagram.com/comedie.francaise.officiel/",
            youtube: "https://www.youtube.com/@LaComedieFrancaise",
            website: "https://www.comedie-francaise.fr/"
          }
        }
      );
    })();
  }
});

// languages/french/js/data/french-resources-data.js
var require_french_resources_data = __commonJS({
  "languages/french/js/data/french-resources-data.js"() {
    window.frenchResourcesData = {
      spotlights: [
        {
          id: "alliance-manille",
          name: "Alliance Fran\xE7aise de Manille",
          imageSrc: "../../images/languagecenters/Alliance_Manille_SaturdayVisit_2025_Collage.png",
          imageAlt: "Visite d'Aljohn \xE0 l'Alliance Fran\xE7aise de Manille",
          gallery: [
            {
              src: "../../images/languagecenters/Alliance_Manille_SaturdayVisit_2025_Collage.png",
              alt: "Collage de la visite d'Aljohn \xE0 l'Alliance Fran\xE7aise de Manille",
              caption: "Un samedi \xE0 l'Alliance Fran\xE7aise de Manille"
            },
            {
              src: "../../images/languagecenters/alliance_manille_library_reading.JPG",
              alt: "Aljohn lit dans la m\xE9diath\xE8que de l'Alliance Fran\xE7aise de Manille",
              caption: "Lire et travailler dans la m\xE9diath\xE8que"
            },
            {
              src: "../../images/languagecenters/alliance_manille_cinema_selfie.JPG",
              alt: "Aljohn avant une projection \xE0 l'Alliance Fran\xE7aise de Manille",
              caption: "Avant une projection en fran\xE7ais"
            }
          ],
          logoSrc: "images/resources/alliance-francaise-manille-logo.png",
          logoAlt: "Logo de l'Alliance Fran\xE7aise de Manille",
          paragraphs: [
            "\xC0 Makati, l'Alliance r\xE9unit cours, certifications DELF/DALF, m\xE9diath\xE8que et programmation culturelle. C'est l'un de mes points d'ancrage pour faire vivre le fran\xE7ais en dehors des manuels.",
            "J'aime y passer le week-end pour lire, assister \xE0 une projection et retrouver une communaut\xE9 qui transforme une s\xE9ance d'\xE9tude en v\xE9ritable immersion."
          ],
          tags: ["Cours de fran\xE7ais", "DELF / DALF", "M\xE9diath\xE8que", "Cin\xE9-club"],
          actions: [
            { label: "D\xE9couvrir l'Alliance", href: "https://www.alliance.ph/" },
            { label: "Voir la fiche de l'Alliance", href: "../../languagecenters.html#institute-af-manille", variant: "secondary" }
          ]
        },
        {
          id: "saging-ca-va",
          name: "Saging \xC7a Va ? \u2014 French for Filipinos",
          imageSrc: "./images/community/saging-july-19-tricolore-flag.jpg",
          imageAlt: "Membres de Saging \xC7a Va ? r\xE9unis derri\xE8re le drapeau fran\xE7ais le 19 juillet 2026",
          gallery: [
            {
              src: "./images/community/saging-july-19-tricolore-flag.jpg",
              alt: "Membres de Saging \xC7a Va ? r\xE9unis derri\xE8re le drapeau fran\xE7ais",
              caption: "Le tricolore au c\u0153ur de la rencontre du 19 juillet 2026"
            },
            {
              type: "facebookReel",
              sourceUrl: "https://www.facebook.com/reel/1625937425280058",
              title: "Reel de la rencontre Saging \xC7a Va ? chez Cr\xEApe Glazik",
              caption: "La rencontre chez Cr\xEApe Glazik, racont\xE9e en reel"
            },
            {
              src: "./images/community/saging-july-19-group-portrait.jpg",
              alt: "Portrait de groupe pendant la rencontre Saging \xC7a Va ? du 19 juillet 2026",
              caption: "Autour de la table pour c\xE9l\xE9brer la f\xEAte nationale fran\xE7aise"
            },
            {
              src: "./images/community/saging-july-19-activity.jpg",
              alt: "Participants \xE0 un jeu en fran\xE7ais pendant la rencontre du 19 juillet 2026",
              caption: "Brise-glace, Mot interdit et T\xE9l\xE9phone arabe en fran\xE7ais"
            },
            {
              src: "./images/community/saging-february-28-group-portrait.jpg",
              alt: "Portrait de groupe \xE0 la rencontre Cr\xEApe de la Cr\xEApe du 28 f\xE9vrier 2026",
              caption: "\xAB Cr\xEApe de la Cr\xEApe \xBB chez Cr\xEApe Glazik, le 28 f\xE9vrier 2026"
            },
            {
              src: "./images/community/saging-february-28-event-card.jpg",
              alt: "Cartes souvenir Cr\xEApe de la Cr\xEApe de Saging \xC7a Va ?",
              caption: "Les cartes souvenir de la deuxi\xE8me Chandeleur du groupe"
            },
            {
              src: "./images/community/saging-february-28-conversation.jpg",
              alt: "Deux participants \xE9changent en fran\xE7ais pendant Cr\xEApe de la Cr\xEApe",
              caption: "Une conversation pendant l\u2019apr\xE8s-midi autour des cr\xEApes"
            },
            {
              src: "./images/community/saging-february-28-table-activity.jpg",
              alt: "Participants r\xE9unis pour une activit\xE9 de conversation le 28 f\xE9vrier 2026",
              caption: "Les activit\xE9s de langue continuent autour de la table"
            },
            {
              src: "./images/community/saging-community-members.jpg",
              alt: "Aljohn avec plusieurs membres du groupe Saging \xC7a Va ?",
              caption: "Avec des membres de Saging \xC7a Va ?"
            },
            {
              src: "./images/community/france-norway-world-cup-poblacion.jpg",
              alt: "Aljohn et un ami pendant le match France\u2013Norv\xE8ge \xE0 Poblacion",
              caption: "Le match France\u2013Norv\xE8ge avec un ami \xE0 Poblacion"
            },
            {
              src: "../../images/groups/saging_cava_feb2024_meetup4.jpg",
              alt: "Participants \xE0 une rencontre Saging \xC7a Va ?",
              caption: "Une rencontre de la communaut\xE9 \xE0 Manille en f\xE9vrier 2024"
            },
            {
              src: "../../images/groups/saging_cava_feb2024_meetup2.jpg",
              alt: "Conversation en fran\xE7ais pendant une rencontre Saging \xC7a Va ?",
              caption: "Parler fran\xE7ais autour de la m\xEAme table"
            },
            {
              src: "../../images/groups/saging_cava_group_screenshot.png",
              alt: "Aper\xE7u du groupe Facebook Saging \xC7a Va ?",
              caption: "Garder le contact entre les rencontres"
            },
            {
              src: "../../images/groups/saging_cava_feb2024_meetup_sticker.jpg",
              alt: "Autocollant souvenir de Saging \xC7a Va ?",
              caption: "Un petit souvenir de la communaut\xE9"
            }
          ],
          logoSrc: "../../images/groups/saging_cava_logo_yellowbg.jpg",
          logoAlt: "Logo de Saging \xC7a Va ?",
          reverse: true,
          paragraphs: [
            "Saging \xC7a Va ? \u2014 French for Filipinos est une communaut\xE9 locale d'apprenants philippins et de francophones qui se retrouvent \xE0 Manille pour pratiquer le fran\xE7ais dans une ambiance d\xE9tendue.",
            "Les rencontres m\xEAlent conversations, jeux et sorties. Le groupe Facebook permet de partager les prochains rendez-vous et de garder le contact entre deux rencontres."
          ],
          tags: ["Rencontres \xE0 Makati", "Jeux en fran\xE7ais", "Groupe Facebook", "Communaut\xE9 locale"],
          actions: [
            { label: "D\xE9couvrir la communaut\xE9", href: "../../groups/sagingcava.html" },
            { label: "Rejoindre le groupe", href: "https://www.facebook.com/groups/846327791047174", variant: "secondary" }
          ]
        },
        {
          id: "alliance-cebu",
          name: "Alliance Fran\xE7aise de Cebu",
          imageSrc: "../../images/languagecenters/alliance_cebu_aljohn_with_cebu_filipinofrench_speakers_group.jpg",
          imageAlt: "Aljohn avec des francophones \xE0 l'Alliance Fran\xE7aise de Cebu",
          gallery: [
            {
              src: "../../images/languagecenters/alliance_cebu_aljohn_with_cebu_filipinofrench_speakers_group.jpg",
              alt: "Aljohn avec le groupe de francophones de l'Alliance Fran\xE7aise de Cebu",
              caption: "Avec les francophones de Cebu"
            },
            {
              src: "../../images/languagecenters/alliance_cebu_aljohn_with_cebu_filipinofrench_speakers_bts.jpg",
              alt: "Coulisses du tournage d'Aljohn \xE0 l'Alliance Fran\xE7aise de Cebu",
              caption: "Dans les coulisses de notre tournage"
            },
            {
              src: "../../images/languagecenters/alliance_cebu_aljohn_with_cebu_filipinofrench_speakers_bts_2.jpg",
              alt: "Conversation pendant le tournage \xE0 l'Alliance Fran\xE7aise de Cebu",
              caption: "Des histoires francophones venues des Visayas"
            }
          ],
          logoSrc: "images/resources/alliance-francaise-cebu-logo.jpg",
          logoAlt: "Logo de l'Alliance Fran\xE7aise de Cebu",
          paragraphs: [
            "L'Alliance Fran\xE7aise de Cebu est un v\xE9ritable relais francophone dans les Visayas, avec des cours, des certifications et des \xE9v\xE9nements culturels pour tous les niveaux.",
            "J'y ai tourn\xE9 une vid\xE9o avec des francophones de Cebu. Leur accueil et leur envie de partager la langue ont donn\xE9 \xE0 cette rencontre une \xE9nergie que je voulais garder ici."
          ],
          tags: ["Cours en ligne et sur place", "DELF / DALF", "\xC9v\xE9nements culturels", "Communaut\xE9 des Visayas"],
          actions: [
            { label: "D\xE9couvrir l'Alliance", href: "https://alliancefr.ph/" },
            { label: "Voir la vid\xE9o de Cebu", href: "https://www.youtube.com/watch?v=dRswor7uF_Y", variant: "secondary" }
          ]
        },
        {
          id: "ambassade-france",
          name: "La francophonie avec l'Ambassade de France",
          imageSrc: "../../images/languagecenters/fr_embassy_paris2024olympics_opening_pic_with_ambassador_marie_fontanel_should_be_at_front.jpg",
          imageAlt: "Aljohn avec l'ambassadrice Marie Fontanel pendant un \xE9v\xE9nement Paris 2024",
          gallery: [
            {
              src: "../../images/languagecenters/fr_embassy_paris2024olympics_opening_pic_with_ambassador_marie_fontanel_should_be_at_front.jpg",
              alt: "Aljohn avec l'ambassadrice Marie Fontanel pendant un \xE9v\xE9nement Paris 2024",
              caption: "Avec l'ambassadrice Marie Fontanel pour Paris 2024"
            },
            {
              type: "facebookReel",
              sourceUrl: "https://www.facebook.com/reel/1161771929440983",
              title: "Reel d'Aljohn au Festival du film fran\xE7ais",
              caption: "Mon souvenir vid\xE9o du Festival du film fran\xE7ais"
            },
            {
              src: "../../images/languagecenters/fr_embassy_2024_filmfestival_with_embassy_cultural_attache_martin_macalintal.jpg",
              alt: "Aljohn avec Martin Macalintal pendant le Festival du film fran\xE7ais",
              caption: "Au Festival du film fran\xE7ais avec Martin Macalintal"
            },
            {
              src: "../../images/languagecenters/fr_embassy_2024_filmfestival.jpg",
              alt: "Aljohn au Festival du film fran\xE7ais aux Philippines",
              caption: "Le cin\xE9ma fran\xE7ais v\xE9cu \xE0 Manille"
            },
            {
              src: "../../images/languagecenters/fr_embassy_2024_filmfestival2.jpg",
              alt: "Aljohn pendant un autre moment du Festival du film fran\xE7ais",
              caption: "Des rencontres autour de la culture francophone"
            }
          ],
          flagBadge: true,
          reverse: true,
          paragraphs: [
            "Festivals de cin\xE9ma, Semaine de la francophonie et rendez-vous culturels ouvrent d'autres portes sur la langue. Ce sont des moments o\xF9 le fran\xE7ais sort de la salle de classe et circule dans toute la ville.",
            "J'ai notamment eu la chance de chanter lors d'une soir\xE9e karaok\xE9 de la Francophonie et de participer au Festival du film fran\xE7ais \u2014 deux souvenirs tr\xE8s diff\xE9rents, mais la m\xEAme communaut\xE9 autour de la langue."
          ],
          tags: ["Festival du film fran\xE7ais", "Francophonie", "\xC9changes culturels", "\xC9v\xE9nements publics"],
          actions: [
            { label: "Voir le site de l'Ambassade", href: "https://ph.ambafrance.org/" },
            { label: "Suivre les actualit\xE9s", href: "https://www.facebook.com/FrenchEmbassyPH/", variant: "secondary" }
          ]
        }
      ]
    };
  }
});

// languages/french/js/data/french-study-kit-data.js
var require_french_study_kit_data = __commonJS({
  "languages/french/js/data/french-study-kit-data.js"() {
    window.frenchStudyKitData = {
      resources: [
        {
          id: "french-study-folder",
          step: "1",
          action: "Rassembler",
          name: "French Studies, Workbooks, Audio & More",
          description: "Le dossier principal pour retrouver au m\xEAme endroit les supports d\u2019\xE9tude, les cahiers et les ressources audio fournis pour ce parcours.",
          href: "https://drive.google.com/drive/folders/1EWspriB7F8TlfEUe4i04H3zCjran38Yh",
          linkLabel: "Ouvrir le dossier",
          icon: "fa-solid fa-folder-open",
          service: "Google Drive"
        },
        {
          id: "french-audio-folder",
          step: "2",
          action: "\xC9couter",
          name: "Audio \u2014 French Without Effort",
          description: "Le dossier d\xE9di\xE9 aux pistes num\xE9rot\xE9es de la m\xE9thode, s\xE9par\xE9 du reste des documents pour retrouver rapidement la s\xE9ance d\u2019\xE9coute.",
          href: "https://drive.google.com/drive/folders/19bcbKK9a5odFi0FBb6p_IZ_lBmXKmcha",
          linkLabel: "Ouvrir les pistes audio",
          icon: "fa-solid fa-headphones",
          service: "Google Drive"
        },
        {
          id: "french-conjugation-map",
          step: "3",
          action: "R\xE9viser",
          name: "Carte des temps et conjugaisons",
          description: "Une grande feuille de r\xE9f\xE9rence qui met c\xF4te \xE0 c\xF4te indicatif, subjonctif, conditionnel, imp\xE9ratif, participes et exemples de terminaisons.",
          href: "https://docs.google.com/spreadsheets/d/1r_ChFFktV-o8TBEZ3KFYpISQeuKadktV8kXXilTNu-c/edit?gid=554078650#gid=554078650",
          linkLabel: "Consulter la carte",
          icon: "fa-solid fa-table-cells-large",
          service: "Google Sheets"
        }
      ],
      linguno: {
        title: "Linguno pour les conjugaisons",
        description: "Pour une s\xE9ance courte et cibl\xE9e, Linguno permet de travailler les conjugaisons fran\xE7aises sous forme de quiz. Je l'utilise comme compl\xE9ment pratique entre deux moments d'\xE9coute ou de conversation. Choisis un temps, un groupe de verbes et un niveau de difficult\xE9 : dix minutes suffisent pour rep\xE9rer les formes qui demandent encore de l'attention.",
        href: "https://www.linguno.com/language/fra/",
        linkLabel: "Pratiquer le fran\xE7ais"
      }
    };
  }
});

// languages/french/js/data/french-books-data.js
var require_french_books_data = __commonJS({
  "languages/french/js/data/french-books-data.js"() {
    window.frenchBooksData = [
      {
        id: "le-petit-prince",
        title: "Le Petit Prince",
        author: "Antoine de Saint-Exup\xE9ry",
        category: "Conte philosophique",
        levels: ["A2", "B1"],
        coverImage: "/library/images/books/french/le-petit-prince.jpg",
        coverAlt: "Couverture fran\xE7aise du Petit Prince",
        shortDescription: "Une rencontre dans le d\xE9sert qui parle d\u2019amiti\xE9, de responsabilit\xE9 et de ce que les grandes personnes ne voient plus.",
        longDescription: "Un aviateur \xE9chou\xE9 dans le Sahara rencontre un petit voyageur venu d\u2019une autre plan\xE8te. Le r\xE9cit avance par sc\xE8nes br\xE8ves et images m\xE9morables, mais ses dialogues simples ouvrent sur des id\xE9es plus profondes : apprivoiser, prendre soin et regarder autrement.",
        guidance: "Lis un chapitre \xE0 la fois. \xC0 A2, appuie-toi sur les illustrations et rel\xE8ve les phrases courtes qui reviennent. \xC0 B1, observe le double sens des rencontres et reformule la le\xE7on de chaque plan\xE8te.",
        sourceLabel: "Site officiel du Petit Prince",
        links: [
          {
            label: "D\xE9couvrir l\u2019\u0153uvre",
            href: "https://www.lepetitprince.com/loeuvre/",
            variant: "primary",
            icon: "fa-solid fa-arrow-up-right-from-square"
          }
        ]
      },
      {
        id: "fables-la-fontaine",
        title: "Fables de La Fontaine",
        author: "Jean de La Fontaine",
        category: "Fables illustr\xE9es",
        levels: ["B1", "B2"],
        coverImage: "/library/images/books/french/fables-la-fontaine.jpg",
        coverAlt: "Couverture de l\u2019\xE9dition illustr\xE9e des Fables de La Fontaine",
        shortDescription: "Des animaux, des sc\xE8nes vives et des morales \xE0 relire pour apprivoiser le rythme, l\u2019ironie et une langue plus ancienne.",
        longDescription: "Cette \xE9dition illustr\xE9e par Grandville r\xE9unit les fables en vers et conserve une partie de leur graphie historique. Chaque texte forme une petite sc\xE8ne compl\xE8te : id\xE9al pour une lecture courte, puis une seconde lecture attentive au rythme et \xE0 la morale.",
        guidance: "Commence par une fable dont tu connais d\xE9j\xE0 l\u2019histoire. Lis-la \xE0 voix haute, puis r\xE9sume la morale en fran\xE7ais contemporain. L\u2019orthographe ancienne demande plus de souplesse que le niveau apparent du r\xE9cit.",
        sourceLabel: "Project Gutenberg \xB7 livre 56327",
        links: [
          {
            label: "Lire en ligne",
            href: "https://www.gutenberg.org/cache/epub/56327/pg56327-images.html",
            variant: "primary",
            icon: "fa-solid fa-book-open-reader"
          },
          {
            label: "T\xE9l\xE9charger l\u2019EPUB",
            href: "https://www.gutenberg.org/ebooks/56327.epub3.images",
            variant: "secondary",
            icon: "fa-solid fa-download"
          }
        ]
      },
      {
        id: "tour-du-monde",
        title: "Le tour du monde en quatre-vingts jours",
        author: "Jules Verne",
        category: "Roman d\u2019aventures",
        levels: ["B1", "B2"],
        coverImage: "/library/images/books/french/tour-du-monde.jpg",
        coverAlt: "Couverture du Tour du monde en quatre-vingts jours",
        shortDescription: "Une course autour du monde port\xE9e par des \xE9tapes nettes, des rebondissements et le contraste entre Fogg et Passepartout.",
        longDescription: "Phileas Fogg parie qu\u2019il peut faire le tour du monde en quatre-vingts jours. Avec Passepartout, il traverse continents, contretemps et malentendus sans abandonner son calendrier. La structure du voyage aide \xE0 suivre un roman pourtant riche en descriptions.",
        guidance: "Suis l\u2019itin\xE9raire sur une carte et note seulement les mots qui reviennent. Les chapitres courts permettent d\u2019alterner lecture d\xE9taill\xE9e et lecture rapide sans perdre le fil de la course.",
        sourceLabel: "Project Gutenberg \xB7 livre 800",
        links: [
          {
            label: "Lire en ligne",
            href: "https://www.gutenberg.org/cache/epub/800/pg800-images.html",
            variant: "primary",
            icon: "fa-solid fa-book-open-reader"
          },
          {
            label: "T\xE9l\xE9charger l\u2019EPUB",
            href: "https://www.gutenberg.org/ebooks/800.epub3.images",
            variant: "secondary",
            icon: "fa-solid fa-download"
          }
        ]
      },
      {
        id: "voyage-centre-terre",
        title: "Voyage au centre de la Terre",
        author: "Jules Verne",
        category: "Aventure scientifique",
        levels: ["B1", "B2"],
        coverImage: "/library/images/books/french/voyage-centre-terre.jpg",
        coverAlt: "Couverture de Voyage au centre de la Terre",
        shortDescription: "Une exp\xE9dition souterraine o\xF9 le suspense et l\u2019imaginaire scientifique donnent un contexte fort au vocabulaire descriptif.",
        longDescription: "Le professeur Lidenbrock, son neveu Axel et leur guide Hans descendent dans un volcan islandais \xE0 la recherche d\u2019un passage vers le centre du globe. La narration d\u2019Axel rend l\u2019aventure imm\xE9diate, m\xEAme lorsque le vocabulaire devient scientifique ou min\xE9ral.",
        guidance: "Ne bloque pas sur chaque terme g\xE9ologique. Rep\xE8re d\u2019abord qui agit, o\xF9 le groupe se trouve et quel danger survient; reviens ensuite sur le vocabulaire qui structure la sc\xE8ne.",
        sourceLabel: "Project Gutenberg \xB7 livre 4791",
        links: [
          {
            label: "Lire en ligne",
            href: "https://www.gutenberg.org/cache/epub/4791/pg4791-images.html",
            variant: "primary",
            icon: "fa-solid fa-book-open-reader"
          },
          {
            label: "T\xE9l\xE9charger l\u2019EPUB",
            href: "https://www.gutenberg.org/ebooks/4791.epub3.images",
            variant: "secondary",
            icon: "fa-solid fa-download"
          }
        ]
      },
      {
        id: "trois-mousquetaires",
        title: "Les trois mousquetaires",
        author: "Alexandre Dumas et Auguste Maquet",
        category: "Roman historique",
        levels: ["B2", "C1"],
        coverImage: "/library/images/books/french/trois-mousquetaires.jpg",
        coverAlt: "Couverture des Trois Mousquetaires",
        shortDescription: "Un long roman de duels, d\u2019alliances et d\u2019intrigues o\xF9 l\u2019\xE9lan du r\xE9cit r\xE9compense une lecture r\xE9guli\xE8re.",
        longDescription: "D\u2019Artagnan arrive \xE0 Paris avec l\u2019ambition de devenir mousquetaire. Sa rencontre avec Athos, Porthos et Aramis l\u2019entra\xEEne dans les intrigues de la cour et les rivalit\xE9s politiques du r\xE8gne de Louis XIII. Les dialogues donnent du mouvement \xE0 un texte tr\xE8s ample.",
        guidance: "Garde une petite liste des personnages et lis par \xE9pisodes plut\xF4t que par nombre de pages. \xC0 B2, vise le fil de l\u2019action; \xE0 C1, observe les registres de politesse, les sous-entendus et le vocabulaire historique.",
        sourceLabel: "Project Gutenberg \xB7 livre 13951",
        links: [
          {
            label: "Lire en ligne",
            href: "https://www.gutenberg.org/cache/epub/13951/pg13951-images.html",
            variant: "primary",
            icon: "fa-solid fa-book-open-reader"
          },
          {
            label: "T\xE9l\xE9charger l\u2019EPUB",
            href: "https://www.gutenberg.org/ebooks/13951.epub3.images",
            variant: "secondary",
            icon: "fa-solid fa-download"
          }
        ]
      },
      {
        id: "candide",
        title: "Candide, ou l\u2019Optimisme",
        author: "Voltaire",
        category: "Conte satirique",
        levels: ["B2", "C1"],
        coverImage: "/library/images/books/french/candide.jpg",
        coverAlt: "Couverture de Candide, ou l\u2019Optimisme",
        shortDescription: "Un r\xE9cit rapide et mordant dont les aventures deviennent plus riches quand on commence \xE0 reconna\xEEtre l\u2019ironie.",
        longDescription: "Chass\xE9 du monde prot\xE9g\xE9 o\xF9 il a grandi, Candide traverse une suite de catastrophes qui met \xE0 l\u2019\xE9preuve l\u2019optimisme enseign\xE9 par Pangloss. L\u2019action avance vite, mais le plaisir du texte repose sur le d\xE9calage entre les \xE9v\xE9nements et la mani\xE8re de les raconter.",
        guidance: "Lis d\u2019abord pour suivre les m\xE9saventures, puis relis les passages o\xF9 le ton para\xEEt \xE9trangement calme. C\u2019est souvent l\xE0 que se cache la satire. Une \xE9dition annot\xE9e peut aider pour les r\xE9f\xE9rences philosophiques.",
        sourceLabel: "Project Gutenberg \xB7 livre 4650",
        links: [
          {
            label: "Lire en ligne",
            href: "https://www.gutenberg.org/cache/epub/4650/pg4650-images.html",
            variant: "primary",
            icon: "fa-solid fa-book-open-reader"
          },
          {
            label: "T\xE9l\xE9charger l\u2019EPUB",
            href: "https://www.gutenberg.org/ebooks/4650.epub3.images",
            variant: "secondary",
            icon: "fa-solid fa-download"
          }
        ]
      }
    ];
  }
});

// languages/french/js/data/french-podcasts-data.js
var require_french_podcasts_data = __commonJS({
  "languages/french/js/data/french-podcasts-data.js"() {
    window.frenchPodcastsData = [
      {
        id: "hugodecrypte-actus-interviews",
        title: "HugoD\xE9crypte \u2014 Actus et interviews",
        publisher: "HugoD\xE9crypte",
        format: "Actualit\xE9 \xB7 entretiens",
        levels: ["B1", "B2", "C1"],
        coverImage: "images/podcasts/hugodecrypte-actus-interviews.webp",
        coverAlt: "Portrait d\u2019Hugo Travers sur la couverture du podcast HugoD\xE9crypte \u2014 Actus et interviews",
        description: "L\u2019essentiel de l\u2019actualit\xE9 arrive en capsules quotidiennes d\u2019environ dix minutes, compl\xE9t\xE9es par des points pop culture et des entretiens plus longs avec des personnalit\xE9s des m\xE9dias et du spectacle.",
        guidance: "Commence par un sujet que tu connais d\xE9j\xE0 : la structure est claire, mais les noms propres et le d\xE9bit d\u2019information demandent une \xE9coute active. Une seconde \xE9coute suffit souvent pour retrouver les articulations du r\xE9sum\xE9.",
        links: [
          {
            label: "\xC9couter sur Pocket Casts",
            href: "https://pocketcasts.com/podcast/hugod%C3%A9crypte-actus-et-interviews/8f36f930-4ee1-0139-3394-0acc26574db2",
            icon: "fa-solid fa-headphones"
          },
          {
            label: "Voir la page officielle",
            href: "https://shows.acast.com/les-actus-du-jour-hugo-decrypte",
            icon: "fa-solid fa-arrow-up-right-from-square"
          }
        ]
      },
      {
        id: "inpower-louise-aubery",
        title: "InPower par Louise Aubery",
        publisher: "MyBetterSelf \xB7 Louise Aubery",
        format: "Conversation \xB7 parcours",
        levels: ["B2", "C1"],
        coverImage: "images/podcasts/inpower-louise-aubery.webp",
        coverAlt: "Louise Aubery tenant un micro sur la couverture du podcast InPower",
        description: "Louise Aubery re\xE7oit chaque semaine des invit\xE9s aux trajectoires tr\xE8s diff\xE9rentes. Les \xE9changes d\xE9veloppent leurs choix, leurs ambitions, leurs doutes et les le\xE7ons concr\xE8tes tir\xE9es de leur parcours.",
        guidance: "Les \xE9pisodes longs laissent le temps de s\u2019habituer aux voix, mais les r\xE9ponses restent spontan\xE9es. Rep\xE8re d\u2019abord les relances de Louise, puis reviens sur un passage o\xF9 l\u2019invit\xE9 raconte une d\xE9cision pr\xE9cise.",
        links: [
          {
            label: "\xC9couter sur Pocket Casts",
            href: "https://pocketcasts.com/podcast/inpower-par-louise-aubery/b6dd4780-2897-0136-c266-7d73a919276a",
            icon: "fa-solid fa-headphones"
          },
          {
            label: "Voir la page officielle",
            href: "https://shows.acast.com/inpower",
            icon: "fa-solid fa-arrow-up-right-from-square"
          }
        ]
      },
      {
        id: "affaires-sensibles",
        title: "Affaires sensibles",
        publisher: "France Inter \xB7 Fabrice Drouelle",
        format: "Documentaire \xB7 archives",
        levels: ["B2", "C1"],
        coverImage: "images/podcasts/affaires-sensibles.webp",
        coverAlt: "Fabrice Drouelle sur la couverture rouge et bleue du podcast Affaires sensibles de France Inter",
        description: "Fabrice Drouelle raconte les grandes affaires, aventures et proc\xE8s qui ont marqu\xE9 les cinquante derni\xE8res ann\xE9es. Le r\xE9cit radiophonique m\xEAle narration, archives sonores et \xE9clairage d\u2019un invit\xE9.",
        guidance: "La diction est pos\xE9e, mais le vocabulaire historique, judiciaire et politique est dense. \xC9coute d\u2019abord le r\xE9cit sans pause, puis utilise le titre et les archives comme rep\xE8res pour reconstruire la chronologie.",
        links: [
          {
            label: "\xC9couter sur Pocket Casts",
            href: "https://pocketcasts.com/podcast/affaires-sensibles/c414b6a0-0f17-0132-aa1e-5f4c86fd3263",
            icon: "fa-solid fa-headphones"
          },
          {
            label: "\xC9couter sur France Inter",
            href: "https://www.radiofrance.fr/franceinter/podcasts/affaires-sensibles",
            icon: "fa-solid fa-radio"
          }
        ]
      },
      {
        id: "une-lettre-amerique",
        title: "Une lettre d\u2019Am\xE9rique",
        publisher: "RTL \xB7 Arnaud Tousch et Cyrielle Stadler",
        format: "Correspondance \xB7 soci\xE9t\xE9",
        levels: ["B2", "C1"],
        coverImage: "images/podcasts/une-lettre-amerique.webp",
        coverAlt: "Illustration de la statue de la Libert\xE9 sur la couverture du podcast Une lettre d\u2019Am\xE9rique de RTL",
        description: "Depuis New York, Arnaud Tousch et Cyrielle Stadler proposent un courrier audio hebdomadaire sur la politique, la culture et la vie quotidienne aux \xC9tats-Unis, racont\xE9 \xE0 la premi\xE8re personne.",
        guidance: "Le format d\u2019une vingtaine de minutes suit un fil \xE9ditorial net. Avant l\u2019\xE9coute, lis le titre et pr\xE9vois quelques mots-cl\xE9s am\xE9ricains : ils t\u2019aideront \xE0 suivre les exemples et les changements de voix.",
        links: [
          {
            label: "\xC9couter sur Pocket Casts",
            href: "https://pocketcasts.com/podcast/une-lettre-dam%C3%A9rique/b6e607b0-62af-0137-f267-1d245fc5f9cf",
            icon: "fa-solid fa-headphones"
          },
          {
            label: "\xC9couter sur RTL",
            href: "https://www.rtl.fr/programmes/une-lettre-d-amerique",
            icon: "fa-solid fa-radio"
          }
        ]
      }
    ];
  }
});

// languages/french/js/renderers/french-playlists-renderer.js
var require_french_playlists_renderer = __commonJS({
  "languages/french/js/renderers/french-playlists-renderer.js"() {
    function renderFrenchPlaylists() {
      const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      });
      const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      const buildMetaText = (video) => {
        const parts = [];
        if (video.publishedAt) {
          const publishedDate = /* @__PURE__ */ new Date(`${video.publishedAt}T00:00:00Z`);
          if (!Number.isNaN(publishedDate.getTime())) {
            parts.push(dateFormatter.format(publishedDate));
          }
        }
        if (video.duration) {
          parts.push(video.duration);
        }
        if (video.subtitleNote) {
          parts.push(video.subtitleNote);
        }
        if (video.channelName) {
          parts.push(video.channelName);
        }
        return parts.join(" \u2022 ");
      };
      const getPlaylistId = (playlistUrl) => {
        if (!playlistUrl) {
          return "";
        }
        try {
          return new URL(playlistUrl).searchParams.get("list") ?? "";
        } catch (error) {
          return "";
        }
      };
      const setupPlaylist = ({
        items,
        playlistUrl,
        playerId,
        titleId,
        metaId,
        linkId,
        listId,
        itemClassName = "playlist-item-fr"
      }) => {
        const player = document.getElementById(playerId);
        const title = document.getElementById(titleId);
        const meta = document.getElementById(metaId);
        const link = document.getElementById(linkId);
        const list = document.getElementById(listId);
        if (!player || !title || !meta || !link || !list || !Array.isArray(items) || items.length === 0) {
          return;
        }
        const playlistId = getPlaylistId(playlistUrl);
        const updateFeaturedVideo = (video, autoplay = false) => {
          const playerParams = new URLSearchParams({ rel: "0" });
          if (autoplay) {
            playerParams.set("autoplay", "1");
          }
          if (playlistId) {
            playerParams.set("list", playlistId);
          }
          player.src = `https://www.youtube.com/embed/${video.id}?${playerParams.toString()}`;
          title.textContent = video.title;
          meta.textContent = buildMetaText(video);
          link.href = playlistId ? `https://www.youtube.com/watch?v=${video.id}&list=${playlistId}` : `https://www.youtube.com/watch?v=${video.id}`;
          link.setAttribute("aria-label", `Voir ${video.title} sur YouTube`);
        };
        const setActiveState = (activeItem) => {
          list.querySelectorAll(`.${itemClassName}`).forEach((item) => {
            item.classList.remove("active-video");
            item.setAttribute("aria-pressed", "false");
          });
          activeItem.classList.add("active-video");
          activeItem.setAttribute("aria-pressed", "true");
        };
        updateFeaturedVideo(items[0], false);
        list.innerHTML = "";
        items.forEach((video, index) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = itemClassName;
          item.setAttribute("aria-pressed", index === 0 ? "true" : "false");
          item.setAttribute("aria-label", `Lire ${video.title}`);
          if (index === 0) {
            item.classList.add("active-video");
          }
          item.innerHTML = `
                <img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="${escapeHtml(video.title)}" class="playlist-thumbnail-fr">
                <div class="playlist-text-fr">
                    <h4 class="playlist-item-title-fr">${escapeHtml(video.title)}</h4>
                    <p class="playlist-item-desc-fr">${escapeHtml(buildMetaText(video))}</p>
                </div>
            `;
          item.addEventListener("click", () => {
            if (item.classList.contains("active-video")) {
              return;
            }
            setActiveState(item);
            updateFeaturedVideo(video, true);
          });
          list.appendChild(item);
        });
      };
      setupPlaylist({
        items: window.frenchPlaylistData,
        playlistUrl: "https://www.youtube.com/playlist?list=PLHC88jnBSUqJKNya7qTUk48v9qS28l5I-",
        playerId: "featured-video-player-fr",
        titleId: "playlist-title-fr",
        metaId: "playlist-meta-fr",
        linkId: "playlist-youtube-link-fr",
        listId: "playlist-items-container-fr"
      });
      setupPlaylist({
        items: window.extraFrenchPlaylistData ? window.extraFrenchPlaylistData.episodes : [],
        playlistUrl: window.extraFrenchPlaylistData ? window.extraFrenchPlaylistData.playlistUrl : "",
        playerId: "extra-player-fr",
        titleId: "extra-title-fr",
        metaId: "extra-meta-fr",
        linkId: "extra-youtube-link-fr",
        listId: "extra-playlist-fr"
      });
    }
    window.renderFrenchPlaylists = renderFrenchPlaylists;
  }
});

// languages/french/js/renderers/french-curated-channels-renderer.js
var require_french_curated_channels_renderer = __commonJS({
  "languages/french/js/renderers/french-curated-channels-renderer.js"() {
    function renderFrenchCuratedChannels() {
      const data = window.frenchCuratedChannelsData;
      const shelvesContainer = document.getElementById("curated-channel-shelves-fr");
      const filterContainer = document.getElementById("curated-filter-chips-fr");
      const searchInput = document.getElementById("curated-search-input-fr");
      const levelSelect = document.getElementById("curated-level-select-fr");
      const resultsStatus = document.getElementById("curated-results-status-fr");
      const emptyState = document.getElementById("curated-empty-state-fr");
      const resetButton = document.getElementById("curated-reset-fr");
      const modal = document.getElementById("curated-channel-modal-fr");
      const modalDialog = modal?.querySelector(".curated-channel-modal-dialog-fr");
      const modalCloseButton = document.getElementById("curated-modal-close-fr");
      if (!data || !Array.isArray(data.categories) || !Array.isArray(data.channels) || !shelvesContainer || !filterContainer || !searchInput || !levelSelect || !resultsStatus || !emptyState || !modal || !modalDialog || !modalCloseButton) {
        return;
      }
      const categoryById = new Map(data.categories.map((category) => [category.id, category]));
      const channelById = new Map(data.channels.map((channel) => [channel.id, channel]));
      const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
      const shelfLeadOrder = {
        personnalites: ["linh", "jeck", "pierre-garnier"]
      };
      const state = {
        activeCategory: "all",
        activeLevel: "all",
        query: "",
        modalTrigger: null
      };
      const normalise = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      const getLevelRange = (levels) => {
        if (!Array.isArray(levels) || levels.length === 0) return "Tous niveaux";
        if (levels.length === 1) return levels[0];
        return `${levels[0]}\u2013${levels[levels.length - 1]}`;
      };
      const getLevelGuidance = (levels) => {
        if (levels.includes("A1")) {
          return "Bon point de d\xE9part : appuie-toi sur les images, les r\xE9p\xE9titions et les sous-titres fran\xE7ais.";
        }
        if (levels.includes("A2")) {
          return "Id\xE9al pour consolider l\u2019\xE9coute : cherche d\u2019abord l\u2019id\xE9e g\xE9n\xE9rale, puis rel\xE8ve quelques expressions.";
        }
        if (levels.includes("B1")) {
          return "\xC0 ce niveau, utilise la cha\xEEne comme immersion r\xE9guli\xE8re et r\xE9duis progressivement les sous-titres.";
        }
        return "Contenu natif exigeant : parfait pour travailler le d\xE9bit, les nuances, l\u2019argot et les r\xE9f\xE9rences culturelles.";
      };
      const getProfilePlatform = (channel) => {
        if (channel.profilePlatform === "instagram") {
          return { icon: "fa-brands fa-instagram", label: "Profil Instagram", className: "instagram" };
        }
        return { icon: "fa-brands fa-youtube", label: "Cha\xEEne YouTube", className: "youtube" };
      };
      const matchesFilters = (channel) => {
        const queryTokens = normalise(state.query).split(/\s+/).filter(Boolean);
        const categoryText = channel.categories.map((categoryId) => categoryById.get(categoryId)?.title || "").join(" ");
        const searchText = normalise(
          `${channel.name} ${channel.shortDescription} ${channel.longDescription} ${categoryText}`
        );
        const matchesQuery = queryTokens.length === 0 || queryTokens.every((token) => searchText.includes(token));
        const matchesLevel = state.activeLevel === "all" || channel.levels.includes(state.activeLevel);
        const matchesCategory = state.activeCategory === "all" || channel.categories.includes(state.activeCategory);
        return matchesQuery && matchesLevel && matchesCategory;
      };
      const renderFilters = () => {
        const filters = [
          { id: "all", title: "Tous les rayons", icon: "fa-solid fa-border-all" },
          ...data.categories
        ];
        filterContainer.replaceChildren();
        filters.forEach((filter) => {
          const button = document.createElement("button");
          const isActive = filter.id === state.activeCategory;
          button.type = "button";
          button.className = "curated-filter-chip-fr";
          button.dataset.category = filter.id;
          button.setAttribute("aria-pressed", String(isActive));
          button.classList.toggle("active", isActive);
          button.innerHTML = `
                <i class="${filter.icon}" aria-hidden="true"></i>
                <span>${filter.title}</span>
            `;
          filterContainer.appendChild(button);
        });
      };
      const createChannelCard = (channel) => {
        const card = document.createElement("button");
        const visual = document.createElement("span");
        const image = document.createElement("img");
        const platform = document.createElement("span");
        const body = document.createElement("span");
        const meta = document.createElement("span");
        const category = document.createElement("span");
        const level = document.createElement("span");
        const title = document.createElement("strong");
        const description = document.createElement("span");
        const action = document.createElement("span");
        const primaryCategory = categoryById.get(channel.categories[0]);
        const profilePlatform = getProfilePlatform(channel);
        card.type = "button";
        card.className = "curated-channel-card-fr";
        card.dataset.channelId = channel.id;
        card.setAttribute("aria-haspopup", "dialog");
        card.setAttribute("aria-label", `Voir la fiche de ${channel.name}`);
        visual.className = "curated-channel-visual-fr";
        image.src = channel.profilePic;
        image.alt = channel.imageAlt || `Photo de la cha\xEEne ${channel.name}`;
        image.loading = "lazy";
        image.decoding = "async";
        image.width = 220;
        image.height = 220;
        platform.className = "curated-channel-platform-fr";
        platform.classList.add(profilePlatform.className);
        platform.setAttribute("aria-label", profilePlatform.label);
        platform.innerHTML = `<i class="${profilePlatform.icon}" aria-hidden="true"></i>`;
        visual.append(image, platform);
        body.className = "curated-channel-card-body-fr";
        meta.className = "curated-channel-card-meta-fr";
        category.className = "curated-channel-category-fr";
        category.textContent = primaryCategory?.title || "Cr\xE9ateur francophone";
        level.className = "curated-channel-level-fr";
        level.textContent = getLevelRange(channel.levels);
        meta.append(category, level);
        title.className = "curated-channel-name-fr";
        title.textContent = channel.name;
        description.className = "curated-channel-description-fr";
        description.textContent = channel.shortDescription;
        action.className = "curated-channel-action-fr";
        action.innerHTML = 'Voir la fiche <span aria-hidden="true">\u2192</span>';
        body.append(meta, title, description, action);
        card.append(visual, body);
        return card;
      };
      const createShelf = (category, channels) => {
        const shelf = document.createElement("article");
        const header = document.createElement("header");
        const icon = document.createElement("span");
        const headingGroup = document.createElement("div");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const row = document.createElement("div");
        shelf.className = "curated-channel-shelf-fr";
        shelf.id = `chaines-${category.id}`;
        header.className = "curated-channel-shelf-header-fr";
        icon.className = "curated-channel-shelf-icon-fr";
        icon.innerHTML = `<i class="${category.icon}" aria-hidden="true"></i>`;
        title.textContent = category.title;
        description.textContent = category.description;
        headingGroup.append(title, description);
        header.append(icon, headingGroup);
        row.className = "curated-channel-row-fr";
        row.setAttribute("role", "list");
        row.setAttribute("aria-label", category.title);
        channels.forEach((channel) => {
          const item = document.createElement("div");
          item.className = "curated-channel-row-item-fr";
          item.setAttribute("role", "listitem");
          item.appendChild(createChannelCard(channel));
          row.appendChild(item);
        });
        shelf.append(header, row);
        return shelf;
      };
      const renderShelves = () => {
        const filteredChannels = data.channels.filter(matchesFilters);
        const fragment = document.createDocumentFragment();
        const visibleCategories = state.activeCategory === "all" ? data.categories : data.categories.filter((category) => category.id === state.activeCategory);
        let renderedShelfCount = 0;
        visibleCategories.forEach((category) => {
          const shelfChannels = filteredChannels.filter((channel) => channel.categories.includes(category.id));
          if (shelfChannels.length === 0) return;
          const leadOrder = shelfLeadOrder[category.id] || [];
          shelfChannels.sort((left, right) => {
            const leftIndex = leadOrder.indexOf(left.id);
            const rightIndex = leadOrder.indexOf(right.id);
            if (leftIndex === -1 && rightIndex === -1) return 0;
            if (leftIndex === -1) return 1;
            if (rightIndex === -1) return -1;
            return leftIndex - rightIndex;
          });
          fragment.appendChild(createShelf(category, shelfChannels));
          renderedShelfCount += 1;
        });
        shelvesContainer.replaceChildren(fragment);
        const hasResults = renderedShelfCount > 0;
        shelvesContainer.hidden = !hasResults;
        emptyState.hidden = hasResults;
        if (!hasResults) {
          resultsStatus.textContent = "Aucun rayon ne correspond \xE0 cette recherche.";
        } else if (state.query) {
          resultsStatus.textContent = `Cr\xE9ateurs correspondant \xE0 \xAB ${state.query.trim()} \xBB.`;
        } else if (state.activeLevel !== "all") {
          resultsStatus.textContent = `Cha\xEEnes conseill\xE9es pour le niveau ${state.activeLevel}.`;
        } else if (state.activeCategory !== "all") {
          resultsStatus.textContent = categoryById.get(state.activeCategory)?.title || "";
        } else {
          resultsStatus.textContent = "Choisis une carte pour ouvrir sa fiche et regarder une vid\xE9o d\u2019exemple.";
        }
      };
      const renderModalLevels = (channel) => {
        const levelsContainer = document.getElementById("curated-modal-levels-fr");
        const guidance = document.getElementById("curated-modal-level-guidance-fr");
        if (!levelsContainer || !guidance) return;
        levelsContainer.replaceChildren();
        cefrLevels.forEach((level) => {
          const marker = document.createElement("span");
          const isRecommended = channel.levels.includes(level);
          marker.className = "curated-channel-level-dot-fr";
          marker.classList.toggle("recommended", isRecommended);
          marker.textContent = level;
          marker.setAttribute("aria-label", `${level}${isRecommended ? " conseill\xE9" : " non conseill\xE9"}`);
          levelsContainer.appendChild(marker);
        });
        guidance.textContent = getLevelGuidance(channel.levels);
      };
      const renderModalLinks = (channel) => {
        const linksContainer = document.getElementById("curated-modal-links-fr");
        if (!linksContainer) return;
        const linkLabels = {
          youtube: { label: "Ouvrir la cha\xEEne", icon: "fa-brands fa-youtube" },
          instagram: { label: "Instagram", icon: "fa-brands fa-instagram" },
          website: { label: "Site officiel", icon: "fa-solid fa-globe" },
          spotify: { label: "Spotify", icon: "fa-brands fa-spotify" }
        };
        linksContainer.replaceChildren();
        Object.entries(channel.links || {}).forEach(([platformName, href]) => {
          if (!href) return;
          const config = linkLabels[platformName] || {
            label: platformName,
            icon: "fa-solid fa-arrow-up-right-from-square"
          };
          const link = document.createElement("a");
          link.className = `btn-fr ${platformName === "youtube" ? "primary" : "secondary"}`;
          link.href = href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.innerHTML = `<i class="${config.icon}" aria-hidden="true"></i> ${config.label}`;
          linksContainer.appendChild(link);
        });
      };
      const getFocusableModalElements = () => Array.from(
        modalDialog.querySelectorAll(
          'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
        )
      );
      const openModal = (channel, trigger) => {
        const image = document.getElementById("curated-modal-image-fr");
        const name = document.getElementById("curated-modal-name-fr");
        const description = document.getElementById("curated-modal-description-fr");
        const longDescription = document.getElementById("curated-modal-long-description-fr");
        const comment = document.getElementById("curated-modal-comment-fr");
        const personalNote = comment?.closest(".curated-channel-personal-note-fr");
        const video = document.getElementById("curated-modal-video-fr");
        const videoTitle = document.getElementById("curated-modal-video-title-fr");
        const platform = document.getElementById("curated-modal-platform-fr");
        if (!image || !name || !description || !longDescription || !comment || !personalNote || !video || !videoTitle || !platform) return;
        state.modalTrigger = trigger;
        const profilePlatform = getProfilePlatform(channel);
        image.src = channel.profilePic;
        image.alt = channel.imageAlt || `Photo de la cha\xEEne ${channel.name}`;
        platform.className = `curated-channel-modal-platform-fr ${profilePlatform.className}`;
        platform.setAttribute("aria-label", profilePlatform.label);
        platform.innerHTML = `<i class="${profilePlatform.icon}" aria-hidden="true"></i>`;
        name.textContent = channel.name;
        description.textContent = channel.shortDescription;
        longDescription.textContent = channel.longDescription;
        const personalComment = typeof channel.aljohnComment === "string" ? channel.aljohnComment.trim() : "";
        comment.textContent = personalComment;
        personalNote.hidden = personalComment.length === 0;
        video.src = `https://www.youtube.com/embed/${channel.sampleVideo.id}?rel=0`;
        video.title = channel.sampleVideo.title;
        videoTitle.textContent = channel.sampleVideo.title;
        renderModalLevels(channel);
        renderModalLinks(channel);
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("curated-modal-open-fr");
        requestAnimationFrame(() => {
          modal.classList.add("open");
          modalCloseButton.focus();
        });
      };
      const closeModal = () => {
        const video = document.getElementById("curated-modal-video-fr");
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("curated-modal-open-fr");
        if (video) video.src = "about:blank";
        window.setTimeout(() => {
          modal.hidden = true;
          state.modalTrigger?.focus();
          state.modalTrigger = null;
        }, 180);
      };
      filterContainer.addEventListener("click", (event) => {
        const button = event.target.closest(".curated-filter-chip-fr");
        if (!button || !filterContainer.contains(button)) return;
        state.activeCategory = button.dataset.category || "all";
        renderFilters();
        renderShelves();
      });
      searchInput.addEventListener("input", () => {
        state.query = searchInput.value;
        renderShelves();
      });
      levelSelect.addEventListener("change", () => {
        state.activeLevel = levelSelect.value;
        renderShelves();
      });
      shelvesContainer.addEventListener("click", (event) => {
        const card = event.target.closest(".curated-channel-card-fr");
        if (!card || !shelvesContainer.contains(card)) return;
        const channel = channelById.get(card.dataset.channelId);
        if (channel) openModal(channel, card);
      });
      resetButton?.addEventListener("click", () => {
        state.activeCategory = "all";
        state.activeLevel = "all";
        state.query = "";
        searchInput.value = "";
        levelSelect.value = "all";
        renderFilters();
        renderShelves();
        searchInput.focus();
      });
      modal.addEventListener("click", (event) => {
        if (event.target.closest("[data-curated-modal-close]")) closeModal();
      });
      modalCloseButton.addEventListener("click", closeModal);
      document.addEventListener("keydown", (event) => {
        if (modal.hidden) return;
        if (event.key === "Escape") {
          event.preventDefault();
          closeModal();
          return;
        }
        if (event.key !== "Tab") return;
        const focusableElements = getFocusableModalElements();
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      });
      renderFilters();
      renderShelves();
    }
    window.renderFrenchCuratedChannels = renderFrenchCuratedChannels;
  }
});

// languages/french/js/renderers/french-resources-renderer.js
var require_french_resources_renderer = __commonJS({
  "languages/french/js/renderers/french-resources-renderer.js"() {
    function renderFrenchResources() {
      const data = window.frenchResourcesData;
      const spotlightContainer = document.getElementById("resource-stack-fr");
      const photoModal = document.getElementById("photo-lightbox-fr");
      const photoModalDialog = photoModal?.querySelector(".photo-lightbox-dialog-fr");
      const photoModalImage = document.getElementById("photo-lightbox-image-fr");
      const photoModalVideo = document.getElementById("photo-lightbox-video-fr");
      const photoModalCaption = document.getElementById("photo-lightbox-caption-fr");
      const photoModalCounter = document.getElementById("photo-lightbox-counter-fr");
      const photoModalClose = document.getElementById("photo-lightbox-close-fr");
      const photoModalPrevious = document.getElementById("photo-lightbox-prev-fr");
      const photoModalNext = document.getElementById("photo-lightbox-next-fr");
      if (!data || !spotlightContainer || !photoModal || !photoModalDialog || !photoModalImage || !photoModalVideo || !photoModalCaption || !photoModalCounter || !photoModalClose || !photoModalPrevious || !photoModalNext) {
        return;
      }
      const lightboxState = {
        items: [],
        activeIndex: 0,
        trigger: null
      };
      const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      const isExternalLink = (href) => /^https?:\/\//i.test(href);
      const renderAction = (action) => {
        const externalAttributes = isExternalLink(action.href) ? ' target="_blank" rel="noopener noreferrer"' : "";
        const variant = action.variant === "secondary" ? "secondary" : "primary";
        return `<a class="btn-fr ${variant}" href="${escapeHtml(action.href)}"${externalAttributes}>${escapeHtml(action.label)}</a>`;
      };
      const renderSpotlightBadge = (spotlight) => {
        if (spotlight.logoSrc) {
          return `<img src="${escapeHtml(spotlight.logoSrc)}" alt="${escapeHtml(spotlight.logoAlt)}" loading="lazy" decoding="async">`;
        }
        if (spotlight.flagBadge) {
          return '<span class="spotlight-logo-mark flag-fr-mark" aria-hidden="true"></span>';
        }
        return `<span class="spotlight-logo-mark" aria-hidden="true">${escapeHtml(spotlight.badge)}</span>`;
      };
      const hasGallery = (spotlight) => Array.isArray(spotlight.gallery) && spotlight.gallery.length > 0;
      const isFacebookReel = (item) => item?.type === "facebookReel";
      const getFacebookEmbedUrl = (sourceUrl) => `https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(sourceUrl)}&show_text=false&width=267&t=0`;
      const renderGalleryItem = (spotlight, item, index) => {
        const activeClass = index === 0 ? " is-active" : "";
        const hiddenAttributes = index === 0 ? "" : " hidden";
        const ariaHidden = index === 0 ? "false" : "true";
        if (isFacebookReel(item)) {
          const embedUrl = getFacebookEmbedUrl(item.sourceUrl);
          return `
                <figure class="spotlight-album-photo-fr spotlight-album-reel-fr${activeClass}" data-gallery-index="${index}"${hiddenAttributes} aria-hidden="${ariaHidden}">
                    <div class="spotlight-album-reel-frame-fr">
                        <iframe src="${index === 0 ? escapeHtml(embedUrl) : "about:blank"}" data-embed-src="${escapeHtml(embedUrl)}" title="${escapeHtml(item.title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                    <figcaption>
                        <span>${escapeHtml(item.caption)}</span>
                        <a class="spotlight-album-reel-source-fr" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ouvrir sur Facebook <span aria-hidden="true">\u2197</span></a>
                    </figcaption>
                </figure>
            `;
        }
        return `
            <figure class="spotlight-album-photo-fr${activeClass}" data-gallery-index="${index}"${hiddenAttributes} aria-hidden="${ariaHidden}">
                <button class="spotlight-album-trigger-fr" type="button" data-spotlight-id="${escapeHtml(spotlight.id)}" data-gallery-index="${index}" aria-label="Agrandir : ${escapeHtml(item.caption)}">
                    <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async">
                </button>
                <figcaption aria-hidden="true">${escapeHtml(item.caption)}</figcaption>
            </figure>
        `;
      };
      const renderSpotlightVisual = (spotlight) => {
        if (!hasGallery(spotlight)) {
          return `<img src="${escapeHtml(spotlight.imageSrc)}" alt="${escapeHtml(spotlight.imageAlt)}" loading="lazy" decoding="async">`;
        }
        const hasMixedMedia = spotlight.gallery.some(isFacebookReel);
        const itemLabel = hasMixedMedia ? "\xC9l\xE9ment" : "Photo";
        const navigationLabel = hasMixedMedia ? "M\xE9dia" : "Photo";
        return `
            <div class="spotlight-album-fr" data-spotlight-id="${escapeHtml(spotlight.id)}" data-active-index="0" data-item-label="${itemLabel}" role="group" aria-roledescription="carrousel" aria-label="Galerie \u2014 ${escapeHtml(spotlight.name)}">
                <div class="spotlight-album-viewport-fr">
                    ${spotlight.gallery.map((item, index) => renderGalleryItem(spotlight, item, index)).join("")}
                </div>
                <button class="spotlight-album-nav-fr previous" type="button" data-carousel-direction="-1" aria-label="${navigationLabel} pr\xE9c\xE9dent de ${escapeHtml(spotlight.name)}">
                    <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <button class="spotlight-album-nav-fr next" type="button" data-carousel-direction="1" aria-label="${navigationLabel} suivant de ${escapeHtml(spotlight.name)}">
                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>
                <p class="spotlight-album-status-fr" aria-live="polite">${itemLabel} 1 sur ${spotlight.gallery.length}</p>
            </div>
        `;
      };
      spotlightContainer.innerHTML = data.spotlights.map(
        (spotlight) => `
                <article class="glass-card spotlight-fr${spotlight.reverse ? " reverse" : ""}" id="${escapeHtml(spotlight.id)}">
                    <div class="spotlight-visual${hasGallery(spotlight) ? " has-album" : ""}">
                        ${renderSpotlightVisual(spotlight)}
                        <div class="spotlight-logo-pill">
                            ${renderSpotlightBadge(spotlight)}
                            <span>${escapeHtml(spotlight.name)}</span>
                        </div>
                    </div>
                    <div class="spotlight-copy">
                        <h3>${escapeHtml(spotlight.name)}</h3>
                        ${spotlight.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                        <div class="action-row">
                            ${spotlight.actions.map(renderAction).join("")}
                        </div>
                    </div>
                </article>
            `
      ).join("");
      const getFocusableModalElements = () => Array.from(
        photoModalDialog.querySelectorAll(
          'button:not([disabled]):not([hidden]), iframe:not([hidden]), [tabindex]:not([tabindex="-1"]):not([hidden])'
        )
      );
      const renderActiveMedia = () => {
        const item = lightboxState.items[lightboxState.activeIndex];
        if (!item) return;
        if (isFacebookReel(item)) {
          photoModalImage.hidden = true;
          photoModalImage.src = "";
          photoModalVideo.hidden = false;
          photoModalVideo.title = item.title;
          photoModalVideo.src = getFacebookEmbedUrl(item.sourceUrl);
        } else {
          photoModalVideo.hidden = true;
          photoModalVideo.src = "about:blank";
          photoModalImage.hidden = false;
          photoModalImage.src = item.src;
          photoModalImage.alt = item.alt;
        }
        photoModalCaption.textContent = item.caption;
        const itemLabel = lightboxState.items.some(isFacebookReel) ? "\xC9l\xE9ment" : "Photo";
        photoModalCounter.textContent = `${itemLabel} ${lightboxState.activeIndex + 1} sur ${lightboxState.items.length}`;
        const hasMultipleItems = lightboxState.items.length > 1;
        photoModalPrevious.hidden = !hasMultipleItems;
        photoModalNext.hidden = !hasMultipleItems;
      };
      const changeMedia = (direction) => {
        const itemCount = lightboxState.items.length;
        if (itemCount < 2) return;
        lightboxState.activeIndex = (lightboxState.activeIndex + direction + itemCount) % itemCount;
        renderActiveMedia();
      };
      const openPhotoModal = (spotlight, galleryIndex, trigger) => {
        if (!hasGallery(spotlight)) return;
        lightboxState.items = [...spotlight.gallery];
        lightboxState.activeIndex = Math.max(0, Math.min(galleryIndex, lightboxState.items.length - 1));
        lightboxState.trigger = trigger;
        renderActiveMedia();
        photoModal.hidden = false;
        photoModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("photo-lightbox-open-fr");
        requestAnimationFrame(() => {
          photoModal.classList.add("open");
          photoModalClose.focus();
        });
      };
      const closePhotoModal = () => {
        photoModal.classList.remove("open");
        photoModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("photo-lightbox-open-fr");
        window.setTimeout(() => {
          photoModal.hidden = true;
          photoModalImage.src = "";
          photoModalVideo.src = "about:blank";
          photoModalVideo.hidden = true;
          photoModalImage.hidden = false;
          lightboxState.trigger?.focus();
          lightboxState.items = [];
          lightboxState.activeIndex = 0;
          lightboxState.trigger = null;
        }, 180);
      };
      const changeCarouselPhoto = (album, direction) => {
        const photos = Array.from(album.querySelectorAll(".spotlight-album-photo-fr"));
        if (photos.length < 2) return;
        const currentIndex = Number.parseInt(album.dataset.activeIndex || "0", 10);
        const nextIndex = (currentIndex + direction + photos.length) % photos.length;
        photos.forEach((photo, index) => {
          const isActive = index === nextIndex;
          const embeddedVideo = photo.querySelector("iframe[data-embed-src]");
          photo.hidden = !isActive;
          photo.classList.toggle("is-active", isActive);
          photo.setAttribute("aria-hidden", String(!isActive));
          if (embeddedVideo) {
            embeddedVideo.src = isActive ? embeddedVideo.dataset.embedSrc : "about:blank";
          }
        });
        album.dataset.activeIndex = String(nextIndex);
        const status = album.querySelector(".spotlight-album-status-fr");
        const itemLabel = album.dataset.itemLabel || "Photo";
        if (status) status.textContent = `${itemLabel} ${nextIndex + 1} sur ${photos.length}`;
      };
      spotlightContainer.addEventListener("click", (event) => {
        const carouselButton = event.target.closest(".spotlight-album-nav-fr");
        if (carouselButton && spotlightContainer.contains(carouselButton)) {
          const album = carouselButton.closest(".spotlight-album-fr");
          const direction = Number.parseInt(carouselButton.dataset.carouselDirection || "1", 10);
          if (album) changeCarouselPhoto(album, direction);
          return;
        }
        const trigger = event.target.closest(".spotlight-album-trigger-fr");
        if (!trigger || !spotlightContainer.contains(trigger)) return;
        const spotlight = data.spotlights.find((item) => item.id === trigger.dataset.spotlightId);
        const galleryIndex = Number.parseInt(trigger.dataset.galleryIndex || "0", 10);
        if (spotlight) openPhotoModal(spotlight, galleryIndex, trigger);
      });
      photoModal.addEventListener("click", (event) => {
        if (event.target.closest("[data-photo-lightbox-close]")) closePhotoModal();
      });
      photoModalClose.addEventListener("click", closePhotoModal);
      photoModalPrevious.addEventListener("click", () => changeMedia(-1));
      photoModalNext.addEventListener("click", () => changeMedia(1));
      document.addEventListener("keydown", (event) => {
        if (photoModal.hidden) return;
        if (event.key === "Escape") {
          event.preventDefault();
          closePhotoModal();
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          changeMedia(-1);
          return;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          changeMedia(1);
          return;
        }
        if (event.key !== "Tab") return;
        const focusableElements = getFocusableModalElements();
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      });
    }
    window.renderFrenchResources = renderFrenchResources;
  }
});

// languages/french/js/renderers/french-study-kit-renderer.js
var require_french_study_kit_renderer = __commonJS({
  "languages/french/js/renderers/french-study-kit-renderer.js"() {
    function renderFrenchStudyKit() {
      const container = document.getElementById("french-study-kit-fr");
      const resources = window.frenchStudyKitData?.resources;
      const linguno = window.frenchStudyKitData?.linguno;
      if (!container) return;
      const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      if (!Array.isArray(resources) || resources.length === 0) {
        container.innerHTML = '<p class="study-kit-empty-fr">Le kit d\u2019\xE9tude n\u2019est pas disponible pour le moment. Recharge la page ou ouvre les liens source indiqu\xE9s plus bas.</p>';
        return;
      }
      container.innerHTML = `
        <article class="study-kit-folio-fr" aria-label="Parcours avec les ressources d\u2019\xE9tude fournies">
            <div class="study-kit-intro-fr">
                <i class="fa-solid fa-compass-drafting" aria-hidden="true"></i>
                <div>
                    <h3>Un seul atelier, trois gestes</h3>
                    <p>Les documents restent chez Google : cette page sert de table de travail pour retrouver rapidement le bon point d\u2019entr\xE9e.</p>
                </div>
            </div>
            <ol class="study-kit-route-fr">
                ${resources.map(
        (resource) => `
                            <li>
                                <a class="study-kit-link-fr" href="${escapeHtml(resource.href)}" target="_blank" rel="noopener noreferrer">
                                    <span class="study-kit-step-fr" aria-hidden="true">${escapeHtml(resource.step)}</span>
                                    <span class="study-kit-icon-fr" aria-hidden="true"><i class="${escapeHtml(resource.icon)}"></i></span>
                                    <span class="study-kit-copy-fr">
                                        <span class="study-kit-action-fr">${escapeHtml(resource.action)} \xB7 ${escapeHtml(resource.service)}</span>
                                        <strong>${escapeHtml(resource.name)}</strong>
                                        <span>${escapeHtml(resource.description)}</span>
                                    </span>
                                    <span class="study-kit-cta-fr">${escapeHtml(resource.linkLabel)} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
                                </a>
                            </li>
                        `
      ).join("")}
            </ol>
        </article>
    `;
      const lingunoContainer = document.getElementById("french-linguno-fr");
      if (lingunoContainer && linguno) {
        lingunoContainer.innerHTML = `
            <div class="french-linguno-copy-fr">
                <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                <h2 id="linguno-francais-heading">${escapeHtml(linguno.title)}</h2>
                <p>${escapeHtml(linguno.description)}</p>
                <a class="btn-fr primary" href="${escapeHtml(linguno.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linguno.linkLabel)} <span aria-hidden="true">\u2197</span></a>
            </div>
            <div class="french-linguno-visual-fr">
                <img src="../../images/apps/linguno.webp" alt="Interface de Linguno pour s\u2019exercer aux conjugaisons" width="250" height="243" loading="lazy" decoding="async">
                <p>Une forme \xE0 la fois, un objectif pr\xE9cis.</p>
            </div>
        `;
      }
    }
    window.renderFrenchStudyKit = renderFrenchStudyKit;
  }
});

// languages/french/js/renderers/french-books-renderer.js
var require_french_books_renderer = __commonJS({
  "languages/french/js/renderers/french-books-renderer.js"() {
    function renderFrenchBooks() {
      const books = window.frenchBooksData;
      const shelf = document.getElementById("french-books-shelf-fr");
      const previousButton = document.getElementById("french-books-prev-fr");
      const nextButton = document.getElementById("french-books-next-fr");
      const modal = document.getElementById("french-book-modal-fr");
      const modalDialog = modal?.querySelector(".french-book-modal-dialog-fr");
      const modalClose = document.getElementById("french-book-modal-close-fr");
      const modalCover = document.getElementById("french-book-modal-cover-fr");
      const modalCoverFallback = document.getElementById("french-book-modal-cover-fallback-fr");
      const modalSource = document.getElementById("french-book-modal-source-fr");
      const modalCategory = document.getElementById("french-book-modal-category-fr");
      const modalTitle = document.getElementById("french-book-modal-title-fr");
      const modalAuthor = document.getElementById("french-book-modal-author-fr");
      const modalLevel = document.getElementById("french-book-modal-level-fr");
      const modalDescription = document.getElementById("french-book-modal-description-fr");
      const modalGuidance = document.getElementById("french-book-modal-guidance-fr");
      const modalLinks = document.getElementById("french-book-modal-links-fr");
      if (!shelf || !previousButton || !nextButton || !modal || !modalDialog || !modalClose || !modalCover || !modalCoverFallback || !modalSource || !modalCategory || !modalTitle || !modalAuthor || !modalLevel || !modalDescription || !modalGuidance || !modalLinks) {
        return;
      }
      const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      if (!Array.isArray(books) || books.length === 0) {
        shelf.innerHTML = `
            <li class="french-books-empty-fr">
                <i class="fa-solid fa-book-open" aria-hidden="true"></i>
                <p>Le rayon est vide pour le moment. Recharge la page ou visite directement Project Gutenberg.</p>
            </li>
        `;
        previousButton.disabled = true;
        nextButton.disabled = true;
        return;
      }
      const state = {
        activeBook: null,
        lastFocusedCard: null,
        closeTimer: null
      };
      shelf.innerHTML = books.map(
        (book) => `
                <li class="french-book-item-fr">
                    <button
                        class="french-book-card-fr"
                        type="button"
                        data-french-book-id="${escapeHtml(book.id)}"
                        aria-haspopup="dialog"
                        aria-controls="french-book-modal-fr"
                        aria-label="Ouvrir la fiche de ${escapeHtml(book.title)}, niveau ${escapeHtml(book.levels.join(" \xE0 "))}"
                    >
                        <span class="french-book-cover-fr">
                            <img src="${escapeHtml(book.coverImage)}" alt="${escapeHtml(book.coverAlt)}" loading="lazy" decoding="async">
                            <span class="french-book-cover-fallback-fr" hidden aria-hidden="true">${escapeHtml(book.title)}</span>
                        </span>
                        <span class="french-book-card-copy-fr">
                            <span class="french-book-category-fr">${escapeHtml(book.category)}</span>
                            <strong>${escapeHtml(book.title)}</strong>
                            <span class="french-book-author-fr">${escapeHtml(book.author)}</span>
                            <span class="french-book-level-fr">CECR \xB7 ${escapeHtml(book.levels.join("\u2013"))}</span>
                            <span class="french-book-short-fr">${escapeHtml(book.shortDescription)}</span>
                        </span>
                    </button>
                </li>
            `
      ).join("");
      const showCoverFallback = (image, fallback, title) => {
        image.hidden = true;
        fallback.hidden = false;
        fallback.textContent = title;
      };
      shelf.querySelectorAll(".french-book-cover-fr").forEach((cover) => {
        const image = cover.querySelector("img");
        const fallback = cover.querySelector(".french-book-cover-fallback-fr");
        const card = cover.closest("[data-french-book-id]");
        const book = books.find((item) => item.id === card?.dataset.frenchBookId);
        if (image && fallback && book) {
          image.addEventListener("error", () => showCoverFallback(image, fallback, book.title));
          if (image.complete && image.naturalWidth === 0) {
            showCoverFallback(image, fallback, book.title);
          }
        }
      });
      const renderModalLinks = (book) => {
        modalLinks.innerHTML = book.links.map(
          (link) => `
                    <a class="btn-fr ${link.variant === "secondary" ? "secondary" : "primary"}" href="${escapeHtml(link.href)}"${link.external === false ? "" : ' target="_blank" rel="noopener noreferrer"'}>
                        <i class="${escapeHtml(link.icon)}" aria-hidden="true"></i>
                        ${escapeHtml(link.label)}
                    </a>
                `
        ).join("");
      };
      const getFocusableModalElements = () => Array.from(
        modalDialog.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const openBookModal = (book, trigger) => {
        if (state.closeTimer) {
          window.clearTimeout(state.closeTimer);
          state.closeTimer = null;
        }
        state.activeBook = book;
        state.lastFocusedCard = trigger;
        modalCover.hidden = false;
        modalCoverFallback.hidden = true;
        modalCover.src = book.coverImage;
        modalCover.alt = book.coverAlt;
        modalCoverFallback.textContent = book.title;
        if (modalCover.complete && modalCover.naturalWidth === 0) {
          showCoverFallback(modalCover, modalCoverFallback, book.title);
        }
        modalSource.textContent = book.sourceLabel;
        modalCategory.textContent = book.category;
        modalTitle.textContent = book.title;
        modalAuthor.textContent = book.author;
        modalLevel.textContent = `Niveau conseill\xE9 \xB7 ${book.levels.join("\u2013")}`;
        modalDescription.textContent = book.longDescription;
        modalGuidance.textContent = book.guidance;
        renderModalLinks(book);
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("french-book-modal-open-fr");
        window.requestAnimationFrame(() => {
          modal.classList.add("open");
          modalClose.focus();
        });
      };
      const closeBookModal = () => {
        if (modal.hidden) return;
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("french-book-modal-open-fr");
        state.closeTimer = window.setTimeout(() => {
          modal.hidden = true;
          modalCover.src = books[0].coverImage;
          modalCover.alt = books[0].coverAlt;
          modalLinks.innerHTML = "";
          state.lastFocusedCard?.focus();
          state.activeBook = null;
          state.lastFocusedCard = null;
          state.closeTimer = null;
        }, 180);
      };
      modalCover.addEventListener("error", () => {
        showCoverFallback(modalCover, modalCoverFallback, state.activeBook?.title || "Livre");
      });
      shelf.addEventListener("click", (event) => {
        const card = event.target.closest("[data-french-book-id]");
        if (!card || !shelf.contains(card)) return;
        const book = books.find((item) => item.id === card.dataset.frenchBookId);
        if (book) openBookModal(book, card);
      });
      modal.addEventListener("click", (event) => {
        if (event.target.closest("[data-french-book-modal-close]")) closeBookModal();
      });
      modalClose.addEventListener("click", closeBookModal);
      document.addEventListener("keydown", (event) => {
        if (modal.hidden) return;
        if (event.key === "Escape") {
          event.preventDefault();
          closeBookModal();
          return;
        }
        if (event.key !== "Tab") return;
        const focusableElements = getFocusableModalElements();
        if (focusableElements.length === 0) {
          event.preventDefault();
          modalDialog.focus();
          return;
        }
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      });
      const updateShelfControls = () => {
        const maximumScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 4;
        nextButton.disabled = shelf.scrollLeft >= maximumScroll - 4;
      };
      const scrollShelf = (direction) => {
        shelf.scrollBy({
          left: direction * Math.max(240, shelf.clientWidth * 0.78),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
      };
      previousButton.addEventListener("click", () => scrollShelf(-1));
      nextButton.addEventListener("click", () => scrollShelf(1));
      shelf.addEventListener("scroll", updateShelfControls, { passive: true });
      window.addEventListener("resize", updateShelfControls, { passive: true });
      window.requestAnimationFrame(updateShelfControls);
    }
    window.renderFrenchBooks = renderFrenchBooks;
  }
});

// languages/french/js/renderers/french-podcasts-renderer.js
var require_french_podcasts_renderer = __commonJS({
  "languages/french/js/renderers/french-podcasts-renderer.js"() {
    function renderFrenchPodcasts() {
      const podcasts = window.frenchPodcastsData;
      const shelf = document.getElementById("french-podcasts-shelf-fr");
      const previousButton = document.getElementById("french-podcasts-prev-fr");
      const nextButton = document.getElementById("french-podcasts-next-fr");
      const modal = document.getElementById("french-podcast-modal-fr");
      const dialog = modal?.querySelector(".french-podcast-modal-dialog-fr");
      const closeButton = document.getElementById("french-podcast-modal-close-fr");
      const content = document.getElementById("french-podcast-modal-content-fr");
      if (!shelf || !previousButton || !nextButton || !modal || !dialog || !closeButton || !content) return;
      const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      if (!Array.isArray(podcasts) || podcasts.length === 0) {
        shelf.innerHTML = '<li class="french-podcasts-empty-fr">Le rayon audio est momentan\xE9ment indisponible.</li>';
        previousButton.disabled = true;
        nextButton.disabled = true;
        return;
      }
      const state = { trigger: null, active: null };
      shelf.innerHTML = podcasts.map((podcast) => `
        <li class="french-podcast-item-fr">
            <button class="french-podcast-card-fr" type="button" data-french-podcast-id="${escapeHtml(podcast.id)}" aria-haspopup="dialog" aria-controls="french-podcast-modal-fr" aria-label="Ouvrir la fiche de ${escapeHtml(podcast.title)}">
                <span class="french-podcast-cover-fr">
                    <img src="${escapeHtml(podcast.coverImage)}" alt="${escapeHtml(podcast.coverAlt)}" width="480" height="480" loading="lazy" decoding="async">
                    <span class="french-podcast-cover-fallback-fr" hidden aria-hidden="true">${escapeHtml(podcast.title)}</span>
                </span>
                <span class="french-podcast-copy-fr">
                    <span class="french-podcast-publisher-fr">${escapeHtml(podcast.publisher)}</span>
                    <strong>${escapeHtml(podcast.title)}</strong>
                    <span class="french-podcast-format-fr">${escapeHtml(podcast.format)}</span>
                    <span class="french-podcast-level-fr">CECR \xB7 ${escapeHtml((podcast.levels || []).join("\u2013"))}</span>
                    <span class="french-podcast-details-fr">Voir la fiche <span aria-hidden="true">\u2192</span></span>
                </span>
            </button>
        </li>
    `).join("");
      shelf.querySelectorAll(".french-podcast-cover-fr").forEach((cover) => {
        const image = cover.querySelector("img");
        const fallback = cover.querySelector(".french-podcast-cover-fallback-fr");
        if (!image || !fallback) return;
        const fallbackImage = () => {
          image.hidden = true;
          fallback.hidden = false;
        };
        image.addEventListener("error", fallbackImage, { once: true });
        if (image.complete && image.naturalWidth === 0) fallbackImage();
      });
      const renderModal = (podcast) => {
        const personalNote = podcast.personalComment || podcast.aljohnComment;
        content.innerHTML = `
            <div class="french-podcast-modal-layout-fr">
                <div class="french-podcast-modal-cover-fr">
                    <img src="${escapeHtml(podcast.coverImage)}" alt="${escapeHtml(podcast.coverAlt)}" width="480" height="480" loading="lazy" decoding="async">
                    <span class="french-podcast-cover-fallback-fr" hidden aria-hidden="true">${escapeHtml(podcast.title)}</span>
                </div>
                <div class="french-podcast-modal-copy-fr">
                    <p class="french-podcast-modal-kicker-fr">${escapeHtml(podcast.format)}</p>
                    <h2 id="french-podcast-modal-title-fr">${escapeHtml(podcast.title)}</h2>
                    <p class="french-podcast-modal-publisher-fr">${escapeHtml(podcast.publisher)}</p>
                    <p class="french-podcast-modal-level-fr">Niveau conseill\xE9 \xB7 ${escapeHtml((podcast.levels || []).join("\u2013"))}</p>
                    <p id="french-podcast-modal-description-fr" class="french-podcast-modal-description-fr">${escapeHtml(podcast.description)}</p>
                    <div class="french-podcast-modal-guidance-fr">
                        <h3>Rep\xE8re d\u2019\xE9coute</h3>
                        <p id="french-podcast-modal-guidance-fr">${escapeHtml(podcast.guidance)}</p>
                    </div>
                    ${personalNote ? `<aside class="french-podcast-modal-note-fr"><h3>Ma note</h3><p>${escapeHtml(personalNote)}</p></aside>` : ""}
                    <div class="french-podcast-modal-links-fr">
                        ${(podcast.links || []).map((link) => `<a class="btn-fr primary" href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer"><i class="${escapeHtml(link.icon || "fa-solid fa-arrow-up-right-from-square")}" aria-hidden="true"></i>${escapeHtml(link.label)}</a>`).join("")}
                    </div>
                </div>
            </div>
        `;
        const modalImage = content.querySelector("img");
        const modalFallback = content.querySelector(".french-podcast-cover-fallback-fr");
        if (modalImage && modalFallback) {
          const fallbackImage = () => {
            modalImage.hidden = true;
            modalFallback.hidden = false;
          };
          modalImage.addEventListener("error", fallbackImage, { once: true });
          if (modalImage.complete && modalImage.naturalWidth === 0) fallbackImage();
        }
      };
      const focusable = () => Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      const closeModal = () => {
        if (modal.hidden) return;
        modal.classList.remove("open");
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("french-podcast-modal-open-fr");
        state.trigger?.focus();
        state.trigger = null;
        state.active = null;
      };
      const openModal = (podcast, trigger) => {
        state.trigger = trigger;
        state.active = podcast;
        renderModal(podcast);
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("french-podcast-modal-open-fr");
        window.requestAnimationFrame(() => {
          modal.classList.add("open");
          closeButton.focus();
        });
      };
      shelf.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-french-podcast-id]");
        if (!trigger) return;
        const podcast = podcasts.find((item) => item.id === trigger.dataset.frenchPodcastId);
        if (podcast) openModal(podcast, trigger);
      });
      modal.addEventListener("click", (event) => {
        if (event.target.closest("[data-french-podcast-modal-close]")) closeModal();
      });
      closeButton.addEventListener("click", closeModal);
      document.addEventListener("keydown", (event) => {
        if (modal.hidden) return;
        if (event.key === "Escape") {
          event.preventDefault();
          closeModal();
          return;
        }
        if (event.key !== "Tab") return;
        const elements = focusable();
        if (!elements.length) {
          event.preventDefault();
          dialog.focus();
          return;
        }
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
      const scrollShelf = (direction) => {
        const item = shelf.querySelector(".french-podcast-item-fr");
        const gap = Number.parseFloat(window.getComputedStyle(shelf).columnGap || window.getComputedStyle(shelf).gap) || 16;
        const step = item ? item.getBoundingClientRect().width + gap : shelf.clientWidth * 0.8;
        shelf.scrollBy({ left: direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      };
      const updateControls = () => {
        const max = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 4;
        nextButton.disabled = shelf.scrollLeft >= max - 4;
      };
      previousButton.addEventListener("click", () => scrollShelf(-1));
      nextButton.addEventListener("click", () => scrollShelf(1));
      shelf.addEventListener("scroll", updateControls, { passive: true });
      shelf.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollShelf(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollShelf(1);
        }
        if (event.key === "Home") {
          event.preventDefault();
          shelf.scrollTo({ left: 0, behavior: "auto" });
        }
        if (event.key === "End") {
          event.preventDefault();
          shelf.scrollTo({ left: shelf.scrollWidth, behavior: "auto" });
        }
      });
      window.addEventListener("resize", updateControls, { passive: true });
      window.requestAnimationFrame(updateControls);
    }
    window.renderFrenchPodcasts = renderFrenchPodcasts;
  }
});

// languages/french/js/renderers/french-page-renderer.js
var require_french_page_renderer = __commonJS({
  "languages/french/js/renderers/french-page-renderer.js"() {
    document.addEventListener("DOMContentLoaded", () => {
      const main = document.getElementById("main-content");
      const creatorLibrary = document.getElementById("bibliotheque");
      const frenchPlaylist = document.getElementById("playlist-francais");
      if (main && creatorLibrary && frenchPlaylist) {
        main.insertBefore(creatorLibrary, frenchPlaylist);
      }
      const creatorContainer = creatorLibrary?.querySelector(".container-fr");
      const creatorBrowser = creatorLibrary?.querySelector(".curated-channel-browser-fr");
      const creatorHeading = creatorLibrary?.querySelector(".curated-library-heading-fr");
      if (creatorContainer && creatorBrowser && creatorHeading) {
        creatorContainer.insertBefore(creatorBrowser, creatorHeading);
      }
      if (window.location.hash) {
        const anchorId = decodeURIComponent(window.location.hash.slice(1));
        window.requestAnimationFrame(() => {
          document.getElementById(anchorId)?.scrollIntoView({ block: "start" });
        });
      }
      const extraHeading = document.getElementById("extra-heading-fr");
      const extraSummary = document.getElementById("extra-summary-copy-fr");
      if (window.extraFrenchPlaylistData) {
        if (extraHeading) {
          extraHeading.textContent = window.extraFrenchPlaylistData.title;
        }
        if (extraSummary) {
          extraSummary.textContent = window.extraFrenchPlaylistData.summary;
        }
      }
      if (typeof window.renderFrenchCuratedChannels === "function") {
        window.renderFrenchCuratedChannels();
      }
      if (typeof window.renderFrenchResources === "function") {
        window.renderFrenchResources();
      }
      if (typeof window.renderFrenchStudyKit === "function") {
        window.renderFrenchStudyKit();
      }
      if (typeof window.renderFrenchBooks === "function") {
        window.renderFrenchBooks();
      }
      if (typeof window.renderFrenchPodcasts === "function") {
        window.renderFrenchPodcasts();
      }
      if (typeof window.renderFrenchPlaylists === "function") {
        window.renderFrenchPlaylists();
      }
    });
  }
});

// languages/shared/js/language-restaurants.js
var require_language_restaurants = __commonJS({
  "languages/shared/js/language-restaurants.js"() {
    (function() {
      "use strict";
      const config = window.languageRestaurantShelfConfig;
      if (!config) return;
      const section = document.querySelector("[data-language-restaurant-shelf]");
      const rail = section?.querySelector("[data-language-restaurant-rail]");
      if (!section || !rail) return;
      const labels = config.labels || {};
      let activeOverlay = null;
      let activeTrigger = null;
      let previousBodyOverflow = "";
      function createElement(tagName, className, text) {
        const node = document.createElement(tagName);
        if (className) node.className = className;
        if (typeof text === "string") node.textContent = text;
        return node;
      }
      function wireImageFallback(image) {
        image.addEventListener("error", () => {
          if (!config.fallbackImage || image.dataset.fallbackApplied === "true") {
            image.hidden = true;
            return;
          }
          image.dataset.fallbackApplied = "true";
          image.classList.add("is-fallback");
          image.src = config.fallbackImage;
        });
      }
      function getFocusable(dialog) {
        return Array.from(dialog.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((node) => !node.hidden && node.getClientRects().length > 0);
      }
      function closeDialog() {
        if (!activeOverlay) return;
        const trigger = activeTrigger;
        activeOverlay.remove();
        activeOverlay = null;
        activeTrigger = null;
        document.body.classList.remove("restaurant-dialog-open");
        document.body.style.overflow = previousBodyOverflow;
        trigger?.focus();
      }
      function appendLink(container, link) {
        if (!link?.url || !link?.label) return;
        const anchor = createElement("a", "restaurant-place-dialog__link", link.label);
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        container.appendChild(anchor);
      }
      function openDialog(item, trigger) {
        closeDialog();
        const overlay = createElement("div", "restaurant-place-overlay");
        const dialog = createElement("div", "restaurant-place-dialog");
        const closeButton = createElement("button", "restaurant-place-dialog__close", "\xD7");
        const media = createElement("div", "restaurant-place-dialog__media");
        const image = document.createElement("img");
        const body = createElement("div", "restaurant-place-dialog__body");
        const title = createElement("h2", "restaurant-place-dialog__title", item.name);
        const city = createElement("p", "restaurant-place-dialog__city", item.city);
        const description = createElement("p", "restaurant-place-dialog__description", item.description);
        const addressGroup = createElement("div", "restaurant-place-dialog__address");
        const addressLabel = createElement("span", "restaurant-place-dialog__label", labels.address || "Address");
        const address = createElement("p", "", item.address);
        const links = createElement("div", "restaurant-place-dialog__links");
        overlay.addEventListener("click", (event) => {
          if (event.target === overlay) closeDialog();
        });
        overlay.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeDialog();
            return;
          }
          if (event.key !== "Tab") return;
          const focusable = getFocusable(dialog);
          if (!focusable.length) {
            event.preventDefault();
            dialog.focus();
            return;
          }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        });
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-labelledby", `${config.idPrefix}-restaurant-title-${item.id}`);
        dialog.tabIndex = -1;
        title.id = `${config.idPrefix}-restaurant-title-${item.id}`;
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", labels.close || "Close");
        closeButton.addEventListener("click", closeDialog);
        image.src = item.image;
        image.alt = item.imageAlt;
        image.width = 960;
        image.height = 540;
        image.decoding = "async";
        wireImageFallback(image);
        media.appendChild(image);
        addressGroup.append(addressLabel, address);
        (item.links || []).forEach((link) => appendLink(links, link));
        if (item.videoUrl) {
          appendLink(links, {
            label: item.videoLabel || labels.watchVideo || "Watch Aljohn's video",
            url: item.videoUrl
          });
        }
        body.append(title, city, description, addressGroup);
        if (item.contact) {
          const contactGroup = createElement("div", "restaurant-place-dialog__contact");
          contactGroup.append(
            createElement("span", "restaurant-place-dialog__label", labels.contact || "Contact"),
            createElement("p", "", item.contact)
          );
          body.appendChild(contactGroup);
        }
        body.appendChild(links);
        dialog.append(closeButton, media, body);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        activeOverlay = overlay;
        activeTrigger = trigger;
        previousBodyOverflow = document.body.style.overflow;
        document.body.classList.add("restaurant-dialog-open");
        document.body.style.overflow = "hidden";
        closeButton.focus();
      }
      function renderCard(item) {
        const article = createElement("article", "restaurant-place-card");
        const trigger = createElement("button", "restaurant-place-card__trigger");
        const media = createElement("span", "restaurant-place-card__media");
        const image = document.createElement("img");
        const copy = createElement("span", "restaurant-place-card__copy");
        const city = createElement("span", "restaurant-place-card__city", item.city);
        const name = createElement("span", "restaurant-place-card__name", item.name);
        const summary = createElement("span", "restaurant-place-card__summary", item.summary);
        const action = createElement("span", "restaurant-place-card__action", labels.details || "Details");
        trigger.type = "button";
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-label", `${labels.details || "Details"}: ${item.name}`);
        trigger.addEventListener("click", () => openDialog(item, trigger));
        image.src = item.logo || item.image;
        image.alt = item.logoAlt || item.imageAlt;
        image.width = 960;
        image.height = 540;
        image.loading = "lazy";
        image.decoding = "async";
        wireImageFallback(image);
        media.appendChild(image);
        copy.append(city, name, summary, action);
        trigger.append(media, copy);
        article.appendChild(trigger);
        return article;
      }
      rail.replaceChildren();
      if (!Array.isArray(config.items) || config.items.length === 0) {
        rail.appendChild(createElement("p", "restaurant-place-empty", labels.empty || "No places available."));
        return;
      }
      config.items.forEach((item) => rail.appendChild(renderCard(item)));
    })();
  }
});

// languages/french/js/french-entry.js
var require_french_entry = __commonJS({
  "languages/french/js/french-entry.js"() {
    var import_navbar_loader = __toESM(require_navbar_loader());
    var import_footer_loader = __toESM(require_footer_loader());
    var import_french_playlist_data = __toESM(require_french_playlist_data());
    var import_french_restaurants_data = __toESM(require_french_restaurants_data());
    var import_extra_french_playlist_data = __toESM(require_extra_french_playlist_data());
    var import_french_curated_channels_data = __toESM(require_french_curated_channels_data());
    var import_french_instagram_creators_data = __toESM(require_french_instagram_creators_data());
    var import_french_resources_data = __toESM(require_french_resources_data());
    var import_french_study_kit_data = __toESM(require_french_study_kit_data());
    var import_french_books_data = __toESM(require_french_books_data());
    var import_french_podcasts_data = __toESM(require_french_podcasts_data());
    var import_french_playlists_renderer = __toESM(require_french_playlists_renderer());
    var import_french_curated_channels_renderer = __toESM(require_french_curated_channels_renderer());
    var import_french_resources_renderer = __toESM(require_french_resources_renderer());
    var import_french_study_kit_renderer = __toESM(require_french_study_kit_renderer());
    var import_french_books_renderer = __toESM(require_french_books_renderer());
    var import_french_podcasts_renderer = __toESM(require_french_podcasts_renderer());
    var import_french_page_renderer = __toESM(require_french_page_renderer());
    var import_language_restaurants = __toESM(require_language_restaurants());
  }
});
export default require_french_entry();

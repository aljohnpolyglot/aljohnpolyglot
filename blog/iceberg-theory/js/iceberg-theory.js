(() => {
  document.documentElement.classList.add("js");

  const dive = document.querySelector(".dive");
  const viewport = document.querySelector(".iceberg-viewport");
  const iceberg = document.querySelector(".iceberg-track");
  const depthNumber = document.querySelector("#depth-number");
  const levels = [...document.querySelectorAll(".depth-level")];
  const routeLinks = [...document.querySelectorAll(".route-rail a")];
  const visualLevels = [...document.querySelectorAll(".ice-level")];

  if (!dive || !viewport || !iceberg || !levels.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let activeLevel = 1;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function setActiveLevel(level) {
    if (level === activeLevel && dive.dataset.zone) return;
    activeLevel = level;

    levels.forEach((section) => {
      section.classList.toggle("is-active", Number(section.dataset.level) === level);
    });

    routeLinks.forEach((link) => {
      const current = link.getAttribute("href") === `#level-${level}`;
      if (current) {
        link.setAttribute("aria-current", "step");
        if (window.innerWidth <= 780) {
          link.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });

    visualLevels.forEach((layer) => {
      layer.toggleAttribute("data-active", Number(layer.dataset.visualLevel) === level);
      if (Number(layer.dataset.visualLevel) === level) layer.setAttribute("data-active", "true");
    });

    dive.dataset.zone = level <= 3 ? "surface" : level <= 5 ? "middle" : level <= 8 ? "deep" : "trench";
    document.documentElement.classList.toggle("is-below-surface", level >= 4);
  }

  function updateDive() {
    frame = 0;
    const rect = dive.getBoundingClientRect();
    const scrollable = Math.max(1, dive.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / scrollable, 0, 1);
    const viewportHeight = viewport.clientHeight;
    const icebergHeight = iceberg.getBoundingClientRect().height;
    const maxShift = Math.max(0, icebergHeight - viewportHeight + viewportHeight * 0.12);
    const shift = reducedMotion.matches ? 0 : maxShift * progress;
    const waterline = iceberg.offsetTop + icebergHeight * (300 / 1600) - shift;

    iceberg.style.setProperty("--track-y", `${-shift}px`);
    viewport.style.setProperty("--waterline-y", `${waterline}px`);
    depthNumber.textContent = String(Math.round(progress * 890)).padStart(3, "0");
  }

  function requestDiveUpdate() {
    if (!frame) frame = requestAnimationFrame(updateDive);
  }

  const levelObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * 0.48) - Math.abs(b.boundingClientRect.top - window.innerHeight * 0.48));

    if (visible[0]) setActiveLevel(Number(visible[0].target.dataset.level));
  }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });

  levels.forEach((section) => levelObserver.observe(section));

  const diveObserver = new IntersectionObserver(([entry]) => {
    document.documentElement.classList.toggle("is-diving", entry.isIntersecting);
  }, { threshold: 0.01 });

  diveObserver.observe(dive);
  window.addEventListener("scroll", requestDiveUpdate, { passive: true });
  window.addEventListener("resize", requestDiveUpdate, { passive: true });
  reducedMotion.addEventListener("change", requestDiveUpdate);

  setActiveLevel(1);
  updateDive();
})();

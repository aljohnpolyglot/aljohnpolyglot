(() => {
  const labels = {
    top: "Overview",
    beginner: "Beginner · A1–A2",
    intermediate: "Intermediate · B1–B2",
    advanced: "Advanced · C1–C2",
    "bottom-line": "Summary"
  };

  if (Object.keys(labels).length !== 5 || labels.beginner !== "Beginner · A1–A2") {
    throw new Error("Roadmap chapter mapping is incomplete.");
  }

  document.documentElement.classList.add("js");

  const article = document.querySelector("#article article");
  const chapterNav = document.querySelector(".chapter-nav");
  const status = document.querySelector("#route-status");
  const mapFrame = document.querySelector(".map-frame");
  const sections = [
    document.querySelector("#top"),
    ...document.querySelectorAll("[data-roadmap-stage]"),
    document.querySelector("#bottom-line")
  ].filter(Boolean);
  const chapterLinks = [...document.querySelectorAll('.chapter-nav a[href^="#"]')];
  const mapStops = [...document.querySelectorAll("[data-map-stop]")];

  if (!article || !chapterNav || !status || !mapFrame || !sections.length) return;

  const setActiveChapter = (id) => {
    status.textContent = labels[id] || labels.top;

    chapterLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });

    const stage = id === "beginner" || id === "intermediate" || id === "advanced" ? id : "";
    if (stage) mapFrame.dataset.activeStage = stage;
    else delete mapFrame.dataset.activeStage;

    mapStops.forEach((stop) => {
      if (stop.dataset.mapStop === stage) stop.setAttribute("aria-current", "step");
      else stop.removeAttribute("aria-current");
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) setActiveChapter(visible.target.id);
  }, {
    rootMargin: "-28% 0px -56%",
    threshold: [0, 0.1, 0.35]
  });

  sections.forEach((section) => observer.observe(section));
  setActiveChapter(location.hash.slice(1) || "top");

  let framePending = false;
  const updateProgress = () => {
    const start = article.offsetTop;
    const distance = Math.max(article.offsetHeight - innerHeight, 1);
    const progress = Math.min(1, Math.max(0, (scrollY - start) / distance));
    chapterNav.style.setProperty("--route-progress", `${progress * 100}%`);
    framePending = false;
  };

  addEventListener("scroll", () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateProgress);
  }, { passive: true });

  addEventListener("resize", updateProgress, { passive: true });
  updateProgress();
})();

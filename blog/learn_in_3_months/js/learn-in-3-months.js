(() => {
  "use strict";

  const DAY_MS = 86_400_000;

  function calculatePace(targetHours, dailyHours, startDate = new Date()) {
    const days = Math.ceil(targetHours / dailyHours);
    const months = days / 30.44;
    const finishDate = new Date(startDate.getTime() + (days * DAY_MS));

    return {
      days,
      months,
      finishDate,
      weeklyHours: dailyHours * 7,
      ninetyDayHours: dailyHours * 90
    };
  }

  function formatHours(value) {
    const totalMinutes = Math.round(value * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    return `${hours}h ${minutes}m`;
  }

  function formatNumber(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  const selfCheck = calculatePace(500, 5, new Date("2026-01-01T00:00:00Z"));
  if (selfCheck.days !== 100 || Math.round(selfCheck.ninetyDayHours) !== 450) {
    throw new Error("Pace calculator self-check failed.");
  }

  const target = document.querySelector("#target-hours");
  const daily = document.querySelector("#daily-hours");
  const dailyOutput = document.querySelector("#daily-hours-output");
  const resultPrimary = document.querySelector("#result-primary");
  const resultSecondary = document.querySelector("#result-secondary");
  const weeklyLoad = document.querySelector("#weekly-load");
  const ninetyDayTotal = document.querySelector("#ninety-day-total");
  const finishDate = document.querySelector("#finish-date");
  const resultFill = document.querySelector("#result-fill");

  function updateCalculator() {
    if (!target || !daily) return;

    const targetHours = Number(target.value);
    const dailyHours = Number(daily.value);
    const result = calculatePace(targetHours, dailyHours);
    const monthLabel = result.months < 1
      ? `${result.days} days`
      : `${formatNumber(result.months)} months`;

    dailyOutput.textContent = formatHours(dailyHours);
    resultPrimary.textContent = monthLabel;
    resultSecondary.textContent = `${result.days.toLocaleString()} days at ${formatHours(dailyHours)} every day.`;
    weeklyLoad.textContent = `${formatNumber(result.weeklyHours)} hours`;
    ninetyDayTotal.textContent = `${Math.round(result.ninetyDayHours).toLocaleString()} hours`;
    finishDate.textContent = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(result.finishDate);

    const ninetyDayTarget = targetHours / 90;
    const completionRatio = Math.min(100, (dailyHours / ninetyDayTarget) * 100);
    resultFill.style.width = `${completionRatio}%`;
  }

  target?.addEventListener("change", updateCalculator);
  daily?.addEventListener("input", updateCalculator);
  updateCalculator();

  const progressLinks = [...document.querySelectorAll("[data-step-link]")];
  const trackedSections = progressLinks
    .map(link => document.getElementById(link.dataset.stepLink))
    .filter(Boolean);

  function markCurrent(id) {
    progressLinks.forEach(link => {
      if (link.dataset.stepLink === id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) markCurrent(visible.target.id);
    }, { rootMargin: "-25% 0px -60%", threshold: [0, .2, .5] });

    trackedSections.forEach(section => observer.observe(section));
  } else {
    markCurrent("top");
  }
})();

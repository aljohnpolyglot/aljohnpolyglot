(() => {
  'use strict';

  const clamp = value => Math.max(0, Math.min(1, value));
  const stageFor = (progress, count) => Math.min(count - 1, Math.floor(clamp(progress) * count));
  const selfTest = () => stageFor(-1, 6) === 0 && stageFor(.5, 6) === 3 && stageFor(1, 6) === 5;
  globalThis.memoryForestScrollSelfTest = selfTest;
  console.assert(selfTest(), 'Memory Forest scroll mapping failed.');
  if (typeof document === 'undefined') return;

  const tree = document.getElementById('simulation-tree');
  const day = document.getElementById('simulation-day');
  const eventDay = document.getElementById('simulation-event-day');
  const eventStatus = document.getElementById('simulation-event-status');
  const caption = document.getElementById('simulation-caption');
  const status = document.getElementById('simulation-status');
  const memoryStory = document.getElementById('memory-scroll-story');
  const missedStory = document.getElementById('missed-scroll-story');
  const missedStage = document.querySelector('.missed-stage');
  const missedTree = document.getElementById('missed-tree');
  const missedDay = document.getElementById('missed-day');
  const missedStatus = document.getElementById('missed-status');
  const missedCaption = document.getElementById('missed-caption');
  const recoveryStory = document.getElementById('recovery-scroll-story');
  const recoveryStage = document.getElementById('recovery-stage');
  const recoveryTree = document.getElementById('recovery-tree');
  const recoveryDay = document.getElementById('recovery-day');
  const recoveryStatus = document.getElementById('recovery-status');
  const recoveryCaption = document.getElementById('recovery-caption');
  const scaleStory = document.getElementById('forest-scale-story');
  const aerialForest = document.getElementById('aerial-forest-sprite');
  const scaleLabel = document.getElementById('forest-scale-label');
  const canopyScale = document.getElementById('canopy-scale');
  const steps = [...document.querySelectorAll('#simulation-steps li')];
  const calendar = document.getElementById('review-calendar-days');
  const calendarState = document.getElementById('calendar-state');
  const specimens = [...document.querySelectorAll('.specimen')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const frames = [
    { day: 'Day 0', image: 1, scale: 1, status: 'Planted', caption: 'A new word begins as a fragile sprout.' },
    { day: 'Day 1', image: 2, scale: 1, status: 'Reviewed', caption: 'The first successful recall keeps the trace alive.' },
    { day: 'Day 3', image: 3, scale: 1, status: 'Reviewed', caption: 'A second return strengthens the stem.' },
    { day: 'Day 7', image: 4, scale: 1.05, status: 'Reviewed', caption: 'The gap widens while the roots spread.' },
    { day: 'Day 14', image: 5, scale: 1.2, status: 'Reviewed', caption: 'Recall becomes faster and more stable.' },
    { day: 'Day 30', image: 6, scale: 1.4, status: 'Reviewed', caption: 'The memory is rooted and can wait much longer.' }
  ];
  const missedDays = ['Day 7', 'Day 10', 'Day 14', 'Day 21', 'Day 30', 'Day 60'];
  const recoveryFrames = [
    { day: 'Day 7', status: 'Reviewed', image: 7, scale: .72, caption: 'The Day 7 review is still holding.' },
    { day: 'Day 10', status: 'No review', image: 8, scale: .72, caption: 'The scheduled return was missed; the trace begins to weaken.' },
    { day: 'Day 11', status: 'Reviewed', image: 9, scale: .72, caption: 'The late recall stops further decline, but the sapling is still weaker.' },
    { day: 'Day 14', status: 'Reviewed', image: 8, scale: .8, caption: 'The shorter follow-up begins restoring stability.' },
    { day: 'Day 21', status: 'Reviewed', image: 3, scale: 1.05, caption: 'Successful recall lets the interval widen again.' },
    { day: 'Day 30', status: 'Reviewed', image: 4, scale: 1.3, caption: 'The memory is growing again.' }
  ];
  const scaleFrames = [
    { label: '1 word', scale: .24 },
    { label: '100 words', scale: .48 },
    { label: '1,000 words', scale: .76 },
    { label: 'A working vocabulary', scale: 1 }
  ];
  let memoryFrame = -1;
  let missedFrame = -1;
  let recoveryFrame = -1;
  let scaleFrame = -1;
  let specimenIndex = 0;
  let ticking = false;

  function buildReviewCalendar() {
    const reviewDays = new Set([1, 3, 7, 14, 30]);
    for (let number = 1; number <= 30; number++) {
      const item = document.createElement('li');
      item.textContent = number;
      item.dataset.day = number;
      item.classList.toggle('is-review', reviewDays.has(number));
      if (reviewDays.has(number)) item.setAttribute('aria-label', `Day ${number}: scheduled review`);
      calendar.append(item);
    }
  }

  function storyProgress(element) {
    const travel = Math.max(1, element.offsetHeight - innerHeight);
    return clamp(-element.getBoundingClientRect().top / travel);
  }

  function showMemoryFrame(index) {
    if (index === memoryFrame) return;
    memoryFrame = index;
    const frame = frames[index];
    tree.setAttribute('href', `spaced-repetition/images/sprites/tree-lifecycle/lifecycle-${frame.image}.png`);
    tree.style.setProperty('--tree-scale', frame.scale);
    day.textContent = frame.day;
    eventDay.textContent = frame.day;
    eventStatus.textContent = frame.status;
    eventStatus.classList.toggle('is-reviewed', frame.status === 'Reviewed');
    const currentDay = Number(frame.day.replace(/\D/g, ''));
    calendarState.textContent = frame.status;
    [...calendar.children].forEach(item => {
      const itemDay = Number(item.dataset.day);
      item.classList.toggle('is-past', item.classList.contains('is-review') && itemDay < currentDay);
      item.classList.toggle('is-current', itemDay === currentDay);
    });
    caption.textContent = frame.caption;
    steps.forEach((step, position) => step.classList.toggle('is-active', position === index));
    status.textContent = `${frame.day}. ${frame.caption}`;
  }

  function showMissedFrame(index) {
    if (index === missedFrame) return;
    missedFrame = index;
    missedTree.setAttribute('href', `spaced-repetition/images/sprites/tree-lifecycle/lifecycle-${index + 7}.png`);
    missedDay.textContent = missedDays[index];
    missedStatus.textContent = index === 0 ? 'Reviewed' : 'No review';
    missedStatus.classList.toggle('is-reviewed', index === 0);
    missedStatus.classList.toggle('is-missed', index !== 0);
    missedCaption.classList.toggle('is-reviewed', index === 0);
    missedCaption.classList.toggle('is-missed', index !== 0);
  }

  function showRecoveryFrame(index) {
    if (index === recoveryFrame) return;
    recoveryFrame = index;
    const frame = recoveryFrames[index];
    recoveryTree.setAttribute('href', `spaced-repetition/images/sprites/tree-lifecycle/lifecycle-${frame.image}.png`);
    recoveryTree.style.setProperty('--recovery-scale', frame.scale);
    recoveryDay.textContent = frame.day;
    recoveryStatus.textContent = frame.status;
    recoveryStatus.classList.toggle('is-reviewed', frame.status === 'Reviewed');
    recoveryStatus.classList.toggle('is-missed', frame.status === 'No review');
    recoveryCaption.textContent = frame.caption;
    recoveryCaption.classList.toggle('is-reviewed', frame.status === 'Reviewed');
    recoveryCaption.classList.toggle('is-missed', frame.status === 'No review');
  }

  function showScaleFrame(index) {
    if (index === scaleFrame) return;
    scaleFrame = index;
    const frame = scaleFrames[index];
    aerialForest.src = `spaced-repetition/images/sprites/aerial-forest/aerial-${index + 1}.png`;
    aerialForest.style.setProperty('--aerial-scale', frame.scale);
    scaleLabel.textContent = frame.label;
    canopyScale.textContent = `0${index + 1} / 04`;
  }

  function updateScrollStories() {
    ticking = false;
    if (reducedMotion.matches) {
      showMemoryFrame(frames.length - 1);
      missedStage.style.setProperty('--missed-progress', 1);
      showMissedFrame(5);
      missedCaption.textContent = 'Without another encounter, the route back becomes faint.';
      showRecoveryFrame(recoveryFrames.length - 1);
      showScaleFrame(scaleFrames.length - 1);
      return;
    }

    const memoryProgress = storyProgress(memoryStory);
    showMemoryFrame(stageFor(memoryProgress, frames.length));

    const missedProgress = storyProgress(missedStory);
    missedStage.style.setProperty('--missed-progress', missedProgress.toFixed(3));
    showMissedFrame(stageFor(missedProgress, 6));
    missedCaption.textContent = missedProgress < .34
      ? 'The memory is still within reach.'
      : missedProgress < .7
        ? 'The path is fading; recall now takes more effort.'
        : 'Without another encounter, the route back becomes faint.';

    const recoveryProgress = storyProgress(recoveryStory);
    recoveryStage.style.setProperty('--missed-progress', recoveryProgress.toFixed(3));
    showRecoveryFrame(stageFor(recoveryProgress, recoveryFrames.length));

    const scaleProgress = storyProgress(scaleStory);
    showScaleFrame(stageFor(scaleProgress, scaleFrames.length));
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollStories);
  }

  function showSpecimen(index) {
    specimenIndex = (index + specimens.length) % specimens.length;
    specimens.forEach((specimen, position) => {
      const active = position === specimenIndex;
      specimen.hidden = !active;
      specimen.classList.toggle('is-active', active);
      specimen.classList.toggle('is-entering', active && !reducedMotion.matches);
      if (active) specimen.addEventListener('animationend', () => specimen.classList.remove('is-entering'), { once: true });
    });
    document.getElementById('specimen-position').textContent = `${specimenIndex + 1} / ${specimens.length}`;
  }

  document.getElementById('previous-specimen').addEventListener('click', () => showSpecimen(specimenIndex - 1));
  document.getElementById('next-specimen').addEventListener('click', () => showSpecimen(specimenIndex + 1));
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
  reducedMotion.addEventListener?.('change', requestUpdate);

  buildReviewCalendar();
  showSpecimen(0);
  requestUpdate();
})();

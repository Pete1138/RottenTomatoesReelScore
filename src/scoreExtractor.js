export function getPercentage(text) {
  if (!text) return null;
  const match = text.trim().match(/(\d{1,3})%/);
  return match ? parseInt(match[1], 10) : null;
}

// Try multiple selectors for resilience in case the site changes
const CRITIC_SELECTORS = [
  '.mop-ratings-wrap__percentage', // critics score (desktop)
  '.score-board__link--tomatometer .percentage',
  '.tomatometer .percentage'
];

const AUDIENCE_SELECTORS = [
  '.audience-score .percentage',
  '.score-board__link--audience-score .percentage'
];

export function queryFirst(selectors) {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export function extractScores() {
  const criticEl = queryFirst(CRITIC_SELECTORS);
  const audienceEl = queryFirst(AUDIENCE_SELECTORS);

  const tomatoMeter = criticEl ? getPercentage(criticEl.textContent) : null;
  const popcornMeter = audienceEl ? getPercentage(audienceEl.textContent) : null;

  return { tomatoMeter, popcornMeter };
}

export function observeScoreElements(callback) {
  // Immediate attempt
  const initial = extractScores();
  if (initial.tomatoMeter !== null && initial.popcornMeter !== null) {
    callback(initial);
    return null;
  }

  const observer = new MutationObserver(() => {
    const scores = extractScores();
    if (scores.tomatoMeter !== null && scores.popcornMeter !== null) {
      observer.disconnect();
      callback(scores);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
} 
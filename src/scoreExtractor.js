export function getPercentage(text) {
  if (!text) return null;
  const match = text.trim().match(/(\d{1,3})%/);
  return match ? parseInt(match[1], 10) : null;
}

// Cache element references for performance
let cachedCriticEl = null;
let cachedAudienceEl = null;

const CRITIC_SELECTORS = [
  '.mop-ratings-wrap__percentage', // critics score (desktop)
  '.score-board__link--tomatometer .percentage',
  '.tomatometer .percentage',
  '.critics-score-wrap'
];

const AUDIENCE_SELECTORS = [
  '.audience-score .percentage',
  '.score-board__link--audience-score .percentage',
  '.audience-score-wrap'
];

export function queryFirst(selectors) {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

function searchPercentageInElement(el) {
  if (!el) return null;
  // If the element itself contains %, test it first
  const direct = getPercentage(el.textContent);
  if (direct !== null) return direct;

  // Otherwise, scan descendants (depth-first) looking for first text with %
  const iterator = document.createNodeIterator(el, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = iterator.nextNode())) {
    const val = getPercentage(node.textContent);
    if (val !== null) return val;
  }
  return null;
}

export function extractScores() {
  // Use cached references if still connected to DOM
  if (cachedCriticEl && !document.contains(cachedCriticEl)) cachedCriticEl = null;
  if (cachedAudienceEl && !document.contains(cachedAudienceEl)) cachedAudienceEl = null;

  if (!cachedCriticEl) cachedCriticEl = queryFirst(CRITIC_SELECTORS);
  if (!cachedAudienceEl) cachedAudienceEl = queryFirst(AUDIENCE_SELECTORS);

  let tomatoMeter = cachedCriticEl ? getPercentage(cachedCriticEl.textContent) : null;
  let popcornMeter = cachedAudienceEl ? getPercentage(cachedAudienceEl.textContent) : null;

  // Fallback: use <score-board> custom element data attributes
  if (tomatoMeter === null || popcornMeter === null) {
    const scoreBoard = document.querySelector('score-board');
    if (scoreBoard) {
      const attrTomato = scoreBoard.getAttribute('tomatometerscore');
      const attrAudience = scoreBoard.getAttribute('audiencescore');
      if (tomatoMeter === null && attrTomato) {
        const parsed = parseInt(attrTomato, 10);
        if (!isNaN(parsed)) tomatoMeter = parsed;
      }
      if (popcornMeter === null && attrAudience) {
        const parsed = parseInt(attrAudience, 10);
        if (!isNaN(parsed)) popcornMeter = parsed;
      }
    }
  }

  // Final attempt: brute-force search inside wrap elements if still null
  if (tomatoMeter === null) {
    tomatoMeter = searchPercentageInElement(queryFirst(['.critics-score-wrap']));
  }
  if (popcornMeter === null) {
    popcornMeter = searchPercentageInElement(queryFirst(['.audience-score-wrap']));
  }

  // Fallback 3: use <rt-text> elements with slot attributes on detail pages
  if (tomatoMeter === null) {
    const criticSlot = document.querySelector('rt-text[slot="criticsScore"]');
    tomatoMeter = getPercentage(criticSlot?.textContent);
  }
  if (popcornMeter === null) {
    const audienceSlot = document.querySelector('rt-text[slot="audienceScore"]');
    popcornMeter = getPercentage(audienceSlot?.textContent);
  }

  return { tomatoMeter, popcornMeter };
}

function debounce(fn, wait = 50) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
}

export function observeScoreElements(callback) {
  const tryEmit = () => {
    const scores = extractScores();
    if (scores.tomatoMeter !== null && scores.popcornMeter !== null) {
      callback(scores);
      return true;
    }
    return false;
  };

  if (tryEmit()) return null;

  const container = document.querySelector('.score-board') || document.body;
  const observer = new MutationObserver(debounce(() => {
    if (tryEmit()) observer.disconnect();
  }, 50));

  observer.observe(container, { childList: true, subtree: true });
  return observer;
}

export function extractFromScorePairs(pairEl) {
  if (!pairEl) return { tomatoMeter: null, popcornMeter: null };
  const criticText = pairEl.querySelector('[slot="criticsScore"]')?.textContent;
  const audienceText = pairEl.querySelector('[slot="audienceScore"]')?.textContent;
  return {
    tomatoMeter: getPercentage(criticText),
    popcornMeter: getPercentage(audienceText)
  };
} 
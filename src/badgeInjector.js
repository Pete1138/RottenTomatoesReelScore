import { extractScores } from './scoreExtractor.js';
import { calculateReelScore, getReelScoreVisuals } from './reelScoreCalculator.js';
import { createBadgeElement, injectBadgeStyles } from './badgeCreator.js';

function debounce(func, wait = 100) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

export function injectBadges() {
  const { tomatoMeter, popcornMeter } = extractScores();
  const reelScore = calculateReelScore(popcornMeter, tomatoMeter);
  if (reelScore === null) return;

  const visuals = getReelScoreVisuals(reelScore);
  const badge = createBadgeElement(reelScore, visuals);

  // inject next to audience score preferred, else critic
  const audienceContainer = document.querySelector('.audience-score') || document.querySelector('.score-board__link--audience-score');
  const criticContainer = document.querySelector('.tomatometer') || document.querySelector('.score-board__link--tomatometer');

  const target = audienceContainer || criticContainer;
  if (!target) return;

  // Avoid duplicate badges
  if (target.querySelector('.reel-score-badge')) return;

  target.appendChild(badge);
}

export function initBadgeInjection() {
  injectBadgeStyles();
  injectBadges();

  const observer = new MutationObserver(debounce(() => {
    injectBadges();
  }, 150));

  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
} 
import { extractScores } from './scoreExtractor.js';
import { calculateReelScore, getReelScoreVisuals } from './reelScoreCalculator.js';
import { createBadgeElement, injectBadgeStyles } from './badgeCreator.js';
import { logger } from './logger.js';

function debounce(func, wait = 50) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

export function injectBadges() {
  try {
    const { tomatoMeter, popcornMeter } = extractScores();
    const reelScore = calculateReelScore(popcornMeter, tomatoMeter);
    if (reelScore === null) {
      logger.debug('Scores not available, skipping badge injection');
      return;
    }

    const visuals = getReelScoreVisuals(reelScore);
    const badge = createBadgeElement(reelScore, visuals);

    // inject next to audience score preferred, else critic
    const audienceContainer = document.querySelector('.audience-score') || document.querySelector('.score-board__link--audience-score');
    const criticContainer = document.querySelector('.tomatometer') || document.querySelector('.score-board__link--tomatometer');

    const target = audienceContainer || criticContainer;
    if (!target) {
      logger.debug('No suitable container found for badge injection');
      return;
    }

    // Avoid duplicate badges
    if (target.querySelector('.reel-score-badge')) {
      logger.debug('Badge already exists, skipping');
      return;
    }

    target.appendChild(badge);
    logger.debug('Badge injected successfully', { reelScore, tomatoMeter, popcornMeter });
  } catch (error) {
    logger.error('Failed to inject badge', { error: error.message, stack: error.stack });
  }
}

export function initBadgeInjection() {
  try {
    logger.info('Initializing badge injection system');
    injectBadgeStyles();
    injectBadges();

    const observer = new MutationObserver(debounce(() => {
      injectBadges();
    }, 150));

    observer.observe(document.body, { childList: true, subtree: true });
    logger.info('Badge injection system initialized');
    return observer;
  } catch (error) {
    logger.error('Failed to initialize badge injection', { error: error.message, stack: error.stack });
    return null;
  }
} 
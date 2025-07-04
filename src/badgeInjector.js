import { extractScores, extractFromScorePairs } from './scoreExtractor.js';
import { calculateReelScore, getReelScoreVisuals } from './reelScoreCalculator.js';
import { createBadgeElement, injectBadgeStyles, createReelScoreBlock } from './badgeCreator.js';
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
      logger.debug('Scores not available after extraction attempts, skipping badge injection');
      return;
    }

    const visuals = getReelScoreVisuals(reelScore);
    const badge = createBadgeElement(reelScore, visuals);

    // inject next to audience score preferred, else critic
    const audienceContainer = document.querySelector('.audience-score') || document.querySelector('.score-board__link--audience-score') || document.querySelector('.audience-score-wrap') || document.querySelector('rt-text[slot="audienceScore"]');
    const criticContainer = document.querySelector('.tomatometer') || document.querySelector('.score-board__link--tomatometer') || document.querySelector('.critics-score-wrap') || document.querySelector('rt-text[slot="criticsScore"]');

    const target = audienceContainer || criticContainer;
    if (!target) {
      logger.debug('No suitable container found for badge injection');
      return;
    }

    // Avoid duplicate badges
    if (target && target.closest && target.closest('media-scorecard')?.querySelector('.reel-score-badge')) {
      logger.debug('Badge already exists, skipping');
      return;
    }

    const card = target.closest('media-scorecard');
    if (card) {
      const block = createReelScoreBlock(reelScore);
      block.setAttribute('slot', 'audienceScoreIcon');
      // place before audienceScoreIcon button
      const audienceIconBtn = card.querySelector('rt-button[slot="audienceScoreIcon"]');
      const audienceScoreType = card.querySelector('rt-text[slot="audienceScoreType"]');
      if (audienceScoreType && !card.querySelector('.reel-score-block')) {
        audienceScoreType.parentNode.insertBefore(block, audienceScoreType.nextSibling);
      } else if (audienceIconBtn && !card.querySelector('.reel-score-block')) {
        audienceIconBtn.parentNode.insertBefore(block, audienceIconBtn.nextSibling);
      }
      logger.info('Inserted block into media-scorecard');
    } else if (target.tagName === 'RT-TEXT') {
      // preferable: place badge after reviews link for consistent layout
      const card = target.closest('media-scorecard') || target.parentNode;
      const reviewsLink = card.querySelector('rt-link[slot="audienceReviews"], rt-link[slot="criticsReviews"]');
      if (reviewsLink) {
        reviewsLink.parentNode.insertBefore(badge, reviewsLink.nextSibling);
      } else {
        const wrap = target.closest('.score-wrap') || card;
        wrap.appendChild(badge);
      }
    } else {
      target.appendChild(badge);
    }

    // If we are operating within media-scorecard, give badge same slot so it renders
    const slotName = target.getAttribute && target.getAttribute('slot');
    if (slotName) {
      badge.setAttribute('slot', slotName);
    }

    logger.info('Badge injected successfully', { reelScore, tomatoMeter, popcornMeter });
  } catch (error) {
    logger.error('Failed to inject badge', { error: error.message, stack: error.stack });
  }
}

export function injectBadgesForScorePairs() {
  const pairs = document.querySelectorAll('score-pairs-deprecated, score-pairs');
  pairs.forEach((pair) => {
    if (pair.dataset.reelScoreInjected === '1') return;

    const { tomatoMeter, popcornMeter } = extractFromScorePairs(pair);
    const reelScore = calculateReelScore(popcornMeter, tomatoMeter);
    if (reelScore === null) return;

    const visuals = getReelScoreVisuals(reelScore);
    const badge = createBadgeElement(reelScore, visuals);
    badge.style.width = '28px';
    badge.style.height = '28px';
    badge.style.fontSize = '0.75rem';
    badge.style.marginLeft = '4px';

    pair.appendChild(badge);
    pair.dataset.reelScoreInjected = '1';
    logger.info('Badge injected into list item', { reelScore });
  });
}

export function initBadgeInjection() {
  try {
    logger.info('Initializing badge injection system');
    injectBadgeStyles();
    injectBadges();
    injectBadgesForScorePairs();

    const observer = new MutationObserver(debounce(() => {
      injectBadges();
      injectBadgesForScorePairs();
    }, 150));

    observer.observe(document.body, { childList: true, subtree: true });
    logger.info('Badge injection system initialized');
    return observer;
  } catch (error) {
    logger.error('Failed to initialize badge injection', { error: error.message, stack: error.stack });
    return null;
  }
} 
console.log('ReelScore content script active');

import { observeScoreElements } from './scoreExtractor.js';
import { calculateReelScore, getReelScoreVisuals } from './reelScoreCalculator.js';
import { injectBadgeStyles, createBadgeElement } from './badgeCreator.js';

observeScoreElements(({ tomatoMeter, popcornMeter }) => {
  const reelScore = calculateReelScore(popcornMeter, tomatoMeter);
  const visuals = getReelScoreVisuals(reelScore);
  console.log(`Reel Score: ${reelScore} | ${visuals.description}`);

  // Inject styles once
  if (!window.__reelBadgeStyles) {
    injectBadgeStyles();
    window.__reelBadgeStyles = true;
  }

  // Remove existing badge if any
  const existing = document.querySelector('.reel-score-badge');
  if (existing) existing.remove();

  // Determine insertion target: audience score element preferred
  const audienceEl = document.querySelector('.audience-score .percentage') || document.querySelector('.score-board__link--audience-score .percentage');
  const criticEl = document.querySelector('.mop-ratings-wrap__percentage') || document.querySelector('.score-board__link--tomatometer .percentage');
  const targetEl = audienceEl || criticEl;
  if (!targetEl) return;

  const badge = createBadgeElement(reelScore);
  targetEl.parentNode.insertBefore(badge, targetEl.nextSibling);
});

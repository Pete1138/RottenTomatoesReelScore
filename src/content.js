console.log('ReelScore content script active');

import { observeScoreElements } from './scoreExtractor.js';
import { calculateReelScore, getReelScoreVisuals } from './reelScoreCalculator.js';
import { initBadgeInjection } from './badgeInjector.js';

// Initialize badge injection (handles dynamic SPA updates)
initBadgeInjection();

// Optional console logging for debugging
observeScoreElements(({ tomatoMeter, popcornMeter }) => {
  const reelScore = calculateReelScore(popcornMeter, tomatoMeter);
  const visuals = getReelScoreVisuals(reelScore);
  console.log(`Reel Score: ${reelScore} | ${visuals.description}`);
});

// (Badge injection is now handled by badgeInjector.js)

console.log('ReelScore content script active');

import { observeScoreElements } from './scoreExtractor.js';
import { calculateReelScore, getReelScoreVisuals } from './reelScoreCalculator.js';

observeScoreElements(({ tomatoMeter, popcornMeter }) => {
  const reelScore = calculateReelScore(popcornMeter, tomatoMeter);
  const visuals = getReelScoreVisuals(reelScore);
  console.log(`Reel Score: ${reelScore} | ${visuals.description}`);
  // TODO: In future task, inject badge using visuals.color and visuals.icon
});

console.log('ReelScore content script active');

import { observeScoreElements } from './scoreExtractor.js';

observeScoreElements(({ tomatoMeter, popcornMeter }) => {
  const diff = popcornMeter - tomatoMeter;
  console.log(`Reel Score difference detected: Critics ${tomatoMeter}% | Audience ${popcornMeter}% | Diff ${diff}`);
  // TODO: Dispatch event for UI badge injection in future tasks
});

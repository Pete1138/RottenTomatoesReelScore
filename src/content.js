console.log('ReelScore content script active');

import { initBadgeInjection } from './badgeInjector.js';

// Determine if current page is a movie or TV detail page on RottenTomatoes
function isRelevantPage() {
  const url = location.href;
  return url.includes('rottentomatoes.com') && (url.includes('/m/') || url.includes('/tv/'));
}

async function initialize() {
  if (!isRelevantPage()) return;

  // Check extension enabled flag (default true)
  const { enabled = true } = await chrome.storage.sync.get('enabled');
  if (!enabled) return;

  let observer = initBadgeInjection();

  // Listen for enable/disable changes
  chrome.storage.onChanged.addListener((changes) => {
    if (!changes.enabled) return;

    if (changes.enabled.newValue === false) {
      // Disable: remove badges & disconnect observer
      document.querySelectorAll('.reel-score-badge').forEach((b) => b.remove());
      observer && observer.disconnect();
    }

    if (changes.enabled.newValue === true && changes.enabled.oldValue === false) {
      // Re-enable: start again
      observer = initBadgeInjection();
    }
  });
}

initialize();

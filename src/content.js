import { logger, setupGlobalErrorHandling } from './logger.js';

import { initBadgeInjection } from './badgeInjector.js';

// Determine if current page is a movie or TV detail page on RottenTomatoes
function isRelevantPage() {
  const url = location.href;
  return url.includes('rottentomatoes.com') && (url.includes('/m/') || url.includes('/tv/'));
}

async function initialize() {
  try {
    setupGlobalErrorHandling();
    logger.info('Extension initializing');

    if (!isRelevantPage()) {
      logger.debug('Not a relevant page, exiting');
      return;
    }

    const { enabled = true } = await chrome.storage.sync.get('enabled');
    if (!enabled) {
      logger.debug('Extension disabled in settings, exiting');
      return;
    }

    logger.info('Initializing badge injection');
    let observer = initBadgeInjection();

    chrome.storage.onChanged.addListener((changes) => {
      if (!changes.enabled) return;

      logger.info('Enabled setting changed', { newValue: changes.enabled.newValue });
      if (changes.enabled.newValue === false) {
        document.querySelectorAll('.reel-score-badge').forEach((b) => b.remove());
        observer && observer.disconnect();
      }

      if (changes.enabled.newValue === true && changes.enabled.oldValue === false) {
        observer = initBadgeInjection();
      }
    });

    logger.info('Extension initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize extension', { error: error.message, stack: error.stack });
  }
}

initialize();

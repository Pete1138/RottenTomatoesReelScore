import { getReelScoreVisuals } from './reelScoreCalculator.js';

export function injectBadgeStyles() {
  if (document.getElementById('reel-score-styles')) return;
  const style = document.createElement('style');
  style.id = 'reel-score-styles';
  style.textContent = `
    .reel-score-badge {
      font-family: ShockSans, Arial, sans-serif;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: white;
      font-weight: bold;
      margin-left: 8px;
      position: relative;
      cursor: help;
      transition: opacity .2s ease;
    }
    .reel-score-badge:hover { opacity: 0.9; }
    .reel-score-badge .reel-score-icon {
      position: absolute;
      bottom: -2px;
      right: -2px;
      font-size: 12px;
    }
    .reel-score-tooltip {
      position: absolute;
      bottom: 120%;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: #fff;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 1000;
    }
    .reel-score-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
  `;
  document.head.appendChild(style);
}

export function createBadgeElement(reelScore) {
  const visuals = getReelScoreVisuals(reelScore);
  const badge = document.createElement('div');
  badge.className = 'reel-score-badge';
  badge.style.backgroundColor = visuals.color;
  // Accessibility title (fallback)
  badge.setAttribute('aria-label', visuals.description);

  // Custom tooltip for styled message
  const tooltip = document.createElement('div');
  tooltip.className = 'reel-score-tooltip';
  tooltip.textContent = visuals.description;
  badge.appendChild(tooltip);

  // Show/hide tooltip
  badge.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1';
  });
  badge.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });

  const text = document.createElement('span');
  text.textContent = Math.abs(reelScore);
  badge.appendChild(text);

  const icon = document.createElement('div');
  icon.className = 'reel-score-icon';
  icon.textContent = visuals.icon === 'thumbs-up' ? '👍' : visuals.icon === 'thumbs-down' ? '👎' : '✋';
  badge.appendChild(icon);

  return badge;
} 
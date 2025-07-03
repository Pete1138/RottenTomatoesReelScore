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
  `;
  document.head.appendChild(style);
}

export function createBadgeElement(reelScore) {
  const visuals = getReelScoreVisuals(reelScore);
  const badge = document.createElement('div');
  badge.className = 'reel-score-badge';
  badge.style.backgroundColor = visuals.color;
  badge.setAttribute('aria-label', visuals.description);
  badge.title = visuals.description;

  const text = document.createElement('span');
  text.textContent = Math.abs(reelScore);
  badge.appendChild(text);

  const icon = document.createElement('div');
  icon.className = 'reel-score-icon';
  icon.textContent = visuals.icon === 'thumbs-up' ? '👍' : visuals.icon === 'thumbs-down' ? '👎' : '✋';
  badge.appendChild(icon);

  return badge;
} 
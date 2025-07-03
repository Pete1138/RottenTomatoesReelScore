export function calculateReelScore(popcornMeter, tomatoMeter) {
  if (popcornMeter === null || tomatoMeter === null) return null;
  return popcornMeter - tomatoMeter;
}

export function getReelScoreVisuals(reelScore) {
  if (reelScore === null) {
    return { color: '#95a5a6', icon: 'neutral', description: 'Score unavailable' };
  }
  if (reelScore > 0) {
    return {
      color: '#2ecc71',
      icon: 'thumbs-up',
      description: `Audience score is ${Math.abs(reelScore)}% higher than critics.`
    };
  }
  if (reelScore < 0) {
    return {
      color: '#e74c3c',
      icon: 'thumbs-down',
      description: `Audience score is ${Math.abs(reelScore)}% lower than critics.`
    };
  }
  return {
    color: '#95a5a6',
    icon: 'neutral',
    description: 'Critics and audiences agree exactly.'
  };
} 
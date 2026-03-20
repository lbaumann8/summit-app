export function getNearMissText(
  weightedScore: number,
  maxScore: number
): string | null {
  if (maxScore === 0) return null;

  const pct = weightedScore / maxScore;

  // already top tier → no need for near miss
  if (pct >= 0.8) return null;

  const oneMorePointPct = (weightedScore + 1) / maxScore;

  if (pct < 0.6 && oneMorePointPct >= 0.6) {
    return '1 more point would have put you above most players';
  }

  if (pct < 0.8 && oneMorePointPct >= 0.8) {
    return '1 more strong call would have put you near the top';
  }

  if (weightedScore === 0) {
    return 'Tough day. Tomorrow is a clean slate';
  }

  return 'You were close to a higher tier';
}
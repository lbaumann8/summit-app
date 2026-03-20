export function getPercentileFromScore(weightedScore: number, maxScore: number) {
  if (maxScore === 0) return 0;

  const pct = weightedScore / maxScore;

  // fake distribution (later this becomes real backend data)
  if (pct === 1) return 95;
  if (pct >= 0.8) return 85;
  if (pct >= 0.6) return 65;
  if (pct >= 0.4) return 45;
  if (pct > 0) return 25;
  return 10;
}
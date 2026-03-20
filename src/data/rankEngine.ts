export function getMockRankFromEdgePoints(edgePoints: number) {
  if (edgePoints > 4000) return 1;
  if (edgePoints > 3500) return 2;
  if (edgePoints > 3000) return 3;
  if (edgePoints > 2000) return 4;
  if (edgePoints > 1000) return 5;
  return 6;
}

export function getRankMovement(prevRank: number, newRank: number) {
  if (!prevRank) return 0;
  return prevRank - newRank; // positive = moved up
}

export function getPlayerPassed(prevRank: number, newRank: number) {
  if (newRank < prevRank) {
    return `You passed ${prevRank - newRank} player${prevRank - newRank > 1 ? 's' : ''}`;
  }
  return null;
}
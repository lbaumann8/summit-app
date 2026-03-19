import { User } from '../types';

export const mockUser: User = {
  name: 'Alex',
  rank: 'Rise',
  edgePoints: 1240,
  run: 7,
  topPercent: 23,
  rankProgress: 62, // 62% to next rank
  edgePointsToNextRank: 760,
};

export const leaderboard = [
  { rank: 1, name: 'Marcus H.', edgePoints: 4820, userRank: 'Ascent' },
  { rank: 2, name: 'Priya S.', edgePoints: 4310, userRank: 'Ascent' },
  { rank: 3, name: 'Jordan K.', edgePoints: 3990, userRank: 'Ascent' },
  { rank: 4, name: 'You', edgePoints: 1240, userRank: 'Rise', isCurrentUser: true },
  { rank: 5, name: 'Chris M.', edgePoints: 1180, userRank: 'Rise' },
];

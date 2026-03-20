import { User } from '../types';

export const mockUser: User = {
  name: 'Alex',
  rank: 'Rise',
  edgePoints: 0,
  run: 0,
  topPercent: 50,
  rankProgress: 0,
  edgePointsToNextRank: 100,
};

export const leaderboard = [
  {
    name: 'Marcus H.',
    confidenceScore: 3,
    maxScore: 3,
    dailyEdgePoints: 70,
    highConviction: true,
  },
  {
    name: 'Priya S.',
    confidenceScore: 3,
    maxScore: 3,
    dailyEdgePoints: 50,
    highConviction: false,
  },
  {
    name: 'Jordan K.',
    confidenceScore: 2,
    maxScore: 3,
    dailyEdgePoints: 30,
    highConviction: false,
  },
  {
    name: 'Chris M.',
    confidenceScore: 1,
    maxScore: 3,
    dailyEdgePoints: 10,
    highConviction: false,
  },
];

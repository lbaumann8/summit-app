export type Rank = 'Rise' | 'Ascent' | 'Ridge' | 'Peak' | 'Summit';

export type Difficulty =
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Analyst'
  | 'Associate'
  | 'VP'
  | 'MD';

export type MarketDirection = 'up' | 'down';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface AnswerOption {
  id: string;
  label: string;
  text: string;
}

export interface Challenge {
  id: string;
  title: string;
  track: string;
  difficulty: Difficulty;
  timeEstimate: string;
  scenario: string;
  options: AnswerOption[];
  correctOptionId: string;
  explanation: string;
  edgePoints: number;
}

export interface DailyChallengeAsset {
  key: string;
  label: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  assets: readonly DailyChallengeAsset[];
  outcome: Record<string, MarketDirection>;
  explanations: Record<string, string>;
}

export interface Track {
  id: string;
  name: string;
  description: string;
  challengeCount: number;
  completedCount: number;
  color: string;
}

export interface User {
  name: string;
  rank: Rank;
  edgePoints: number;
  run: number;
  topPercent: number;
  rankProgress: number;
  edgePointsToNextRank: number;
}

export interface DailyAnswer {
  direction?: MarketDirection;
  confidence?: ConfidenceLevel;
}

export interface DailyResultRecord {
  challengeId: string;
  completedAt: number;
  completedDate: string;
  score: number;
  total: number;
  weightedScore: number;
  maxScore: number;
  percentile: number;
  nearMissText: string | null;
  allHighConfidenceCorrect: boolean;
  edgePointsEarned: number;
  newRank: number;
  rankMovement: number;
  passedText: string | null;
  resultHeadline?: string;
}

export interface LeaderboardEntry {
  name: string;
  confidenceScore: number;
  maxScore: number;
  dailyEdgePoints: number;
  highConviction?: boolean;
  isCurrentUser?: boolean;
  rank?: number;
}

export interface ResultState {
  challengeId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  edgePointsEarned: number;
}
export type Rank = 'Rise' | 'Ascent' | 'Ridge' | 'Peak' | 'Summit';
export type Difficulty = 'Analyst' | 'Associate' | 'VP' | 'MD';

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
  rankProgress: number; // 0–100
  edgePointsToNextRank: number;
}

export interface ResultState {
  challengeId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  edgePointsEarned: number;
}

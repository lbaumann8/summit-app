import { useMemo } from 'react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import { leaderboard } from '../data/user';
import { dailyChallenge } from '../data/dailyChallenge';

const RANK_LADDER = ['Rise', 'Ascent', 'Ridge', 'Peak', 'Summit'] as const;
const RANK_THRESHOLDS = [0, 100, 250, 500, 1000];

function getRankData(totalEdgePoints: number) {
  let currentRankIndex = 0;

  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (totalEdgePoints >= RANK_THRESHOLDS[i]) {
      currentRankIndex = i;
    }
  }

  return {
    currentRank: RANK_LADDER[currentRankIndex],
  };
}

type LeaderboardEntry = {
  name: string;
  confidenceScore: number;
  maxScore: number;
  dailyEdgePoints: number;
  highConviction?: boolean;
  isCurrentUser?: boolean;
  rank?: number;
};

function getBoardHeadline(userRank: number | null, totalPlayers: number) {
  if (!userRank) return 'Climb the board';

  const percentile = Math.max(1, Math.round((userRank / totalPlayers) * 100));

  if (userRank === 1) return 'You’re leading today';
  if (percentile <= 10) return 'Top 10% today';
  if (percentile <= 25) return 'Strong position today';
  return 'Still room to climb';
}

function getBoardSubtext(userRank: number | null, totalPlayers: number) {
  if (!userRank) {
    return 'Complete today’s call to enter the board.';
  }

  if (userRank === 1) {
    return 'Best read on the board so far.';
  }

  return `You’re ranked ${userRank} out of ${totalPlayers} players today.`;
}

export default function LeaderboardScreen() {
  const totalEdgePoints = Number(localStorage.getItem('totalEdgePoints') || '0');
  const { currentRank } = useMemo(
    () => getRankData(totalEdgePoints),
    [totalEdgePoints]
  );

  const savedResultRaw = localStorage.getItem('dailyResult');
  const savedResult = savedResultRaw ? JSON.parse(savedResultRaw) : null;

  const todayResult =
    savedResult && savedResult.challengeId === dailyChallenge.id
      ? savedResult
      : null;

  const computedLeaderboard = useMemo(() => {
    const base: LeaderboardEntry[] = [...leaderboard];

    if (!todayResult) {
      return base
        .sort((a, b) => {
          if (b.confidenceScore !== a.confidenceScore) {
            return b.confidenceScore - a.confidenceScore;
          }
          return b.dailyEdgePoints - a.dailyEdgePoints;
        })
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));
    }

    const userEntry: LeaderboardEntry = {
      name: 'You',
      confidenceScore: todayResult.weightedScore,
      maxScore: todayResult.maxScore,
      dailyEdgePoints: todayResult.edgePointsEarned,
      highConviction: todayResult.allHighConfidenceCorrect,
      isCurrentUser: true,
    };

    const combined = [...base, userEntry];

    combined.sort((a, b) => {
      if (b.confidenceScore !== a.confidenceScore) {
        return b.confidenceScore - a.confidenceScore;
      }
      return b.dailyEdgePoints - a.dailyEdgePoints;
    });

    return combined.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [todayResult]);

  const currentUserEntry = useMemo(() => {
    return computedLeaderboard.find((entry) => entry.isCurrentUser) ?? null;
  }, [computedLeaderboard]);

  const totalPlayers = computedLeaderboard.length;
  const userRank = currentUserEntry?.rank ?? null;

  const boardHeadline = getBoardHeadline(userRank, totalPlayers);
  const boardSubtext = getBoardSubtext(userRank, totalPlayers);

  return (
    <div className="app-shell flex min-h-screen flex-col text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-28 scrollbar-none">
        <div className="mb-4">
          <div className="mb-3 inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary">
            Leaderboard
          </div>

          <h1 className="text-[30px] font-bold leading-[1.05] text-text-primary">
            Today’s Board
          </h1>

          <p className="mt-2 max-w-[92%] text-sm leading-relaxed text-text-secondary">
            See how your read stacks up against everyone else today.
          </p>
        </div>

        <Card className="mb-5 border border-gold/10 p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Your Standing
          </div>

          <div className="mb-3">
            <div className="text-2xl font-bold text-text-primary">
              {boardHeadline}
            </div>
            <div className="mt-1 text-sm text-text-secondary">
              {boardSubtext}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-sm text-text-secondary">Rank</div>
              <div className="mt-1 text-2xl font-bold text-gold">
                {userRank ?? '—'}
              </div>
            </div>

            <div>
              <div className="text-sm text-text-secondary">Edge</div>
              <div className="mt-1 text-2xl font-bold text-text-primary">
                {todayResult?.edgePointsEarned ?? 0}
              </div>
            </div>

            <div>
              <div className="text-sm text-text-secondary">Score</div>
              <div className="mt-1 text-2xl font-bold text-text-primary">
                {todayResult
                  ? `${todayResult.weightedScore}/${todayResult.maxScore}`
                  : '—'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {computedLeaderboard.map((entry, index) => {
            const isTopSpot = entry.rank === 1;
            const isTopThree = Boolean(entry.rank && entry.rank <= 3);

            return (
              <div
                key={`${entry.name}-${entry.rank}`}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  index < computedLeaderboard.length - 1
                    ? 'border-b border-border-subtle'
                    : ''
                } ${entry.isCurrentUser ? 'bg-gold/5' : ''}`}
              >
                <div
                  className={`w-6 text-center text-sm font-bold ${
                    isTopSpot
                      ? 'text-gold'
                      : isTopThree
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  }`}
                >
                  {entry.rank}
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-sm font-semibold ${
                      entry.isCurrentUser ? 'text-gold' : 'text-text-primary'
                    }`}
                  >
                    {entry.name} {entry.highConviction ? '🔥' : ''}
                  </div>

                  <div className="text-[11px] text-text-muted">
                    {entry.confidenceScore}/{entry.maxScore} confidence score
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-gold">
                    +{entry.dailyEdgePoints}
                  </div>
                  <div className="text-[11px] text-text-muted">today</div>
                </div>
              </div>
            );
          })}
        </Card>

        <div className="mt-5">
          <Card className="p-5">
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Insight
            </div>

            <p className="text-sm leading-relaxed text-text-secondary">
              Consistent reads climb the board. This is not about random swings,
              it is about judging the setup better than the crowd.
            </p>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
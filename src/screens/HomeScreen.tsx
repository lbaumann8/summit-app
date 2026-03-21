import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  ChevronRight,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Sparkles,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { mockUser, leaderboard } from '../data/user';
import { dailyChallenge } from '../data/dailyChallenge';
import { getRecentActivity, type ActivityEntry } from '../lib/performance';

const RANK_LADDER = ['Rise', 'Ascent', 'Ridge', 'Peak', 'Summit'] as const;
const RANK_THRESHOLDS = [0, 100, 250, 500, 1000];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getNextDailyCallTimeLeft() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return Math.max(next.getTime() - now.getTime(), 0);
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function getRelativeTimeLabel(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function getActivityIcon(entry: ActivityEntry) {
  if (entry.type === 'daily_call') {
    return <Sparkles size={14} className="text-gold" />;
  }

  return <BookOpen size={14} className="text-green-400" />;
}

function getRankData(totalEdgePoints: number) {
  let currentRankIndex = 0;

  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (totalEdgePoints >= RANK_THRESHOLDS[i]) {
      currentRankIndex = i;
    }
  }

  const currentRank = RANK_LADDER[currentRankIndex];
  const nextRank = RANK_LADDER[currentRankIndex + 1] ?? null;

  const currentThreshold = RANK_THRESHOLDS[currentRankIndex];
  const nextThreshold = RANK_THRESHOLDS[currentRankIndex + 1] ?? null;

  const edgePointsToNextRank =
    nextThreshold !== null ? Math.max(nextThreshold - totalEdgePoints, 0) : 0;

  const rankProgress =
    nextThreshold !== null
      ? Math.min(
          ((totalEdgePoints - currentThreshold) /
            (nextThreshold - currentThreshold)) *
            100,
          100
        )
      : 100;

  return {
    currentRank,
    nextRank,
    edgePointsToNextRank,
    rankProgress,
  };
}

function getStreakRiskMessage(streakCount: number) {
  if (streakCount >= 7) {
    return 'Play today to protect your 1.5x streak multiplier';
  }
  if (streakCount >= 5) {
    return 'Play today to protect your 1.25x streak multiplier';
  }
  if (streakCount >= 3) {
    return 'Play today to protect your 1.1x streak multiplier';
  }
  if (streakCount >= 1) {
    return `Don’t lose your ${streakCount}-day streak`;
  }
  return null;
}

function getDailyCompletionBanner(
  todayResult: { edgePointsEarned: number } | null,
  streakCount: number
) {
  if (!todayResult) return null;

  if (streakCount > 1) {
    return {
      title: 'Streak extended',
      text: `${streakCount} days alive, +${todayResult.edgePointsEarned} Edge Points earned today.`,
    };
  }

  return {
    title: 'Daily call completed',
    text: `Nice work. +${todayResult.edgePointsEarned} Edge Points locked in.`,
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

type CompletionBannerState = {
  title: string;
  text: string;
} | null;

export default function HomeScreen() {
  const navigate = useNavigate();
  const user = mockUser;

  const todayKey = getTodayKey();

  useEffect(() => {
    const playedDate = localStorage.getItem('playedDate');

    if (playedDate && playedDate !== todayKey) {
      localStorage.removeItem('played');
      localStorage.removeItem('answers');
      localStorage.removeItem('unlockTime');
      localStorage.removeItem('dailyResult');
      localStorage.removeItem('dailyCompletionBannerSeen');
      localStorage.setItem('playedDate', todayKey);
    }
  }, [todayKey]);

  const getRemainingTime = () => {
    const playedDate = localStorage.getItem('playedDate');
    const unlockTime = Number(localStorage.getItem('unlockTime') || '0');

    if (playedDate !== todayKey || !unlockTime) return 0;
    return Math.max(unlockTime - Date.now(), 0);
  };

  const [timeLeft, setTimeLeft] = useState(getRemainingTime);
  const [nextDailyCallTimeLeft, setNextDailyCallTimeLeft] = useState(
    getNextDailyCallTimeLeft
  );
  const [streakCount, setStreakCount] = useState(
    Number(localStorage.getItem('streakCount') || '0')
  );
  const [totalEdgePoints, setTotalEdgePoints] = useState(
    Number(localStorage.getItem('totalEdgePoints') || '0')
  );
  const [lastRank, setLastRank] = useState(
    Number(localStorage.getItem('lastRank') || '0')
  );
  const [completionBanner, setCompletionBanner] =
    useState<CompletionBannerState>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    setRecentActivity(getRecentActivity());

    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime());
      setNextDailyCallTimeLeft(getNextDailyCallTimeLeft());
      setStreakCount(Number(localStorage.getItem('streakCount') || '0'));
      setTotalEdgePoints(Number(localStorage.getItem('totalEdgePoints') || '0'));
      setLastRank(Number(localStorage.getItem('lastRank') || '0'));
    }, 1000);

    return () => clearInterval(interval);
  }, [todayKey]);

  const { currentRank, nextRank, edgePointsToNextRank, rankProgress } = useMemo(
    () => getRankData(totalEdgePoints),
    [totalEdgePoints]
  );

  const playedDate = localStorage.getItem('playedDate');
  const played =
    localStorage.getItem('played') === 'true' && playedDate === todayKey;
  const resultsReady = played && timeLeft <= 0;

  const savedResultRaw = localStorage.getItem('dailyResult');
  const savedResult = savedResultRaw ? JSON.parse(savedResultRaw) : null;
  const todayResult =
    savedResult &&
    savedResult.challengeId === dailyChallenge.id &&
    savedResult.completedDate === todayKey
      ? savedResult
      : null;

  useEffect(() => {
    if (!todayResult || !resultsReady) return;

    const bannerSeen =
      localStorage.getItem('dailyCompletionBannerSeen') === todayKey;
    if (bannerSeen) return;

    const banner = getDailyCompletionBanner(todayResult, streakCount);
    if (!banner) return;

    setCompletionBanner(banner);
    localStorage.setItem('dailyCompletionBannerSeen', todayKey);

    const timer = window.setTimeout(() => {
      setCompletionBanner(null);
    }, 4500);

    return () => clearTimeout(timer);
  }, [todayResult, resultsReady, streakCount, todayKey]);

  const ctaLabel = useMemo(() => {
    if (!played) return 'Make Your Call';
    if (resultsReady) return 'See Results';

    const hours = Math.floor(timeLeft / 1000 / 60 / 60);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    if (hours > 0) {
      return `Results in ${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }

    return `Results in ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [played, resultsReady, timeLeft]);

  function handleDailyCardClick() {
    if (!played) {
      navigate('/challenge/daily');
      return;
    }

    navigate('/results');
  }

  const streakRiskMessage = useMemo(() => {
    if (played) return null;
    return getStreakRiskMessage(streakCount);
  }, [played, streakCount]);

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

  const currentUserBoardEntry = useMemo(() => {
    return computedLeaderboard.find((entry) => entry.isCurrentUser);
  }, [computedLeaderboard]);

  const topPercentToday = useMemo(() => {
    if (!currentUserBoardEntry?.rank) return user.topPercent;

    const totalPlayers = computedLeaderboard.length;

    return Math.max(
      1,
      Math.round((currentUserBoardEntry.rank / totalPlayers) * 100)
    );
  }, [currentUserBoardEntry, computedLeaderboard, user.topPercent]);

  const rankMovement = useMemo(() => {
    if (!currentUserBoardEntry || !lastRank) return null;

    const diff = lastRank - (currentUserBoardEntry.rank ?? lastRank);

    if (diff > 0) {
      return { type: 'up' as const, value: diff };
    }

    if (diff < 0) {
      return { type: 'down' as const, value: Math.abs(diff) };
    }

    return { type: 'same' as const, value: 0 };
  }, [currentUserBoardEntry, lastRank]);

  useEffect(() => {
    if (!currentUserBoardEntry?.rank) return;
    localStorage.setItem('lastRank', String(currentUserBoardEntry.rank));
  }, [currentUserBoardEntry]);

  const nextDailyCallCountdown = useMemo(
    () => formatCountdown(nextDailyCallTimeLeft),
    [nextDailyCallTimeLeft]
  );

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto pb-28 scrollbar-none">
        <section className="px-4 pt-5">
          <div className="mb-4">
            <div className="inline-flex items-center rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-[11px] font-semibold tracking-wide text-gold">
              Today’s Main Event
            </div>
          </div>

          <div className="mb-5">
            <h1 className="text-[32px] leading-[1.02] font-bold text-text-primary">
              Make Today’s
              <br />
              Market Call
            </h1>

            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary max-w-[92%]">
              One premium daily decision. Real scenario, real conviction, real
              feedback.
            </p>
          </div>

          {completionBanner && (
            <Card className="mb-5 border border-green-500/20 bg-green-500/5 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400">
                  <CheckCircle2 size={16} />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-green-400">
                    {completionBanner.title}
                  </div>
                  <div className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {completionBanner.text}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card
            className="p-5 cursor-pointer active:scale-[0.995] transition-transform border border-gold/10"
            onClick={handleDailyCardClick}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge label="Daily" variant="track" />
                <Badge label="Medium" variant="difficulty" />
              </div>

              <span className="text-[11px] text-text-muted font-medium">
                1 asset
              </span>
            </div>

            <h2 className="text-[24px] leading-[1.12] font-bold text-text-primary mb-3 max-w-[92%]">
              {dailyChallenge.title}
            </h2>

            <p className="text-text-secondary text-[15px] leading-relaxed mb-4 max-w-[94%]">
              {dailyChallenge.description}
            </p>

            {streakRiskMessage && (
              <div className="mb-4 inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                {streakRiskMessage}
              </div>
            )}

            {resultsReady && todayResult?.allHighConfidenceCorrect && (
              <div className="mb-4 inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                Perfect High Conviction Call 🔥
              </div>
            )}

            <div className="rounded-[22px] border border-gold/10 bg-white/[0.02] px-4 py-4 mb-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
                Today’s Asset
              </div>

              <div className="text-xl font-bold text-text-primary">
                {dailyChallenge.assets[0]?.label ?? 'Asset'}
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                {!resultsReady && (
                  <>
                    <span className="text-gold text-[15px] font-bold">+50</span>
                    <span className="text-text-muted text-xs">
                      Perfect call potential
                    </span>
                  </>
                )}

                {resultsReady && todayResult && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gold text-[15px] font-bold">
                        {todayResult.weightedScore}/{todayResult.maxScore}
                      </span>
                      <span className="text-text-muted text-xs">
                        Confidence score
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-gold text-[15px] font-bold">
                        +{todayResult.edgePointsEarned}
                      </span>
                      <span className="text-text-muted text-xs">
                        Earned today
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button className="premium-button rounded-2xl px-5 py-3 text-[15px] font-semibold flex items-center gap-2">
                {ctaLabel}
                <ArrowRight size={14} />
              </button>
            </div>
          </Card>
        </section>

        <section className="px-4 pt-5">
          <Card className="p-5 border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary mb-3">
                  <Clock3 size={12} />
                  Tomorrow’s Setup
                </div>

                <h3 className="text-[22px] leading-[1.1] font-bold text-text-primary mb-2">
                  Next Daily Call drops in {nextDailyCallCountdown}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed max-w-[94%]">
                  Come back for a fresh market setup, protect your streak, and
                  keep climbing the board.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="px-4 pt-5">
          <Card className="p-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Recent Momentum
            </div>

            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.slice(0, 3).map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-start gap-3 ${
                      index < Math.min(recentActivity.length, 3) - 1
                        ? 'border-b border-white/[0.06] pb-3'
                        : ''
                    }`}
                  >
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                      {getActivityIcon(entry)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-text-primary">
                        {entry.title}
                      </div>
                      <div className="mt-1 text-sm text-text-secondary">
                        {entry.subtitle}
                      </div>
                    </div>

                    <div className="text-[11px] text-text-muted whitespace-nowrap">
                      {getRelativeTimeLabel(entry.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
                <div className="text-sm font-semibold text-text-primary">
                  No momentum yet
                </div>
                <div className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Finish today’s Daily Call or complete a practice session and
                  your recent progress will show up here.
                </div>
              </div>
            )}
          </Card>
        </section>

        <section className="px-4 pt-5">
          <div className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase">
            Training Mode
          </div>

          <Card
            className="p-5 cursor-pointer active:scale-[0.995] transition-transform"
            onClick={() => navigate('/practice')}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary mb-3">
                  <BookOpen size={12} />
                  Practice Paths
                </div>

                <h3 className="text-[22px] leading-[1.1] font-bold text-text-primary mb-2">
                  Train Without the Pressure
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed max-w-[94%]">
                  Build pattern recognition across macro, earnings, momentum,
                  and risk events.
                </p>
              </div>

              <ChevronRight
                size={18}
                className="text-text-muted mt-1 flex-shrink-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-text-muted mb-1">
                  Reward
                </div>
                <div className="text-lg font-bold text-gold">+15 EP</div>
                <div className="text-xs text-text-muted mt-1">
                  once per day per path
                </div>
              </div>

              <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-text-muted mb-1">
                  Purpose
                </div>
                <div className="text-lg font-bold text-text-primary">Sharpen</div>
                <div className="text-xs text-text-muted mt-1">
                  lower-stakes reps
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="px-4 pt-5">
          <div className="grid grid-cols-4 gap-2">
            <StatTile
              label="Run"
              value={String(streakCount)}
              icon={<Flame size={12} className="text-orange-400" />}
              highlight
            />
            <StatTile label="Edge" value={totalEdgePoints.toLocaleString()} />
            <StatTile label="Rank" value={currentRank} />
            <StatTile label="Top" value={`${topPercentToday}%`} />
          </div>
        </section>

        <section className="px-4 pt-5">
          <SectionLabel>Your Progress</SectionLabel>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">
                {currentRank}
              </span>

              {nextRank && (
                <span className="text-xs text-text-secondary">
                  <span className="text-gold font-semibold">
                    {edgePointsToNextRank.toLocaleString()}
                  </span>{' '}
                  EP to {nextRank}
                </span>
              )}
            </div>

            <div className="h-2 rounded-full overflow-hidden mb-4 bg-black/20">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${rankProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              {RANK_LADDER.map((rank) => {
                const isActive = rank === currentRank;

                return (
                  <span
                    key={rank}
                    className={`text-[9px] font-semibold uppercase tracking-wider ${
                      isActive ? 'text-gold' : 'text-text-muted'
                    }`}
                  >
                    {rank}
                  </span>
                );
              })}
            </div>
          </Card>
        </section>

        <section className="px-4 pt-5">
          <div className="flex items-center justify-between mb-2">
            <SectionLabel className="mb-0">Today’s Board</SectionLabel>

            <button
              onClick={() => navigate('/leaderboard')}
              className="text-[11px] text-gold font-medium flex items-center gap-1"
            >
              Full board <ChevronRight size={12} />
            </button>
          </div>

          {rankMovement && (
            <div className="mb-2 px-1">
              <div className="text-xs font-semibold">
                {rankMovement.type === 'up' && (
                  <span className="text-green-400">
                    ↑ +{rankMovement.value} spots today
                  </span>
                )}
                {rankMovement.type === 'down' && (
                  <span className="text-red-400">
                    ↓ -{rankMovement.value} spots today
                  </span>
                )}
                {rankMovement.type === 'same' && (
                  <span className="text-text-muted">→ No movement today</span>
                )}
              </div>
            </div>
          )}

          <Card className="overflow-hidden">
            {computedLeaderboard.slice(0, 5).map((entry, i) => (
              <div
                key={`${entry.name}-${entry.rank}`}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  i < Math.min(computedLeaderboard.length, 5) - 1
                    ? 'border-b border-border-subtle'
                    : ''
                } ${entry.isCurrentUser ? 'bg-gold/5' : ''}`}
              >
                <span
                  className={`w-5 text-sm font-bold text-center ${
                    entry.rank === 1
                      ? 'text-gold'
                      : entry.rank && entry.rank <= 3
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  }`}
                >
                  {entry.rank}
                </span>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-semibold truncate ${
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
            ))}
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-2 ${className}`}
    >
      {children}
    </div>
  );
}

function StatTile({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.06] bg-[rgba(10,13,24,0.96)] px-3 py-3.5 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-semibold tracking-[0.15em] text-text-muted uppercase">
          {label}
        </span>
      </div>

      <span
        className={`text-base font-bold leading-none ${
          highlight ? 'text-orange-400' : 'text-text-primary'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
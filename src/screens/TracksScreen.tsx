import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Flame,
  Target,
  CheckCircle2,
  Sparkles,
  BookOpen,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import { tracks, challenges } from '../data/challenges';
import {
  getRecommendedTrackFromPerformance,
  getTrackPerformance,
  type PerformanceMap,
} from '../lib/performance';

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

function getCompletedPracticeCount(trackId: string) {
  return Number(localStorage.getItem(`practiceCompleted:${trackId}`) || '0');
}

function getFeaturedPrompt(trackId: string) {
  if (trackId === 'macro') {
    return 'Fed hints at cuts, but yields are still elevated. What matters most next?';
  }

  if (trackId === 'earnings') {
    return 'A company beats earnings, but the stock barely moves. What is the market telling you?';
  }

  if (trackId === 'momentum') {
    return 'The market gaps up 2% at the open. What would confirm real follow-through?';
  }

  if (trackId === 'risk') {
    return 'Oil spikes overnight. Which sectors feel it first, and why?';
  }

  return 'Sharpen your read with focused market scenarios.';
}

function getFeaturedTag(trackId: string) {
  if (trackId === 'macro') return 'Rates';
  if (trackId === 'earnings') return 'Guidance';
  if (trackId === 'momentum') return 'Follow-through';
  if (trackId === 'risk') return 'Shock';
  return 'Practice';
}

function getRecommendationReason(trackId: string) {
  if (trackId === 'macro') {
    return 'Recommended because macro reactions are a current weak spot or a strong next place to train.';
  }

  if (trackId === 'earnings') {
    return 'Recommended because earnings expectation gaps are a strong next area to sharpen.';
  }

  if (trackId === 'momentum') {
    return 'Recommended because momentum and follow-through reads are a strong next training opportunity.';
  }

  if (trackId === 'risk') {
    return 'Recommended because risk-event reactions need more reps right now.';
  }

  return 'A smart next place to build your edge.';
}

function getTrackAccuracyText(
  trackId: keyof PerformanceMap,
  performance: ReturnType<typeof getTrackPerformance>
) {
  const data = performance[trackId];

  if (data.attempts === 0) return 'No reps yet';

  const accuracy = Math.round((data.correct / data.attempts) * 100);
  return `${accuracy}% accuracy`;
}

function getTrackDisplayName(trackId: keyof PerformanceMap) {
  if (trackId === 'macro') return 'Macro Reactions';
  if (trackId === 'earnings') return 'Earnings Reads';
  if (trackId === 'momentum') return 'Momentum';
  return 'Risk Events';
}

function getTrackSnapshotText(trackId: keyof PerformanceMap, accuracy: number) {
  if (trackId === 'macro') {
    return accuracy >= 70
      ? 'You are reading policy and macro reactions well.'
      : 'Macro is the best place to sharpen right now.';
  }

  if (trackId === 'earnings') {
    return accuracy >= 70
      ? 'You are getting stronger at expectation-gap reads.'
      : 'Earnings is a good place to sharpen next.';
  }

  if (trackId === 'momentum') {
    return accuracy >= 70
      ? 'Momentum and follow-through are becoming a strength.'
      : 'Momentum is worth more reps right now.';
  }

  return accuracy >= 70
    ? 'You are getting better under volatility and shock scenarios.'
    : 'Risk events are worth more reps right now.';
}

function getStrengthSnapshot(
  performance: ReturnType<typeof getTrackPerformance>
): {
  weakest: { trackId: keyof PerformanceMap; accuracy: number } | null;
  strongest: { trackId: keyof PerformanceMap; accuracy: number } | null;
} {
  const entries = Object.entries(performance) as [
    keyof PerformanceMap,
    { attempts: number; correct: number }
  ][];

  const attempted = entries
    .filter(([, value]) => value.attempts > 0)
    .map(([trackId, value]) => ({
      trackId,
      accuracy: value.correct / value.attempts,
    }));

  if (attempted.length === 0) {
    return {
      weakest: null,
      strongest: null,
    };
  }

  const weakest = [...attempted].sort((a, b) => a.accuracy - b.accuracy)[0];
  const strongest = [...attempted].sort((a, b) => b.accuracy - a.accuracy)[0];

  return { weakest, strongest };
}

type ToastState = {
  trackName: string;
  rewardGranted: boolean;
};

export default function TracksScreen() {
  const navigate = useNavigate();

  const totalEdgePoints = Number(localStorage.getItem('totalEdgePoints') || '0');
  const streakCount = Number(localStorage.getItem('streakCount') || '0');

  const { currentRank } = useMemo(
    () => getRankData(totalEdgePoints),
    [totalEdgePoints]
  );

  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('practiceCompletionToast');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ToastState & { createdAt?: number };
      setToast({
        trackName: parsed.trackName,
        rewardGranted: parsed.rewardGranted,
      });
    } catch {
      // ignore malformed toast data
    }

    localStorage.removeItem('practiceCompletionToast');
  }, []);

  const performance = useMemo(() => getTrackPerformance(), [toast]);
  const strengthSnapshot = useMemo(
    () => getStrengthSnapshot(performance),
    [performance]
  );

  const trackStats = useMemo(() => {
    return tracks.map((track) => {
      const linkedChallenges = challenges.filter(
        (challenge) => challenge.track === track.name
      );

      const realChallengeCount = linkedChallenges.length;
      const completedCount = Math.min(
        getCompletedPracticeCount(track.id),
        realChallengeCount
      );
      const progress =
        realChallengeCount > 0
          ? Math.round((completedCount / realChallengeCount) * 100)
          : 0;

      const perf = performance[track.id as keyof PerformanceMap];
      const accuracy =
        perf.attempts > 0 ? Math.round((perf.correct / perf.attempts) * 100) : null;

      return {
        ...track,
        realChallengeCount,
        completedCount,
        progress,
        attempts: perf.attempts,
        correct: perf.correct,
        accuracy,
      };
    });
  }, [performance]);

  const totalLinkedReps = useMemo(() => {
    return trackStats.reduce((sum, track) => sum + track.realChallengeCount, 0);
  }, [trackStats]);

  const recommendedTrack = useMemo(() => {
    const dailyRecommendedId = localStorage.getItem('recommendedPracticeTrack');
    const performanceRecommendedId = getRecommendedTrackFromPerformance();

    const finalId = dailyRecommendedId || performanceRecommendedId;

    return (
      trackStats.find((track) => track.id === finalId) ??
      trackStats[0] ??
      null
    );
  }, [trackStats]);

  return (
    <div className="app-shell flex flex-col min-h-screen text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto pb-28 scrollbar-none px-4 pt-5">
        <div className="mb-4">
          <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary mb-3">
            Practice
          </div>

          <h1 className="text-[30px] leading-[1.05] font-bold text-text-primary">
            Train the Skills Behind Better Calls
          </h1>

          <p className="mt-2 text-sm text-text-secondary max-w-[92%] leading-relaxed">
            Practice focused market-reaction reps across macro, earnings,
            momentum, and risk so your daily reads get sharper over time.
          </p>
        </div>

        {toast && (
          <Card className="mb-5 border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400">
                <CheckCircle2 size={16} />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-green-400">
                  Practice completed
                </div>
                <div className="mt-1 text-sm text-text-secondary leading-relaxed">
                  {toast.trackName} updated
                  {toast.rewardGranted ? ' and +15 Edge Points earned.' : '.'}
                </div>
              </div>
            </div>
          </Card>
        )}

        {recommendedTrack && (
          <Card
            className="p-5 mb-5 cursor-pointer active:scale-[0.995] transition-transform border border-gold/10"
            onClick={() => navigate(`/practice/${recommendedTrack.id}`)}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-[11px] font-semibold tracking-wide text-gold mb-3">
                  <Sparkles size={12} />
                  Recommended Next Rep
                </div>

                <h2 className="text-[22px] leading-[1.1] font-bold text-text-primary mb-2">
                  {recommendedTrack.name}
                </h2>

                <p className="text-sm text-text-secondary leading-relaxed max-w-[94%]">
                  {getRecommendationReason(recommendedTrack.id)}
                </p>
              </div>

              <ChevronRight
                size={18}
                className="text-text-muted mt-1 flex-shrink-0"
              />
            </div>

            <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-text-secondary uppercase">
                  <Target size={11} className="mr-1.5" />
                  {getFeaturedTag(recommendedTrack.id)}
                </div>
              </div>

              <div className="text-sm font-semibold text-text-primary leading-relaxed">
                {getFeaturedPrompt(recommendedTrack.id)}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">
                {getTrackAccuracyText(
                  recommendedTrack.id as keyof PerformanceMap,
                  performance
                )}
              </span>

              <span className="text-gold font-semibold">
                Continue training
              </span>
            </div>
          </Card>
        )}

        <Card className="p-5 mb-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
            Your Practice Snapshot
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <div className="text-sm text-text-secondary">Rank</div>
              <div className="text-2xl font-bold text-gold mt-1">
                {currentRank}
              </div>
            </div>

            <div>
              <div className="text-sm text-text-secondary">Edge</div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {totalEdgePoints}
              </div>
            </div>

            <div>
              <div className="text-sm text-text-secondary">Run</div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {streakCount}
              </div>
            </div>

            <div>
              <div className="text-sm text-text-secondary">Reps</div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {totalLinkedReps}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 mb-5">
          <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Strength Snapshot
          </div>

          {strengthSnapshot.weakest || strengthSnapshot.strongest ? (
            <div className="grid grid-cols-1 gap-3">
              {strengthSnapshot.weakest && (
                <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle size={14} className="text-yellow-400" />
                    <div className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                      Weakest Area
                    </div>
                  </div>

                  <div className="text-base font-bold text-text-primary">
                    {getTrackDisplayName(strengthSnapshot.weakest.trackId)}
                  </div>

                  <div className="mt-1 text-sm text-gold">
                    {Math.round(strengthSnapshot.weakest.accuracy * 100)}% accuracy
                  </div>

                  <div className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {getTrackSnapshotText(
                      strengthSnapshot.weakest.trackId,
                      Math.round(strengthSnapshot.weakest.accuracy * 100)
                    )}
                  </div>
                </div>
              )}

              {strengthSnapshot.strongest && (
                <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-400" />
                    <div className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                      Strongest Area
                    </div>
                  </div>

                  <div className="text-base font-bold text-text-primary">
                    {getTrackDisplayName(strengthSnapshot.strongest.trackId)}
                  </div>

                  <div className="mt-1 text-sm text-green-400">
                    {Math.round(strengthSnapshot.strongest.accuracy * 100)}% accuracy
                  </div>

                  <div className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {getTrackSnapshotText(
                      strengthSnapshot.strongest.trackId,
                      Math.round(strengthSnapshot.strongest.accuracy * 100)
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
              <div className="text-sm font-semibold text-text-primary">
                No practice history yet
              </div>
              <div className="mt-2 text-sm leading-relaxed text-text-secondary">
                Finish a few practice sessions and Summit will start showing your
                strongest and weakest areas here.
              </div>
            </div>
          )}
        </Card>

        <div className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase">
          Skill Paths
        </div>

        <div className="flex flex-col gap-4">
          {trackStats.map((track) => (
            <Card
              key={track.id}
              className="p-5 cursor-pointer active:scale-[0.995] transition-transform"
              onClick={() => navigate(`/practice/${track.id}`)}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="mt-1 h-3 w-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: track.color }}
                  />

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-text-primary leading-tight">
                      {track.name}
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className="text-text-muted flex-shrink-0 mt-1"
                />
              </div>

              <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-text-secondary uppercase">
                    <Target size={11} className="mr-1.5" />
                    {getFeaturedTag(track.id)}
                  </div>
                </div>

                <div className="text-sm font-semibold text-text-primary leading-relaxed">
                  {getFeaturedPrompt(track.id)}
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="text-text-muted">
                  {track.attempts > 0
                    ? `${track.correct}/${track.attempts} right`
                    : `${track.completedCount}/${track.realChallengeCount} completed`}
                </span>

                <span className="text-text-secondary font-semibold">
                  {track.accuracy !== null ? `${track.accuracy}% accuracy` : `${track.progress}%`}
                </span>
              </div>

              <div className="h-2 rounded-full overflow-hidden bg-black/20">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${track.progress}%`,
                    backgroundColor: track.color,
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-5">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-gold" />
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Why Practice Matters
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Daily Call is your main event. Practice is where you build the
              pattern recognition, judgment, and repetition that make those
              calls better.
            </p>
          </Card>
        </div>

        <div className="mt-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={14} className="text-orange-400" />
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Smart Recommendations
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Summit now uses your recent Daily Call signals and practice accuracy
              to suggest where your next rep should come from.
            </p>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
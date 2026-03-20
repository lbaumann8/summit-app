import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Flame, Target, CheckCircle2 } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import { tracks, challenges } from '../data/challenges';

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

      return {
        ...track,
        realChallengeCount,
        completedCount,
        progress,
      };
    });
  }, []);

  const totalLinkedReps = useMemo(() => {
    return trackStats.reduce((sum, track) => sum + track.realChallengeCount, 0);
  }, [trackStats]);

  return (
    <div className="app-shell flex flex-col min-h-screen text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto pb-28 scrollbar-none px-4 pt-5">
        <div className="mb-4">
          <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary mb-3">
            Practice Paths
          </div>

          <h1 className="text-[30px] leading-[1.05] font-bold text-text-primary">
            Sharpen Specific Skills
          </h1>

          <p className="mt-2 text-sm text-text-secondary max-w-[92%] leading-relaxed">
            Build judgment through focused reps across macro, earnings,
            momentum, and risk events.
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
                  {toast.trackName} progress updated
                  {toast.rewardGranted ? ' and +15 Edge Points earned.' : '.'}
                </div>
              </div>
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

        <div className="flex flex-col gap-4">
          {trackStats.map((track) => (
            <Card
              key={track.id}
              className="p-5 cursor-pointer active:scale-[0.995] transition-transform"
              onClick={() => navigate(`/tracks/${track.id}`)}
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
                  {track.completedCount} / {track.realChallengeCount} completed
                </span>

                <span className="text-text-secondary font-semibold">
                  {track.progress}%
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
              <Flame size={14} className="text-orange-400" />
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Coming Soon
              </div>
            </div>

            <div className="text-lg font-bold text-text-primary mb-2">
              Adaptive Practice
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              We’ll eventually surface practice sets based on your weak spots,
              overconfidence misses, and missed reads so every rep gets more
              useful over time.
            </p>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
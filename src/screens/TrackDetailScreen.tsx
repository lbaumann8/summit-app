import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Target, Flame } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
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

function getFeaturedPrompts(trackId: string) {
  if (trackId === 'macro') {
    return [
      'Fed hints at cuts, but yields stay elevated. What matters most next?',
      'CPI cools after a strong market rally. Is that actually bullish now?',
      'Jobs come in hot. Why can strong data pressure stocks?',
    ];
  }

  if (trackId === 'earnings') {
    return [
      'A company beats earnings, but the stock barely moves. What does that signal?',
      'Revenue beats, guidance misses. Which one usually matters more?',
      'Good quarter, weak reaction. Was the beat already priced in?',
    ];
  }

  if (trackId === 'momentum') {
    return [
      'The market gaps up 2% at the open. What confirms follow-through?',
      'A stock has rallied for six straight sessions. What makes continuation harder?',
      'A panic selloff hits on high volume. Bounce or more downside?',
    ];
  }

  if (trackId === 'risk') {
    return [
      'Oil spikes overnight. Which sectors feel it first?',
      'Rates jump fast. Why do long-duration assets get hit harder?',
      'Volatility rises while the market chops sideways. What does that suggest?',
    ];
  }

  return [
    'Sharpen your read with focused market scenarios.',
    'Build pattern recognition with repeat reps.',
    'Practice conviction under uncertainty.',
  ];
}

function getTrackFocus(trackId: string) {
  if (trackId === 'macro') {
    return 'Train your read on inflation, rates, jobs, and how markets reprice new macro information.';
  }

  if (trackId === 'earnings') {
    return 'Learn how markets react to beats, misses, guidance changes, and expectation gaps.';
  }

  if (trackId === 'momentum') {
    return 'Build instinct for continuation, exhaustion, reversals, and crowd positioning.';
  }

  if (trackId === 'risk') {
    return 'Practice reading shocks, volatility, rate jumps, and defensive rotations across markets.';
  }

  return 'Build better market judgment through focused reps.';
}

export default function TrackDetailScreen() {
  const navigate = useNavigate();
  const { trackId } = useParams();

  const totalEdgePoints = Number(localStorage.getItem('totalEdgePoints') || '0');
  const streakCount = Number(localStorage.getItem('streakCount') || '0');

  const { currentRank } = useMemo(
    () => getRankData(totalEdgePoints),
    [totalEdgePoints]
  );

  const track = tracks.find((item) => item.id === trackId);

  const prompts = useMemo(() => getFeaturedPrompts(track?.id ?? ''), [track?.id]);

  const linkedChallenges = useMemo(() => {
    if (!track) return [];
    return challenges.filter((challenge) => challenge.track === track.name);
  }, [track]);

  if (!track) {
    return (
      <div className="app-shell flex flex-col min-h-screen text-white">
        <TopBar rank={currentRank} />

        <main className="flex-1 px-4 py-6 flex items-center justify-center">
          <Card className="w-full max-w-md p-6 text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-3">
              Track not found
            </h1>

            <p className="text-text-secondary text-sm mb-6">
              That practice path does not exist.
            </p>

            <Button fullWidth onClick={() => navigate('/tracks')}>
              Back to Tracks
            </Button>
          </Card>
        </main>

        <BottomNav />
      </div>
    );
  }

  const realChallengeCount = linkedChallenges.length;
  const completedCount = Math.min(
    getCompletedPracticeCount(track.id),
    realChallengeCount
  );
  const progress =
    realChallengeCount > 0
      ? Math.round((completedCount / realChallengeCount) * 100)
      : 0;

  return (
    <div className="app-shell flex flex-col min-h-screen text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto pb-32 scrollbar-none px-4 pt-5">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/tracks')}
            aria-label="Back to tracks"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-text-primary transition-all duration-150 hover:bg-white/[0.04] active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary">
            Practice Path
          </div>
        </div>

        <Card className="p-5 mb-5">
          <div className="flex items-start gap-3 mb-4">
            <div
              className="mt-1 h-3 w-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: track.color }}
            />

            <div>
              <h1 className="text-[28px] leading-[1.05] font-bold text-text-primary">
                {track.name}
              </h1>

              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {track.description}
              </p>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4 mb-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
              What this path trains
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {getTrackFocus(track.id)}
            </p>
          </div>

          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-text-muted">
              {completedCount} / {realChallengeCount} completed
            </span>

            <span className="text-text-secondary font-semibold">
              {progress}%
            </span>
          </div>

          <div className="h-2 rounded-full overflow-hidden bg-black/20">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: track.color,
              }}
            />
          </div>
        </Card>

        <Card className="p-5 mb-5">
          <div className="grid grid-cols-3 gap-3">
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
          </div>
        </Card>

        <Card className="p-5 mb-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
            Live Path Stats
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-text-secondary">Linked Reps</div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {realChallengeCount}
              </div>
            </div>

            <div>
              <div className="text-sm text-text-secondary">Reward</div>
              <div className="text-2xl font-bold text-gold mt-1">+15</div>
            </div>
          </div>
        </Card>

        <div className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase">
          Featured Prompts
        </div>

        <div className="flex flex-col gap-4">
          {prompts.map((prompt, index) => (
            <Card key={index} className="p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-text-secondary">
                  <Target size={14} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
                    Prompt {index + 1}
                  </div>

                  <p className="text-sm text-text-primary leading-relaxed">
                    {prompt}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-5">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={14} className="text-orange-400" />
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Next Upgrade
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              This path is now connected to your real challenge bank, so each
              session trains on actual market-reaction reps instead of placeholder prompts.
            </p>
          </Card>
        </div>

        <div className="mt-5">
          <Button fullWidth onClick={() => navigate(`/practice/${track.id}`)}>
            Start Practice
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
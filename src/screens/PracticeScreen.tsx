import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  XCircle,
  Trophy,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { tracks, challenges } from '../data/challenges';
import { updateProfile } from '../lib/profile';
import {
  recordTrackPerformance,
  type PerformanceMap,
} from '../lib/performance';

const RANK_LADDER = ['Rise', 'Ascent', 'Ridge', 'Peak', 'Summit'] as const;
const RANK_THRESHOLDS = [0, 100, 250, 500, 1000];
const PRACTICE_REWARD_EP = 15;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

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

function incrementCompletedPracticeCount(trackId: string, maxCount: number) {
  const current = getCompletedPracticeCount(trackId);
  const next = Math.min(current + 1, maxCount);
  localStorage.setItem(`practiceCompleted:${trackId}`, String(next));
}

function setPracticeCompletionToast(trackName: string, rewardGranted: boolean) {
  localStorage.setItem(
    'practiceCompletionToast',
    JSON.stringify({
      trackName,
      rewardGranted,
      createdAt: Date.now(),
    })
  );
}

function getPracticePerformanceHeadline(correctCount: number, totalCount: number) {
  if (totalCount === 0) return 'Session Complete';

  const pct = correctCount / totalCount;

  if (pct === 1) return 'Elite Read';
  if (pct >= 0.8) return 'Strong Session';
  if (pct >= 0.6) return 'Solid Reps';
  if (pct > 0) return 'Keep Sharpening';
  return 'Tough Tape';
}

function getPracticePerformanceSubtext(correctCount: number, totalCount: number) {
  if (totalCount === 0) return 'You completed the session.';
  if (correctCount === totalCount) {
    return 'You nailed every read in this session.';
  }
  if (correctCount >= Math.ceil(totalCount * 0.8)) {
    return 'You were consistently reading the setup the right way.';
  }
  if (correctCount >= Math.ceil(totalCount * 0.6)) {
    return 'Good reps. A few more sharp reads and this becomes a strength.';
  }
  if (correctCount > 0) {
    return 'Some reads landed, some did not. This is exactly how instincts improve.';
  }
  return 'Not your best session, but this is where better judgment gets built.';
}

export default function PracticeScreen() {
  const navigate = useNavigate();
  const { trackId } = useParams();

  const totalEdgePoints = Number(localStorage.getItem('totalEdgePoints') || '0');
  const { currentRank } = useMemo(
    () => getRankData(totalEdgePoints),
    [totalEdgePoints]
  );

  const track = tracks.find((item) => item.id === trackId);

  if (!track) {
    return (
      <div className="app-shell flex min-h-screen flex-col text-white">
        <TopBar rank={currentRank} />

        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <Card className="w-full max-w-md p-6 text-center">
            <h1 className="mb-3 text-2xl font-bold text-text-primary">
              Practice path not found
            </h1>

            <p className="mb-6 text-sm text-text-secondary">
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

  const activeTrack = track;

  const practiceChallenges = challenges.filter(
    (challenge) => challenge.track === activeTrack.name
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [rewardGranted, setRewardGranted] = useState(false);

  if (practiceChallenges.length === 0) {
    return (
      <div className="app-shell flex min-h-screen flex-col text-white">
        <TopBar rank={currentRank} />

        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <Card className="w-full max-w-md p-6 text-center">
            <h1 className="mb-3 text-2xl font-bold text-text-primary">
              No practice loaded yet
            </h1>

            <p className="mb-6 text-sm text-text-secondary">
              This path does not have any linked practice challenges yet.
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

  const currentChallenge = practiceChallenges[currentIndex];
  const isLastChallenge = currentIndex === practiceChallenges.length - 1;
  const correctOption = currentChallenge.options.find(
    (option) => option.id === currentChallenge.correctOptionId
  );
  const selectedOption = currentChallenge.options.find(
    (option) => option.id === selectedOptionId
  );
  const answeredCorrectly =
    selectedOptionId !== null &&
    selectedOptionId === currentChallenge.correctOptionId;

  const finalCorrectCount =
    sessionFinished || !revealed
      ? correctCount
      : correctCount + (answeredCorrectly ? 1 : 0);

  const finalAccuracy =
    practiceChallenges.length > 0
      ? Math.round((correctCount / practiceChallenges.length) * 100)
      : 0;

  const performanceHeadline = getPracticePerformanceHeadline(
    correctCount,
    practiceChallenges.length
  );
  const performanceSubtext = getPracticePerformanceSubtext(
    correctCount,
    practiceChallenges.length
  );

  function handleSelectOption(optionId: string) {
    if (revealed) return;
    setSelectedOptionId(optionId);
  }

  function handleReveal() {
    if (!selectedOptionId) return;
    setRevealed(true);
  }

  function grantPracticeRewardOncePerDay() {
    const todayKey = getTodayKey();
    const rewardStorageKey = `practiceRewarded:${activeTrack.id}:${todayKey}`;
    const alreadyRewardedToday =
      localStorage.getItem(rewardStorageKey) === 'true';

    if (alreadyRewardedToday) {
      setRewardGranted(false);
      return false;
    }

    const currentTotal = Number(localStorage.getItem('totalEdgePoints') || '0');
    const nextTotal = currentTotal + PRACTICE_REWARD_EP;

    localStorage.setItem('totalEdgePoints', String(nextTotal));
    localStorage.setItem(rewardStorageKey, 'true');
    setRewardGranted(true);
    return true;
  }

  async function handleNext() {
    if (!revealed) return;

    const nextCompleted = Math.max(completedCount, currentIndex + 1);
    const nextCorrectCount = answeredCorrectly ? correctCount + 1 : correctCount;

    setCompletedCount(nextCompleted);
    setCorrectCount(nextCorrectCount);

    if (isLastChallenge) {
      const didGrantReward = grantPracticeRewardOncePerDay();

      recordTrackPerformance(
        activeTrack.id as keyof PerformanceMap,
        practiceChallenges.length,
        nextCorrectCount
      );

      localStorage.setItem(
        'recentActivity',
        JSON.stringify([
          {
            id: `practice-${Date.now()}`,
            type: 'practice',
            title: `${activeTrack.name} practice completed`,
            subtitle: `${nextCorrectCount}/${practiceChallenges.length} correct`,
            createdAt: Date.now(),
          },
          ...JSON.parse(localStorage.getItem('recentActivity') || '[]'),
        ].slice(0, 10))
      );

      incrementCompletedPracticeCount(activeTrack.id, practiceChallenges.length);
      setPracticeCompletionToast(activeTrack.name, didGrantReward);

      if (didGrantReward) {
        try {
          const nextTotalEdgePoints = Number(
            localStorage.getItem('totalEdgePoints') || '0'
          );
          const currentStreak = Number(localStorage.getItem('streakCount') || '0');
          const currentLastRank = Number(localStorage.getItem('lastRank') || '0');

          await updateProfile({
            total_edge_points: nextTotalEdgePoints,
            streak_count: currentStreak,
            last_rank: currentLastRank,
          });
        } catch (error) {
          console.error('Failed to persist practice reward:', error);
        }
      }

      setSessionFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setRevealed(false);
    setSelectedOptionId(null);
  }

  function handleDone() {
    navigate('/tracks');
  }

  function handlePracticeAnother() {
    navigate('/tracks');
  }

  return (
    <div className="app-shell flex min-h-screen flex-col text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-32 scrollbar-none">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(sessionFinished ? '/tracks' : `/tracks/${activeTrack.id}`)
            }
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-text-primary transition-all duration-150 hover:bg-white/[0.04] active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary">
            Training Mode
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary">
            <BookOpen size={12} />
            Practice Session
          </div>

          <h1 className="text-[30px] font-bold leading-[1.05] text-text-primary">
            {activeTrack.name}
          </h1>

          <p className="mt-2 max-w-[92%] text-sm leading-relaxed text-text-secondary">
            Read the setup, make your best call, then compare your thinking to the market read.
          </p>
        </div>

        {sessionFinished ? (
          <>
            <Card className="mb-5 border border-gold/10 p-6 text-center">
              <div className="mb-3 inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-green-400">
                Session Complete
              </div>

              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold-muted text-gold">
                  <Trophy size={20} />
                </div>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-text-primary">
                {performanceHeadline}
              </h2>

              <p className="mb-5 text-sm leading-relaxed text-text-secondary">
                {performanceSubtext}
              </p>

              <div className="mb-5 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
                  <div className="text-sm text-text-secondary">Reads Nailed</div>
                  <div className="mt-1 text-2xl font-bold text-text-primary">
                    {correctCount}/{practiceChallenges.length}
                  </div>
                </div>

                <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
                  <div className="text-sm text-text-secondary">Accuracy</div>
                  <div className="mt-1 text-2xl font-bold text-gold">
                    {finalAccuracy}%
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="text-4xl font-bold text-gold">
                  {rewardGranted ? `+${PRACTICE_REWARD_EP}` : '+0'}
                </div>

                <div className="text-left">
                  <div className="text-sm font-semibold text-text-primary">
                    Edge Points
                  </div>
                  <div className="text-xs text-text-muted">
                    {rewardGranted
                      ? 'Practice reward earned today'
                      : 'Today’s reward already claimed'}
                  </div>
                </div>
              </div>

              <div className="text-sm text-text-secondary">
                Practice sharpens pattern recognition and makes your daily reads
                stronger.
              </div>
            </Card>

            <Card className="mb-5 p-5">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Keep Going
              </div>

              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                Stack another training path now, or head back and choose your
                next focus area.
              </p>

              <div className="flex flex-col gap-3">
                <Button fullWidth onClick={handlePracticeAnother}>
                  Practice Another Path
                  <ChevronRight size={16} className="ml-2" />
                </Button>

                <Button fullWidth variant="secondary" onClick={handleDone}>
                  Back to Tracks
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="mb-5 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  Progress
                </div>

                <div className="text-sm text-text-secondary">
                  {currentIndex + 1} / {practiceChallenges.length}
                </div>
              </div>

              <div className="mb-3 h-2 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / practiceChallenges.length) * 100}%`,
                    backgroundColor: activeTrack.color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-text-muted">{currentChallenge.difficulty}</span>
                <span className="text-text-secondary">
                  {currentChallenge.timeEstimate}
                </span>
              </div>
            </Card>

            <Card className="mb-4 p-5">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Training Prompt {currentIndex + 1}
              </div>

              <h2 className="mb-3 text-xl font-bold text-text-primary">
                {currentChallenge.title}
              </h2>

              <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                {currentChallenge.scenario}
              </p>
            </Card>

            <Card className="mb-5 p-5">
              <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                What’s your best read?
              </div>

              <div className="space-y-3">
                {currentChallenge.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = option.id === currentChallenge.correctOptionId;
                  const isWrongSelected = revealed && isSelected && !isCorrect;

                  let optionClass =
                    'border-white/[0.06] bg-white/[0.02] text-text-primary';

                  if (!revealed && isSelected) {
                    optionClass = 'border-gold/40 bg-gold-muted text-gold';
                  }

                  if (revealed && isCorrect) {
                    optionClass = 'border-green-500/30 bg-green-500/10 text-green-300';
                  }

                  if (revealed && isWrongSelected) {
                    optionClass = 'border-red-500/30 bg-red-500/10 text-red-300';
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(option.id)}
                      disabled={revealed}
                      className={`w-full rounded-[20px] border px-4 py-4 text-left transition-all duration-150 ${optionClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-black/10 text-[11px] font-semibold">
                          {option.label}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold leading-relaxed">
                            {option.text}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="mb-5 p-5">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Feedback
              </div>

              {!revealed ? (
                <p className="text-sm leading-relaxed text-text-muted">
                  Pick the answer you think is strongest, then lock it in to compare your read.
                </p>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`flex items-start gap-3 rounded-[20px] border px-4 py-4 ${
                      answeredCorrectly
                        ? 'border-green-500/20 bg-green-500/10'
                        : 'border-red-500/20 bg-red-500/10'
                    }`}
                  >
                    {answeredCorrectly ? (
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 flex-shrink-0 text-green-400"
                      />
                    ) : (
                      <XCircle
                        size={18}
                        className="mt-0.5 flex-shrink-0 text-red-400"
                      />
                    )}

                    <div>
                      <div
                        className={`text-sm font-semibold ${
                          answeredCorrectly ? 'text-green-300' : 'text-red-300'
                        }`}
                      >
                        {answeredCorrectly ? 'Nice read' : 'Not quite'}
                      </div>

                      <div className="mt-1 text-sm text-text-secondary">
                        You picked:{' '}
                        <span className="font-semibold text-text-primary">
                          {selectedOption?.label}. {selectedOption?.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-green-500/20 bg-green-500/10 px-4 py-4">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-green-300">
                      Best Read
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-green-200">
                      {correctOption?.label}. {correctOption?.text}
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">
                      Why
                    </div>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {currentChallenge.explanation}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Card className="mb-5 p-5">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Session Stats
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-sm text-text-secondary">Done</div>
                  <div className="mt-1 text-2xl font-bold text-text-primary">
                    {completedCount}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-text-secondary">Correct</div>
                  <div className="mt-1 text-2xl font-bold text-gold">
                    {finalCorrectCount}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-text-secondary">Mode</div>
                  <div className="mt-1 text-2xl font-bold text-text-primary">
                    Practice
                  </div>
                </div>
              </div>
            </Card>

            <div className="mt-5">
              {!revealed ? (
                <Button
                  fullWidth
                  variant="secondary"
                  disabled={!selectedOptionId}
                  onClick={handleReveal}
                >
                  {selectedOptionId ? 'Lock Answer' : 'Pick an Answer'}
                </Button>
              ) : (
                <Button fullWidth variant="secondary" onClick={handleNext}>
                  {isLastChallenge ? 'Finish Session' : 'Next Prompt'}
                </Button>
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
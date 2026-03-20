import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, Trophy } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { dailyChallenge } from '../data/dailyChallenge';
import { getPercentileFromScore } from '../data/mockPerformance';
import {
  getMockRankFromEdgePoints,
  getRankMovement,
  getPlayerPassed,
} from '../data/rankEngine';
import { getNearMissText } from '../data/nearMissEngine';
import { getProfile, updateProfile } from '../lib/profile';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function getConfidencePoints(confidence?: 'low' | 'medium' | 'high') {
  if (confidence === 'high') return 3;
  if (confidence === 'medium') return 2;
  if (confidence === 'low') return 1;
  return 0;
}

function getEdgePointsForWeightedScore(
  weightedScore: number,
  maxScore: number,
  allHighConfidenceCorrect: boolean
) {
  if (maxScore === 0) return 0;

  const pct = weightedScore / maxScore;

  let base = 0;

  if (pct === 1) base = 50;
  else if (pct >= 0.66) base = 30;
  else if (pct > 0) base = 10;

  if (allHighConfidenceCorrect) {
    base += 20;
  }

  return base;
}

function getStreakMultiplier(streak: number) {
  if (streak >= 7) return 1.5;
  if (streak >= 5) return 1.25;
  if (streak >= 3) return 1.1;
  return 1;
}

function getDirectionLabel(direction?: 'up' | 'down') {
  if (direction === 'up') return 'Up';
  if (direction === 'down') return 'Down';
  return 'No Call';
}

function getDirectionIcon(direction?: 'up' | 'down') {
  if (direction === 'up') return '↑';
  if (direction === 'down') return '↓';
  return '–';
}

function getVerdictLabel(
  isCorrect: boolean,
  confidence?: 'low' | 'medium' | 'high'
) {
  if (isCorrect && confidence === 'high') return 'High conviction winner';
  if (isCorrect) return 'Strong call';
  if (!isCorrect && confidence === 'high') return 'Overconfident miss';
  return 'Missed read';
}

function getResultHeadline(
  correctCount: number,
  totalAssets: number,
  allHighConfidenceCorrect: boolean,
  weightedScore: number
) {
  if (
    totalAssets > 0 &&
    correctCount === totalAssets &&
    allHighConfidenceCorrect
  ) {
    return 'Perfect High Conviction Call';
  }

  if (totalAssets > 0 && correctCount === totalAssets) {
    return 'Perfect Read';
  }

  if (weightedScore >= Math.ceil(totalAssets * 2)) {
    return 'Strong Read';
  }

  if (weightedScore > 0) {
    return 'Mixed Read';
  }

  return 'Missed Call';
}

function getResultSubtext(
  correctCount: number,
  totalAssets: number,
  allHighConfidenceCorrect: boolean
) {
  if (
    totalAssets > 0 &&
    correctCount === totalAssets &&
    allHighConfidenceCorrect
  ) {
    return 'You were right and fully trusted the move.';
  }

  if (totalAssets > 0 && correctCount === totalAssets) {
    return 'You got the direction right across the board.';
  }

  if (correctCount > 0) {
    return 'You had part of the read, but there was room to sharpen conviction.';
  }

  return 'Today was a miss, but this is where the learning gets valuable.';
}

function animateValue(
  start: number,
  end: number,
  durationMs: number,
  onUpdate: (value: number) => void
) {
  const startTime = performance.now();

  function tick(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (end - start) * eased);

    onUpdate(value);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  }

  window.requestAnimationFrame(tick);
}

type SavedAnswer = {
  direction?: 'up' | 'down';
  confidence?: 'low' | 'medium' | 'high';
};

export default function ResultsScreen() {
  const navigate = useNavigate();
  const challenge = dailyChallenge;

  const devMode = localStorage.getItem('devMode') === 'true';
  const unlockTime = Number(localStorage.getItem('unlockTime') || '0');
  const answers: Record<string, SavedAnswer> = JSON.parse(
    localStorage.getItem('answers') || '{}'
  );

  const getRemainingTime = () => {
    if (devMode) return 0;
    if (!unlockTime) return 0;
    return Math.max(unlockTime - Date.now(), 0);
  };

  const [timeLeft, setTimeLeft] = useState(getRemainingTime);
  const [revealStage, setRevealStage] = useState(0);
  const [animatedEdgePoints, setAnimatedEdgePoints] = useState(0);
  const [animatedWeightedScore, setAnimatedWeightedScore] = useState(0);
  const [resultPulse, setResultPulse] = useState(false);

  useEffect(() => {
    if (devMode) {
      setTimeLeft(0);
      return;
    }

    if (!unlockTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(unlockTime - Date.now(), 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockTime, devMode]);

  const totalAssets = challenge.assets.length;
  const maxScore = totalAssets * 3;

  const correctCount = useMemo(() => {
    return challenge.assets.filter((asset) => {
      return answers[asset.key]?.direction === challenge.outcome[asset.key];
    }).length;
  }, [answers, challenge]);

  const weightedScore = useMemo(() => {
    return challenge.assets.reduce((sum, asset) => {
      const answer = answers[asset.key];
      const isCorrect = answer?.direction === challenge.outcome[asset.key];

      if (!isCorrect) return sum;

      return sum + getConfidencePoints(answer?.confidence);
    }, 0);
  }, [answers, challenge]);

  const allHighConfidenceCorrect = useMemo(() => {
    return challenge.assets.every((asset) => {
      const a = answers[asset.key];
      return (
        a?.direction === challenge.outcome[asset.key] &&
        a?.confidence === 'high'
      );
    });
  }, [answers, challenge]);

  const percentile = useMemo(() => {
    return getPercentileFromScore(weightedScore, maxScore);
  }, [weightedScore, maxScore]);

  const nearMissText = useMemo(() => {
    return getNearMissText(weightedScore, maxScore);
  }, [weightedScore, maxScore]);

  const primaryAsset = challenge.assets[0];
  const primaryUserAnswer = primaryAsset ? answers[primaryAsset.key] : undefined;
  const primaryCorrectAnswer = primaryAsset
    ? challenge.outcome[primaryAsset.key]
    : undefined;
  const primaryIsCorrect =
    primaryUserAnswer?.direction === primaryCorrectAnswer;

  const resultHeadline = getResultHeadline(
    correctCount,
    totalAssets,
    allHighConfidenceCorrect,
    weightedScore
  );

  const resultSubtext = getResultSubtext(
    correctCount,
    totalAssets,
    allHighConfidenceCorrect
  );

  const primaryVerdictLabel = getVerdictLabel(
    primaryIsCorrect,
    primaryUserAnswer?.confidence
  );

  const [computedRewardState, setComputedRewardState] = useState<{
    streakCount: number;
    multiplier: number;
    edgePointsEarned: number;
    previousRank: number;
    newRank: number;
    movement: number;
    passedText: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRewardState() {
      const profile = await getProfile();

      const currentTotalEdgePoints =
        profile?.total_edge_points ??
        Number(localStorage.getItem('totalEdgePoints') || '0');
      const currentStreak =
        profile?.streak_count ??
        Number(localStorage.getItem('streakCount') || '0');
      const previousRank =
        profile?.last_rank ?? Number(localStorage.getItem('lastRank') || '0');

      const multiplier = getStreakMultiplier(currentStreak);
      const baseEdgePoints = getEdgePointsForWeightedScore(
        weightedScore,
        maxScore,
        allHighConfidenceCorrect
      );
      const edgePointsEarned = Math.round(baseEdgePoints * multiplier);
      const projectedTotalEdgePoints = currentTotalEdgePoints + edgePointsEarned;
      const newRank = getMockRankFromEdgePoints(projectedTotalEdgePoints);
      const movement = getRankMovement(previousRank, newRank);
      const passedText = getPlayerPassed(previousRank, newRank);

      if (mounted) {
        setComputedRewardState({
          streakCount: currentStreak,
          multiplier,
          edgePointsEarned,
          previousRank,
          newRank,
          movement,
          passedText,
        });
      }
    }

    loadRewardState();

    return () => {
      mounted = false;
    };
  }, [weightedScore, maxScore, allHighConfidenceCorrect]);

  const multiplier = computedRewardState?.multiplier ?? 1;
  const edgePointsEarned = computedRewardState?.edgePointsEarned ?? 0;
  const movement = computedRewardState?.movement ?? 0;
  const passedText = computedRewardState?.passedText ?? '';
  const newRank = computedRewardState?.newRank ?? 0;

  useEffect(() => {
    if (timeLeft > 0) {
      setRevealStage(0);
      setAnimatedEdgePoints(0);
      setAnimatedWeightedScore(0);
      setResultPulse(false);
      return;
    }

    const timers = [
      window.setTimeout(() => setRevealStage(1), 180),
      window.setTimeout(() => setRevealStage(2), 700),
      window.setTimeout(() => {
        setRevealStage(3);
        setResultPulse(true);
        animateValue(0, edgePointsEarned, 950, setAnimatedEdgePoints);
      }, 1200),
      window.setTimeout(() => {
        setRevealStage(4);
        animateValue(0, weightedScore, 850, setAnimatedWeightedScore);
      }, 1700),
      window.setTimeout(() => setResultPulse(false), 2100),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [timeLeft, edgePointsEarned, weightedScore]);

  useEffect(() => {
    let cancelled = false;

    async function persistResult() {
      if (!(timeLeft <= 0 && (unlockTime || devMode) && computedRewardState)) {
        return;
      }

      const todayKey = getTodayKey();
      const yesterdayKey = getYesterdayKey();

      const existingDailyResultRaw = localStorage.getItem('dailyResult');
      const existingDailyResult = existingDailyResultRaw
        ? JSON.parse(existingDailyResultRaw)
        : null;

      const profile = await getProfile();

      if (cancelled) return;

      const currentStoredStreak =
        profile?.streak_count ??
        Number(localStorage.getItem('streakCount') || '0');

      const streakLastUpdated = localStorage.getItem('streakLastUpdated');

      let nextStreak = 1;

      if (streakLastUpdated === yesterdayKey) {
        nextStreak = currentStoredStreak + 1;
      } else if (streakLastUpdated === todayKey) {
        nextStreak = currentStoredStreak;
      }

      if (streakLastUpdated !== todayKey) {
        localStorage.setItem('streakCount', String(nextStreak));
        localStorage.setItem('streakLastUpdated', todayKey);
      }

      localStorage.setItem(
        'dailyResult',
        JSON.stringify({
          score: correctCount,
          total: totalAssets,
          weightedScore,
          maxScore,
          percentile,
          nearMissText,
          allHighConfidenceCorrect,
          challengeId: challenge.id,
          completedAt: Date.now(),
          completedDate: todayKey,
          edgePointsEarned,
          newRank,
          rankMovement: movement,
          passedText,
          resultHeadline,
        })
      );

      const alreadyAwardedToday =
        existingDailyResult &&
        existingDailyResult.completedDate === todayKey &&
        existingDailyResult.challengeId === challenge.id &&
        typeof existingDailyResult.edgePointsEarned === 'number';

      const currentTotalEdgePoints =
        profile?.total_edge_points ??
        Number(localStorage.getItem('totalEdgePoints') || '0');

      const nextTotalEdgePoints = alreadyAwardedToday
        ? currentTotalEdgePoints
        : currentTotalEdgePoints + edgePointsEarned;

      if (!alreadyAwardedToday) {
        localStorage.setItem('totalEdgePoints', String(nextTotalEdgePoints));
      }

      localStorage.setItem('lastRank', String(newRank));

      await updateProfile({
        total_edge_points: nextTotalEdgePoints,
        streak_count: nextStreak,
        last_rank: newRank,
      });
    }

    persistResult();

    return () => {
      cancelled = true;
    };
  }, [
    timeLeft,
    unlockTime,
    devMode,
    computedRewardState,
    correctCount,
    totalAssets,
    weightedScore,
    maxScore,
    percentile,
    nearMissText,
    allHighConfidenceCorrect,
    challenge.id,
    edgePointsEarned,
    newRank,
    movement,
    passedText,
    resultHeadline,
  ]);

  if (timeLeft > 0) {
    return (
      <div className="app-shell flex flex-col min-h-screen text-white">
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <Card className="w-full max-w-md border border-gold/10 p-6 text-center">
            <div className="mb-3 inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-yellow-400">
              <Lock size={11} className="mr-1.5" />
              Locked
            </div>

            <h1 className="mb-3 text-2xl font-bold text-text-primary">
              Results unlock soon
            </h1>

            <p className="mb-2 text-sm text-text-secondary">
              Your daily call is locked in.
            </p>

            <p className="mb-6 text-sm text-text-muted">
              Come back later to see whether your read beat the crowd.
            </p>

            <Button fullWidth onClick={() => navigate('/home')}>
              Back Home
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell flex flex-col min-h-screen text-white">
      <main className="flex-1 px-4 py-5 pb-28">
        <div className="mb-4">
          <div className="mb-3 inline-flex items-center rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-[11px] font-semibold tracking-wide text-gold">
            Daily Result
          </div>

          <h1 className="text-[30px] font-bold leading-[1.05] text-text-primary">
            Here’s What Happened
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Your read, the real move, and how you stacked up.
          </p>
        </div>

        <Card
          className={`mb-5 border border-gold/10 p-6 text-center transition-all duration-500 ${
            resultPulse
              ? 'scale-[1.01] shadow-[0_0_0_1px_rgba(132,186,146,0.08)_inset]'
              : ''
          }`}
        >
          <div
            className={`transition-all duration-300 ease-out ${
              revealStage >= 1
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Market Outcome
            </div>

            <div className="mb-2 text-5xl font-bold text-text-primary">
              {getDirectionIcon(primaryCorrectAnswer)}
            </div>

            <div className="text-base font-semibold text-text-primary">
              {primaryAsset?.label ?? 'Market'} moved{' '}
              {getDirectionLabel(primaryCorrectAnswer)}
            </div>
          </div>

          <div
            className={`mt-6 transition-all duration-300 ease-out ${
              revealStage >= 2
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-white/[0.06] bg-white/[0.02] px-4 py-4 text-left">
                <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">
                  Your Call
                </div>

                <div className="text-2xl font-bold text-text-primary">
                  {getDirectionIcon(primaryUserAnswer?.direction)}
                </div>

                <div className="mt-1 text-sm font-semibold text-text-primary">
                  {getDirectionLabel(primaryUserAnswer?.direction)}
                </div>

                <div className="mt-1 text-xs capitalize text-text-muted">
                  {primaryUserAnswer?.confidence ?? 'No confidence set'} conviction
                </div>
              </div>

              <div className="rounded-[22px] border border-white/[0.06] bg-white/[0.02] px-4 py-4 text-left">
                <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">
                  Verdict
                </div>

                <div
                  className={`text-2xl font-bold ${
                    primaryIsCorrect ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {primaryIsCorrect ? '✓' : '✕'}
                </div>

                <div
                  className={`mt-1 text-sm font-semibold ${
                    primaryIsCorrect ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {primaryVerdictLabel}
                </div>

                <div className="mt-1 text-xs text-text-muted">
                  {primaryAsset?.label ?? 'Market'} went{' '}
                  {getDirectionLabel(primaryCorrectAnswer).toLowerCase()}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`mt-6 transition-all duration-300 ease-out ${
              revealStage >= 3
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Today’s Read
            </div>

            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold-muted text-gold">
                <Sparkles size={20} />
              </div>
            </div>

            <div className="mb-2 text-3xl font-bold text-text-primary">
              {resultHeadline}
            </div>

            <div className="mx-auto max-w-[280px] text-sm text-text-secondary">
              {resultSubtext}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="text-4xl font-bold text-gold">
                +{animatedEdgePoints}
              </div>

              <div className="text-left">
                <div className="text-sm font-semibold text-text-primary">
                  Edge Points
                </div>
                <div className="text-xs text-text-muted">Earned today</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-text-secondary">
              You outperformed
            </div>

            <div className="mt-1 flex items-center justify-center gap-2">
              <Trophy size={16} className="text-gold" />
              <div className="text-2xl font-bold text-text-primary">
                {percentile}% of players
              </div>
            </div>
          </div>

          <div
            className={`mt-5 transition-all duration-300 ease-out ${
              revealStage >= 4
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Confidence Score
            </div>

            <div className="text-3xl font-bold text-text-primary">
              {animatedWeightedScore}/{maxScore}
            </div>

            <div className="mt-1 text-sm text-text-secondary">
              {correctCount}/{totalAssets} correct
            </div>

            {nearMissText && (
              <div className="mt-4 inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-400">
                {nearMissText}
              </div>
            )}

            {multiplier > 1 && (
              <div className="mt-4 inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
                🔥 {multiplier}x streak multiplier
              </div>
            )}

            {allHighConfidenceCorrect && (
              <div className="mt-3 inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
                Perfect High Conviction Call 🔥
              </div>
            )}

            {movement > 0 && (
              <div className="mt-4 text-sm font-semibold text-green-400">
                ↑ You moved up {movement} spot{movement > 1 ? 's' : ''}
              </div>
            )}

            {passedText && (
              <div className="mt-1 text-sm text-text-secondary">
                {passedText}
              </div>
            )}
          </div>
        </Card>

        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Why the market moved
        </div>

        <Card className="mb-5 border border-gold/10 p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            What the market cared about
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">
            {primaryAsset
              ? challenge.explanations[primaryAsset.key]
              : 'The market reaction depended on how traders interpreted the setup.'}
          </p>
        </Card>

        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Breakdown
        </div>

        <div className="flex flex-col gap-4">
          {challenge.assets.map((asset) => {
            const userAnswer = answers[asset.key];
            const userDirection = userAnswer?.direction;
            const userConfidence = userAnswer?.confidence;
            const correctAnswer = challenge.outcome[asset.key];
            const isCorrect = userDirection === correctAnswer;
            const explanation = challenge.explanations[asset.key];
            const earned = isCorrect ? getConfidencePoints(userConfidence) : 0;

            return (
              <Card key={asset.key} className="p-4">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-text-primary">
                      {asset.label}
                    </div>
                    <div className="mt-1 text-[11px] text-text-muted">
                      Your call vs outcome
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-text-muted">You</span>
                      <span className="font-semibold text-text-primary">
                        {getDirectionIcon(userDirection)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-text-muted">Market</span>
                      <span
                        className={`font-semibold ${
                          isCorrect ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {getDirectionIcon(correctAnswer)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs">
                    <span className="mr-1 text-text-muted">Conviction:</span>
                    <span className="capitalize text-text-primary">
                      {userConfidence ?? '—'}
                    </span>
                  </div>

                  <div
                    className={`text-xs font-semibold ${
                      earned > 0 ? 'text-gold' : 'text-text-muted'
                    }`}
                  >
                    +{earned} pts
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-text-secondary">
                  {explanation}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-5">
          <Card className="p-5">
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              What next
            </div>

            <p className="mb-4 text-sm leading-relaxed text-text-secondary">
              Daily results are the main scorecard. Use training mode to sharpen
              pattern recognition before tomorrow’s call.
            </p>

            <div className="flex flex-col gap-3">
              <Button fullWidth onClick={() => navigate('/challenge/daily')}>
                See Today’s Challenge
              </Button>

              <Button
                fullWidth
                variant="secondary"
                onClick={() => navigate('/tracks')}
              >
                Go to Training Mode
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
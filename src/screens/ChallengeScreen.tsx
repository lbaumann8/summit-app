import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Lock, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { dailyChallenge } from '../data/dailyChallenge';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

type AssetAnswer = {
  direction?: 'up' | 'down';
  confidence?: 'low' | 'medium' | 'high';
};

function getUrgencyText(secondsLeft: number) {
  if (secondsLeft <= 5) return 'Final seconds. Trust your read.';
  if (secondsLeft <= 10) return 'Lock window is closing fast.';
  return 'One call. One shot. Make it count.';
}

export default function ChallengeScreen() {
  const navigate = useNavigate();
  const challenge = dailyChallenge;
  const primaryAsset = challenge.assets[0];

  const [answers, setAnswers] = useState<Record<string, AssetAnswer>>({});
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [isLockingIn, setIsLockingIn] = useState(false);
  const [showLockedState, setShowLockedState] = useState(false);

  const todayKey = getTodayKey();
  const devMode = localStorage.getItem('devMode') === 'true';
  const playedDate = localStorage.getItem('playedDate');
  const alreadyPlayed =
    !devMode &&
    localStorage.getItem('played') === 'true' &&
    playedDate === todayKey;

  useEffect(() => {
    const savedPlayedDate = localStorage.getItem('playedDate');

    if (savedPlayedDate !== todayKey) {
      localStorage.removeItem('played');
      localStorage.removeItem('answers');
      localStorage.removeItem('unlockTime');
      localStorage.removeItem('dailyResult');
      localStorage.setItem('playedDate', todayKey);
    }
  }, [todayKey]);

  useEffect(() => {
    if (alreadyPlayed || isLockingIn) return;

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 15;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alreadyPlayed, isLockingIn]);

  function handleDirectionSelect(direction: 'up' | 'down') {
    if (!primaryAsset || isLockingIn) return;

    setAnswers((prev) => ({
      ...prev,
      [primaryAsset.key]: {
        ...prev[primaryAsset.key],
        direction,
      },
    }));
  }

  function handleConfidenceSelect(confidence: 'low' | 'medium' | 'high') {
    if (!primaryAsset || isLockingIn) return;

    setAnswers((prev) => ({
      ...prev,
      [primaryAsset.key]: {
        ...prev[primaryAsset.key],
        confidence,
      },
    }));
  }

  function handleLockIn() {
    if (!allAnswered || !primaryAsset || isLockingIn) return;

    setIsLockingIn(true);
    setShowLockedState(true);

    const unlockTime = Date.now() + 1000 * 60 * 60 * 2;

    localStorage.setItem('played', 'true');
    localStorage.setItem('playedDate', todayKey);
    localStorage.setItem('answers', JSON.stringify(answers));
    localStorage.setItem('unlockTime', unlockTime.toString());

    window.setTimeout(() => {
      navigate('/results');
    }, 950);
  }

  const selected = primaryAsset ? answers[primaryAsset.key] : undefined;
  const allAnswered = Boolean(selected?.direction && selected?.confidence);

  const directionLabel =
    selected?.direction === 'up'
      ? 'Up'
      : selected?.direction === 'down'
      ? 'Down'
      : 'Not selected';

  const confidenceLabel = selected?.confidence ?? 'Not selected';

  const hookText = useMemo(() => {
    if (showLockedState) {
      return 'Your read is locked. Results will reveal later.';
    }

    if (selected?.confidence === 'high') {
      return 'Big conviction. Bigger reward if you are right.';
    }

    if (selected?.direction) {
      return 'Now decide how much conviction you want behind it.';
    }

    return getUrgencyText(secondsLeft);
  }, [selected, secondsLeft, showLockedState]);

  if (alreadyPlayed) {
    return (
      <div className="app-shell flex flex-col min-h-screen text-white">
        <header className="px-4 pt-4">
          <div className="rounded-[28px] border border-white/[0.06] bg-[rgba(10,13,24,0.96)] px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.01)_inset]">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate('/home')}
                aria-label="Back to home"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-text-primary transition-all duration-150 hover:bg-white/[0.04] active:scale-[0.98]"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="text-sm font-semibold text-text-primary">
                Daily Call
              </div>

              <div className="w-10 flex-shrink-0" />
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-6 text-center">
          <Card className="w-full max-w-md p-6">
            <div className="mb-3 inline-flex items-center rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-[11px] font-semibold tracking-wide text-gold">
              Locked In
            </div>

            <h2 className="mb-2 text-xl font-bold text-text-primary">
              You’ve already made today’s call
            </h2>

            <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-text-secondary">
              Your prediction is saved. Come back later to see how you did.
            </p>

            <Button fullWidth onClick={() => navigate('/results')}>
              View Results
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell flex flex-col min-h-screen text-white relative">
      <header className="px-4 pt-4">
        <div className="rounded-[28px] border border-gold/10 bg-[linear-gradient(180deg,rgba(18,24,26,0.96)_0%,rgba(10,13,24,0.98)_100%)] px-4 py-3 shadow-[0_0_0_1px_rgba(132,186,146,0.04)_inset]">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/home')}
              aria-label="Back to home"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-text-primary transition-all duration-150 hover:bg-white/[0.04] active:scale-[0.98]"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="text-sm font-semibold text-text-primary">
              Daily Call
            </div>

            <div className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[11px] font-semibold text-yellow-400">
              <Lock size={11} />
              Live
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-28">
        <div className="mb-4">
          <div className="mb-3 inline-flex items-center rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-[11px] font-semibold tracking-wide text-gold">
            Today’s Main Event
          </div>

          <h1 className="mb-3 max-w-[95%] text-[30px] font-bold leading-[1.06] text-text-primary">
            {challenge.title}
          </h1>

          <p className="mb-3 max-w-[95%] text-[15px] leading-relaxed text-text-secondary">
            {challenge.description}
          </p>

          <p className="text-sm text-text-muted">{hookText}</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">
              Lock closes in
            </div>

            <div className="text-2xl font-bold text-yellow-400">
              {showLockedState ? 'Locked' : `0:${secondsLeft.toString().padStart(2, '0')}`}
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">
              Perfect call
            </div>

            <div className="flex items-center gap-2">
              <Flame size={16} className="text-orange-400" />
              <span className="text-2xl font-bold text-gold">+50</span>
            </div>
          </Card>
        </div>

        <Card className="mb-4 p-5">
          <div className="mb-4">
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Today’s Asset
            </div>

            <div className="text-[24px] font-bold leading-[1.1] text-text-primary">
              {primaryAsset?.label ?? 'Asset'}
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDirectionSelect('up')}
              disabled={isLockingIn}
              className={`rounded-[22px] border px-4 py-4 text-left transition-all duration-150 ${
                selected?.direction === 'up'
                  ? 'border-green-400/50 bg-green-500/12 text-green-300 shadow-[0_0_0_1px_rgba(74,222,128,0.08)]'
                  : 'border-white/[0.06] bg-white/[0.02] text-text-primary'
              } ${isLockingIn ? 'opacity-70' : ''}`}
            >
              <div className="mb-1 text-2xl font-bold">↑</div>
              <div className="text-sm font-semibold">Up</div>
              <div className="mt-1 text-[11px] text-text-muted">
                Bullish reaction
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDirectionSelect('down')}
              disabled={isLockingIn}
              className={`rounded-[22px] border px-4 py-4 text-left transition-all duration-150 ${
                selected?.direction === 'down'
                  ? 'border-red-400/50 bg-red-500/12 text-red-300 shadow-[0_0_0_1px_rgba(248,113,113,0.08)]'
                  : 'border-white/[0.06] bg-white/[0.02] text-text-primary'
              } ${isLockingIn ? 'opacity-70' : ''}`}
            >
              <div className="mb-1 text-2xl font-bold">↓</div>
              <div className="text-sm font-semibold">Down</div>
              <div className="mt-1 text-[11px] text-text-muted">
                Bearish reaction
              </div>
            </button>
          </div>

          <div>
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Conviction
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleConfidenceSelect(level)}
                  disabled={isLockingIn}
                  className={`rounded-[18px] border px-3 py-3 text-sm font-medium capitalize transition-all duration-150 ${
                    selected?.confidence === level
                      ? 'border-gold/40 bg-gold-muted text-gold'
                      : 'border-white/[0.06] bg-white/[0.02] text-text-secondary'
                  } ${isLockingIn ? 'opacity-70' : ''}`}
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-text-muted">
              High conviction should feel rare. Use it when you really mean it.
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Your Position
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm text-text-secondary">Direction</div>
              <div className="mt-1 text-base font-semibold text-text-primary">
                {directionLabel}
              </div>
            </div>

            <div className="min-w-0 text-right">
              <div className="text-sm text-text-secondary">Conviction</div>
              <div className="mt-1 text-base font-semibold capitalize text-text-primary">
                {confidenceLabel}
              </div>
            </div>
          </div>

          {allAnswered && !showLockedState && (
            <div className="mt-4 inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
              Ready to lock in
            </div>
          )}

          {showLockedState && (
            <div className="mt-4 inline-flex items-center rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-xs font-semibold text-gold">
              <CheckCircle2 size={14} className="mr-2" />
              Conviction locked
            </div>
          )}
        </Card>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#05060b] via-[#05060be8] to-transparent px-4 pb-6 pt-4">
        <div className="mx-auto max-w-md">
          <Button
            fullWidth
            disabled={!allAnswered || isLockingIn}
            onClick={handleLockIn}
          >
            {showLockedState
              ? 'Locked In'
              : isLockingIn
              ? 'Locking In...'
              : allAnswered
              ? 'Lock In Prediction'
              : 'Complete Your Call'}
          </Button>
        </div>
      </div>

      {showLockedState && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-sm rounded-[28px] border border-gold/20 bg-[rgba(10,13,24,0.96)] p-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold-muted text-gold">
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              Conviction Locked
            </div>

            <h2 className="mb-2 text-2xl font-bold text-text-primary">
              Your call is in
            </h2>

            <p className="text-sm leading-relaxed text-text-secondary">
              {primaryAsset?.label ?? 'This asset'} is locked with{' '}
              <span className="font-semibold text-text-primary">
                {directionLabel}
              </span>{' '}
              and{' '}
              <span className="font-semibold capitalize text-text-primary">
                {confidenceLabel}
              </span>{' '}
              conviction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
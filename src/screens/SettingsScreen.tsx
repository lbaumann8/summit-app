import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  Wrench,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { dailyChallenges } from '../data/dailyChallenge';

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

function getStoredDevIndex() {
  const raw = localStorage.getItem('devChallengeIndex');
  if (raw === null) return 0;

  const parsed = Number(raw);
  if (Number.isNaN(parsed)) return 0;

  return Math.max(0, Math.min(parsed, dailyChallenges.length - 1));
}

export default function SettingsScreen() {
  const navigate = useNavigate();

  const totalEdgePoints = Number(localStorage.getItem('totalEdgePoints') || '0');
  const { currentRank } = useMemo(
    () => getRankData(totalEdgePoints),
    [totalEdgePoints]
  );

  const [devMode, setDevMode] = useState(
    localStorage.getItem('devMode') === 'true'
  );
  const [devChallengeIndex, setDevChallengeIndex] = useState(getStoredDevIndex);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage('');
    }, 2500);

    return () => clearTimeout(timer);
  }, [message]);

  const activeChallenge = dailyChallenges[devChallengeIndex];

  function showMessage(text: string) {
    setMessage(text);
  }

  function handleToggleDevMode() {
    const next = !devMode;
    setDevMode(next);
    localStorage.setItem('devMode', String(next));
    showMessage(next ? 'Dev mode enabled' : 'Dev mode disabled');
  }

  function handlePrevChallenge() {
    const nextIndex =
      devChallengeIndex === 0 ? dailyChallenges.length - 1 : devChallengeIndex - 1;
    setDevChallengeIndex(nextIndex);
    localStorage.setItem('devChallengeIndex', String(nextIndex));
    showMessage('Dev challenge updated');
  }

  function handleNextChallenge() {
    const nextIndex =
      devChallengeIndex === dailyChallenges.length - 1 ? 0 : devChallengeIndex + 1;
    setDevChallengeIndex(nextIndex);
    localStorage.setItem('devChallengeIndex', String(nextIndex));
    showMessage('Dev challenge updated');
  }

  function handleResetDaily() {
    localStorage.removeItem('played');
    localStorage.removeItem('answers');
    localStorage.removeItem('unlockTime');
    localStorage.removeItem('dailyResult');
    localStorage.removeItem('dailyCompletionBannerSeen');
    showMessage('Daily call reset');
  }

  function handleResetPractice() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('practiceCompleted:')) {
        localStorage.removeItem(key);
      }
      if (key.startsWith('practiceRewarded:')) {
        localStorage.removeItem(key);
      }
    });

    localStorage.removeItem('practiceCompletionToast');
    showMessage('Practice progress reset');
  }

  function handleFactoryReset() {
    localStorage.clear();
    localStorage.setItem('devMode', 'false');
    setDevMode(false);
    setDevChallengeIndex(0);
    showMessage('All local app data cleared');
  }

  return (
    <div className="app-shell flex min-h-screen flex-col text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-28 scrollbar-none">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Back to profile"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-text-primary transition-all duration-150 hover:bg-white/[0.04] active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary">
            Settings
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-[30px] font-bold leading-[1.05] text-text-primary">
            App Controls
          </h1>

          <p className="mt-2 max-w-[92%] text-sm leading-relaxed text-text-secondary">
            Test the daily flow, reset progress, and control your local app state.
          </p>
        </div>

        {message && (
          <Card className="mb-5 border border-green-500/20 bg-green-500/5 p-4">
            <div className="text-sm font-semibold text-green-400">{message}</div>
          </Card>
        )}

        <Card className="mb-5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <Wrench size={14} className="text-gold" />
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Dev Mode
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Enable dev mode to bypass the once-per-day restriction and test faster.
          </p>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-text-secondary">Status</div>
              <div className="mt-1 text-lg font-bold text-text-primary">
                {devMode ? 'Enabled' : 'Disabled'}
              </div>
            </div>

            <Button onClick={handleToggleDevMode}>
              {devMode ? 'Turn Off' : 'Turn On'}
            </Button>
          </div>
        </Card>

        <Card className="mb-5 p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Dev Challenge Picker
          </div>

          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Choose which daily challenge loads while testing.
          </p>

          <div className="mb-4 rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
            <div className="text-xs text-text-muted">Challenge #{devChallengeIndex + 1}</div>
            <div className="mt-2 text-base font-semibold text-text-primary">
              {activeChallenge?.title ?? 'No challenge selected'}
            </div>
            <div className="mt-1 text-sm text-text-secondary">
              {activeChallenge?.description ?? ''}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={handlePrevChallenge}>
              <ChevronLeft size={16} className="mr-2" />
              Previous
            </Button>

            <Button variant="secondary" onClick={handleNextChallenge}>
              Next
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </Card>

        <Card className="mb-5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <RotateCcw size={14} className="text-text-primary" />
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Reset Daily Flow
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Clears today’s call, saved answers, unlock timer, and daily result.
          </p>

          <Button fullWidth variant="secondary" onClick={handleResetDaily}>
            Reset Daily Call
          </Button>
        </Card>

        <Card className="mb-5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <RotateCcw size={14} className="text-text-primary" />
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Reset Practice
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Clears saved track completion and daily practice rewards.
          </p>

          <Button fullWidth variant="secondary" onClick={handleResetPractice}>
            Reset Practice Progress
          </Button>
        </Card>

        <Card className="p-5 border border-red-500/20">
          <div className="mb-2 flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-400" />
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Danger Zone
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Clears all local app data, including streaks, edge points, practice progress,
            dev settings, and saved daily state.
          </p>

          <Button fullWidth variant="secondary" className="border-red-500/20 text-red-300" onClick={handleFactoryReset}>
            <Trash2 size={16} className="mr-2" />
            Clear All Local Data
          </Button>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
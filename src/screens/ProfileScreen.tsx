import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Trophy,
  Sparkles,
  ChevronRight,
  Settings,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { getProfile, type Profile } from '../lib/profile';

const RANK_LADDER = ['Rise', 'Ascent', 'Ridge', 'Peak', 'Summit'] as const;
const RANK_THRESHOLDS = [0, 100, 250, 500, 1000];

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

function getStreakMultiplier(streak: number) {
  if (streak >= 7) return '1.5x';
  if (streak >= 5) return '1.25x';
  if (streak >= 3) return '1.1x';
  return '1.0x';
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoadingProfile(true);
      const data = await getProfile();

      if (mounted) {
        setProfile(data);
        setLoadingProfile(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const totalEdgePoints =
    profile?.total_edge_points ??
    Number(localStorage.getItem('totalEdgePoints') || '0');
  const streakCount =
    profile?.streak_count ??
    Number(localStorage.getItem('streakCount') || '0');
  const lastRank =
    profile?.last_rank ?? Number(localStorage.getItem('lastRank') || '0');

  const { currentRank, nextRank, edgePointsToNextRank, rankProgress } =
    useMemo(() => getRankData(totalEdgePoints), [totalEdgePoints]);

  const streakMultiplier = getStreakMultiplier(streakCount);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/auth');
  }

  return (
    <div className="app-shell flex min-h-screen flex-col text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-28 scrollbar-none">
        <div className="mb-4">
          <div className="mb-3 inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary">
            Profile
          </div>

          <h1 className="text-[30px] font-bold leading-[1.05] text-text-primary">
            Your Edge
          </h1>

          <p className="mt-2 max-w-[92%] text-sm leading-relaxed text-text-secondary">
            Track your progress, protect your streak, and climb the rank ladder.
          </p>
        </div>

        <Card className="mb-4 border border-gold/10 p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Current Rank
          </div>

          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-3xl font-bold text-text-primary">
                {currentRank}
              </div>
              <div className="mt-1 text-sm text-text-secondary">
                {nextRank
                  ? `${edgePointsToNextRank.toLocaleString()} EP to ${nextRank}`
                  : 'Top rank reached'}
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold-muted text-gold">
              <Trophy size={20} />
            </div>
          </div>

          <div className="mb-3 h-2 overflow-hidden rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-gold transition-all duration-300"
              style={{ width: `${rankProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">
              {totalEdgePoints.toLocaleString()} EP
            </span>

            {nextRank ? (
              <span className="text-text-secondary">
                <span className="font-semibold text-gold">
                  {edgePointsToNextRank.toLocaleString()}
                </span>{' '}
                EP to {nextRank}
              </span>
            ) : (
              <span className="font-semibold text-gold">Top rank reached</span>
            )}
          </div>
        </Card>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Flame size={14} className="text-orange-400" />
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Streak
              </div>
            </div>

            <div className="text-2xl font-bold text-text-primary">
              {streakCount}
            </div>

            <div className="mt-1 text-sm text-text-secondary">
              day{streakCount === 1 ? '' : 's'}
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-gold" />
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Multiplier
              </div>
            </div>

            <div className="text-2xl font-bold text-gold">
              {streakMultiplier}
            </div>

            <div className="mt-1 text-sm text-text-secondary">
              active streak boost
            </div>
          </Card>
        </div>

        <Card className="mb-4 p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Snapshot
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">
                Total Edge Points
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {loadingProfile ? 'Loading...' : totalEdgePoints.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">
                Stored Board Rank
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {loadingProfile ? 'Loading...' : lastRank || '—'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">Current Tier</span>
              <span className="text-sm font-semibold text-gold">
                {currentRank}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">Display Name</span>
              <span className="text-sm font-semibold text-text-primary">
                {loadingProfile ? 'Loading...' : profile?.display_name || '—'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="mb-4 p-5">
          <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Rank Ladder
          </div>

          <div className="flex items-center justify-between gap-2">
            {RANK_LADDER.map((rank) => {
              const active = rank === currentRank;

              return (
                <span
                  key={rank}
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    active ? 'text-gold' : 'text-text-muted'
                  }`}
                >
                  {rank}
                </span>
              );
            })}
          </div>
        </Card>

        <Card
          className="mb-4 cursor-pointer p-5 transition-transform active:scale-[0.995]"
          onClick={() => navigate('/settings')}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-text-secondary">
                <Settings size={16} />
              </div>

              <div>
                <div className="text-sm font-semibold text-text-primary">
                  Settings & App Controls
                </div>
                <div className="mt-1 text-sm text-text-secondary">
                  Dev mode, resets, and local testing tools
                </div>
              </div>
            </div>

            <ChevronRight size={16} className="flex-shrink-0 text-text-muted" />
          </div>
        </Card>

        <Card className="mb-4 p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Account
          </div>

          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Sign out of your account on this device.
          </p>

          <Button fullWidth variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Card>

        <Card className="p-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Coming Soon
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">
            Profile history, accuracy trends, confidence calibration, and streak
            analytics will live here.
          </p>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
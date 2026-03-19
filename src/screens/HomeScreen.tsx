import { useNavigate } from 'react-router-dom';
import { Flame, ChevronRight, ArrowRight, Lock } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { mockUser, leaderboard } from '../data/user';
import { tracks, todaysChallenge } from '../data/challenges';

const RANK_LADDER = ['Rise', 'Ascent', 'Ridge', 'Peak', 'Summit'];

export default function HomeScreen() {
  const navigate = useNavigate();
  const user = mockUser;

  const currentRankIndex = RANK_LADDER.indexOf(user.rank);
  const nextRank = RANK_LADDER[currentRankIndex + 1] ?? null;

  return (
    <div className="flex flex-col min-h-screen bg-base">
      <TopBar rank={user.rank} />

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-none">

        {/* ─── Today's Challenge hero card ─── */}
        <section className="px-4 pt-5">
          <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-2">
            Today's Challenge
          </div>
          <Card
            className="p-5 cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => navigate(`/challenge/${todaysChallenge.id}`)}
          >
            {/* Top meta */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge label={todaysChallenge.track} variant="track" />
                <Badge label={todaysChallenge.difficulty} variant="difficulty" />
              </div>
              <span className="text-[11px] text-text-muted font-medium">
                {todaysChallenge.timeEstimate}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-text-primary leading-snug mb-4">
              {todaysChallenge.title}
            </h2>

            {/* Scenario preview */}
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-5">
              {todaysChallenge.scenario}
            </p>

            {/* CTA row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-gold text-xs font-bold">+{todaysChallenge.edgePoints}</span>
                <span className="text-text-muted text-xs">Edge Points</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gold/10 text-gold text-sm font-semibold px-4 py-2 rounded-xl">
                Start
                <ArrowRight size={14} />
              </div>
            </div>
          </Card>
        </section>

        {/* ─── Progress strip ─── */}
        <section className="px-4 pt-5">
          <div className="grid grid-cols-4 gap-2">
            <StatTile
              label="Run"
              value={String(user.run)}
              icon={<Flame size={12} className="text-orange-400" />}
              highlight
            />
            <StatTile
              label="Edge Points"
              value={user.edgePoints.toLocaleString()}
            />
            <StatTile label="Rank" value={user.rank} />
            <StatTile label="Top" value={`${user.topPercent}%`} />
          </div>
        </section>

        {/* ─── Your Climb (rank progress) ─── */}
        <section className="px-4 pt-5">
          <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-2">
            Your Climb
          </div>
          <Card className="p-5">
            {/* Rank nodes */}
            <div className="flex items-center justify-between mb-4">
              {RANK_LADDER.map((rank, i) => {
                const done = i < currentRankIndex;
                const current = i === currentRankIndex;
                return (
                  <div key={rank} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        done
                          ? 'bg-gold'
                          : current
                          ? 'bg-gold ring-2 ring-gold/30'
                          : 'bg-border'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wider ${
                        done || current ? 'text-gold' : 'text-text-muted'
                      }`}
                    >
                      {rank}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-all"
                style={{ width: `${user.rankProgress}%` }}
              />
            </div>

            {/* Label row */}
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs">
                {user.edgePoints.toLocaleString()} EP
              </span>
              {nextRank && (
                <span className="text-text-secondary text-xs">
                  <span className="text-gold font-semibold">{user.edgePointsToNextRank.toLocaleString()}</span> EP to {nextRank}
                </span>
              )}
            </div>
          </Card>
        </section>

        {/* ─── Tracks section ─── */}
        <section className="pt-5">
          <div className="flex items-center justify-between px-4 mb-2">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase">
              Tracks
            </div>
            <button className="text-[11px] text-gold font-medium flex items-center gap-0.5">
              See all <ChevronRight size={12} />
            </button>
          </div>

          {/* Horizontal scroll */}
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-none pb-1">
            {tracks.map((track) => {
              const pct = Math.round((track.completedCount / track.challengeCount) * 100);
              return (
                <div
                  key={track.id}
                  className="flex-shrink-0 w-36 bg-surface border border-border rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div
                    className="w-6 h-6 rounded-md mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${track.color}18` }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: track.color }}
                    />
                  </div>
                  <p className="text-text-primary text-sm font-semibold mb-0.5">{track.name}</p>
                  <p className="text-text-muted text-[11px] mb-3">{track.challengeCount} challenges</p>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: track.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Expedition preview ─── */}
        <section className="px-4 pt-5">
          <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-2">
            Expedition
          </div>
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold/4 blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase bg-gold-muted px-2 py-0.5 rounded-md border border-gold/20">
                    Weekly
                  </span>
                </div>
                <h3 className="text-text-primary font-bold text-base mb-1">
                  Valuation Sprint
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed max-w-[200px]">
                  7 challenges. 7 days. Master the core valuation toolkit.
                </p>
              </div>
              <Lock size={16} className="text-text-muted mt-1 flex-shrink-0" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1 flex-1 bg-border rounded-full overflow-hidden">
                <div className="h-full w-[14%] bg-gold rounded-full" />
              </div>
              <span className="text-text-muted text-xs">1 / 7</span>
            </div>
          </Card>
        </section>

        {/* ─── Leaderboard preview ─── */}
        <section className="px-4 pt-5 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase">
              Leaderboard
            </div>
            <button className="text-[11px] text-gold font-medium flex items-center gap-0.5">
              Full board <ChevronRight size={12} />
            </button>
          </div>
          <Card className="overflow-hidden">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i < leaderboard.length - 1 ? 'border-b border-border-subtle' : ''
                } ${entry.isCurrentUser ? 'bg-gold/5' : ''}`}
              >
                <span
                  className={`w-5 text-sm font-bold text-center ${
                    entry.rank === 1
                      ? 'text-gold'
                      : entry.rank <= 3
                      ? 'text-text-secondary'
                      : 'text-text-muted'
                  }`}
                >
                  {entry.rank}
                </span>
                <div className="flex-1">
                  <span
                    className={`text-sm font-semibold ${
                      entry.isCurrentUser ? 'text-gold' : 'text-text-primary'
                    }`}
                  >
                    {entry.name}
                  </span>
                </div>
                <span className="text-text-muted text-xs font-medium">
                  {entry.edgePoints.toLocaleString()} EP
                </span>
              </div>
            ))}
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

// ── Local stat tile ──────────────────────────────────────
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
    <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1">
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

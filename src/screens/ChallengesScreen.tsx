import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock3, Flame, Trophy } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { dailyChallenge } from '../data/dailyChallenge';
import { tracks } from '../data/challenges';

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

export default function ChallengesScreen() {
  const navigate = useNavigate();

  const totalEdgePoints = Number(localStorage.getItem('totalEdgePoints') || '0');
  const streakCount = Number(localStorage.getItem('streakCount') || '0');
  const playedToday = localStorage.getItem('played') === 'true';

  const { currentRank } = useMemo(
    () => getRankData(totalEdgePoints),
    [totalEdgePoints]
  );

  return (
    <div className="app-shell flex flex-col min-h-screen text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto pb-28 scrollbar-none px-4 pt-5">
        <div className="mb-4">
          <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary mb-3">
            Challenges
          </div>

          <h1 className="text-[30px] leading-[1.05] font-bold text-text-primary">
            Choose Your Arena
          </h1>

          <p className="mt-2 text-sm text-text-secondary max-w-[92%] leading-relaxed">
            Make today’s call, sharpen your instincts in practice, and build your
            edge one decision at a time.
          </p>
        </div>

        <Card
          className="p-5 mb-5 cursor-pointer active:scale-[0.995] transition-transform"
          onClick={() => navigate('/challenge/daily')}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge label="Daily" variant="track" />
              <Badge label="Medium" variant="difficulty" />
            </div>

            <div className="inline-flex items-center gap-1 text-[11px] text-text-muted">
              <Clock3 size={12} />
              1 call
            </div>
          </div>

          <h2 className="text-[24px] leading-[1.12] font-bold text-text-primary mb-3 max-w-[92%]">
            {dailyChallenge.title}
          </h2>

          <p className="text-text-secondary text-[15px] leading-relaxed mb-4 max-w-[94%]">
            {dailyChallenge.description}
          </p>

          <div className="rounded-[22px] border border-white/[0.06] bg-white/[0.02] px-4 py-4 mb-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
              Today’s Asset
            </div>

            <div className="text-xl font-bold text-text-primary">
              {dailyChallenge.assets[0]?.label ?? 'Asset'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-text-secondary">
                <Flame size={14} className="text-orange-400" />
                {streakCount} day streak
              </div>

              <div className="flex items-center gap-1.5 text-text-secondary">
                <Trophy size={14} className="text-gold" />
                +50 potential
              </div>
            </div>

            <div className="premium-button rounded-2xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2">
              {playedToday ? 'View Call' : 'Start'}
              <ChevronRight size={14} />
            </div>
          </div>
        </Card>

        <div className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase">
          Practice Paths
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tracks.map((track) => {
            const progress = Math.round(
              (track.completedCount / track.challengeCount) * 100
            );

            return (
              <Card
                key={track.id}
                className="p-5 cursor-pointer active:scale-[0.995] transition-transform"
                onClick={() => navigate('/tracks')}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 h-3 w-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: track.color }}
                    />

                    <div>
                      <h3 className="text-lg font-bold text-text-primary leading-tight">
                        {track.name}
                      </h3>

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

                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="text-text-muted">
                    {track.completedCount} / {track.challengeCount} completed
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
            );
          })}
        </div>

        <div className="mt-5">
          <Card className="p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
              Coming Soon
            </div>

            <div className="text-lg font-bold text-text-primary mb-2">
              Special Event Challenges
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Live macro drops, earnings reactions, and flash challenges tied to
              real market events will show up here.
            </p>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
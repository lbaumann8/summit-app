import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';

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

  const { currentRank } = useMemo(
    () => getRankData(totalEdgePoints),
    [totalEdgePoints]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/practice', { replace: true });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="app-shell flex flex-col min-h-screen text-white">
      <TopBar rank={currentRank} />

      <main className="flex-1 overflow-y-auto pb-28 scrollbar-none px-4 pt-5">
        <div className="mb-4">
          <div className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold tracking-wide text-text-secondary mb-3">
            Updated Navigation
          </div>

          <h1 className="text-[30px] leading-[1.05] font-bold text-text-primary">
            Challenges Moved to Practice
          </h1>

          <p className="mt-2 text-sm text-text-secondary max-w-[92%] leading-relaxed">
            Daily Call now lives on Home, and all training paths live under Practice.
          </p>
        </div>

        <Card
          className="p-5 cursor-pointer active:scale-[0.995] transition-transform border border-gold/10"
          onClick={() => navigate('/practice', { replace: true })}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-[11px] font-semibold tracking-wide text-gold mb-3">
                <Sparkles size={12} />
                New Flow
              </div>

              <h2 className="text-[22px] leading-[1.1] font-bold text-text-primary mb-2">
                Go to Practice
              </h2>

              <p className="text-sm text-text-secondary leading-relaxed max-w-[94%]">
                Use Practice to train macro, earnings, momentum, and risk-event reads.
              </p>
            </div>

            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-gold">
              <ArrowRight size={16} />
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="app-shell relative flex min-h-screen flex-col overflow-hidden text-white">
      <div className="pointer-events-none absolute top-0 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <main className="flex flex-1 flex-col px-6 pt-10 pb-8">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-[11px] font-semibold tracking-wide text-gold">
            Finance Judgment Training
          </div>

          <div className="mb-5">
            <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
              <svg
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <path
                  d="M13 39L28 12L43 39"
                  stroke="#84BA92"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 39L28 25L36 39"
                  stroke="#84BA92"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.45"
                />
                <path
                  d="M17 44H39"
                  stroke="#84BA92"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </svg>
            </div>

            <h1 className="text-[40px] leading-[0.98] font-black tracking-[-0.03em] text-text-primary">
              Summit
            </h1>

            <p className="mt-3 text-lg font-semibold text-text-primary">
              Think like the market.
            </p>

            <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-text-secondary">
              Build real finance judgment through one sharp Daily Call and targeted
              practice that makes tomorrow’s read better.
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          <Card className="border border-gold/10 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gold-muted text-gold">
                <Flame size={18} />
              </div>

              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  Main Event
                </div>
                <h2 className="mb-2 text-lg font-bold text-text-primary">
                  Daily Call
                </h2>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Make one premium market read each day, choose your conviction,
                  and see how your judgment holds up when results unlock.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-text-secondary">
                <BookOpen size={18} />
              </div>

              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  Support System
                </div>
                <h2 className="mb-2 text-lg font-bold text-text-primary">
                  Practice Paths
                </h2>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Train across macro, earnings, momentum, and risk events so your
                  Daily Call gets sharper over time.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6 rounded-[24px] border border-white/[0.06] bg-white/[0.02] px-4 py-4">
          <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-text-muted">
            How Summit works
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 bg-gold-muted text-[12px] font-bold text-gold">
                1
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  Make today’s call
                </div>
                <div className="mt-1 text-xs leading-relaxed text-text-secondary">
                  Read the setup and choose your market direction.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 bg-gold-muted text-[12px] font-bold text-gold">
                2
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  Lock your conviction
                </div>
                <div className="mt-1 text-xs leading-relaxed text-text-secondary">
                  Strong reads score better, reckless confidence gets exposed.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 bg-gold-muted text-[12px] font-bold text-gold">
                3
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  Train and climb
                </div>
                <div className="mt-1 text-xs leading-relaxed text-text-secondary">
                  Use Practice to improve weak spots, earn Edge Points, and rise on
                  the board.
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-6 p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-gold" />
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
              What makes Summit different
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm text-text-secondary">
              <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-green-400" />
              <span>Not just definitions, real judgment reps.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-text-secondary">
              <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-green-400" />
              <span>Conviction matters, not just getting direction right.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-text-secondary">
              <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-green-400" />
              <span>Daily ritual plus training support.</span>
            </div>
          </div>
        </Card>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/auth')}
          >
            Get Started
            <ArrowRight size={16} className="ml-2" />
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            className="text-sm text-text-muted"
            onClick={() => navigate('/auth')}
          >
            Sign in to continue
          </Button>
        </div>
      </main>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import { Flame, BookOpen, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="app-shell flex flex-col min-h-screen relative overflow-hidden text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <main className="flex-1 px-6 pt-10 pb-8 flex flex-col">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-gold/20 bg-gold-muted px-3 py-1 text-[11px] font-semibold tracking-wide text-gold mb-4">
            Finance Judgment Training
          </div>

          <div className="mb-5">
            <div className="relative w-14 h-14 flex items-center justify-center mb-5">
              <svg
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
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

            <p className="mt-3 text-lg text-text-primary font-semibold">
              Think like the market.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-text-secondary max-w-[300px]">
              One premium daily call, plus training reps that sharpen your
              instincts for tomorrow.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <Card className="p-5 border border-gold/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-muted text-gold flex-shrink-0">
                <Flame size={18} />
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
                  Main Event
                </div>
                <h2 className="text-lg font-bold text-text-primary mb-2">
                  Daily Call
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Make one high-stakes market prediction each day and see how
                  your conviction stacks up when results unlock.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.03] text-text-secondary flex-shrink-0 border border-white/[0.06]">
                <BookOpen size={18} />
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
                  Training Mode
                </div>
                <h2 className="text-lg font-bold text-text-primary mb-2">
                  Practice Paths
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Train across macro, earnings, momentum, and risk so your daily
                  calls get sharper over time.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] px-4 py-4 mb-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted mb-2">
            How it works
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-lg font-bold text-gold">1</div>
              <div className="text-xs text-text-secondary leading-relaxed mt-1">
                Make today’s call
              </div>
            </div>

            <div>
              <div className="text-lg font-bold text-gold">2</div>
              <div className="text-xs text-text-secondary leading-relaxed mt-1">
                Lock your conviction
              </div>
            </div>

            <div>
              <div className="text-lg font-bold text-gold">3</div>
              <div className="text-xs text-text-secondary leading-relaxed mt-1">
                Climb the board
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/home')}
          >
            Enter Summit
            <ArrowRight size={16} className="ml-2" />
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            className="text-text-muted text-sm"
            onClick={() => navigate('/home')}
          >
            Explore First
          </Button>
        </div>
      </main>
    </div>
  );
}
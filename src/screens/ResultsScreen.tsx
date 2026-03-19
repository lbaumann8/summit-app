import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle, Flame, ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { challenges } from '../data/challenges';
import { mockUser } from '../data/user';
import { ResultState } from '../types';

export default function ResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // Fall back gracefully if navigated to directly
  const result = (location.state as ResultState | null) ?? {
    challengeId: 'ch-001',
    selectedOptionId: 'b',
    isCorrect: false,
    edgePointsEarned: 0,
  };

  const challenge = challenges.find((c) => c.id === result.challengeId) ?? challenges[0];
  const correctOption = challenge.options.find((o) => o.id === challenge.correctOptionId);
  const selectedOption = challenge.options.find((o) => o.id === result.selectedOptionId);
  const user = mockUser;

  const isCorrect = result.isCorrect;

  return (
    <div className="flex flex-col min-h-screen bg-base">

      {/* ── Result banner ── */}
      <div
        className={`px-4 pt-12 pb-8 flex flex-col items-center gap-3 relative overflow-hidden ${
          isCorrect ? 'bg-correct-dim' : 'bg-missed-dim'
        }`}
      >
        {/* Glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isCorrect ? 'bg-correct' : 'bg-missed'
          }`}
        />

        {isCorrect ? (
          <CheckCircle2 size={40} className="text-correct" strokeWidth={1.5} />
        ) : (
          <XCircle size={40} className="text-missed" strokeWidth={1.5} />
        )}

        <div className="text-center">
          <h1 className={`text-2xl font-black tracking-tight ${isCorrect ? 'text-correct' : 'text-missed'}`}>
            {isCorrect ? 'Sharp Eye.' : 'Missed It.'}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {isCorrect
              ? 'Clean call. Your edge is showing.'
              : 'Study the reasoning. Every miss sharpens your instinct.'}
          </p>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto px-4 py-5 scrollbar-none">

        {/* Correct answer card */}
        <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-2">
          Correct Answer
        </div>
        <Card className="p-4 mb-5 border-correct/20 bg-correct-dim">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-md bg-correct text-base text-[11px] font-bold flex items-center justify-center mt-0.5">
              {correctOption?.label}
            </span>
            <span className="text-text-primary text-sm leading-relaxed font-medium">
              {correctOption?.text}
            </span>
          </div>
        </Card>

        {/* If wrong, show what they picked */}
        {!isCorrect && selectedOption && (
          <>
            <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-2">
              Your Answer
            </div>
            <Card className="p-4 mb-5 border-missed/20 bg-missed-dim">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-missed text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {selectedOption.label}
                </span>
                <span className="text-text-secondary text-sm leading-relaxed line-through opacity-70">
                  {selectedOption.text}
                </span>
              </div>
            </Card>
          </>
        )}

        {/* Explanation */}
        <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-2">
          The Breakdown
        </div>
        <Card className="p-5 mb-5">
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
            {challenge.explanation}
          </p>
        </Card>

        {/* Rewards */}
        <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-2">
          Rewards
        </div>
        <Card className="p-5 mb-5">
          <div className="flex items-center justify-around">
            {/* Edge Points */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`text-2xl font-black ${
                  isCorrect ? 'text-gold' : 'text-text-muted'
                }`}
              >
                {isCorrect ? `+${result.edgePointsEarned}` : '+0'}
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                Edge Points
              </span>
            </div>

            <div className="w-px h-10 bg-border" />

            {/* Run */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1">
                <Flame
                  size={20}
                  className={isCorrect ? 'text-orange-400' : 'text-text-muted'}
                />
                <span
                  className={`text-2xl font-black ${
                    isCorrect ? 'text-orange-400' : 'text-text-muted'
                  }`}
                >
                  {isCorrect ? user.run + 1 : user.run}
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                {isCorrect ? 'Run Extended' : 'Run Holds'}
              </span>
            </div>

            <div className="w-px h-10 bg-border" />

            {/* Total EP */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="text-2xl font-black text-text-primary">
                {(user.edgePoints + result.edgePointsEarned).toLocaleString()}
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                Total EP
              </span>
            </div>
          </div>
        </Card>

        {/* Performance insight */}
        <Card className="p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary text-sm font-semibold">Valuation Track</p>
              <p className="text-text-muted text-xs mt-0.5">
                {isCorrect ? 'Top 28% this week' : 'Keep pushing — you\'re at 41%'}
              </p>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </div>
        </Card>

        {/* Spacer */}
        <div className="h-4" />
      </main>

      {/* ── Sticky CTAs ── */}
      <div className="px-4 pb-8 pt-4 flex flex-col gap-3 border-t border-border-subtle bg-base">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => navigate('/challenge/ch-002')}
        >
          Continue Track
          <ChevronRight size={14} className="ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

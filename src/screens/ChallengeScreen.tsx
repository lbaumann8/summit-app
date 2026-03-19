import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { challenges } from '../data/challenges';
import { ResultState } from '../types';

export default function ChallengeScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const challenge = challenges.find((c) => c.id === id) ?? challenges[0];

  function handleLockIn() {
    if (!selectedId) return;
    const isCorrect = selectedId === challenge.correctOptionId;
    const result: ResultState = {
      challengeId: challenge.id,
      selectedOptionId: selectedId,
      isCorrect,
      edgePointsEarned: isCorrect ? challenge.edgePoints : 0,
    };
    navigate('/results', { state: result });
  }

  return (
    <div className="flex flex-col min-h-screen bg-base">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Home</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge label={challenge.track} variant="track" />
        </div>

        <div className="flex items-center gap-1.5 text-text-muted">
          <Clock size={13} />
          <span className="text-xs font-medium">{challenge.timeEstimate}</span>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto px-4 py-5 scrollbar-none">

        {/* Difficulty + Edge Points */}
        <div className="flex items-center justify-between mb-4">
          <Badge label={challenge.difficulty} variant="difficulty" />
          <div className="flex items-center gap-1.5">
            <span className="text-gold text-xs font-bold">+{challenge.edgePoints}</span>
            <span className="text-text-muted text-xs">Edge Points</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-text-primary leading-tight mb-5">
          {challenge.title}
        </h1>

        {/* Scenario card */}
        <Card className="p-5 mb-6">
          <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-3">
            Scenario
          </div>
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
            {challenge.scenario}
          </p>
        </Card>

        {/* Answer options */}
        <div className="text-[10px] font-semibold tracking-[0.2em] text-text-muted uppercase mb-3">
          Your Answer
        </div>
        <div className="flex flex-col gap-2.5">
          {challenge.options.map((option) => {
            const selected = selectedId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedId(option.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-150 active:scale-[0.99] ${
                  selected
                    ? 'border-gold bg-gold-muted'
                    : 'border-border bg-surface hover:border-border/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center mt-0.5 ${
                      selected
                        ? 'bg-gold text-base'
                        : 'bg-elevated text-text-muted border border-border'
                    }`}
                  >
                    {option.label}
                  </span>
                  <span
                    className={`text-sm leading-relaxed ${
                      selected ? 'text-text-primary font-medium' : 'text-text-secondary'
                    }`}
                  >
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Spacer for bottom button */}
        <div className="h-28" />
      </main>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-8 pt-4 bg-gradient-to-t from-base via-base/95 to-transparent">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedId}
          onClick={handleLockIn}
        >
          Lock In Answer
        </Button>
      </div>
    </div>
  );
}

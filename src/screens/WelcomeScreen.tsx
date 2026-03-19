import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-base relative overflow-hidden">
      {/* Ambient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10">

        {/* Mark + Wordmark */}
        <div className="flex flex-col items-center gap-5">
          {/* Triangle mark */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <polygon
                points="28,6 52,48 4,48"
                stroke="#C8A84B"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
              />
              <polygon
                points="28,16 44,44 12,44"
                stroke="#C8A84B"
                strokeWidth="1"
                strokeLinejoin="round"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-[42px] font-black tracking-[0.22em] text-text-primary uppercase leading-none">
              Summit
            </h1>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              Earn Your Edge
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-[200px]">
          <div className="flex-1 h-px bg-border" />
          <div className="w-1 h-1 rounded-full bg-gold/40" />
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Description */}
        <div className="flex flex-col items-center gap-3 text-center max-w-[280px]">
          <p className="text-text-secondary text-sm leading-relaxed">
            Daily judgment challenges built for finance careers.
          </p>
          <p className="text-text-muted text-xs leading-relaxed">
            Train your instincts. Sharpen your edge. Climb the ranks.
          </p>
        </div>

        {/* Rank ladder preview */}
        <div className="flex items-center gap-1.5">
          {['Rise', 'Ascent', 'Ridge', 'Peak', 'Summit'].map((r, i) => (
            <div key={r} className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-semibold tracking-widest uppercase ${
                  i === 0 ? 'text-gold' : 'text-text-muted'
                }`}
              >
                {r}
              </span>
              {i < 4 && (
                <span className="text-text-muted text-[10px]">›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="px-6 pb-12 flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/home')}
        >
          Begin Ascent
        </Button>
        <Button
          variant="ghost"
          size="md"
          fullWidth
          className="text-text-muted text-sm"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}

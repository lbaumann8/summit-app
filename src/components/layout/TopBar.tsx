import { User } from 'lucide-react';
import { Rank } from '../../types';
import Badge from '../ui/Badge';

interface TopBarProps {
  rank: Rank;
  onProfileClick?: () => void;
}

export default function TopBar({ rank, onProfileClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 px-4 pt-4">
      <div className="rounded-[28px] border border-white/[0.06] bg-[rgba(10,13,24,0.96)] px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.01)_inset] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted">
              Finance Learning
            </div>

            <div className="mt-1 text-[18px] font-black uppercase leading-none tracking-[0.18em] text-text-primary">
              Summit
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Badge label={rank} variant="rank" />

            <button
              type="button"
              onClick={onProfileClick}
              aria-label="Open profile"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-text-secondary transition-all duration-150 hover:bg-white/[0.04] hover:text-text-primary active:scale-[0.98]"
            >
              <User size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

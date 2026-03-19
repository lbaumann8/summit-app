import { User } from 'lucide-react';
import { Rank } from '../../types';
import Badge from '../ui/Badge';

interface TopBarProps {
  rank: Rank;
  onProfileClick?: () => void;
}

export default function TopBar({ rank, onProfileClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border-subtle sticky top-0 z-10 bg-base/95 backdrop-blur-sm">
      <span className="text-lg font-black tracking-[0.22em] text-text-primary uppercase">
        Summit
      </span>

      <div className="flex items-center gap-2.5">
        <Badge label={rank} variant="rank" />
        <button
          onClick={onProfileClick}
          className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center hover:border-gold/30 transition-colors"
        >
          <User size={15} className="text-text-secondary" />
        </button>
      </div>
    </header>
  );
}

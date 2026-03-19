interface BadgeProps {
  label: string;
  variant?: 'rank' | 'track' | 'difficulty' | 'default';
  className?: string;
}

const difficultyColors: Record<string, string> = {
  Analyst: 'text-text-secondary border-border',
  Associate: 'text-gold border-gold/30 bg-gold-muted',
  VP: 'text-correct border-correct/30 bg-correct-dim',
  MD: 'text-missed border-missed/30 bg-missed-dim',
};

export default function Badge({ label, variant = 'default', className = '' }: BadgeProps) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-widest uppercase border';

  if (variant === 'rank') {
    return (
      <span className={`${base} bg-gold-muted text-gold border-gold/25 ${className}`}>
        {label}
      </span>
    );
  }

  if (variant === 'track') {
    return (
      <span className={`${base} bg-elevated text-text-secondary border-border ${className}`}>
        {label}
      </span>
    );
  }

  if (variant === 'difficulty') {
    const colors = difficultyColors[label] ?? difficultyColors.Analyst;
    return (
      <span className={`${base} ${colors} ${className}`}>
        {label}
      </span>
    );
  }

  return (
    <span className={`${base} bg-elevated text-text-secondary border-border ${className}`}>
      {label}
    </span>
  );
}

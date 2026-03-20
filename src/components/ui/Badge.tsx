interface BadgeProps {
  label: string;
  variant?: 'rank' | 'track' | 'difficulty' | 'default';
  className?: string;
}

const difficultyStyles: Record<string, string> = {
  Analyst: 'bg-white/[0.04] text-text-secondary border-white/[0.06]',
  Associate: 'bg-gold-muted text-gold border-gold/25',
  VP: 'bg-green-500/10 text-green-400 border-green-500/20',
  MD: 'bg-red-500/10 text-red-400 border-red-500/20',
  Easy: 'bg-white/[0.04] text-text-secondary border-white/[0.06]',
  Medium: 'bg-gold-muted text-gold border-gold/25',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Badge({
  label,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const base =
    'inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap';

  if (variant === 'rank') {
    return (
      <span
        className={`${base} bg-gold-muted text-gold border-gold/25 ${className}`}
      >
        {label}
      </span>
    );
  }

  if (variant === 'track') {
    return (
      <span
        className={`${base} bg-white/[0.04] text-text-secondary border-white/[0.06] ${className}`}
      >
        {label}
      </span>
    );
  }

  if (variant === 'difficulty') {
    const styles = difficultyStyles[label] ?? difficultyStyles.Analyst;

    return <span className={`${base} ${styles} ${className}`}>{label}</span>;
  }

  return (
    <span
      className={`${base} bg-white/[0.04] text-text-secondary border-white/[0.06] ${className}`}
    >
      {label}
    </span>
  );
}
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  bordered?: boolean;
}

export default function Card({
  elevated = false,
  bordered = true,
  className = '',
  children,
  ...props
}: CardProps) {
  const base = 'rounded-2xl overflow-hidden';
  const bg = elevated ? 'bg-elevated' : 'bg-surface';
  const border = bordered ? 'border border-border' : '';

  return (
    <div className={`${base} ${bg} ${border} ${className}`} {...props}>
      {children}
    </div>
  );
}

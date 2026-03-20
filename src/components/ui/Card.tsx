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
  const base =
    'rounded-[28px] overflow-hidden transition-all duration-200';
  const surface = elevated ? 'soft-panel' : 'glass-card';
  const border = bordered ? '' : 'border-0';

  return (
    <div className={`${base} ${surface} ${border} ${className}`} {...props}>
      {children}
    </div>
  );
}

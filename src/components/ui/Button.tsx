import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-2xl font-semibold tracking-[-0.01em] transition-all duration-150 select-none whitespace-nowrap';

  const variants = {
    primary:
      'premium-button active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50',
    secondary:
      'bg-surface border border-border text-text-primary hover:bg-white/[0.02] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50',
    ghost:
      'text-text-secondary hover:text-text-primary hover:bg-white/[0.02] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2.5',
    md: 'text-sm px-5 py-3.5',
    lg: 'text-base px-6 py-4',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
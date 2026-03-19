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
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 tracking-wide select-none';

  const variants = {
    primary:
      'bg-gold text-base hover:bg-gold-bright active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
    secondary:
      'bg-elevated border border-border text-text-primary hover:border-gold/40 active:scale-[0.98] disabled:opacity-40',
    ghost:
      'text-text-secondary hover:text-text-primary active:scale-[0.98] disabled:opacity-40',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2.5',
    md: 'text-sm px-5 py-3.5',
    lg: 'text-base px-6 py-4',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer rounded-lg font-[family-name:var(--font-ui)]';

  const variants: Record<string, string> = {
    primary:
      'bg-accent text-white hover:brightness-110 shadow-lg shadow-accent/20 active:scale-[0.97]',
    outline:
      'border border-border-subtle text-text-dim hover:border-border-active hover:text-text-primary hover:bg-white/[0.03] active:scale-[0.97]',
    ghost:
      'text-text-dim hover:text-text-primary hover:bg-white/[0.05] active:scale-[0.97]',
    danger:
      'bg-error/10 text-error border border-error/20 hover:bg-error/20 active:scale-[0.97]',
  };

  const sizes: Record<string, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

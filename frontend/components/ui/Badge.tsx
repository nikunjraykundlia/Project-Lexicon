'use client';

import React from 'react';

interface BadgeProps {
  label: string;
  color: string;
  icon?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color, icon, size = 'sm' }: BadgeProps) {
  const sizeStyles = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium font-[family-name:var(--font-ui)] tracking-wide uppercase ${sizeStyles}`}
      style={{
        color,
        background: `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      {icon && <span className="text-[11px]">{icon}</span>}
      {label}
    </span>
  );
}

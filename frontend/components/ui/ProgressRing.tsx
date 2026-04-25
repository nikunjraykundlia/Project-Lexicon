'use client';

import React from 'react';

interface ProgressRingProps {
  score: number; // 0–7
  max?: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  score,
  max = 7,
  size = 36,
  strokeWidth = 3,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / max) * circumference;
  const percentage = Math.round((score / max) * 100);

  const getColor = () => {
    if (percentage >= 100) return '#FFD700';
    if (percentage >= 70) return '#10B981';
    if (percentage >= 40) return '#3B9EFF';
    return '#4A6079';
  };

  return (
    <div className="relative inline-flex items-center justify-center" title={`${score}/${max} block types`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(74, 96, 121, 0.2)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: percentage >= 100 ? `drop-shadow(0 0 6px ${getColor()})` : undefined,
          }}
        />
      </svg>
      <span
        className="absolute text-[10px] font-semibold font-[family-name:var(--font-mono)]"
        style={{ color: getColor() }}
      >
        {score}
      </span>
    </div>
  );
}

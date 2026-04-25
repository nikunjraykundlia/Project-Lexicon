'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', width, height }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

export function SkeletonBlock() {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card/50 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton width={3} height={24} />
        <Skeleton width={60} height={20} className="rounded-full" />
        <div className="flex-1" />
        <Skeleton width={20} height={20} className="rounded" />
      </div>
      <Skeleton height={40} className="rounded-lg" />
    </div>
  );
}

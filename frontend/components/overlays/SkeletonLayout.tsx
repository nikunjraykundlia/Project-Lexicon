'use client';

import React from 'react';
import { Skeleton, SkeletonBlock } from '@/components/ui/Skeleton';

export function SkeletonLayout() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left sidebar skeleton */}
      <div className="w-[280px] border-r border-border-subtle bg-bg-secondary/50 p-4 space-y-4">
        <Skeleton height={32} className="rounded-lg" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} height={44} className="rounded-lg" />
          ))}
        </div>
        <Skeleton height={1} className="my-4" />
        <Skeleton height={24} width={100} className="rounded" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={52} className="rounded-lg" />
          ))}
        </div>
      </div>

      {/* Center canvas skeleton */}
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton width={200} height={28} className="rounded" />
          <Skeleton width={80} height={32} className="rounded-lg" />
        </div>
        <div className="space-y-3">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
      </div>

      {/* Right panel skeleton */}
      <div className="w-[380px] border-l border-border-subtle bg-bg-secondary/50 p-4 space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={80} height={32} className="rounded-lg" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} height={16} className="rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

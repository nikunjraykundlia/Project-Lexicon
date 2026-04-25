'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Zap } from 'lucide-react';
import { useBlockStore } from '@/store/useBlockStore';
import { useUIStore } from '@/store/useUIStore';
import { useCompare } from '@/hooks/useCompare';
import { diffWords, diffStats } from '@/lib/diff';
import { Button } from '@/components/ui/Button';
import { ThinkingAnimation } from '@/components/overlays/ThinkingAnimation';

export function DiffViewer() {
  const blocks = useBlockStore((s) => s.blocks);
  const getPromptA = useBlockStore((s) => s.getPromptA);
  const getPromptB = useBlockStore((s) => s.getPromptB);
  const variantBExclusions = useBlockStore((s) => s.variantBExclusions);
  const loadingState = useUIStore((s) => s.loadingState);
  const { compare, isComparing } = useCompare();

  const promptA = getPromptA();
  const promptB = getPromptB();

  const segments = useMemo(() => diffWords(promptA, promptB), [promptA, promptB]);
  const stats = useMemo(() => diffStats(segments), [segments]);

  const hasExclusions = variantBExclusions.length > 0;

  const handleCompare = () => {
    compare({
      promptA,
      promptB,
      blocksA: blocks.map((b) => b.type),
      blocksB: blocks
        .filter((b) => !variantBExclusions.includes(b.id))
        .map((b) => b.type),
    });
  };

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <GitCompare className="w-8 h-8 text-text-muted/40" />
        <p className="text-sm text-text-muted text-center">
          Add blocks and toggle some off from<br />Variant B to see the diff
        </p>
      </div>
    );
  }

  if (loadingState === 'thinking') {
    return <ThinkingAnimation />;
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Info */}
      <div className="text-xs text-text-muted space-y-1">
        <p>
          <span className="text-text-dim font-medium">Prompt A:</span>{' '}
          {blocks.length} blocks (all)
        </p>
        <p>
          <span className="text-text-dim font-medium">Prompt B:</span>{' '}
          {blocks.length - variantBExclusions.length} blocks
          {hasExclusions && (
            <span className="text-warning"> ({variantBExclusions.length} excluded)</span>
          )}
        </p>
      </div>

      {/* Stats bar */}
      {hasExclusions && (
        <div className="flex items-center gap-3 text-[11px] font-[family-name:var(--font-mono)]">
          <span className="text-diff-del">
            −{stats.deleted} removed
          </span>
          <span className="text-diff-add">
            +{stats.added} added
          </span>
          <span className="text-text-muted">
            {stats.percentChanged}% changed
          </span>
        </div>
      )}

      {/* Diff view */}
      {hasExclusions ? (
        <div className="rounded-lg bg-bg-primary border border-border-subtle p-4 max-h-[300px] overflow-y-auto">
          <div className="font-[family-name:var(--font-mono)] text-xs leading-relaxed whitespace-pre-wrap">
            {segments.map((seg, i) => (
              <span
                key={i}
                className={
                  seg.type === 'added'
                    ? 'bg-diff-add/15 text-diff-add'
                    : seg.type === 'deleted'
                    ? 'bg-diff-del/15 text-diff-del line-through'
                    : 'text-text-muted'
                }
              >
                {seg.text}{' '}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-bg-primary/50 border border-border-subtle p-6 text-center">
          <p className="text-xs text-text-muted">
            Toggle blocks off from Variant B using the{' '}
            <span className="text-accent-violet">⏻</span> toggle on each card to see a diff
          </p>
        </div>
      )}

      {/* Run comparison button */}
      <Button
        variant="primary"
        size="md"
        onClick={handleCompare}
        disabled={isComparing || !hasExclusions}
        className="w-full"
      >
        <Zap className="w-4 h-4" />
        {isComparing ? 'Analyzing...' : 'Run AI Comparison'}
      </Button>
    </div>
  );
}

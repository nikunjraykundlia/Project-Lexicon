'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trophy, Star, AlertTriangle } from 'lucide-react';
import { useBlockStore } from '@/store/useBlockStore';
import { useUIStore } from '@/store/useUIStore';
import { getMockAnalysis } from '@/lib/mockResponses';

export function ResponsePanel() {
  const blocks = useBlockStore((s) => s.blocks);
  const getCompositionFingerprint = useBlockStore((s) => s.getCompositionFingerprint);
  const getCompletenessScore = useBlockStore((s) => s.getCompletenessScore);
  const llmResult = useUIStore((s) => s.llmResult);

  const fingerprint = getCompositionFingerprint();
  const score = getCompletenessScore();

  // Use LLM result if available, otherwise show mock based on fingerprint
  const analysis = useMemo(
    () => llmResult || getMockAnalysis(fingerprint),
    [llmResult, fingerprint]
  );

  const qualityStars = Math.min(3, Math.ceil(score / 2.5));

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <MessageSquare className="w-8 h-8 text-text-muted/40" />
        <p className="text-sm text-text-muted text-center">
          Add blocks to see analysis<br />and quality insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Quality score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border-subtle bg-bg-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary font-[family-name:var(--font-display)]">
            Quality Score
          </h3>
          <div className="flex gap-0.5">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= qualityStars
                    ? 'text-warning fill-warning'
                    : 'text-text-muted/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Score bars */}
        <div className="space-y-2">
          <ScoreBar label="Clarity A" value={analysis.scores.clarityA} />
          <ScoreBar label="Clarity B" value={analysis.scores.clarityB} />
          <ScoreBar label="Specificity A" value={analysis.scores.specificityA} />
          <ScoreBar label="Specificity B" value={analysis.scores.specificityB} />
        </div>
      </motion.div>

      {/* Winner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border-subtle bg-bg-card p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-warning" />
          <h3 className="text-sm font-semibold text-text-primary font-[family-name:var(--font-display)]">
            Better Prompt: {analysis.better_prompt}
          </h3>
        </div>
        <p className="text-xs text-text-dim leading-relaxed">
          {analysis.reasoning}
        </p>
      </motion.div>

      {/* Key differences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border-subtle bg-bg-card p-4"
      >
        <h3 className="text-sm font-semibold text-text-primary font-[family-name:var(--font-display)] mb-3">
          Key Differences
        </h3>
        <ul className="space-y-2">
          {analysis.key_differences.map((diff, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-text-dim">
              <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
              {diff}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Fallback notice */}
      {analysis.fallback && (
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <AlertTriangle className="w-3 h-3" />
          <span>Mock analysis — connect n8n for AI-powered insights</span>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const getColor = () => {
    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-accent';
    if (value >= 40) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-text-muted w-20 shrink-0 font-[family-name:var(--font-mono)]">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-bg-primary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
      <span className="text-[10px] text-text-dim w-8 text-right font-[family-name:var(--font-mono)]">
        {value}
      </span>
    </div>
  );
}

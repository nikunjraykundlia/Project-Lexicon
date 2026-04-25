'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, FileText } from 'lucide-react';
import { useBlockStore } from '@/store/useBlockStore';
import { BLOCK_TYPE_CONFIGS } from '@/lib/blockTypes';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export function PromptPreview() {
  const blocks = useBlockStore((s) => s.blocks);
  const getPromptA = useBlockStore((s) => s.getPromptA);
  const getCompletenessScore = useBlockStore((s) => s.getCompletenessScore);
  const getMissingBlockTypes = useBlockStore((s) => s.getMissingBlockTypes);

  const prompt = getPromptA();
  const score = getCompletenessScore();
  const missing = getMissingBlockTypes();
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    toast.success('Copied to clipboard!');
  };

  const handleExport = () => {
    if (!prompt) return;
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lexicon-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported!');
  };

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <FileText className="w-8 h-8 text-text-muted/40" />
        <p className="text-sm text-text-muted text-center">
          Your assembled prompt will<br />appear here as you add blocks
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Completeness section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProgressRing score={score} size={40} strokeWidth={3} />
          <div>
            <p className="text-sm font-medium text-text-primary">
              {score}/7 Block Types
            </p>
            <p className="text-[10px] text-text-muted">
              {score === 7 ? 'Complete composition!' : `Missing: ${missing.map((t) => BLOCK_TYPE_CONFIGS[t].label).join(', ')}`}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
          <Copy className="w-3.5 h-3.5" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport} className="flex-1">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      {/* Color-coded prompt segments */}
      <div className="rounded-lg bg-bg-primary border border-border-subtle p-4 space-y-3">
        {sortedBlocks.map((block, index) => {
          const config = BLOCK_TYPE_CONFIGS[block.type];
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-1"
            >
              <Badge label={config.label} color={config.color} icon={config.icon} size="sm" />
              <pre className="text-xs text-text-dim font-[family-name:var(--font-mono)] whitespace-pre-wrap leading-relaxed pl-2 border-l-2"
                style={{ borderColor: `${config.color}30` }}
              >
                {block.content}
              </pre>
            </motion.div>
          );
        })}
      </div>

      {/* Raw prompt */}
      <details className="group">
        <summary className="text-[10px] text-text-muted cursor-pointer hover:text-text-dim transition-colors uppercase tracking-widest">
          Raw Prompt
        </summary>
        <pre className="mt-2 text-xs text-text-dim font-[family-name:var(--font-mono)] whitespace-pre-wrap bg-bg-primary border border-border-subtle rounded-lg p-3 max-h-[200px] overflow-y-auto leading-relaxed">
          {prompt}
        </pre>
      </details>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowLeft } from 'lucide-react';

export function EmptyCanvasState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6"
    >
      {/* Animated icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center"
      >
        <Layers className="w-8 h-8 text-accent/40" />
      </motion.div>

      {/* Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-text-dim font-[family-name:var(--font-display)]">
          Start Composing
        </h3>
        <p className="text-sm text-text-muted max-w-xs">
          Click blocks from the palette on the left to start building your prompt composition.
        </p>
      </div>

      {/* Arrow hint */}
      <motion.div
        animate={{ x: [-5, 0, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex items-center gap-2 text-xs text-text-muted"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Select block types from the palette</span>
      </motion.div>
    </motion.div>
  );
}

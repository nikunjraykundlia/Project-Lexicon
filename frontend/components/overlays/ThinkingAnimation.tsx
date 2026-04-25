'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STAGES = [
  'Analyzing structure...',
  'Comparing compositions...',
  'Evaluating clarity...',
  'Scoring specificity...',
  'Generating insights...',
];

export function ThinkingAnimation() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-accent"
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Stage label */}
      <motion.p
        key={stageIndex}
        className="text-sm text-text-dim font-[family-name:var(--font-mono)]"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {STAGES[stageIndex]}
      </motion.p>

      {/* Indeterminate progress bar */}
      <div className="w-48 h-0.5 bg-bg-card rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ width: '60%' }}
        />
      </div>
    </div>
  );
}

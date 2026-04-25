'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { BLOCK_TYPE_LIST } from '@/lib/blockTypes';
import { useBlockStore } from '@/store/useBlockStore';
import { BlockType } from '@/types';
import { toast } from 'sonner';

export function BlockPalette() {
  const blocks = useBlockStore((s) => s.blocks);
  const addBlock = useBlockStore((s) => s.addBlock);

  const handleAddBlock = (type: BlockType) => {
    if (blocks.some((b) => b.type === type)) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} block already exists.`);
      return;
    }
    addBlock(type);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} block added`);
  };

  return (
    <div className="space-y-1.5">
      {BLOCK_TYPE_LIST.map((config, index) => {
        const isAdded = blocks.some((b) => b.type === config.type);
        
        return (
          <motion.button
            key={config.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => handleAddBlock(config.type)}
            disabled={isAdded}
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
              isAdded
                ? 'opacity-30 cursor-not-allowed border-transparent bg-transparent grayscale'
                : 'border-transparent hover:border-border-subtle bg-transparent hover:bg-white/[0.02] cursor-pointer'
            }`}
            whileHover={isAdded ? {} : { y: -1 }}
            whileTap={isAdded ? {} : { scale: 0.98 }}
          >
          {/* Color bar */}
          <div
            className="w-[3px] h-6 rounded-full transition-all group-hover:h-7"
            style={{ backgroundColor: config.color }}
          />

          {/* Icon */}
          <span className="text-sm w-5 text-center" style={{ color: config.color }}>
            {config.icon}
          </span>

          {/* Label */}
          <span className="text-sm text-text-dim group-hover:text-text-primary transition-colors font-medium flex-1 text-left">
            {config.label}
          </span>

          {/* Drag hint */}
          {!isAdded && (
            <span className="text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity mr-1">
              Click to add
            </span>
          )}
          <GripVertical
            className={`w-3.5 h-3.5 transition-opacity ${
              isAdded ? 'opacity-0 text-text-muted/30' : 'text-text-muted opacity-0 group-hover:opacity-60'
            }`}
          />
        </motion.button>
        );
      })}
    </div>
  );
}

'use client';

import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import {
  GripVertical,
  X,
  Copy,
  ChevronDown,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Block } from '@/types';
import { useBlockStore } from '@/store/useBlockStore';
import { BLOCK_TYPE_CONFIGS } from '@/lib/blockTypes';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';

interface BlockCardProps {
  block: Block;
}

export function BlockCard({ block }: BlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const updateBlock = useBlockStore((s) => s.updateBlock);
  const removeBlock = useBlockStore((s) => s.removeBlock);
  const selectBlock = useBlockStore((s) => s.selectBlock);
  const selectedBlockId = useBlockStore((s) => s.selectedBlockId);
  const variantBExclusions = useBlockStore((s) => s.variantBExclusions);
  const toggleVariantBExclusion = useBlockStore((s) => s.toggleVariantBExclusion);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const config = BLOCK_TYPE_CONFIGS[block.type];
  const isSelected = selectedBlockId === block.id;
  const isExcluded = variantBExclusions.includes(block.id);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [block.content]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scaleY: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      layout
      className={`group rounded-xl border transition-all duration-200 ${
        isDragging
          ? 'opacity-30'
          : isSelected
          ? `border-border-active bg-bg-card shadow-lg block-glow-${block.type}`
          : 'border-border-subtle bg-bg-card/60 hover:border-border-active hover:bg-bg-card'
      }`}
      onClick={() => selectBlock(block.id)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border-subtle/50">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-0.5 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-dim transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Color bar */}
        <div
          className="w-[3px] h-5 rounded-full"
          style={{ backgroundColor: config.color }}
        />

        {/* Type badge */}
        <Badge label={config.label} color={config.color} icon={config.icon} />

        <div className="flex-1" />

        {/* Variant B toggle */}
        <Tooltip content={isExcluded ? 'Excluded from Variant B' : 'Included in Variant B'}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleVariantBExclusion(block.id);
            }}
            className={`p-1 rounded transition-all cursor-pointer ${
              isExcluded
                ? 'text-text-muted opacity-50'
                : 'text-accent-violet'
            }`}
          >
            {isExcluded ? (
              <ToggleLeft className="w-4 h-4" />
            ) : (
              <ToggleRight className="w-4 h-4" />
            )}
          </button>
        </Tooltip>

        {/* Collapse toggle */}
        <Tooltip content={block.isCollapsed ? 'Expand' : 'Collapse'}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateBlock(block.id, { isCollapsed: !block.isCollapsed });
            }}
            className="p-1 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            {block.isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Remove */}
        <Tooltip content="Remove">
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeBlock(block.id);
            }}
            className="p-1 rounded text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>

      {/* Body */}
      {!block.isCollapsed && (
        <div className="px-4 py-3">
          <textarea
            ref={textareaRef}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            className="auto-grow-textarea"
            placeholder={`Enter ${config.label.toLowerCase()} content...`}
            onClick={(e) => e.stopPropagation()}
            rows={2}
          />
        </div>
      )}
    </motion.div>
  );
}

// Drag overlay version (translucent ghost)
export function BlockCardOverlay({ block }: { block: Block }) {
  const config = BLOCK_TYPE_CONFIGS[block.type];

  return (
    <div
      className={`rounded-xl border border-border-active bg-bg-card shadow-2xl opacity-90 block-glow-${block.type}`}
      style={{
        transform: 'rotate(1deg) scale(1.03)',
        width: '100%',
        maxWidth: '768px',
      }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical className="w-4 h-4 text-text-muted" />
        <div
          className="w-[3px] h-5 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <Badge label={config.label} color={config.color} icon={config.icon} />
      </div>
      <div className="px-4 py-3 text-sm text-text-dim font-[family-name:var(--font-mono)] line-clamp-2">
        {block.content}
      </div>
    </div>
  );
}

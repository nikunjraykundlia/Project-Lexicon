'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { useBlockStore } from '@/store/useBlockStore';
import { BlockCard, BlockCardOverlay } from '@/components/canvas/BlockCard';
import { EmptyCanvasState } from '@/components/canvas/EmptyCanvasState';
import { Trash2 } from 'lucide-react';

export function BlockCanvas() {
  const blocks = useBlockStore((s) => s.blocks);
  const reorderBlocks = useBlockStore((s) => s.reorderBlocks);
  const clearCanvas = useBlockStore((s) => s.clearCanvas);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeBlock = activeId
    ? blocks.find((b) => b.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      {/* Canvas header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
        <div>
          <h1 className="text-lg font-semibold font-[family-name:var(--font-display)] text-text-primary">
            Composition Canvas
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            {blocks.length === 0
              ? 'Add blocks from the palette to start'
              : `${blocks.length} block${blocks.length !== 1 ? 's' : ''} · Drag to reorder`}
          </p>
        </div>
        {blocks.length > 0 && (
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-y-auto p-6 dot-grid">
        {blocks.length === 0 ? (
          <EmptyCanvasState />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 max-w-3xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {blocks.map((block) => (
                    <BlockCard key={block.id} block={block} />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>

            <DragOverlay>
              {activeBlock ? (
                <BlockCardOverlay block={activeBlock} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}

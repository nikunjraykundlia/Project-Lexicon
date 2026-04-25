'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Block, BlockType } from '@/types';
import { BLOCK_TYPE_CONFIGS } from '@/lib/blockTypes';
import {
  assemblePrompt,
  assemblePromptB,
  getCompositionFingerprint,
  getCompletenessScore,
} from '@/lib/promptAssembler';
import { BLOCK_TYPES } from '@/types';

interface BlockState {
  blocks: Block[];
  selectedBlockId: string | null;
  variantBExclusions: string[];

  // Derived getters
  getPromptA: () => string;
  getPromptB: () => string;
  getCompletenessScore: () => number;
  getCompositionFingerprint: () => string;
  getMissingBlockTypes: () => BlockType[];

  // Actions
  addBlock: (type: BlockType) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  updateBlock: (id: string, patch: Partial<Block>) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  toggleVariantBExclusion: (id: string) => void;
  loadTemplate: (blocks: Block[]) => void;
  clearCanvas: () => void;
  selectBlock: (id: string | null) => void;
}

function generateId(): string {
  return crypto.randomUUID();
}

export const useBlockStore = create<BlockState>()(
  persist(
    (set, get) => ({
      blocks: [],
      selectedBlockId: null,
      variantBExclusions: [],

      getPromptA: () => assemblePrompt(get().blocks),

      getPromptB: () =>
        assemblePromptB(
          get().blocks,
          new Set(get().variantBExclusions)
        ),

      getCompletenessScore: () =>
        getCompletenessScore(get().blocks),

      getCompositionFingerprint: () =>
        getCompositionFingerprint(get().blocks),

      getMissingBlockTypes: () => {
        const present = new Set(get().blocks.map((b) => b.type));
        return BLOCK_TYPES.filter((t) => !present.has(t));
      },

      addBlock: (type: BlockType) => {
        const config = BLOCK_TYPE_CONFIGS[type];
        const currentBlocks = get().blocks;
        const newBlock: Block = {
          id: generateId(),
          type,
          title: config.label,
          content: config.defaultContent,
          order: currentBlocks.length,
          isCollapsed: false,
          isIncludedInVariantB: true,
          colorToken: config.color,
        };
        set({ blocks: [...currentBlocks, newBlock] });
      },

      removeBlock: (id: string) => {
        set((state) => ({
          blocks: state.blocks
            .filter((b) => b.id !== id)
            .map((b, i) => ({ ...b, order: i })),
          selectedBlockId:
            state.selectedBlockId === id ? null : state.selectedBlockId,
          variantBExclusions: state.variantBExclusions.filter(
            (exId) => exId !== id
          ),
        }));
      },

      duplicateBlock: (id: string) => {
        const state = get();
        const block = state.blocks.find((b) => b.id === id);
        if (!block) return;

        const newBlock: Block = {
          ...block,
          id: generateId(),
          order: state.blocks.length,
          title: `${block.title} (copy)`,
        };
        set({ blocks: [...state.blocks, newBlock] });
      },

      updateBlock: (id: string, patch: Partial<Block>) => {
        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === id ? { ...b, ...patch } : b
          ),
        }));
      },

      reorderBlocks: (activeId: string, overId: string) => {
        set((state) => {
          const blocks = [...state.blocks];
          const oldIndex = blocks.findIndex((b) => b.id === activeId);
          const newIndex = blocks.findIndex((b) => b.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const [moved] = blocks.splice(oldIndex, 1);
          blocks.splice(newIndex, 0, moved);

          return {
            blocks: blocks.map((b, i) => ({ ...b, order: i })),
          };
        });
      },

      toggleVariantBExclusion: (id: string) => {
        set((state) => {
          const exclusions = new Set(state.variantBExclusions);
          if (exclusions.has(id)) {
            exclusions.delete(id);
          } else {
            exclusions.add(id);
          }
          return { variantBExclusions: Array.from(exclusions) };
        });
      },

      loadTemplate: (blocks: Block[]) => {
        set({
          blocks: blocks.map((b, i) => ({ ...b, order: i })),
          selectedBlockId: null,
          variantBExclusions: [],
        });
      },

      clearCanvas: () => {
        set({
          blocks: [],
          selectedBlockId: null,
          variantBExclusions: [],
        });
      },

      selectBlock: (id: string | null) => {
        set({ selectedBlockId: id });
      },
    }),
    {
      name: 'lexicon-blocks',
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          return sessionStorage;
        }
      }),
      partialize: (state) => ({
        blocks: state.blocks,
        variantBExclusions: state.variantBExclusions,
      }),
    }
  )
);

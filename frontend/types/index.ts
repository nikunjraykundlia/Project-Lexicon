import { z } from 'zod/v4';

// ─── Block Types ────────────────────────────────────────────
export const BLOCK_TYPES = [
  'role',
  'context',
  'constraint',
  'format',
  'tone',
  'example',
  'output_length',
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

// ─── Zod Schemas ────────────────────────────────────────────
export const BlockSchema = z.object({
  id: z.string(),
  type: z.enum(BLOCK_TYPES),
  title: z.string().optional(),
  content: z.string(),
  order: z.number(),
  isCollapsed: z.boolean(),
  isIncludedInVariantB: z.boolean(),
  colorToken: z.string(),
});

export const SaveTemplateSchema = z.object({
  name: z.string().min(1).max(80),
  blocks: z.array(BlockSchema),
});

export const CompareRequestSchema = z.object({
  promptA: z.string().min(1),
  promptB: z.string(),
  blocksA: z.array(z.string()),
  blocksB: z.array(z.string()),
});

// ─── TypeScript Types ───────────────────────────────────────
export type Block = z.infer<typeof BlockSchema>;

export type Template = {
  _id: string;
  name: string;
  blocks: Block[];
  promptA?: string;
  blockCount?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type HistoryEntry = {
  _id: string;
  promptA: string;
  promptB?: string;
  blocks: Block[];
  blockCount: number;
  compositionFingerprint: string;
  userId: string;
  createdAt: string;
};

export type DiffSegment = {
  type: 'added' | 'deleted' | 'unchanged';
  text: string;
};

export type DiffStats = {
  added: number;
  deleted: number;
  unchanged: number;
  percentChanged: number;
};

export type LLMResult = {
  better_prompt: 'A' | 'B';
  reasoning: string;
  scores: {
    clarityA: number;
    clarityB: number;
    specificityA: number;
    specificityB: number;
  };
  key_differences: string[];
  fallback?: boolean;
};

export type LoadingState = 'idle' | 'skeleton' | 'thinking' | 'success' | 'error';

export type TabType = 'preview' | 'compare' | 'response';

export type BlockTypeConfig = {
  type: BlockType;
  color: string;
  icon: string;
  label: string;
  defaultContent: string;
};

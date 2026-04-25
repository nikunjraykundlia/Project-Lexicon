import { Block } from '@/types';
import { BLOCK_TYPE_CONFIGS } from './blockTypes';

/**
 * Assembles a prompt string from an array of blocks.
 * Each block is prefixed with its type label in brackets.
 */
export function assemblePrompt(blocks: Block[]): string {
  if (blocks.length === 0) return '';

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return sorted
    .map((block) => {
      const config = BLOCK_TYPE_CONFIGS[block.type];
      const label = block.title || config.label;
      return `[${label}]\n${block.content}`;
    })
    .join('\n\n');
}

/**
 * Assembles Prompt B by excluding blocks not in Variant B.
 */
export function assemblePromptB(
  blocks: Block[],
  exclusions: Set<string>
): string {
  const includedBlocks = blocks.filter(
    (block) => !exclusions.has(block.id)
  );
  return assemblePrompt(includedBlocks);
}

/**
 * Creates a composition fingerprint from block types.
 * Used for mapping to mock responses.
 */
export function getCompositionFingerprint(blocks: Block[]): string {
  const types = blocks
    .map((b) => b.type)
    .sort()
    .join('-');
  return types || 'empty';
}

/**
 * Returns the set of unique block types present.
 */
export function getUniqueBlockTypes(blocks: Block[]): Set<string> {
  return new Set(blocks.map((b) => b.type));
}

/**
 * Returns how many of the 7 block types are represented (0–7).
 */
export function getCompletenessScore(blocks: Block[]): number {
  return getUniqueBlockTypes(blocks).size;
}

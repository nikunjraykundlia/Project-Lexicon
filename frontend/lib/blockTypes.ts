import { BlockTypeConfig, BlockType } from '@/types';

export const BLOCK_TYPE_CONFIGS: Record<BlockType, BlockTypeConfig> = {
  role: {
    type: 'role',
    color: '#3B9EFF',
    icon: '◈',
    label: 'Role',
    defaultContent: 'You are a helpful assistant specialized in...',
  },
  context: {
    type: 'context',
    color: '#A78BFA',
    icon: '◎',
    label: 'Context',
    defaultContent: 'The user is working on...',
  },
  constraint: {
    type: 'constraint',
    color: '#F59E0B',
    icon: '⬡',
    label: 'Constraint',
    defaultContent: 'You must not...',
  },
  format: {
    type: 'format',
    color: '#10B981',
    icon: '▦',
    label: 'Format',
    defaultContent: 'Respond in the following format...',
  },
  tone: {
    type: 'tone',
    color: '#EC4899',
    icon: '◉',
    label: 'Tone',
    defaultContent: 'Use a professional and concise tone...',
  },
  example: {
    type: 'example',
    color: '#F97316',
    icon: '◆',
    label: 'Example',
    defaultContent: 'Here is an example of the expected output...',
  },
  output_length: {
    type: 'output_length',
    color: '#06B6D4',
    icon: '◧',
    label: 'Output Length',
    defaultContent: 'Keep the response under 500 words...',
  },
};

export const BLOCK_TYPE_LIST = Object.values(BLOCK_TYPE_CONFIGS);

export function getBlockConfig(type: BlockType): BlockTypeConfig {
  return BLOCK_TYPE_CONFIGS[type];
}

import { LLMResult } from '@/types';

/**
 * Mock responses keyed by composition fingerprint.
 * Used when n8n webhook is not configured.
 */
const MOCK_RESPONSES: Record<string, LLMResult> = {
  'context-constraint-example-format-output_length-role-tone': {
    better_prompt: 'A',
    reasoning:
      'Prompt A is the superior composition. It covers all 7 structural dimensions — role definition, contextual grounding, behavioral constraints, output formatting, tonal calibration, concrete examples, and length bounds. This level of completeness dramatically reduces ambiguity for the model, leading to more predictable and higher-quality outputs.',
    scores: {
      clarityA: 95,
      clarityB: 60,
      specificityA: 92,
      specificityB: 55,
    },
    key_differences: [
      'Prompt A provides explicit role definition, anchoring the model\'s persona',
      'Prompt A includes concrete examples that calibrate expected output quality',
      'Prompt A specifies output length constraints, preventing verbose responses',
      'Prompt B lacks structural completeness, leading to potential ambiguity',
    ],
    fallback: true,
  },
  'context-role': {
    better_prompt: 'A',
    reasoning:
      'While both prompts have a role and context, Prompt A provides a more complete foundation. Consider adding constraint, format, and tone blocks for a significantly stronger prompt.',
    scores: {
      clarityA: 70,
      clarityB: 45,
      specificityA: 65,
      specificityB: 40,
    },
    key_differences: [
      'Both prompts are missing critical structural elements',
      'Adding format blocks would improve output consistency',
      'Constraint blocks would prevent unwanted behaviors',
    ],
    fallback: true,
  },
  'role': {
    better_prompt: 'A',
    reasoning:
      'A single role block provides basic persona definition but lacks the structural depth needed for reliable outputs. Add context, constraints, and format blocks.',
    scores: {
      clarityA: 50,
      clarityB: 20,
      specificityA: 45,
      specificityB: 15,
    },
    key_differences: [
      'Minimal prompt structure — high ambiguity risk',
      'No output format specification',
      'No behavioral constraints defined',
    ],
    fallback: true,
  },
  empty: {
    better_prompt: 'A',
    reasoning:
      'No blocks have been added yet. Start by adding a Role block to define the AI\'s persona, then add Context to ground the conversation.',
    scores: {
      clarityA: 0,
      clarityB: 0,
      specificityA: 0,
      specificityB: 0,
    },
    key_differences: [
      'Empty canvas — add blocks to begin',
    ],
    fallback: true,
  },
};

/**
 * Default fallback response when no fingerprint match is found.
 */
const DEFAULT_MOCK: LLMResult = {
  better_prompt: 'A',
  reasoning:
    'Prompt A has a stronger structural composition with more block types represented. The additional blocks provide the model with clearer boundaries and expectations, reducing output variance. Consider completing all 7 block types for maximum prompt effectiveness.',
  scores: {
    clarityA: 78,
    clarityB: 52,
    specificityA: 74,
    specificityB: 48,
  },
  key_differences: [
    'Prompt A covers more structural dimensions',
    'Additional block types reduce model ambiguity',
    'Format and constraint blocks significantly improve output quality',
  ],
  fallback: true,
};

/**
 * Get a mock analysis response based on the composition fingerprint.
 */
export function getMockAnalysis(fingerprint: string): LLMResult {
  return MOCK_RESPONSES[fingerprint] || DEFAULT_MOCK;
}

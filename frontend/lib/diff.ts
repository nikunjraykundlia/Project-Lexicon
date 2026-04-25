import { DiffSegment, DiffStats } from '@/types';

/**
 * Build the LCS (Longest Common Subsequence) dynamic programming table.
 * O(n * m) time and space.
 */
function lcsMatrix(a: string[], b: string[]): number[][] {
  const n = a.length;
  const m = b.length;
  const table: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1;
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
      }
    }
  }

  return table;
}

/**
 * Backtrack through the LCS table to produce diff segments.
 */
function backtrack(
  a: string[],
  b: string[],
  table: number[][]
): DiffSegment[] {
  const segments: DiffSegment[] = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      segments.unshift({ type: 'unchanged', text: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || table[i][j - 1] >= table[i - 1][j])) {
      segments.unshift({ type: 'added', text: b[j - 1] });
      j--;
    } else {
      segments.unshift({ type: 'deleted', text: a[i - 1] });
      i--;
    }
  }

  return segments;
}

/**
 * Merge consecutive segments of the same type for cleaner output.
 */
function mergeSegments(segments: DiffSegment[]): DiffSegment[] {
  if (segments.length === 0) return [];

  const merged: DiffSegment[] = [{ ...segments[0] }];

  for (let i = 1; i < segments.length; i++) {
    const last = merged[merged.length - 1];
    if (last.type === segments[i].type) {
      last.text += ' ' + segments[i].text;
    } else {
      merged.push({ ...segments[i] });
    }
  }

  return merged;
}

/**
 * Compute word-level diff between two prompt strings.
 * Returns an array of DiffSegments (added, deleted, unchanged).
 * Pure TypeScript — no external diff library.
 */
export function diffWords(
  promptA: string,
  promptB: string
): DiffSegment[] {
  const wordsA = promptA.split(/\s+/).filter(Boolean);
  const wordsB = promptB.split(/\s+/).filter(Boolean);

  if (wordsA.length === 0 && wordsB.length === 0) return [];
  if (wordsA.length === 0)
    return [{ type: 'added', text: wordsB.join(' ') }];
  if (wordsB.length === 0)
    return [{ type: 'deleted', text: wordsA.join(' ') }];

  const table = lcsMatrix(wordsA, wordsB);
  const segments = backtrack(wordsA, wordsB, table);
  return mergeSegments(segments);
}

/**
 * Compute statistics from diff segments.
 */
export function diffStats(segments: DiffSegment[]): DiffStats {
  let added = 0;
  let deleted = 0;
  let unchanged = 0;

  for (const seg of segments) {
    const wordCount = seg.text.split(/\s+/).filter(Boolean).length;
    switch (seg.type) {
      case 'added':
        added += wordCount;
        break;
      case 'deleted':
        deleted += wordCount;
        break;
      case 'unchanged':
        unchanged += wordCount;
        break;
    }
  }

  const total = added + deleted + unchanged;
  const percentChanged =
    total > 0 ? Math.round(((added + deleted) / total) * 100) : 0;

  return { added, deleted, unchanged, percentChanged };
}

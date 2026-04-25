'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HistoryEntry } from '@/types';

async function fetchHistory(): Promise<{
  history: HistoryEntry[];
  count: number;
}> {
  const res = await fetch('/api/history');
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

async function appendHistory(data: {
  promptA: string;
  promptB?: string;
  blocks: unknown[];
  compositionFingerprint: string;
}): Promise<{ entry: HistoryEntry; message: string }> {
  const res = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save history');
  return res.json();
}

export function useHistory() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['history'],
    queryFn: fetchHistory,
    staleTime: 10_000,
  });

  const appendMutation = useMutation({
    mutationFn: appendHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  return {
    history: query.data?.history ?? [],
    isLoading: query.isLoading,
    appendHistory: appendMutation.mutate,
  };
}

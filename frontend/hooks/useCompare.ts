'use client';

import { useMutation } from '@tanstack/react-query';
import { LLMResult } from '@/types';
import { useUIStore } from '@/store/useUIStore';
import { toast } from 'sonner';

async function runComparison(data: {
  promptA: string;
  promptB: string;
  blocksA: string[];
  blocksB: string[];
}): Promise<LLMResult> {
  const res = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Comparison failed');
  return res.json();
}

export function useCompare() {
  const setLoadingState = useUIStore((s) => s.setLoadingState);
  const setLLMResult = useUIStore((s) => s.setLLMResult);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const mutation = useMutation({
    mutationFn: runComparison,
    onMutate: () => {
      setLoadingState('thinking');
    },
    onSuccess: (data) => {
      setLLMResult(data);
      setLoadingState('success');
      setActiveTab('response');
      if (data.fallback) {
        toast.info('Using mock analysis (n8n not configured)');
      }
    },
    onError: () => {
      setLoadingState('error');
      toast.error('Comparison failed — using fallback analysis');
    },
  });

  return {
    compare: mutation.mutate,
    isComparing: mutation.isPending,
  };
}

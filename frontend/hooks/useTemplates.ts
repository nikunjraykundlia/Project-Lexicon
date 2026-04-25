'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Template } from '@/types';
import { toast } from 'sonner';

async function fetchTemplates(): Promise<{
  templates: Template[];
  count: number;
}> {
  const res = await fetch('/api/templates');
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

async function saveTemplate(data: {
  name: string;
  blocks: unknown[];
}): Promise<{ template: Template; message: string }> {
  const res = await fetch('/api/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save template');
  return res.json();
}

async function deleteTemplate(
  id: string
): Promise<{ message: string; id: string }> {
  const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete template');
  return res.json();
}

export function useTemplates() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
    staleTime: 30_000,
  });

  const saveMutation = useMutation({
    mutationFn: saveTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template saved!');
    },
    onError: () => {
      toast.error('Failed to save template');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template deleted');
    },
    onError: () => {
      toast.error('Failed to delete template');
    },
  });

  return {
    templates: query.data?.templates ?? [],
    isLoading: query.isLoading,
    saveTemplate: saveMutation.mutate,
    deleteTemplate: deleteMutation.mutate,
    isSaving: saveMutation.isPending,
  };
}

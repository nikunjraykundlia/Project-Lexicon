'use client';

import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BlockCanvas } from '@/components/canvas/BlockCanvas';
import { RightPanel } from '@/components/layout/RightPanel';
import { useBlockStore } from '@/store/useBlockStore';
import { useTemplates } from '@/hooks/useTemplates';
import { useHydrated } from '@/hooks/useHydrated';
import { SkeletonLayout } from '@/components/overlays/SkeletonLayout';
import { toast } from 'sonner';

export function CanvasClient() {
  const hydrated = useHydrated();
  const blocks = useBlockStore((s) => s.blocks);
  const getPromptA = useBlockStore((s) => s.getPromptA);
  const { saveTemplate } = useTemplates();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;

      // ⌘+S — Save template
      if (isCmd && e.key === 's') {
        e.preventDefault();
        if (blocks.length > 0) {
          const name = window.prompt('Template name:');
          if (name) saveTemplate({ name, blocks });
        }
      }

      // ⌘+E — Export .txt
      if (isCmd && e.key === 'e') {
        e.preventDefault();
        const promptText = getPromptA();
        if (promptText) {
          const blob = new Blob([promptText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'lexicon-prompt.txt';
          a.click();
          URL.revokeObjectURL(url);
          toast.success('Exported!');
        }
      }

      // Escape — Deselect block
      if (e.key === 'Escape') {
        useBlockStore.getState().selectBlock(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [blocks, saveTemplate, getPromptA]);

  // Show skeleton until hydrated to prevent SSR mismatch
  if (!hydrated) {
    return (
      <div className="flex flex-col h-screen">
        <div className="h-16 glass" />
        <SkeletonLayout />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar />
        <BlockCanvas />
        <RightPanel />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, GitCompare, MessageSquare } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { PromptPreview } from '@/components/panels/PromptPreview';
import { DiffViewer } from '@/components/panels/DiffViewer';
import { ResponsePanel } from '@/components/panels/ResponsePanel';
import { TabType } from '@/types';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'preview', label: 'Preview', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'compare', label: 'Compare', icon: <GitCompare className="w-3.5 h-3.5" /> },
  { id: 'response', label: 'Response', icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

export function RightPanel() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  return (
    <div className="w-[380px] h-full border-l border-border-subtle bg-bg-secondary/50 flex flex-col overflow-hidden shrink-0">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 pt-4 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-dim'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="panel-tab"
                className="absolute inset-0 bg-white/[0.06] rounded-lg border border-border-subtle"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'preview' && <PromptPreview />}
            {activeTab === 'compare' && <DiffViewer />}
            {activeTab === 'response' && <ResponsePanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

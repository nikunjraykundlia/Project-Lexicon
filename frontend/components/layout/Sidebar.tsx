'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, FileText, ChevronRight } from 'lucide-react';
import { BlockPalette } from '@/components/canvas/BlockPalette';
import { useTemplates } from '@/hooks/useTemplates';
import { useBlockStore } from '@/store/useBlockStore';
import { useUIStore } from '@/store/useUIStore';
import { Block } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';
import { toast } from 'sonner';

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const { templates, isLoading, deleteTemplate } = useTemplates();
  const loadTemplate = useBlockStore((s) => s.loadTemplate);

  const handleLoadTemplate = (blocks: Block[]) => {
    loadTemplate(blocks);
    toast.success('Template loaded!');
  };

  return (
    <>
      {/* Toggle button when collapsed */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed left-0 top-20 z-40 p-2 bg-bg-card border border-border-subtle rounded-r-lg text-text-dim hover:text-text-primary cursor-pointer transition-colors"
          onClick={toggleSidebar}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-[280px] h-full border-r border-border-subtle bg-bg-secondary/50 flex flex-col overflow-hidden shrink-0"
          >
            {/* Block Palette Section */}
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-text-muted font-[family-name:var(--font-ui)]">
                  Block Palette
                </h2>
                <button
                  onClick={toggleSidebar}
                  className="p-1 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>

              <BlockPalette />

              {/* Templates Section */}
              <div className="mt-6 pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-3.5 h-3.5 text-text-muted" />
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-text-muted font-[family-name:var(--font-ui)]">
                    Templates
                  </h2>
                </div>

                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton h-14 rounded-lg" />
                    ))}
                  </div>
                ) : templates.length === 0 ? (
                  <p className="text-xs text-text-muted py-4 text-center">
                    No saved templates yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <motion.div
                        key={template._id}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group flex items-center gap-2 p-3 rounded-lg border border-border-subtle bg-bg-card/50 hover:border-border-active transition-all cursor-pointer"
                        onClick={() =>
                          handleLoadTemplate(template.blocks as unknown as Block[])
                        }
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary truncate font-medium">
                            {template.name}
                          </p>
                          <p className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(template.createdAt).toLocaleDateString()}
                            <span className="mx-1">·</span>
                            {template.blockCount || template.blocks.length} blocks
                          </p>
                        </div>
                        <Tooltip content="Delete template">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTemplate(template._id);
                            }}
                            className="p-1.5 rounded opacity-0 group-hover:opacity-100 text-text-muted hover:text-error hover:bg-error/10 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </Tooltip>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

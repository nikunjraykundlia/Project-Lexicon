'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Hexagon,
  Home,
  Layout,
  GitCompare,
  Clock,
  Save,
  Zap,
  Download,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Tooltip } from '@/components/ui/Tooltip';
import { useBlockStore } from '@/store/useBlockStore';
import { useUIStore } from '@/store/useUIStore';
import { useTemplates } from '@/hooks/useTemplates';
import { toast } from 'sonner';

export function Navbar() {
  const pathname = usePathname();
  const blocks = useBlockStore((s) => s.blocks);
  const getCompletenessScore = useBlockStore((s) => s.getCompletenessScore);
  const getPromptA = useBlockStore((s) => s.getPromptA);
  const aiModeEnabled = useUIStore((s) => s.aiModeEnabled);
  const toggleAIMode = useUIStore((s) => s.toggleAIMode);
  const { saveTemplate, isSaving } = useTemplates();
  const [templateName, setTemplateName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const isCanvas = pathname === '/canvas';

  const handleSave = () => {
    if (blocks.length === 0) {
      toast.error('Add blocks before saving');
      return;
    }
    setShowSaveModal(true);
  };

  const handleSaveConfirm = () => {
    if (!templateName.trim()) {
      toast.error('Enter a template name');
      return;
    }
    saveTemplate({ name: templateName.trim(), blocks });
    setTemplateName('');
    setShowSaveModal(false);
  };

  const handleCopy = () => {
    const prompt = getPromptA();
    if (!prompt) {
      toast.error('No prompt to copy');
      return;
    }
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard!');
  };

  const handleExport = () => {
    const prompt = getPromptA();
    if (!prompt) {
      toast.error('No prompt to export');
      return;
    }
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lexicon-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Prompt exported!');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/canvas', label: 'Canvas', icon: Layout },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full flex-none h-16 glass border-b border-border-subtle">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 60 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Hexagon className="w-6 h-6 text-accent" strokeWidth={2.5} />
            </motion.div>
            <span className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tight">
              Lexicon
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'text-text-primary'
                      : 'text-text-dim hover:text-text-primary hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-white/[0.06] rounded-lg border border-border-subtle"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isCanvas && (
              <>
                <Tooltip content={`${getCompletenessScore()}/7 block types`}>
                  <ProgressRing score={getCompletenessScore()} />
                </Tooltip>

                <Tooltip content="Copy prompt">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg text-text-dim hover:text-text-primary hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Export .txt">
                  <button
                    onClick={handleExport}
                    className="p-2 rounded-lg text-text-dim hover:text-text-primary hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content={aiModeEnabled ? 'AI Mode ON' : 'AI Mode OFF'}>
                  <button
                    onClick={toggleAIMode}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      aiModeEnabled
                        ? 'text-accent bg-accent/10 shadow-lg shadow-accent/20'
                        : 'text-text-dim hover:text-text-primary hover:bg-white/[0.05]'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || blocks.length === 0}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Save modal overlay */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-[400px] space-y-4"
          >
            <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">
              Save Template
            </h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              className="w-full px-4 py-2.5 bg-bg-primary border border-border-subtle rounded-lg text-sm text-text-primary focus:border-border-active focus:outline-none transition-colors"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveConfirm()}
              maxLength={80}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveConfirm}>
                Save
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

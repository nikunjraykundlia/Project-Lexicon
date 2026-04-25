'use client';

import { create } from 'zustand';
import { DiffSegment, LLMResult, LoadingState, TabType } from '@/types';

interface UIState {
  activeTab: TabType;
  loadingState: LoadingState;
  compareMode: boolean;
  diffResult: DiffSegment[];
  llmResult: LLMResult | null;
  aiModeEnabled: boolean;
  historyPanelOpen: boolean;
  sidebarOpen: boolean;

  // Actions
  setActiveTab: (tab: TabType) => void;
  setLoadingState: (state: LoadingState) => void;
  setCompareMode: (mode: boolean) => void;
  setDiffResult: (result: DiffSegment[]) => void;
  setLLMResult: (result: LLMResult | null) => void;
  toggleAIMode: () => void;
  toggleHistoryPanel: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  activeTab: 'preview',
  loadingState: 'idle',
  compareMode: false,
  diffResult: [],
  llmResult: null,
  aiModeEnabled: false,
  historyPanelOpen: false,
  sidebarOpen: true,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoadingState: (loadingState) => set({ loadingState }),
  setCompareMode: (compareMode) => set({ compareMode }),
  setDiffResult: (diffResult) => set({ diffResult }),
  setLLMResult: (llmResult) => set({ llmResult }),
  toggleAIMode: () => set((s) => ({ aiModeEnabled: !s.aiModeEnabled })),
  toggleHistoryPanel: () =>
    set((s) => ({ historyPanelOpen: !s.historyPanelOpen })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

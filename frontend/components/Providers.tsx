'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            border: '1px solid rgba(99, 179, 237, 0.10)',
            color: '#F0F6FF',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
          },
        }}
      />
    </QueryClientProvider>
  );
}

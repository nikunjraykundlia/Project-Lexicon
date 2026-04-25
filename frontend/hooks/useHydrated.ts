'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to suppress hydration warnings from Zustand persist middleware.
 * Returns false during SSR and first render, true after hydration.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

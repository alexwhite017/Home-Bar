"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cocktail-bar-inventory";

export function useInventory() {
  const [ids, setIds] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Initial load from localStorage on mount. Runs once, only in the browser.
  // The lint rule warns against setState in effects, but this is the standard
  // SSR-safe pattern for hydrating from a browser-only API.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as number[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIds(new Set(arr));
      }
    } catch {
      // ignore — corrupt or unavailable storage just means empty bar
    }
    setHydrated(true);
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  }, [ids, hydrated]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addMany = useCallback((newIds: Iterable<number>) => {
    setIds((prev) => {
      const next = new Set(prev);
      for (const id of newIds) next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setIds(new Set()), []);

  return { ids, toggle, addMany, clear, hydrated };
}

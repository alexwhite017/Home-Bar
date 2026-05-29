"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cocktail-favorites";

export function useFavorites() {
  const [ids, setIds] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as number[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIds(new Set(arr));
      }
    } catch {
      // ignore — corrupt storage just means no favorites
    }
    setHydrated(true);
  }, []);

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

  return { ids, toggle, hydrated };
}

"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cocktail-notes";

function loadNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function useRecipeNote(recipeId: number) {
  const [note, setNoteState] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const notes = loadNotes();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNoteState(notes[String(recipeId)] ?? "");
    setHydrated(true);
  }, [recipeId]);

  // Debounced persist
  useEffect(() => {
    if (!hydrated) return;
    const handle = setTimeout(() => {
      const notes = loadNotes();
      if (note.trim()) notes[String(recipeId)] = note;
      else delete notes[String(recipeId)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch {
        // ignore
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [note, recipeId, hydrated]);

  const setNote = useCallback((v: string) => setNoteState(v), []);

  return { note, setNote, hydrated };
}

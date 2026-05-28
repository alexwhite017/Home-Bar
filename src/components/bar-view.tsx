"use client";

import { useMemo, useState } from "react";
import { useInventory } from "@/hooks/use-inventory";
import {
  deserializeCatalog,
  type SerializedCatalog,
  type IngredientRow,
} from "@/lib/catalog-types";

const CATEGORY_LABELS: Record<string, string> = {
  spirit: "Spirits",
  liqueur: "Liqueurs",
  fortified_wine: "Fortified wines",
  sparkling_wine: "Sparkling wines",
  wine: "Wines",
  bitters: "Bitters",
  pastis: "Pastis & anise",
  mixer: "Mixers",
  juice: "Juices",
  sweetener: "Sweeteners",
  dairy: "Dairy",
  egg: "Egg",
  garnish: "Garnishes",
  other: "Other",
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);
const MAX_RESULTS = 8;

export function BarView({
  catalog: serialized,
}: {
  catalog: SerializedCatalog;
}) {
  const catalog = useMemo(() => deserializeCatalog(serialized), [serialized]);
  const { ids, toggle, clear, hydrated } = useInventory();
  const [query, setQuery] = useState("");

  const allIngredients = useMemo(
    () => [...catalog.ingredients.values()],
    [catalog],
  );

  const searchResults = useMemo<IngredientRow[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allIngredients
      .filter((i) => !ids.has(i.id) && i.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q);
        const bStarts = b.name.toLowerCase().startsWith(q);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, MAX_RESULTS);
  }, [allIngredients, ids, query]);

  const shelf = useMemo(() => {
    const grouped = new Map<string, IngredientRow[]>();
    for (const id of ids) {
      const ing = catalog.ingredients.get(id);
      if (!ing) continue;
      const arr = grouped.get(ing.category) ?? [];
      arr.push(ing);
      grouped.set(ing.category, arr);
    }
    for (const arr of grouped.values()) {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return grouped;
  }, [catalog, ids]);

  const addAndClear = (id: number) => {
    toggle(id);
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults[0]) addAndClear(searchResults[0].id);
  };

  if (!hydrated) {
    return <div className="p-8 text-sm text-stone-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="sticky top-[65px] z-10 border-b border-stone-200 bg-stone-50/80 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/80">
        <div className="px-4 pb-4 pt-6 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h1 className="font-serif text-3xl italic tracking-tight">
              My Bar
            </h1>
            <span className="text-sm tabular-nums text-stone-500">
              {ids.size} item{ids.size === 1 ? "" : "s"}
              {ids.size > 0 && (
                <>
                  {" · "}
                  <button
                    onClick={clear}
                    className="text-amber-700 hover:underline dark:text-amber-500"
                  >
                    clear
                  </button>
                </>
              )}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-4">
            <input
              type="search"
              placeholder="Search for an ingredient..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              className="w-full rounded-full border border-stone-300 bg-white px-5 py-3 text-base shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-900"
            />
            {searchResults.length > 0 && (
              <ul
                role="listbox"
                className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900"
              >
                {searchResults.map((ing) => (
                  <li key={ing.id}>
                    <button
                      type="button"
                      onClick={() => addAndClear(ing.id)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-amber-50 dark:hover:bg-stone-800"
                    >
                      <span>{ing.name}</span>
                      <span className="shrink-0 text-xs text-stone-400">
                        {CATEGORY_LABELS[ing.category] ?? ing.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.trim() && searchResults.length === 0 && (
              <p className="mt-2 px-2 text-sm text-stone-500">
                No ingredients match &quot;{query}&quot;.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="space-y-7 px-4 py-8 sm:px-6">
        {shelf.size === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 px-6 py-16 text-center dark:border-stone-700">
            <p className="font-serif text-lg italic text-stone-500">
              Your shelf is empty
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Search above to add what you have on hand.
            </p>
          </div>
        ) : (
          CATEGORY_ORDER.filter((c) => shelf.has(c)).map((cat) => (
            <section key={cat}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {shelf.get(cat)!.map((ing) => (
                  <li key={ing.id}>
                    <button
                      onClick={() => toggle(ing.id)}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-rose-800 dark:hover:bg-rose-950/30"
                    >
                      <span>{ing.name}</span>
                      <span
                        className="text-stone-400 transition-colors group-hover:text-rose-600"
                        aria-label="Remove"
                      >
                        ×
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

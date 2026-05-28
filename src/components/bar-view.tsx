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

export function BarView({
  catalog: serialized,
}: {
  catalog: SerializedCatalog;
}) {
  const catalog = useMemo(() => deserializeCatalog(serialized), [serialized]);
  const { ids, toggle, clear, hydrated } = useInventory();
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, IngredientRow[]>();
    for (const ing of catalog.ingredients.values()) {
      if (!map.has(ing.category)) map.set(ing.category, []);
      map.get(ing.category)!.push(ing);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return map;
  }, [catalog]);

  const filtered = useMemo(() => {
    if (!query.trim()) return grouped;
    const q = query.trim().toLowerCase();
    const out = new Map<string, IngredientRow[]>();
    for (const [cat, arr] of grouped) {
      const match = arr.filter((i) => i.name.toLowerCase().includes(q));
      if (match.length > 0) out.set(cat, match);
    }
    return out;
  }, [grouped, query]);

  if (!hydrated) {
    return <div className="p-8 text-sm text-zinc-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">My Bar</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {ids.size} item{ids.size === 1 ? "" : "s"} on your shelf
          {ids.size > 0 && (
            <button
              onClick={clear}
              className="ml-3 text-amber-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </p>
        <input
          type="search"
          placeholder="Search ingredients..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-4 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
      </header>
      <div className="space-y-6">
        {CATEGORY_ORDER.filter((c) => filtered.has(c)).map((cat) => (
          <section key={cat}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {CATEGORY_LABELS[cat]}
            </h2>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {filtered.get(cat)!.map((ing) => (
                <li key={ing.id}>
                  <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <input
                      type="checkbox"
                      checked={ids.has(ing.id)}
                      onChange={() => toggle(ing.id)}
                      className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>{ing.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {filtered.size === 0 && (
          <p className="text-sm text-zinc-500">
            No ingredients match &quot;{query}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}

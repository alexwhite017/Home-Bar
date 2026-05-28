"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useInventory } from "@/hooks/use-inventory";
import {
  deserializeCatalog,
  type SerializedCatalog,
} from "@/lib/catalog-types";
import {
  computeMatches,
  computeNextBuys,
  type MatchResult,
} from "@/lib/matching";

export function HomeView({
  catalog: serialized,
}: {
  catalog: SerializedCatalog;
}) {
  const catalog = useMemo(() => deserializeCatalog(serialized), [serialized]);
  const { ids, hydrated } = useInventory();
  const matches = useMemo(() => computeMatches(catalog, ids), [catalog, ids]);
  const nextBuys = useMemo(
    () => computeNextBuys(catalog, ids, 5),
    [catalog, ids],
  );

  if (!hydrated) {
    return (
      <div className="p-8 text-sm text-stone-500">Loading your bar...</div>
    );
  }

  if (ids.size === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-serif text-4xl italic tracking-tight">
          Your bar is empty
        </h1>
        <p className="mt-4 text-stone-600 dark:text-stone-400">
          Add a few bottles to your shelf and we&apos;ll show you what you can
          pour tonight.
        </p>
        <Link
          href="/bar"
          className="mt-8 inline-flex items-center rounded-full bg-amber-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-amber-800 hover:shadow"
        >
          Set up my bar →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 sm:py-10">
      <Section
        title="Ready to make"
        recipes={matches.canMake}
        accent="emerald"
        emptyMsg="Nothing yet — add a few more bottles."
      />
      <Section
        title="One ingredient away"
        recipes={matches.oneAway}
        accent="amber"
        showMissing
      />
      <Section
        title="Close — 2 or 3 missing"
        recipes={matches.close.slice(0, 12)}
        accent="stone"
        showMissing
      />
      {nextBuys.length > 0 && (
        <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-serif text-lg italic text-stone-700 dark:text-stone-300">
            What to buy next
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Bottles that would unlock the most new recipes
          </p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {nextBuys.map((b) => (
              <li
                key={b.ingredient.id}
                className="flex items-baseline justify-between"
              >
                <span className="font-medium">{b.ingredient.name}</span>
                <span className="text-xs text-stone-500">
                  +{b.unlocks} recipe{b.unlocks === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}

const ACCENT_CLASSES = {
  emerald: "border-emerald-200 hover:border-emerald-400 dark:border-emerald-900/50 dark:hover:border-emerald-600",
  amber: "border-amber-200 hover:border-amber-400 dark:border-amber-900/50 dark:hover:border-amber-600",
  stone: "border-stone-200 hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600",
} as const;

function Section({
  title,
  recipes,
  accent,
  showMissing,
  emptyMsg,
}: {
  title: string;
  recipes: MatchResult[];
  accent: keyof typeof ACCENT_CLASSES;
  showMissing?: boolean;
  emptyMsg?: string;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl italic tracking-tight">
          {title}
        </h2>
        <span className="text-sm tabular-nums text-stone-400">
          {recipes.length}
        </span>
      </div>
      {recipes.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500">
          {emptyMsg ?? "Nothing here."}
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((m) => (
            <li key={m.recipe.id}>
              <Link
                href={`/recipes/${m.recipe.id}`}
                className={`block rounded-xl border bg-white p-4 transition-all hover:shadow-md dark:bg-stone-900 ${ACCENT_CLASSES[accent]}`}
              >
                <div className="font-medium tracking-tight">
                  {m.recipe.name}
                </div>
                {m.recipe.glass && (
                  <div className="mt-0.5 text-xs text-stone-400">
                    {m.recipe.glass}
                  </div>
                )}
                {showMissing && m.missingLines.length > 0 && (
                  <div className="mt-2 text-xs text-stone-500">
                    needs{" "}
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {m.missingLines.map((l) => l.ingredientName).join(", ")}
                    </span>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

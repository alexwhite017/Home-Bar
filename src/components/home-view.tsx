"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useInventory } from "@/hooks/use-inventory";
import {
  deserializeCatalog,
  type SerializedCatalog,
} from "@/lib/catalog-types";
import { computeMatches, computeNextBuys, type MatchResult } from "@/lib/matching";

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
      <div className="p-8 text-sm text-zinc-500">Loading your bar...</div>
    );
  }

  if (ids.size === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your bar is empty</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Add some bottles to your bar to see what you can make.
        </p>
        <Link
          href="/bar"
          className="mt-6 inline-block rounded-full bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          Set up my bar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-8">
      <Section
        title="Ready to make"
        recipes={matches.canMake}
        emptyMsg="Nothing yet — add a few more bottles."
      />
      <Section
        title="One ingredient away"
        recipes={matches.oneAway}
        showMissing
      />
      <Section
        title="Close (2–3 missing)"
        recipes={matches.close.slice(0, 12)}
        showMissing
      />
      {nextBuys.length > 0 && (
        <aside className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Highest-impact next bottles
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            {nextBuys.map((b) => (
              <li key={b.ingredient.id}>
                <span className="font-medium">{b.ingredient.name}</span>
                <span className="ml-2 text-zinc-500">
                  unlocks {b.unlocks} recipe{b.unlocks === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}

function Section({
  title,
  recipes,
  showMissing,
  emptyMsg,
}: {
  title: string;
  recipes: MatchResult[];
  showMissing?: boolean;
  emptyMsg?: string;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold">
        {title}{" "}
        <span className="font-normal text-zinc-400">({recipes.length})</span>
      </h2>
      {recipes.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">
          {emptyMsg ?? "Nothing here."}
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((m) => (
            <li key={m.recipe.id}>
              <Link
                href={`/recipes/${m.recipe.id}`}
                className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-amber-400 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="font-medium">{m.recipe.name}</div>
                {showMissing && m.missingLines.length > 0 && (
                  <div className="mt-1 text-xs text-zinc-500">
                    needs:{" "}
                    {m.missingLines.map((l) => l.ingredientName).join(", ")}
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

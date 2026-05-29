"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInventory } from "@/hooks/use-inventory";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecipeNote } from "@/hooks/use-recipe-note";
import {
  deserializeCatalog,
  type SerializedCatalog,
  type RecipeRow,
} from "@/lib/catalog-types";

export function RecipeDetailView({
  catalog: serialized,
  recipe,
}: {
  catalog: SerializedCatalog;
  recipe: RecipeRow;
}) {
  const catalog = useMemo(() => deserializeCatalog(serialized), [serialized]);
  const { ids, hydrated } = useInventory();
  const { ids: favorites, toggle: toggleFavorite } = useFavorites();
  const isFav = favorites.has(recipe.id);
  const { note, setNote, hydrated: noteHydrated } = useRecipeNote(recipe.id);

  return (
    <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-stone-500 transition-colors hover:text-amber-700 dark:hover:text-amber-500"
      >
        ← Back to matches
      </Link>

      {recipe.imageUrl && (
        <div className="relative mt-6 aspect-[5/3] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm dark:bg-stone-800">
          <Image
            src={recipe.imageUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mt-8 flex items-start justify-between gap-4 border-b border-stone-200 pb-6 dark:border-stone-800">
        <div>
          <h1 className="font-serif text-4xl italic tracking-tight sm:text-5xl">
            {recipe.name}
          </h1>
          {recipe.glass && (
            <p className="mt-2 text-sm text-stone-500">
              Served in a {recipe.glass.toLowerCase()}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(recipe.id)}
          aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
          aria-pressed={isFav}
          className="mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-xl shadow-sm transition-transform hover:scale-110 dark:border-stone-800 dark:bg-stone-900"
        >
          <span className={isFav ? "text-rose-500" : "text-stone-400"}>
            {isFav ? "♥" : "♡"}
          </span>
        </button>
      </header>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Ingredients
        </h2>
        <ul className="mt-4 space-y-1.5">
          {recipe.lines.map((line, i) => {
            const satisfiers =
              catalog.satisfiers.get(line.ingredientId) ?? new Set<number>();
            let satisfiedBy: string | null = null;
            if (hydrated) {
              for (const id of satisfiers) {
                if (ids.has(id)) {
                  satisfiedBy = catalog.ingredients.get(id)?.name ?? null;
                  break;
                }
              }
            }
            const isSelf = satisfiedBy === line.ingredientName;
            const status = !hydrated
              ? "loading"
              : satisfiedBy
                ? "have"
                : line.optional
                  ? "optional"
                  : "missing";
            const dotClass =
              status === "have"
                ? "bg-emerald-500"
                : status === "missing"
                  ? "bg-rose-500"
                  : "bg-stone-300 dark:bg-stone-700";
            return (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-stone-100 dark:hover:bg-stone-900"
              >
                <span
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
                  aria-hidden
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span
                      className={
                        status === "missing"
                          ? "font-medium text-rose-700 dark:text-rose-400"
                          : "font-medium"
                      }
                    >
                      {line.notation || "—"}
                    </span>
                    <span
                      className={
                        status === "missing"
                          ? "text-rose-700 dark:text-rose-400"
                          : ""
                      }
                    >
                      {line.ingredientName}
                    </span>
                    {line.optional && (
                      <span className="text-xs text-stone-400">optional</span>
                    )}
                  </div>
                  {status === "have" && !isSelf && satisfiedBy && (
                    <div className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                      using your {satisfiedBy}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Method
        </h2>
        <p className="mt-4 leading-relaxed text-stone-700 dark:text-stone-300">
          {recipe.instructions}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Your notes
        </h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Your tweaks, observations, preferences..."
          rows={3}
          disabled={!noteHydrated}
          className="mt-3 w-full resize-y rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 dark:border-stone-800 dark:bg-stone-900"
        />
        <p className="mt-1.5 text-xs text-stone-400">
          Saved on this device.
        </p>
      </section>
    </article>
  );
}

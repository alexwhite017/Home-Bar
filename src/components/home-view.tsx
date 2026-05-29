"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useInventory } from "@/hooks/use-inventory";
import { useFavorites } from "@/hooks/use-favorites";
import {
  deserializeCatalog,
  type RecipeRow,
  type SerializedCatalog,
} from "@/lib/catalog-types";
import {
  computeMatches,
  computeNextBuys,
  type MatchResult,
  type Matches,
} from "@/lib/matching";
import { STARTER_PACKS } from "@/lib/starter-packs";
import { TAG_LABELS, TAG_ORDER, type Tag } from "@/lib/tags";

function matchesFilter(
  recipe: RecipeRow,
  activeTags: Set<string>,
  query: string,
): boolean {
  for (const t of activeTags) {
    if (!recipe.tags.includes(t)) return false;
  }
  const q = query.trim().toLowerCase();
  if (q) {
    const nameMatch = recipe.name.toLowerCase().includes(q);
    const ingMatch = recipe.lines.some((l) =>
      l.ingredientName.toLowerCase().includes(q),
    );
    if (!nameMatch && !ingMatch) return false;
  }
  return true;
}

function resolveMatch(recipe: RecipeRow, matches: Matches): MatchResult {
  return (
    matches.canMake.find((m) => m.recipe.id === recipe.id) ??
    matches.oneAway.find((m) => m.recipe.id === recipe.id) ??
    matches.close.find((m) => m.recipe.id === recipe.id) ?? {
      recipe,
      missingLines: recipe.lines.filter((l) => !l.optional),
    }
  );
}

export function HomeView({
  catalog: serialized,
}: {
  catalog: SerializedCatalog;
}) {
  const catalog = useMemo(() => deserializeCatalog(serialized), [serialized]);
  const { ids, addMany, hydrated } = useInventory();
  const { ids: favorites, toggle: toggleFavorite } = useFavorites();
  const matches = useMemo(() => computeMatches(catalog, ids), [catalog, ids]);
  const nextBuys = useMemo(
    () => computeNextBuys(catalog, ids, 5),
    [catalog, ids],
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTags, setActiveTags] = useState<Set<Tag>>(() => {
    const raw = searchParams.get("tags");
    if (!raw) return new Set();
    const known = new Set<Tag>(TAG_ORDER);
    return new Set(
      raw.split(",").filter((t): t is Tag => known.has(t as Tag)),
    );
  });
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams();
      if (activeTags.size > 0) params.set("tags", [...activeTags].join(","));
      if (query.trim()) params.set("q", query.trim());
      const next = params.toString();
      router.replace(next ? `?${next}` : "/", { scroll: false });
    }, 150);
    return () => clearTimeout(handle);
  }, [activeTags, query, router]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    for (const r of catalog.recipes) for (const t of r.tags) set.add(t);
    return set;
  }, [catalog]);

  const filtered = useMemo(() => {
    const passes = (m: MatchResult) =>
      matchesFilter(m.recipe, activeTags, query);
    return {
      canMake: matches.canMake.filter(passes),
      oneAway: matches.oneAway.filter(passes),
      close: matches.close.filter(passes),
    };
  }, [matches, activeTags, query]);

  const favoriteMatches = useMemo(() => {
    return catalog.recipes
      .filter((r) => favorites.has(r.id))
      .filter((r) => matchesFilter(r, activeTags, query))
      .map((r) => resolveMatch(r, matches))
      .sort((a, b) => a.recipe.name.localeCompare(b.recipe.name));
  }, [catalog, favorites, matches, activeTags, query]);

  const hasActiveFilters = activeTags.size > 0 || query.trim().length > 0;

  const toggleTag = (tag: Tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveTags(new Set());
    setQuery("");
  };

  if (!hydrated) {
    return (
      <div className="p-8 text-sm text-stone-500">Loading your bar...</div>
    );
  }

  if (ids.size === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="text-center">
          <h1 className="font-serif text-4xl italic tracking-tight sm:text-5xl">
            Your bar is empty
          </h1>
          <p className="mt-4 text-stone-600 dark:text-stone-400">
            Pick a starter pack to fill your shelf in one click.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {STARTER_PACKS.map((pack) => {
            const ingredientIds = pack.ingredients
              .map((name) => catalog.ingredientsByName.get(name)?.id)
              .filter((id): id is number => id !== undefined);
            return (
              <li key={pack.id}>
                <button
                  onClick={() => addMany(ingredientIds)}
                  className="block w-full rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-700"
                >
                  <h2 className="font-serif text-2xl italic tracking-tight text-amber-700 dark:text-amber-500">
                    {pack.name}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                    {pack.tagline}
                  </p>
                  <p className="mt-3 text-xs tabular-nums text-stone-400">
                    {ingredientIds.length} bottle
                    {ingredientIds.length === 1 ? "" : "s"}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-center text-sm text-stone-500">
          Or{" "}
          <Link
            href="/bar"
            className="text-amber-700 hover:underline dark:text-amber-500"
          >
            build your own bar →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-[65px] z-10 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/85">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes or ingredients..."
            autoComplete="off"
            className="w-full rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-900"
          />
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {TAG_ORDER.filter((t) => availableTags.has(t)).map((tag) => {
              const isActive = activeTags.has(tag);
              return (
                <button
                  key={tag}
                  aria-pressed={isActive}
                  onClick={() => toggleTag(tag)}
                  className={
                    isActive
                      ? "rounded-full border border-amber-600 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 transition-colors dark:border-amber-500 dark:bg-amber-950/60 dark:text-amber-200"
                      : "rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:text-stone-200"
                  }
                >
                  {TAG_LABELS[tag]}
                </button>
              );
            })}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-1 rounded-full px-3 py-1 text-xs font-medium text-amber-700 hover:underline dark:text-amber-500"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 sm:py-10">
        {favoriteMatches.length > 0 && (
          <Section
            title="Favorites"
            recipes={favoriteMatches}
            accent="rose"
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            showMissing
          />
        )}
        <Section
          title="Ready to make"
          recipes={filtered.canMake}
          accent="emerald"
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          hasFilters={hasActiveFilters}
          emptyMsg="Nothing yet — add a few more bottles."
        />
        <Section
          title="One ingredient away"
          recipes={filtered.oneAway}
          accent="amber"
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          hasFilters={hasActiveFilters}
          showMissing
        />
        <Section
          title="Close — 2 or 3 missing"
          recipes={filtered.close.slice(0, 12)}
          accent="stone"
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          hasFilters={hasActiveFilters}
          showMissing
        />
        {nextBuys.length > 0 && !hasActiveFilters && (
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
    </div>
  );
}

const ACCENT_CLASSES = {
  emerald:
    "border-emerald-200 hover:border-emerald-400 dark:border-emerald-900/50 dark:hover:border-emerald-600",
  amber:
    "border-amber-200 hover:border-amber-400 dark:border-amber-900/50 dark:hover:border-amber-600",
  stone:
    "border-stone-200 hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600",
  rose:
    "border-rose-200 hover:border-rose-400 dark:border-rose-900/50 dark:hover:border-rose-600",
} as const;

function Section({
  title,
  recipes,
  accent,
  favorites,
  onToggleFavorite,
  hasFilters,
  showMissing,
  emptyMsg,
}: {
  title: string;
  recipes: MatchResult[];
  accent: keyof typeof ACCENT_CLASSES;
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  hasFilters?: boolean;
  showMissing?: boolean;
  emptyMsg?: string;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl italic tracking-tight">{title}</h2>
        <span className="text-sm tabular-nums text-stone-400">
          {recipes.length}
        </span>
      </div>
      {recipes.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500">
          {hasFilters
            ? "No matches for these filters."
            : (emptyMsg ?? "Nothing here.")}
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((m) => {
            const isFav = favorites.has(m.recipe.id);
            return (
              <li key={m.recipe.id} className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite(m.recipe.id);
                  }}
                  aria-label={
                    isFav ? "Remove from favorites" : "Save to favorites"
                  }
                  aria-pressed={isFav}
                  className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-base leading-none shadow-sm backdrop-blur-sm transition-transform hover:scale-110 dark:bg-stone-900/90"
                >
                  <span
                    className={
                      isFav ? "text-rose-500" : "text-stone-400"
                    }
                  >
                    {isFav ? "♥" : "♡"}
                  </span>
                </button>
                <Link
                  href={`/recipes/${m.recipe.id}`}
                  className={`group block overflow-hidden rounded-xl border bg-white transition-all hover:shadow-md dark:bg-stone-900 ${ACCENT_CLASSES[accent]}`}
                >
                  {m.recipe.imageUrl ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                      <Image
                        src={m.recipe.imageUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 dark:from-stone-800 dark:to-stone-900">
                      <span className="font-serif text-6xl italic text-amber-700/40 dark:text-amber-500/30">
                        {m.recipe.name[0]}
                      </span>
                    </div>
                  )}
                  <div className="p-4">
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
                          {m.missingLines
                            .map((l) => l.ingredientName)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

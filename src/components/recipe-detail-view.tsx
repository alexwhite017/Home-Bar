"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useInventory } from "@/hooks/use-inventory";
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

  return (
    <article className="mx-auto max-w-2xl px-6 py-8">
      <Link href="/" className="text-sm text-zinc-500 hover:text-amber-600">
        ← Back
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {recipe.name}
      </h1>
      {recipe.glass && (
        <p className="mt-1 text-sm text-zinc-500">Served in: {recipe.glass}</p>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Ingredients
        </h2>
        <ul className="mt-3 space-y-2">
          {recipe.lines.map((line, i) => {
            const satisfiers =
              catalog.satisfiers.get(line.ingredientId) ?? new Set<number>();
            let satisfiedBy: string | null = null;
            if (hydrated) {
              for (const id of satisfiers) {
                if (ids.has(id)) {
                  satisfiedBy =
                    catalog.ingredients.get(id)?.name ?? null;
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
            return (
              <li
                key={i}
                className="flex items-baseline justify-between gap-3 rounded border border-zinc-100 px-3 py-2 dark:border-zinc-800"
              >
                <div>
                  <span
                    className={
                      status === "missing"
                        ? "font-medium text-rose-600"
                        : "font-medium"
                    }
                  >
                    {line.notation || "—"} {line.ingredientName}
                  </span>
                  {line.optional && (
                    <span className="ml-2 text-xs text-zinc-400">
                      (optional)
                    </span>
                  )}
                  {status === "have" && !isSelf && (
                    <span className="ml-2 text-xs text-emerald-600">
                      via {satisfiedBy}
                    </span>
                  )}
                </div>
                <span className="text-xs">
                  {status === "have" && (
                    <span className="font-medium text-emerald-600">have</span>
                  )}
                  {status === "missing" && (
                    <span className="font-medium text-rose-600">need</span>
                  )}
                  {status === "optional" && !satisfiedBy && (
                    <span className="text-zinc-400">optional</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Method
        </h2>
        <p className="mt-3 leading-relaxed">{recipe.instructions}</p>
      </section>
    </article>
  );
}

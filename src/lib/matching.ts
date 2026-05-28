import type { Catalog, RecipeRow, RecipeLine } from "@/lib/catalog-types";

export type MatchResult = {
  recipe: RecipeRow;
  missingLines: RecipeLine[];
};

export type Matches = {
  canMake: MatchResult[];
  oneAway: MatchResult[];
  close: MatchResult[]; // 2 or 3 missing
};

export function computeMatches(
  catalog: Catalog,
  inventory: Set<number>,
): Matches {
  const canMake: MatchResult[] = [];
  const oneAway: MatchResult[] = [];
  const close: MatchResult[] = [];

  for (const recipe of catalog.recipes) {
    const missing: RecipeLine[] = [];

    for (const line of recipe.lines) {
      if (line.optional) continue;
      const satisfiers = catalog.satisfiers.get(line.ingredientId);
      if (!satisfiers) {
        missing.push(line);
        continue;
      }
      let found = false;
      for (const id of satisfiers) {
        if (inventory.has(id)) {
          found = true;
          break;
        }
      }
      if (!found) missing.push(line);
    }

    const result = { recipe, missingLines: missing };
    if (missing.length === 0) canMake.push(result);
    else if (missing.length === 1) oneAway.push(result);
    else if (missing.length <= 3) close.push(result);
  }

  const byName = (a: MatchResult, b: MatchResult) =>
    a.recipe.name.localeCompare(b.recipe.name);
  canMake.sort(byName);
  oneAway.sort(byName);
  close.sort(byName);

  return { canMake, oneAway, close };
}

// "What to buy next": for each ingredient the user does NOT have, count
// how many additional recipes would move into "canMake" if they added it.
// Returns top results sorted by impact.
export function computeNextBuys(
  catalog: Catalog,
  inventory: Set<number>,
  limit = 10,
): { ingredient: { id: number; name: string }; unlocks: number }[] {
  const current = computeMatches(catalog, inventory).canMake.length;
  const results: { ingredient: { id: number; name: string }; unlocks: number }[] =
    [];

  for (const ing of catalog.ingredients.values()) {
    if (inventory.has(ing.id)) continue;
    const augmented = new Set(inventory);
    augmented.add(ing.id);
    const newCount = computeMatches(catalog, augmented).canMake.length;
    const unlocks = newCount - current;
    if (unlocks > 0) {
      results.push({
        ingredient: { id: ing.id, name: ing.name },
        unlocks,
      });
    }
  }

  return results.sort((a, b) => b.unlocks - a.unlocks).slice(0, limit);
}

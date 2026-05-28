import { readFileSync } from "node:fs";
import { join } from "node:path";
import { db } from "@/db";
import {
  ingredients,
  recipes,
  recipeIngredients,
  substitutionGroups,
  substitutionGroupMembers,
} from "@/db/schema";
import {
  CATEGORY_TREE,
  type CategoryNode,
  type IngredientCategory,
} from "@/seed/categories";
import {
  NORMALIZE_MAP,
  SKIP_INGREDIENTS,
  RECIPE_SKIP_INGREDIENTS,
  EXTRA_CLASSIC_IDS,
  remapJuiceOfFruit,
} from "@/seed/normalize";
import { SUBSTITUTION_GROUPS } from "@/seed/substitutions";
import { parseMeasure } from "@/seed/parse-measure";

type RawDrink = Record<string, string | null>;

const GARNISH_NAMES = new Set(
  CATEGORY_TREE.garnish.children?.map((c) => c.name) ?? [],
);

// Garnishes that are never working ingredients in any recipe in this catalog.
// Always flagged optional regardless of notation.
const ALWAYS_OPTIONAL_GARNISHES = new Set(["Cherry", "Nutmeg", "Salt"]);

// Notation tokens that signal decorative use ("1/2 slice", "twist of lemon")
// as opposed to muddled/squeezed working use.
const GARNISH_NOTATION_REGEX = /\b(slice|wedge|twist|peel|rim|zest)\b/i;

function isOptionalLine(canonical: string, notation: string): boolean {
  if (ALWAYS_OPTIONAL_GARNISHES.has(canonical)) return true;
  if (!GARNISH_NAMES.has(canonical)) return false;
  if (notation === "") return true;
  return GARNISH_NOTATION_REGEX.test(notation);
}

function loadCache(): RawDrink[] {
  const path = join(process.cwd(), "scripts/data/cocktaildb-raw.json");
  return JSON.parse(readFileSync(path, "utf-8")) as RawDrink[];
}

function shouldImport(drink: RawDrink): boolean {
  if (EXTRA_CLASSIC_IDS.has(drink.idDrink ?? "")) return true;
  return (drink.strTags ?? "").includes("IBA");
}

function canonicalize(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  if (SKIP_INGREDIENTS.has(key)) return null;
  if (NORMALIZE_MAP[key]) return NORMALIZE_MAP[key];
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function clearAll() {
  // Delete in FK dependency order (children before parents)
  db.delete(recipeIngredients).run();
  db.delete(substitutionGroupMembers).run();
  db.delete(recipes).run();
  db.delete(substitutionGroups).run();
  db.delete(ingredients).run();
}

// Walks CATEGORY_TREE and inserts every node as an ingredients row,
// threading parent_id from each parent to its children. Returns a
// map of canonical name → row id so later steps can look up FKs.
function seedCategories(): Map<string, number> {
  const nameToId = new Map<string, number>();

  function insertNode(
    node: CategoryNode,
    category: IngredientCategory,
    parentId: number | null,
  ) {
    const [row] = db
      .insert(ingredients)
      .values({ name: node.name, category, parentId })
      .returning({ id: ingredients.id })
      .all();
    nameToId.set(node.name, row.id);
    for (const child of node.children ?? []) {
      insertNode(child, category, row.id);
    }
  }

  // Skip the abstract category roots ("Spirit", "Liqueur", etc.) — they're
  // purely organizational and would otherwise show up as inventory candidates.
  // Their children become top-level rows with parentId = null.
  for (const [category, root] of Object.entries(CATEGORY_TREE)) {
    for (const child of root.children ?? []) {
      insertNode(child, category as IngredientCategory, null);
    }
  }

  return nameToId;
}

function seedSubstitutions(nameToId: Map<string, number>) {
  for (const group of SUBSTITUTION_GROUPS) {
    const [row] = db
      .insert(substitutionGroups)
      .values({ name: group.name })
      .returning({ id: substitutionGroups.id })
      .all();
    for (const memberName of group.members) {
      const ingredientId = nameToId.get(memberName);
      if (!ingredientId) {
        throw new Error(
          `substitution group '${group.name}' references unknown ingredient '${memberName}'`,
        );
      }
      db.insert(substitutionGroupMembers)
        .values({ groupId: row.id, ingredientId })
        .run();
    }
  }
}

function importRecipes(nameToId: Map<string, number>) {
  const cache = loadCache();
  const toImport = cache.filter(shouldImport);
  const uncategorized = new Set<string>();
  let imported = 0;
  let skipped = 0;

  for (const drink of toImport) {
    const lines: { canonical: string; measure: string | null }[] = [];
    let skipRecipe = false;

    for (let i = 1; i <= 15; i++) {
      const raw = drink[`strIngredient${i}`];
      if (!raw) continue;

      if (RECIPE_SKIP_INGREDIENTS.has(raw.trim().toLowerCase())) {
        skipRecipe = true;
        break;
      }

      const measure = drink[`strMeasure${i}`];
      const remapped = remapJuiceOfFruit(raw, measure);
      const canonical = canonicalize(remapped);
      if (canonical === null) continue; // skipped ingredient (ice / water)

      lines.push({ canonical, measure });
    }

    if (skipRecipe) {
      skipped++;
      continue;
    }

    const [recipeRow] = db
      .insert(recipes)
      .values({
        externalId: drink.idDrink,
        name: drink.strDrink ?? "",
        instructions: drink.strInstructions ?? "",
        glass: drink.strGlass,
        garnish: null,
      })
      .returning({ id: recipes.id })
      .all();

    let position = 0;
    for (const line of lines) {
      const ingredientId = nameToId.get(line.canonical);
      if (!ingredientId) {
        uncategorized.add(line.canonical);
        continue;
      }
      const parsed = parseMeasure(line.measure);
      db.insert(recipeIngredients)
        .values({
          recipeId: recipeRow.id,
          ingredientId,
          position: position++,
          amount: parsed.amount,
          unit: parsed.unit,
          notation: parsed.notation,
          optional: isOptionalLine(line.canonical, parsed.notation),
        })
        .run();
    }

    imported++;
  }

  console.log(
    `\nImported ${imported} recipes (${skipped} skipped due to filter ingredients)`,
  );
  if (uncategorized.size > 0) {
    console.log(
      `\n${uncategorized.size} uncategorized ingredient(s) — add to taxonomy or normalize map:`,
    );
    for (const name of [...uncategorized].sort()) {
      console.log(`  - ${name}`);
    }
  }
}

function main() {
  console.log("Clearing existing seed data...");
  clearAll();

  console.log("Seeding ingredient taxonomy...");
  const nameToId = seedCategories();
  console.log(`  ${nameToId.size} ingredients inserted`);

  console.log("Seeding substitution groups...");
  seedSubstitutions(nameToId);
  console.log(`  ${SUBSTITUTION_GROUPS.length} group(s) inserted`);

  console.log("Importing recipes...");
  importRecipes(nameToId);

  console.log("\nDone.");
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}

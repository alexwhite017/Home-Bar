import { db } from "@/db";
import {
  ingredients,
  recipes,
  recipeIngredients,
  substitutionGroupMembers,
} from "@/db/schema";
import type {
  Catalog,
  IngredientRow,
  RecipeRow,
} from "@/lib/catalog-types";
import { deriveTags } from "@/lib/tags";

export type {
  Catalog,
  IngredientRow,
  RecipeRow,
  RecipeLine,
} from "@/lib/catalog-types";

export function loadCatalog(): Catalog {
  const ingRows = db.select().from(ingredients).all();
  const ingMap = new Map<number, IngredientRow>();
  const ingByName = new Map<string, IngredientRow>();
  for (const r of ingRows) {
    ingMap.set(r.id, r);
    ingByName.set(r.name, r);
  }

  const children = new Map<number, number[]>();
  for (const r of ingRows) {
    if (r.parentId != null) {
      const arr = children.get(r.parentId) ?? [];
      arr.push(r.id);
      children.set(r.parentId, arr);
    }
  }

  function descendantsOf(id: number): Set<number> {
    const out = new Set<number>([id]);
    const stack = [id];
    while (stack.length > 0) {
      const n = stack.pop()!;
      for (const c of children.get(n) ?? []) {
        if (!out.has(c)) {
          out.add(c);
          stack.push(c);
        }
      }
    }
    return out;
  }

  function ancestorsOf(id: number): Set<number> {
    const out = new Set<number>([id]);
    let cur = ingMap.get(id)?.parentId ?? null;
    while (cur != null) {
      out.add(cur);
      cur = ingMap.get(cur)?.parentId ?? null;
    }
    return out;
  }

  const memberRows = db.select().from(substitutionGroupMembers).all();
  const groupToMembers = new Map<number, number[]>();
  for (const m of memberRows) {
    const arr = groupToMembers.get(m.groupId) ?? [];
    arr.push(m.ingredientId);
    groupToMembers.set(m.groupId, arr);
  }
  const subSiblings = new Map<number, Set<number>>();
  for (const members of groupToMembers.values()) {
    for (const a of members) {
      const set = subSiblings.get(a) ?? new Set<number>();
      for (const b of members) set.add(b);
      subSiblings.set(a, set);
    }
  }

  const satisfiers = new Map<number, Set<number>>();
  for (const r of ingRows) {
    const out = new Set<number>();
    for (const id of descendantsOf(r.id)) out.add(id);
    for (const id of ancestorsOf(r.id)) out.add(id);
    for (const id of subSiblings.get(r.id) ?? []) out.add(id);
    satisfiers.set(r.id, out);
  }

  const recipeRows = db.select().from(recipes).all();
  const lineRows = db.select().from(recipeIngredients).all();
  const linesByRecipe = new Map<number, typeof lineRows>();
  for (const l of lineRows) {
    const arr = linesByRecipe.get(l.recipeId) ?? [];
    arr.push(l);
    linesByRecipe.set(l.recipeId, arr);
  }
  const recipesOut: RecipeRow[] = recipeRows.map((r) => {
    const lines = (linesByRecipe.get(r.id) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((l) => ({
        ingredientId: l.ingredientId,
        ingredientName: ingMap.get(l.ingredientId)!.name,
        amount: l.amount,
        unit: l.unit,
        notation: l.notation,
        optional: l.optional,
      }));
    return {
      id: r.id,
      name: r.name,
      instructions: r.instructions,
      glass: r.glass,
      imageUrl: r.imageUrl,
      tags: deriveTags(lines, r.instructions),
      lines,
    };
  });

  return {
    ingredients: ingMap,
    ingredientsByName: ingByName,
    recipes: recipesOut,
    satisfiers,
  };
}

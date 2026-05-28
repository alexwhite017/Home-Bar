export type IngredientRow = {
  id: number;
  name: string;
  category: string;
  parentId: number | null;
};

export type RecipeLine = {
  ingredientId: number;
  ingredientName: string;
  amount: number | null;
  unit: string | null;
  notation: string;
  optional: boolean;
};

export type RecipeRow = {
  id: number;
  name: string;
  instructions: string;
  glass: string | null;
  imageUrl: string | null;
  tags: string[];
  lines: RecipeLine[];
};

// In-memory catalog used by the matching engine. Map/Set for O(1) lookups.
export type Catalog = {
  ingredients: Map<number, IngredientRow>;
  ingredientsByName: Map<string, IngredientRow>;
  recipes: RecipeRow[];
  satisfiers: Map<number, Set<number>>;
};

// JSON-friendly shape for passing the catalog across the
// server/client component boundary. Plain arrays only.
export type SerializedCatalog = {
  ingredients: IngredientRow[];
  recipes: RecipeRow[];
  satisfiers: [number, number[]][];
};

export function serializeCatalog(c: Catalog): SerializedCatalog {
  return {
    ingredients: [...c.ingredients.values()],
    recipes: c.recipes,
    satisfiers: [...c.satisfiers.entries()].map(([k, v]) => [k, [...v]]),
  };
}

export function deserializeCatalog(s: SerializedCatalog): Catalog {
  const ingMap = new Map<number, IngredientRow>();
  const ingByName = new Map<string, IngredientRow>();
  for (const i of s.ingredients) {
    ingMap.set(i.id, i);
    ingByName.set(i.name, i);
  }
  const satisfiers = new Map<number, Set<number>>();
  for (const [k, v] of s.satisfiers) satisfiers.set(k, new Set(v));
  return {
    ingredients: ingMap,
    ingredientsByName: ingByName,
    recipes: s.recipes,
    satisfiers,
  };
}

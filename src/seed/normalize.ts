// Maps the lowercased+trimmed raw ingredient string from TheCocktailDB
// to a canonical name that must exist in CATEGORY_TREE.
//
// Strings not in this map fall through to a direct case-insensitive match
// against canonical names. Anything that still doesn't match is logged
// by the importer as "uncategorized" — those need a manual decision.
export const NORMALIZE_MAP: Record<string, string> = {
  // Sugar variants → Simple syrup (bartender's choice — see project memory)
  sugar: "Simple syrup",
  "powdered sugar": "Simple syrup",
  "sugar syrup": "Simple syrup",

  // Light cream is dated; real-world execution uses heavy cream
  "light cream": "Heavy cream",

  // Rum
  "white rum": "Light rum",
  "151 proof rum": "Overproof rum",

  // Soda water synonyms
  "carbonated water": "Soda water",
  "club soda": "Soda water",

  // Vermouth
  "rosso vermouth": "Sweet vermouth",

  // Apricot brandy historically meant apricot liqueur in IBA-era recipes
  "apricot brandy": "Apricot liqueur",

  // Bitters punctuation
  "peychaud bitters": "Peychaud's bitters",

  // Peels collapse onto the parent fruit (notation preserves the original)
  "lemon peel": "Lemon",
  "orange peel": "Orange",
  "maraschino cherry": "Cherry",

  // Accent / formatting fixes for liqueurs
  kahlua: "Kahlúa",
  "baileys irish cream": "Baileys",
  "grand marnier": "Grand Marnier",
  "green creme de menthe": "Green crème de menthe",
  "white creme de menthe": "White crème de menthe",
  "creme de cacao": "Crème de cacao",
  "creme de cassis": "Crème de cassis",
  "creme de mure": "Crème de mûre",
  cachaca: "Cachaça",
  benedictine: "Bénédictine",
  anis: "Anisette",

  // Casing that the auto-capitalization fallback can't reproduce
  "coca-cola": "Coca-Cola",
  "green chartreuse": "Green Chartreuse",
  "yellow chartreuse": "Yellow Chartreuse",
  "lillet blanc": "Lillet Blanc",

  // API uses the trailing word but the canonical is just the name
  "orgeat syrup": "Orgeat",

  // Scotch / whiskey specificity flattens to the parent (notation preserves the spec)
  "blended scotch": "Scotch",
  "islay single malt scotch": "Scotch",
  "blended whiskey": "Whiskey",

  // Generic "bitters" defaults to Angostura — by far the most common bitters
  // and the implicit default in any recipe that doesn't specify a brand
  bitters: "Angostura bitters",
};

// Ingredients to silently drop from any recipe — universal assumptions
// (every bar has these) so requiring them on inventory would be noise.
export const SKIP_INGREDIENTS = new Set(["ice", "water"]);

// Recipes containing any of these are skipped wholesale — pre-made mixes
// aren't real components and the underlying drinks have better versions
// elsewhere in the catalog.
export const RECIPE_SKIP_INGREDIENTS = new Set([
  "sweet and sour",
  "pina colada mix",
  "daiquiri mix",
]);

// Modern classics that exist in TheCocktailDB but aren't IBA-tagged due to
// stale data. Included alongside the IBA filter so the seed catalog covers
// the obvious omissions.
export const EXTRA_CLASSIC_IDS = new Set([
  "17247", // The Last Word
  "17254", // Bijou
  "17829", // Penicillin
  "17250", // Corpse Reviver
]);

// TheCocktailDB conflates the citrus fruit with its juice when the measure
// is expressed as "Juice of X". This remaps the ingredient to the juice
// form so it matches the way bartenders actually inventory their bar
// (you have lime juice or you don't — the fruit is for garnish).
export function remapJuiceOfFruit(
  rawIngredient: string,
  rawMeasure: string | null,
): string {
  const ing = rawIngredient.trim().toLowerCase();
  const measure = (rawMeasure ?? "").trim().toLowerCase();
  if (!measure.startsWith("juice of")) return rawIngredient;
  if (ing === "lemon") return "Lemon juice";
  if (ing === "lime") return "Lime juice";
  if (ing === "orange") return "Orange juice";
  return rawIngredient;
}

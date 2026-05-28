import { loadCatalog } from "@/lib/catalog";
import { computeMatches, computeNextBuys } from "@/lib/matching";

// A reasonable starter home bar
const STARTER_BAR = [
  "Gin",
  "Vodka",
  "Light rum",
  "Bourbon",
  "Tequila",
  "Triple sec",
  "Sweet vermouth",
  "Dry vermouth",
  "Lime juice",
  "Lemon juice",
  "Simple syrup",
  "Angostura bitters",
];

const catalog = loadCatalog();

const inventory = new Set<number>();
for (const name of STARTER_BAR) {
  const ing = catalog.ingredientsByName.get(name);
  if (!ing) {
    console.error(`WARNING: '${name}' not found in catalog`);
    continue;
  }
  inventory.add(ing.id);
}

console.log(`Inventory (${inventory.size} items):`);
for (const id of inventory) console.log(`  - ${catalog.ingredients.get(id)!.name}`);

const matches = computeMatches(catalog, inventory);

console.log(`\nCAN MAKE (${matches.canMake.length}):`);
for (const m of matches.canMake) console.log(`  - ${m.recipe.name}`);

console.log(`\nONE AWAY (${matches.oneAway.length}):`);
for (const m of matches.oneAway) {
  const missing = m.missingLines.map((l) => l.ingredientName).join(", ");
  console.log(`  - ${m.recipe.name.padEnd(30)} needs: ${missing}`);
}

console.log(`\nCLOSE — 2 or 3 missing (${matches.close.length}):`);
for (const m of matches.close.slice(0, 10)) {
  const missing = m.missingLines.map((l) => l.ingredientName).join(", ");
  console.log(`  - ${m.recipe.name.padEnd(30)} needs: ${missing}`);
}
if (matches.close.length > 10) console.log(`  ... and ${matches.close.length - 10} more`);

console.log(`\nTOP 5 NEXT-BUYS (highest recipe unlock count):`);
for (const b of computeNextBuys(catalog, inventory, 5)) {
  console.log(`  + ${b.ingredient.name.padEnd(30)} unlocks ${b.unlocks} recipe(s)`);
}

import { loadCatalog } from "@/lib/catalog";
import { TAG_ORDER } from "@/lib/tags";

const catalog = loadCatalog();

const counts = new Map<string, number>();
for (const r of catalog.recipes) {
  for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
}

console.log("Tag distribution:");
for (const tag of TAG_ORDER) {
  console.log(`  ${(counts.get(tag) ?? 0).toString().padStart(3)}  ${tag}`);
}

console.log("\nSample recipes and their tags:");
const samples = [
  "Margarita",
  "Old Fashioned",
  "Negroni",
  "Mojito",
  "Espresso Martini",
  "Paper Plane",
  "Pina Colada",
  "Whiskey Sour",
  "French 75",
  "Boulevardier",
  "Trinidad Sour",
];
for (const name of samples) {
  const r = catalog.recipes.find((x) => x.name === name);
  if (r) console.log(`  ${name.padEnd(20)} → ${r.tags.join(", ")}`);
  else console.log(`  ${name.padEnd(20)} → (not found)`);
}

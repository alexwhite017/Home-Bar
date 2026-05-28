import { readFileSync } from "node:fs";
import { join } from "node:path";

type RawDrink = Record<string, string | null>;

const cache = JSON.parse(
  readFileSync(join(import.meta.dirname, "data/cocktaildb-raw.json"), "utf-8"),
) as RawDrink[];

const iba = cache.filter((d) => (d.strTags ?? "").includes("IBA"));

console.log(`${iba.length} IBA-tagged drinks (of ${cache.length} total)\n`);

const counts = new Map<string, number>();
for (const drink of iba) {
  for (let i = 1; i <= 15; i++) {
    const raw = drink[`strIngredient${i}`];
    if (!raw) continue;
    const name = raw.trim().toLowerCase();
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
}

const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

console.log(
  `${sorted.length} unique ingredient names (after lowercasing) in IBA subset\n`,
);
console.log("All ingredients, sorted by frequency:");
for (const [name, count] of sorted) {
  console.log(`  ${String(count).padStart(4)}  ${name}`);
}

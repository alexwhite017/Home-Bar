import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(import.meta.dirname, "data");
const OUT_FILE = join(OUT_DIR, "cocktaildb-raw.json");
const BASE = "https://www.thecocktaildb.com/api/json/v1/1";

type RawDrink = Record<string, string | null>;

async function fetchLetter(letter: string): Promise<RawDrink[]> {
  const res = await fetch(`${BASE}/search.php?f=${letter}`);
  if (!res.ok) {
    throw new Error(`fetch failed for letter '${letter}': ${res.status}`);
  }
  const json = (await res.json()) as { drinks: RawDrink[] | null };
  return json.drinks ?? [];
}

async function main() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const all = new Map<string, RawDrink>();

  for (const letter of letters) {
    const drinks = await fetchLetter(letter);
    for (const d of drinks) {
      const id = d.idDrink;
      if (typeof id === "string" && !all.has(id)) all.set(id, d);
    }
    console.log(
      `  ${letter}: ${drinks.length} drinks (total unique: ${all.size})`,
    );
    await new Promise((r) => setTimeout(r, 200));
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify([...all.values()], null, 2));
  console.log(`\nwrote ${all.size} drinks to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

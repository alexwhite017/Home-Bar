// Tags computed once at catalog load and attached to each recipe.
// Two flavors:
//   - Technique (one of shaken / stirred / blended / built, plus optional muddled)
//     derived from the instructions text
//   - Character (spirit-forward, refreshing, sour, bitter, tropical, creamy)
//     plus modifiers (egg-white) derived from the ingredient list

export type Tag =
  | "shaken"
  | "stirred"
  | "built"
  | "blended"
  | "muddled"
  | "spirit-forward"
  | "refreshing"
  | "sour"
  | "bitter"
  | "tropical"
  | "creamy"
  | "egg-white";

export const TAG_LABELS: Record<Tag, string> = {
  shaken: "Shaken",
  stirred: "Stirred",
  built: "Built",
  blended: "Blended",
  muddled: "Muddled",
  "spirit-forward": "Spirit-forward",
  refreshing: "Refreshing",
  sour: "Sour",
  bitter: "Bitter",
  tropical: "Tropical",
  creamy: "Creamy",
  "egg-white": "Egg white",
};

// Display order for filter pills — character first, then technique
export const TAG_ORDER: Tag[] = [
  "spirit-forward",
  "refreshing",
  "sour",
  "bitter",
  "tropical",
  "creamy",
  "egg-white",
  "shaken",
  "stirred",
  "built",
  "blended",
  "muddled",
];

const CITRUS_JUICES = new Set([
  "lemon juice",
  "lime juice",
  "orange juice",
  "grapefruit juice",
]);

const BUBBLES = new Set([
  "champagne",
  "prosecco",
  "soda water",
  "coca-cola",
  "ginger ale",
  "ginger beer",
]);

const TROPICAL_INGREDIENTS = new Set([
  "pineapple juice",
  "coconut cream",
  "coconut milk",
  "orgeat",
]);

const BITTER_INGREDIENTS = new Set([
  "campari",
  "aperol",
  "amaro nonino",
]);

const CREAMY_INGREDIENTS = new Set([
  "heavy cream",
  "coconut cream",
  "coconut milk",
  "baileys",
  "whipped cream",
]);

export function deriveTags(
  lines: { ingredientName: string }[],
  instructions: string,
): Tag[] {
  const tags = new Set<Tag>();
  const lc = instructions.toLowerCase();
  const ingNames = lines.map((l) => l.ingredientName.toLowerCase());

  // Technique — primary is one of shaken / stirred / blended / built
  if (/\bshak/.test(lc)) tags.add("shaken");
  else if (/\bstir/.test(lc)) tags.add("stirred");
  else if (/\bblend/.test(lc)) tags.add("blended");
  else if (instructions.trim()) tags.add("built");

  // Muddled is a secondary technique that can coexist
  if (/\bmuddle/.test(lc)) tags.add("muddled");

  // Modifier
  if (ingNames.includes("egg white")) tags.add("egg-white");

  // Character
  const hasCitrus = ingNames.some((n) => CITRUS_JUICES.has(n));
  const hasBubbles = ingNames.some((n) => BUBBLES.has(n));
  const hasTropical = ingNames.some((n) => TROPICAL_INGREDIENTS.has(n));
  const hasBitter = ingNames.some((n) => BITTER_INGREDIENTS.has(n));
  const hasCreamy = ingNames.some((n) => CREAMY_INGREDIENTS.has(n));

  if (hasTropical) tags.add("tropical");
  if (hasBitter) tags.add("bitter");
  if (hasCreamy) tags.add("creamy");
  if (hasCitrus && hasBubbles) tags.add("refreshing");
  if (hasCitrus && !hasBubbles && tags.has("shaken")) tags.add("sour");
  if (!hasCitrus && !hasBubbles && !hasCreamy) tags.add("spirit-forward");

  return [...tags];
}

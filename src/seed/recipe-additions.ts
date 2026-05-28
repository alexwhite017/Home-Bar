// Hand-authored recipes that don't exist in TheCocktailDB at all.
// Same shape as RecipeOverride but appended fresh rather than replacing.
// Ingredient `name` fields must match canonical names in CATEGORY_TREE.

export type RecipeAddition = {
  name: string;
  glass: string;
  instructions: string;
  ingredients: Array<{
    name: string;
    notation: string;
    optional?: boolean;
  }>;
};

export const RECIPE_ADDITIONS: RecipeAddition[] = [
  {
    name: "Paper Plane",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and double-strain into a chilled coupe. No garnish needed.",
    ingredients: [
      { name: "Bourbon", notation: "3/4 oz" },
      { name: "Aperol", notation: "3/4 oz" },
      { name: "Amaro Nonino", notation: "3/4 oz" },
      { name: "Lemon juice", notation: "3/4 oz" },
    ],
  },

  {
    name: "Boulevardier",
    glass: "Old-fashioned glass",
    instructions:
      "Stir with ice and strain over one large cube in a chilled rocks glass. Express an orange peel over the top and use it as garnish.",
    ingredients: [
      { name: "Bourbon", notation: "1 1/2 oz" },
      { name: "Campari", notation: "1 oz" },
      { name: "Sweet vermouth", notation: "1 oz" },
      { name: "Orange", notation: "peel", optional: true },
    ],
  },

  {
    name: "Tommy's Margarita",
    glass: "Old-fashioned glass",
    instructions:
      "Shake with ice and strain over fresh ice in a rocks glass. No triple sec, no salt rim — let the agave do the work. Garnish with a lime wheel.",
    ingredients: [
      { name: "Tequila", notation: "2 oz" },
      { name: "Lime juice", notation: "1 oz" },
      { name: "Agave syrup", notation: "1/2 oz" },
      { name: "Lime", notation: "wheel", optional: true },
    ],
  },

  {
    name: "Naked and Famous",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and double-strain into a chilled coupe. No garnish.",
    ingredients: [
      { name: "Mezcal", notation: "3/4 oz" },
      { name: "Yellow Chartreuse", notation: "3/4 oz" },
      { name: "Aperol", notation: "3/4 oz" },
      { name: "Lime juice", notation: "3/4 oz" },
    ],
  },

  {
    name: "Trinidad Sour",
    glass: "Cocktail glass",
    instructions:
      "Yes, that much bitters. Shake hard with ice and strain into a chilled coupe. The orgeat and citrus balance the bitterness.",
    ingredients: [
      { name: "Angostura bitters", notation: "1 1/2 oz" },
      { name: "Orgeat", notation: "1 oz" },
      { name: "Lemon juice", notation: "3/4 oz" },
      { name: "Rye", notation: "1/2 oz" },
    ],
  },

  {
    name: "Gold Rush",
    glass: "Old-fashioned glass",
    instructions:
      "Shake with ice and strain over one large cube in a rocks glass. No garnish needed.",
    ingredients: [
      { name: "Bourbon", notation: "2 oz" },
      { name: "Lemon juice", notation: "3/4 oz" },
      { name: "Honey syrup", notation: "3/4 oz" },
    ],
  },

  {
    name: "Jungle Bird",
    glass: "Old-fashioned glass",
    instructions:
      "Shake all ingredients with ice and strain over fresh crushed ice in a rocks glass (or tiki mug). Garnish with a pineapple wedge.",
    ingredients: [
      { name: "Dark rum", notation: "1 1/2 oz" },
      { name: "Pineapple juice", notation: "1 1/2 oz" },
      { name: "Campari", notation: "3/4 oz" },
      { name: "Lime juice", notation: "1/2 oz" },
      { name: "Simple syrup", notation: "1/2 oz" },
      { name: "Pineapple", notation: "wedge", optional: true },
    ],
  },

  {
    name: "Vieux Carré",
    glass: "Old-fashioned glass",
    instructions:
      "Stir all ingredients with ice and strain over fresh ice in a rocks glass. Garnish with a brandied cherry and a lemon peel.",
    ingredients: [
      { name: "Rye", notation: "3/4 oz" },
      { name: "Cognac", notation: "3/4 oz" },
      { name: "Sweet vermouth", notation: "3/4 oz" },
      { name: "Bénédictine", notation: "1 tsp" },
      { name: "Peychaud's bitters", notation: "2 dashes" },
      { name: "Angostura bitters", notation: "2 dashes" },
      { name: "Cherry", notation: "1", optional: true },
      { name: "Lemon", notation: "peel", optional: true },
    ],
  },

  {
    name: "Whiskey Smash",
    glass: "Old-fashioned glass",
    instructions:
      "Muddle mint and lemon wedges with simple syrup in a shaker. Add bourbon and ice, shake hard, and double-strain over fresh crushed ice. Garnish with a slap of mint.",
    ingredients: [
      { name: "Bourbon", notation: "2 oz" },
      { name: "Lemon juice", notation: "3/4 oz" },
      { name: "Simple syrup", notation: "1/2 oz" },
      { name: "Mint", notation: "4-6 leaves" },
      { name: "Mint", notation: "sprig", optional: true },
    ],
  },
];

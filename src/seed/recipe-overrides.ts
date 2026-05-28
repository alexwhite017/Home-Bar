// Hand-authored recipe specs that replace TheCocktailDB's version on import.
// Matched by `name` (exact, case-sensitive against the API's strDrink).
// Ingredient `name` fields must match canonical names in CATEGORY_TREE.

export type RecipeOverride = {
  name: string;
  glass: string;
  instructions: string;
  ingredients: Array<{
    name: string;
    notation: string;
    optional?: boolean;
  }>;
};

export const RECIPE_OVERRIDES: RecipeOverride[] = [
  // ───────── critically wrong fixes ─────────

  {
    name: "Americano",
    glass: "Highball glass",
    instructions:
      "Build Campari and sweet vermouth in a Collins glass over ice. Top with soda water and garnish with an orange slice.",
    ingredients: [
      { name: "Campari", notation: "1 oz" },
      { name: "Sweet vermouth", notation: "1 oz" },
      { name: "Soda water", notation: "to top" },
      { name: "Orange", notation: "slice", optional: true },
    ],
  },

  {
    name: "Bellini",
    glass: "Champagne flute",
    instructions:
      "Pour white peach purée into a chilled flute. Slowly top with Prosecco and stir gently with a bar spoon.",
    ingredients: [
      { name: "Peach purée", notation: "2 oz" },
      { name: "Prosecco", notation: "4 oz" },
    ],
  },

  {
    name: "Derby",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and strain into a chilled coupe. Garnish with a mint sprig.",
    ingredients: [
      { name: "Bourbon", notation: "1 1/2 oz" },
      { name: "Sweet vermouth", notation: "1/2 oz" },
      { name: "Lime juice", notation: "1/2 oz" },
      { name: "Cointreau", notation: "1/2 oz" },
      { name: "Mint", notation: "sprig", optional: true },
    ],
  },

  {
    name: "Espresso Martini",
    glass: "Cocktail glass",
    instructions:
      "Shake hard with cubed ice for a thick foam. Double-strain into a chilled coupe and garnish with 3 coffee beans.",
    ingredients: [
      { name: "Vodka", notation: "2 oz" },
      { name: "Espresso", notation: "1 oz" },
      { name: "Kahlúa", notation: "1/2 oz" },
      { name: "Simple syrup", notation: "1/4 oz" },
      { name: "Coffee beans", notation: "3", optional: true },
    ],
  },

  {
    name: "Long Island Iced Tea",
    glass: "Highball glass",
    instructions:
      "Shake the spirits, lemon juice, and syrup with ice. Strain over fresh ice in a Collins glass and top with Coca-Cola. Garnish with a lemon wedge.",
    ingredients: [
      { name: "Vodka", notation: "1/2 oz" },
      { name: "Tequila", notation: "1/2 oz" },
      { name: "Light rum", notation: "1/2 oz" },
      { name: "Gin", notation: "1/2 oz" },
      { name: "Triple sec", notation: "1/2 oz" },
      { name: "Lemon juice", notation: "3/4 oz" },
      { name: "Simple syrup", notation: "1/2 oz" },
      { name: "Coca-Cola", notation: "to top" },
      { name: "Lemon", notation: "wedge", optional: true },
    ],
  },

  {
    name: "Monkey Gland",
    glass: "Cocktail glass",
    instructions:
      "Shake all ingredients with ice and strain into a chilled coupe.",
    ingredients: [
      { name: "Gin", notation: "1 1/2 oz" },
      { name: "Orange juice", notation: "1 1/2 oz" },
      { name: "Grenadine", notation: "1 tsp" },
      { name: "Absinthe", notation: "2 dashes" },
    ],
  },

  {
    name: "Moscow Mule",
    glass: "Copper mug",
    instructions:
      "Build vodka and lime juice in a copper mug over crushed ice. Top with ginger beer and stir gently. Garnish with a lime wheel and a sprig of mint.",
    ingredients: [
      { name: "Vodka", notation: "2 oz" },
      { name: "Lime juice", notation: "1/2 oz" },
      { name: "Ginger beer", notation: "4 oz" },
      { name: "Lime", notation: "wheel", optional: true },
      { name: "Mint", notation: "sprig", optional: true },
    ],
  },

  {
    name: "Pisco Sour",
    glass: "Cocktail glass",
    instructions:
      "Dry-shake without ice to emulsify the egg white, then shake again with ice. Double-strain into a chilled coupe and float the Angostura bitters in dots on the foam.",
    ingredients: [
      { name: "Pisco", notation: "2 oz" },
      { name: "Lime juice", notation: "1 oz" },
      { name: "Simple syrup", notation: "3/4 oz" },
      { name: "Egg white", notation: "1" },
      { name: "Angostura bitters", notation: "3 dashes", optional: true },
    ],
  },

  {
    name: "Russian Spring Punch",
    glass: "Highball glass",
    instructions:
      "Shake vodka, crème de cassis, lemon juice, and syrup with ice. Strain over fresh crushed ice in a highball and top with Champagne. Garnish with a lemon wheel.",
    ingredients: [
      { name: "Vodka", notation: "1 1/2 oz" },
      { name: "Crème de cassis", notation: "1/2 oz" },
      { name: "Lemon juice", notation: "1/2 oz" },
      { name: "Simple syrup", notation: "1/4 oz" },
      { name: "Champagne", notation: "2 oz" },
      { name: "Lemon", notation: "wheel", optional: true },
    ],
  },

  // ───────── minor issue fixes (ratio / spec corrections) ─────────

  {
    name: "Alexander",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and double-strain into a chilled coupe. Grate fresh nutmeg over the top.",
    ingredients: [
      { name: "Cognac", notation: "1 oz" },
      { name: "Brown crème de cacao", notation: "1 oz" },
      { name: "Heavy cream", notation: "1 oz" },
      { name: "Nutmeg", notation: "grated", optional: true },
    ],
  },

  {
    name: "Aviation",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and double-strain into a chilled coupe. Garnish with a brandied cherry.",
    ingredients: [
      { name: "Gin", notation: "2 oz" },
      { name: "Maraschino liqueur", notation: "1/2 oz" },
      { name: "Lemon juice", notation: "1/2 oz" },
      { name: "Crème de violette", notation: "1/4 oz" },
      { name: "Cherry", notation: "1", optional: true },
    ],
  },

  {
    name: "B-52",
    glass: "Shot glass",
    instructions:
      "Layer in a shot glass: Kahlúa first, then float Baileys, then Grand Marnier over the back of a bar spoon. Optionally flame the top.",
    ingredients: [
      { name: "Kahlúa", notation: "1/3 oz" },
      { name: "Baileys", notation: "1/3 oz" },
      { name: "Grand Marnier", notation: "1/3 oz" },
    ],
  },

  {
    name: "Bramble",
    glass: "Old-fashioned glass",
    instructions:
      "Shake gin, lemon, and simple syrup with ice; strain over fresh crushed ice in a rocks glass. Drizzle crème de mûre over the top so it bleeds down. Garnish with a lemon slice and a couple of berries.",
    ingredients: [
      { name: "Gin", notation: "1 1/2 oz" },
      { name: "Lemon juice", notation: "1 oz" },
      { name: "Simple syrup", notation: "1/2 oz" },
      { name: "Crème de mûre", notation: "1/2 oz" },
      { name: "Lemon", notation: "slice", optional: true },
    ],
  },

  {
    name: "Casino",
    glass: "Cocktail glass",
    instructions:
      "Stir all ingredients with ice and strain into a chilled coupe. Garnish with a cherry.",
    ingredients: [
      { name: "Gin", notation: "2 oz" },
      { name: "Maraschino liqueur", notation: "1/4 oz" },
      { name: "Lemon juice", notation: "1/4 oz" },
      { name: "Orange bitters", notation: "2 dashes" },
      { name: "Cherry", notation: "1", optional: true },
    ],
  },

  {
    name: "Cosmopolitan",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and double-strain into a chilled coupe. Express an orange peel over the surface and use it as garnish.",
    ingredients: [
      { name: "Vodka", notation: "1 1/2 oz" },
      { name: "Cointreau", notation: "1 oz" },
      { name: "Lime juice", notation: "1/2 oz" },
      { name: "Cranberry juice", notation: "1/2 oz" },
      { name: "Orange", notation: "peel", optional: true },
    ],
  },

  {
    name: "Daiquiri",
    glass: "Cocktail glass",
    instructions:
      "Shake hard with ice and double-strain into a chilled coupe. Garnish with a lime wheel.",
    ingredients: [
      { name: "Light rum", notation: "2 oz" },
      { name: "Lime juice", notation: "1 oz" },
      { name: "Simple syrup", notation: "3/4 oz" },
      { name: "Lime", notation: "wheel", optional: true },
    ],
  },

  {
    name: "Dirty Martini",
    glass: "Cocktail glass",
    instructions:
      "Stir with ice and strain into a chilled coupe. Garnish with 2 or 3 olives on a pick.",
    ingredients: [
      { name: "Vodka", notation: "2 1/2 oz" },
      { name: "Dry vermouth", notation: "1/2 oz" },
      { name: "Olive brine", notation: "1/2 oz" },
      { name: "Olive", notation: "2-3", optional: true },
    ],
  },

  {
    name: "French 75",
    glass: "Champagne flute",
    instructions:
      "Shake gin, lemon, and syrup with ice. Strain into a chilled flute and top with Champagne. Garnish with a lemon twist.",
    ingredients: [
      { name: "Gin", notation: "1 oz" },
      { name: "Lemon juice", notation: "1/2 oz" },
      { name: "Simple syrup", notation: "1/2 oz" },
      { name: "Champagne", notation: "3 oz" },
      { name: "Lemon", notation: "twist", optional: true },
    ],
  },

  {
    name: "Harvey Wallbanger",
    glass: "Highball glass",
    instructions:
      "Build vodka and orange juice in a highball over ice and stir. Float Galliano on top. Garnish with an orange slice.",
    ingredients: [
      { name: "Vodka", notation: "1 1/2 oz" },
      { name: "Orange juice", notation: "4 oz" },
      { name: "Galliano", notation: "1/2 oz" },
      { name: "Orange", notation: "slice", optional: true },
    ],
  },

  {
    name: "Hemingway Special",
    glass: "Cocktail glass",
    instructions:
      "Shake hard with ice and double-strain into a chilled coupe. Garnish with a lime wheel.",
    ingredients: [
      { name: "Light rum", notation: "2 oz" },
      { name: "Lime juice", notation: "3/4 oz" },
      { name: "Grapefruit juice", notation: "1/2 oz" },
      { name: "Maraschino liqueur", notation: "1/4 oz" },
      { name: "Lime", notation: "wheel", optional: true },
    ],
  },

  {
    name: "Kir",
    glass: "Wine Glass",
    instructions:
      "Pour crème de cassis into a chilled wine glass, then top with dry white wine and stir gently.",
    ingredients: [
      { name: "Crème de cassis", notation: "1/4 oz" },
      { name: "Dry white wine", notation: "5 oz" },
    ],
  },

  {
    name: "Lemon Drop",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and strain into a sugar-rimmed coupe. Garnish with a lemon twist.",
    ingredients: [
      { name: "Vodka", notation: "1 1/2 oz" },
      { name: "Cointreau", notation: "1/2 oz" },
      { name: "Lemon juice", notation: "1/2 oz" },
      { name: "Simple syrup", notation: "1/4 oz" },
      { name: "Lemon", notation: "twist", optional: true },
    ],
  },

  {
    name: "Manhattan",
    glass: "Cocktail glass",
    instructions:
      "Stir with ice and strain into a chilled coupe. Garnish with a brandied cherry or an expressed orange peel.",
    ingredients: [
      { name: "Rye", notation: "2 oz" },
      { name: "Sweet vermouth", notation: "1 oz" },
      { name: "Angostura bitters", notation: "2 dashes" },
      { name: "Cherry", notation: "1", optional: true },
      { name: "Orange", notation: "peel", optional: true },
    ],
  },

  {
    name: "Margarita",
    glass: "Margarita glass",
    instructions:
      "Shake with ice and strain into a glass with a half-rim of salt. Garnish with a lime wheel.",
    ingredients: [
      { name: "Tequila", notation: "2 oz" },
      { name: "Cointreau", notation: "1 oz" },
      { name: "Lime juice", notation: "3/4 oz" },
      { name: "Salt", notation: "rim", optional: true },
      { name: "Lime", notation: "wheel", optional: true },
    ],
  },

  {
    name: "Mary Pickford",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and double-strain into a chilled coupe. Garnish with a brandied cherry.",
    ingredients: [
      { name: "Light rum", notation: "1 1/2 oz" },
      { name: "Pineapple juice", notation: "1 1/2 oz" },
      { name: "Grenadine", notation: "1/4 oz" },
      { name: "Maraschino liqueur", notation: "1/4 oz" },
      { name: "Cherry", notation: "1", optional: true },
    ],
  },

  {
    name: "Mimosa",
    glass: "Champagne flute",
    instructions:
      "Pour orange juice into a chilled flute, then slowly top with Champagne.",
    ingredients: [
      { name: "Champagne", notation: "3 oz" },
      { name: "Orange juice", notation: "3 oz" },
    ],
  },

  {
    name: "Old Fashioned",
    glass: "Old-fashioned glass",
    instructions:
      "Stir bourbon, simple syrup, and bitters with one large ice cube. Express an orange peel over the top and drop it in. Garnish with a brandied cherry.",
    ingredients: [
      { name: "Bourbon", notation: "2 oz" },
      { name: "Simple syrup", notation: "1/4 oz" },
      { name: "Angostura bitters", notation: "2 dashes" },
      { name: "Orange", notation: "peel", optional: true },
      { name: "Cherry", notation: "1", optional: true },
    ],
  },

  {
    name: "Pina Colada",
    glass: "Collins glass",
    instructions:
      "Blend with a cup of crushed ice until smooth and pour into a chilled hurricane or Collins glass. Garnish with a pineapple wedge and a cherry.",
    ingredients: [
      { name: "Light rum", notation: "2 oz" },
      { name: "Pineapple juice", notation: "3 oz" },
      { name: "Coconut cream", notation: "1 oz" },
      { name: "Pineapple", notation: "wedge", optional: true },
      { name: "Cherry", notation: "1", optional: true },
    ],
  },

  {
    name: "Planter's Punch",
    glass: "Collins glass",
    instructions:
      "Shake rum, lime, syrup, grenadine, and bitters with ice. Strain over fresh crushed ice and top with soda water. Garnish with an orange slice and a cherry.",
    ingredients: [
      { name: "Dark rum", notation: "2 oz" },
      { name: "Lime juice", notation: "1 oz" },
      { name: "Simple syrup", notation: "1/2 oz" },
      { name: "Grenadine", notation: "1/2 oz" },
      { name: "Angostura bitters", notation: "2 dashes" },
      { name: "Soda water", notation: "to top" },
      { name: "Orange", notation: "slice", optional: true },
      { name: "Cherry", notation: "1", optional: true },
    ],
  },

  {
    name: "Rose",
    glass: "Cocktail glass",
    instructions:
      "Stir with ice and strain into a chilled coupe. Garnish with a brandied cherry.",
    ingredients: [
      { name: "Gin", notation: "1 1/2 oz" },
      { name: "Dry vermouth", notation: "3/4 oz" },
      { name: "Cherry liqueur", notation: "1/4 oz" },
      { name: "Orange bitters", notation: "1 dash" },
      { name: "Cherry", notation: "1", optional: true },
    ],
  },

  {
    name: "Sazerac",
    glass: "Old-fashioned glass",
    instructions:
      "Rinse a chilled rocks glass with absinthe and discard the excess. Stir rye, simple syrup, and both bitters with ice and strain into the rinsed glass. Express a lemon peel over the surface and discard.",
    ingredients: [
      { name: "Rye", notation: "2 oz" },
      { name: "Simple syrup", notation: "1/4 oz" },
      { name: "Peychaud's bitters", notation: "3 dashes" },
      { name: "Angostura bitters", notation: "1 dash" },
      { name: "Absinthe", notation: "rinse" },
      { name: "Lemon", notation: "peel", optional: true },
    ],
  },

  {
    name: "Sidecar",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice and double-strain into a sugar-rimmed coupe. Express an orange peel over the surface.",
    ingredients: [
      { name: "Cognac", notation: "2 oz" },
      { name: "Cointreau", notation: "3/4 oz" },
      { name: "Lemon juice", notation: "3/4 oz" },
      { name: "Orange", notation: "peel", optional: true },
    ],
  },

  {
    name: "Tequila Sunrise",
    glass: "Highball glass",
    instructions:
      "Build tequila and orange juice in a highball over ice. Slowly pour grenadine down the side so it sinks to the bottom. Garnish with an orange slice and a cherry.",
    ingredients: [
      { name: "Tequila", notation: "2 oz" },
      { name: "Orange juice", notation: "4 oz" },
      { name: "Grenadine", notation: "1/2 oz" },
      { name: "Orange", notation: "slice", optional: true },
      { name: "Cherry", notation: "1", optional: true },
    ],
  },

  {
    name: "Tuxedo Cocktail",
    glass: "Cocktail glass",
    instructions:
      "Stir all ingredients with ice and strain into a chilled coupe. Garnish with a cherry and a lemon twist.",
    ingredients: [
      { name: "Gin", notation: "1 1/2 oz" },
      { name: "Dry vermouth", notation: "1 1/2 oz" },
      { name: "Maraschino liqueur", notation: "1/4 oz" },
      { name: "Absinthe", notation: "1 dash" },
      { name: "Orange bitters", notation: "2 dashes" },
      { name: "Cherry", notation: "1", optional: true },
      { name: "Lemon", notation: "twist", optional: true },
    ],
  },

  {
    name: "Vampiro",
    glass: "Highball glass",
    instructions:
      "Stir all ingredients with ice in a salt-rimmed highball. Garnish with a lime wedge.",
    ingredients: [
      { name: "Tequila", notation: "2 oz" },
      { name: "Tomato juice", notation: "3 oz" },
      { name: "Orange juice", notation: "1 oz" },
      { name: "Lime juice", notation: "1/2 oz" },
      { name: "Grenadine", notation: "1/2 oz" },
      { name: "Salt", notation: "rim", optional: true },
      { name: "Lime", notation: "wedge", optional: true },
    ],
  },

  {
    name: "Vesper",
    glass: "Cocktail glass",
    instructions:
      "Shake with ice (per Bond) and strain into a chilled coupe. Garnish with a thin lemon peel.",
    ingredients: [
      { name: "Gin", notation: "3 oz" },
      { name: "Vodka", notation: "1 oz" },
      { name: "Lillet Blanc", notation: "1/2 oz" },
      { name: "Lemon", notation: "peel", optional: true },
    ],
  },

  {
    name: "Whiskey Sour",
    glass: "Old-fashioned glass",
    instructions:
      "Dry-shake without ice (if using egg white) to emulsify, then shake again with ice. Strain over fresh ice. Garnish with a brandied cherry and a lemon wheel.",
    ingredients: [
      { name: "Bourbon", notation: "2 oz" },
      { name: "Lemon juice", notation: "3/4 oz" },
      { name: "Simple syrup", notation: "3/4 oz" },
      { name: "Egg white", notation: "1", optional: true },
      { name: "Cherry", notation: "1", optional: true },
      { name: "Lemon", notation: "wheel", optional: true },
    ],
  },

  {
    name: "White Lady",
    glass: "Cocktail glass",
    instructions:
      "Dry-shake without ice (if using egg white) to emulsify, then shake again with ice. Double-strain into a chilled coupe. Garnish with a lemon twist.",
    ingredients: [
      { name: "Gin", notation: "1 1/2 oz" },
      { name: "Cointreau", notation: "3/4 oz" },
      { name: "Lemon juice", notation: "3/4 oz" },
      { name: "Egg white", notation: "1", optional: true },
      { name: "Lemon", notation: "twist", optional: true },
    ],
  },
];

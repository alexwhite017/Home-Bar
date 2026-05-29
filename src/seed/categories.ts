export type IngredientCategory =
  | "spirit"
  | "liqueur"
  | "fortified_wine"
  | "sparkling_wine"
  | "wine"
  | "bitters"
  | "pastis"
  | "mixer"
  | "juice"
  | "sweetener"
  | "dairy"
  | "egg"
  | "garnish"
  | "other";

export type CategoryNode = {
  name: string;
  children?: CategoryNode[];
};

export const CATEGORY_TREE: Record<IngredientCategory, CategoryNode> = {
  spirit: {
    name: "Spirit",
    children: [
      { name: "Gin" },
      { name: "Vodka" },
      {
        name: "Rum",
        children: [
          { name: "Light rum" },
          { name: "Dark rum" },
          { name: "Gold rum" },
          { name: "Overproof rum" },
        ],
      },
      {
        name: "Whiskey",
        children: [
          { name: "Bourbon" },
          { name: "Rye" },
          { name: "Scotch" },
          { name: "Irish whiskey" },
          { name: "Blended whiskey" },
        ],
      },
      {
        name: "Brandy",
        children: [{ name: "Cognac" }],
      },
      { name: "Tequila" },
      { name: "Mezcal" },
      { name: "Cachaça" },
      { name: "Pisco" },
    ],
  },
  liqueur: {
    name: "Liqueur",
    children: [
      {
        name: "Orange liqueur",
        children: [
          { name: "Triple sec" },
          { name: "Cointreau" },
          { name: "Grand Marnier" },
        ],
      },
      { name: "Maraschino liqueur" },
      { name: "Amaretto" },
      {
        name: "Coffee liqueur",
        children: [{ name: "Kahlúa" }],
      },
      {
        name: "Crème de cacao",
        children: [
          { name: "White crème de cacao" },
          { name: "Brown crème de cacao" },
        ],
      },
      { name: "Crème de cassis" },
      {
        name: "Crème de menthe",
        children: [
          { name: "Green crème de menthe" },
          { name: "White crème de menthe" },
        ],
      },
      { name: "Crème de mûre" },
      { name: "Crème de violette" },
      { name: "Cherry liqueur" },
      { name: "Galliano" },
      { name: "Bénédictine" },
      { name: "Drambuie" },
      { name: "Campari" },
      { name: "Aperol" },
      { name: "Amaro Nonino" },
      { name: "Baileys" },
      { name: "Peach schnapps" },
      { name: "Raspberry liqueur" },
      { name: "Apricot liqueur" },
      { name: "Elderflower liqueur" },
      { name: "Green Chartreuse" },
      { name: "Yellow Chartreuse" },
    ],
  },
  fortified_wine: {
    name: "Fortified wine",
    children: [
      { name: "Dry vermouth" },
      { name: "Sweet vermouth" },
      { name: "Lillet Blanc" },
      { name: "Port" },
    ],
  },
  sparkling_wine: {
    name: "Sparkling wine",
    children: [{ name: "Champagne" }, { name: "Prosecco" }],
  },
  wine: {
    name: "Wine",
    children: [{ name: "Dry white wine" }],
  },
  bitters: {
    name: "Bitters",
    children: [
      { name: "Angostura bitters" },
      { name: "Peychaud's bitters" },
      { name: "Orange bitters" },
      { name: "Peach bitters" },
    ],
  },
  pastis: {
    name: "Pastis",
    children: [
      { name: "Ricard" },
      { name: "Anisette" },
      { name: "Absinthe" },
    ],
  },
  mixer: {
    name: "Mixer",
    children: [
      { name: "Soda water" },
    { name: "Tonic water" },
      { name: "Coca-Cola" },
      { name: "Ginger ale" },
      { name: "Ginger beer" },
      { name: "Tomato juice" },
    ],
  },
  juice: {
    name: "Juice",
    children: [
      { name: "Lemon juice" },
      { name: "Lime juice" },
      { name: "Orange juice" },
      { name: "Pineapple juice" },
      { name: "Cranberry juice" },
      { name: "Grapefruit juice" },
    ],
  },
  sweetener: {
    name: "Sweetener",
    children: [
      { name: "Simple syrup" },
      { name: "Grenadine" },
      { name: "Orgeat" },
      { name: "Honey syrup" },
      { name: "Ginger syrup" },
      { name: "Agave syrup" },
    ],
  },
  dairy: {
    name: "Dairy",
    children: [
      { name: "Heavy cream" },
      { name: "Coconut milk" },
      { name: "Coconut cream" },
      { name: "Whipped cream" },
    ],
  },
  egg: {
    name: "Egg",
    children: [{ name: "Egg white" }, { name: "Egg yolk" }],
  },
  garnish: {
    name: "Garnish",
    children: [
      { name: "Lemon" },
      { name: "Lime" },
      { name: "Orange" },
      { name: "Cherry" },
      { name: "Mint" },
      { name: "Olive" },
      { name: "Pineapple" },
      { name: "Nutmeg" },
      { name: "Salt" },
      { name: "Coffee beans" },
    ],
  },
  other: {
    name: "Other",
    children: [
      { name: "Coffee" },
      { name: "Espresso" },
      { name: "Peach purée" },
      { name: "Olive brine" },
    ],
  },
};

// Hand-curated starter bars surfaced on the empty-state landing. Each pack
// lists canonical ingredient names; the home view resolves them to IDs
// against the catalog at click time.

export type StarterPack = {
  id: string;
  name: string;
  tagline: string;
  ingredients: string[];
};

export const STARTER_PACKS: StarterPack[] = [
  {
    id: "home",
    name: "Home bartender",
    tagline: "A balanced kit for making most classics on demand",
    ingredients: [
      "Gin",
      "Vodka",
      "Bourbon",
      "Light rum",
      "Tequila",
      "Triple sec",
      "Sweet vermouth",
      "Dry vermouth",
      "Lime juice",
      "Lemon juice",
      "Simple syrup",
      "Angostura bitters",
    ],
  },
  {
    id: "whiskey",
    name: "Whiskey shelf",
    tagline: "Stirred and spirit-forward — Manhattans, Old Fashioneds, Sazeracs",
    ingredients: [
      "Bourbon",
      "Rye",
      "Scotch",
      "Sweet vermouth",
      "Angostura bitters",
      "Peychaud's bitters",
      "Orange bitters",
      "Lemon juice",
      "Simple syrup",
      "Honey syrup",
      "Maraschino liqueur",
    ],
  },
  {
    id: "tiki",
    name: "Tiki starter",
    tagline: "Rum-forward, citrus-driven, tropical and easy",
    ingredients: [
      "Light rum",
      "Dark rum",
      "Gold rum",
      "Overproof rum",
      "Lime juice",
      "Pineapple juice",
      "Orgeat",
      "Grenadine",
      "Simple syrup",
      "Angostura bitters",
    ],
  },
  {
    id: "aperitif",
    name: "Aperitif hour",
    tagline: "Low-ABV, bitter, and bubbly for pre-dinner drinks",
    ingredients: [
      "Gin",
      "Sweet vermouth",
      "Dry vermouth",
      "Campari",
      "Aperol",
      "Prosecco",
      "Lemon juice",
      "Orange juice",
      "Soda water",
    ],
  },
];

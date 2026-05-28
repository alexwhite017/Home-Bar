// Substitution groups express interchangeability between siblings in the
// tree — cases where the category-tree alone doesn't make ingredients
// substitutable. A recipe calling for any member of a group is satisfied
// by any other member the user has on their bar.
//
// Note: synonyms (e.g. "club soda" = "soda water") are handled in the
// normalization map upstream, so they collapse to one ingredient before
// reaching here. Sub groups are only for genuinely distinct ingredients
// that bartenders accept as interchangeable.
//
// Member names must match canonical names in CATEGORY_TREE.
export const SUBSTITUTION_GROUPS: { name: string; members: string[] }[] = [
  {
    name: "Orange liqueurs",
    members: ["Triple sec", "Cointreau", "Grand Marnier"],
  },
];

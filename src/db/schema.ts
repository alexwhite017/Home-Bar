import {
  sqliteTable,
  integer,
  text,
  real,
  primaryKey,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

export const ingredients = sqliteTable("ingredients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  parentId: integer("parent_id").references(
    (): AnySQLiteColumn => ingredients.id,
  ),
});

export const substitutionGroups = sqliteTable("substitution_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const substitutionGroupMembers = sqliteTable(
  "substitution_group_members",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => substitutionGroups.id),
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.id),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.ingredientId] })],
);

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  externalId: text("external_id").unique(),
  name: text("name").notNull(),
  instructions: text("instructions").notNull(),
  glass: text("glass"),
  garnish: text("garnish"),
  imageUrl: text("image_url"),
});

export const recipeIngredients = sqliteTable(
  "recipe_ingredients",
  {
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id),
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.id),
    position: integer("position").notNull(),
    amount: real("amount"),
    unit: text("unit"),
    notation: text("notation").notNull(),
    optional: integer("optional", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.recipeId, t.position] })],
);

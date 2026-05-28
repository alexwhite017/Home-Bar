import { notFound } from "next/navigation";
import { loadCatalog } from "@/lib/catalog";
import { serializeCatalog } from "@/lib/catalog-types";
import { RecipeDetailView } from "@/components/recipe-detail-view";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipeId = Number(id);
  if (!Number.isFinite(recipeId)) notFound();

  const catalog = loadCatalog();
  const recipe = catalog.recipes.find((r) => r.id === recipeId);
  if (!recipe) notFound();

  return (
    <RecipeDetailView catalog={serializeCatalog(catalog)} recipe={recipe} />
  );
}

import { loadCatalog } from "@/lib/catalog";
import { serializeCatalog } from "@/lib/catalog-types";
import { HomeView } from "@/components/home-view";

export default function HomePage() {
  const catalog = loadCatalog();
  return <HomeView catalog={serializeCatalog(catalog)} />;
}

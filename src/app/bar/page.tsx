import { loadCatalog } from "@/lib/catalog";
import { serializeCatalog } from "@/lib/catalog-types";
import { BarView } from "@/components/bar-view";

export default function BarPage() {
  const catalog = loadCatalog();
  return <BarView catalog={serializeCatalog(catalog)} />;
}

import { Suspense } from "react";
import { loadCatalog } from "@/lib/catalog";
import { serializeCatalog } from "@/lib/catalog-types";
import { HomeView } from "@/components/home-view";

export default function HomePage() {
  const catalog = loadCatalog();
  return (
    <Suspense>
      <HomeView catalog={serializeCatalog(catalog)} />
    </Suspense>
  );
}

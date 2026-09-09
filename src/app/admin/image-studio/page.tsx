import { ImageStudio } from "@/components/admin/image-studio";
import type { StorageBackend, StudioProduct } from "@/components/admin/types";
import { hasOpenAI, hasSupabaseAdmin, isProduction } from "@/lib/env";
import { getProducts } from "@/lib/products";

/**
 * Protected brand-imagery tool. Access is enforced by the admin layout;
 * this page only decides what the client is allowed to know about the
 * server's configuration — booleans, never values.
 */

export const metadata = {
  title: "Image studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function storageBackend(): StorageBackend {
  if (hasSupabaseAdmin) return "supabase";
  return isProduction ? "none" : "local";
}

export default function ImageStudioPage() {
  const products: StudioProduct[] = getProducts().map((product) => ({
    slug: product.slug,
    name: product.name,
    line: product.line,
    flavor: product.flavor,
    category: product.category,
    description: product.description,
  }));

  return (
    <ImageStudio
      products={products}
      openAiConfigured={hasOpenAI}
      storageBackend={storageBackend()}
    />
  );
}

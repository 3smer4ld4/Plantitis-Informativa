
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = (
  process.env.SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [
    { data: categorias, error: errorCategorias },
    { data: plantas, error: errorPlantas },
  ] = await Promise.all([
    supabase
      .from("categorias")
      .select("slug, created_at")
      .order("nombre"),

    supabase
      .from("plantas")
      .select("id, updated_at")
      .order("id"),
  ]);

  if (errorCategorias) {
    throw new Error(
      `Error al generar sitemap de categorías: ${errorCategorias.message}`
    );
  }

  if (errorPlantas) {
    throw new Error(
      `Error al generar sitemap de plantas: ${errorPlantas.message}`
    );
  }

  const paginaPrincipal: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const paginasCategorias: MetadataRoute.Sitemap = (
    categorias ?? []
  ).map((categoria) => ({
    url: `${siteUrl}/categorias/${categoria.slug}`,
    lastModified: categoria.created_at
      ? new Date(categoria.created_at)
      : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const paginasPlantas: MetadataRoute.Sitemap = (
    plantas ?? []
  ).map((planta) => ({
    url: `${siteUrl}/plantas/${planta.id}`,
    lastModified: planta.updated_at
      ? new Date(planta.updated_at)
      : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...paginaPrincipal,
    ...paginasCategorias,
    ...paginasPlantas,
  ];
}

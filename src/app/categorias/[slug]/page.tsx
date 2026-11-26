import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSafeHttpUrl } from "@/lib/security/urls";

export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
};

type Imagen = {
  id: number;
  url: string;
  texto_alternativo: string | null;
  es_portada: boolean;
  orden: number;
};

type Planta = {
  id: number;
  nombre_cientifico: string;
  descripcion: string | null;
  imagenes: Imagen[] | null;
};

type RelacionPlanta = {
  planta_id: number;
  plantas: Planta | null;
};

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  planta_categorias: RelacionPlanta[] | null;
};

// Metadatos SEO dinámicos de cada categoría

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: categoria, error } = await supabase
    .from("categorias")
    .select("nombre, slug, descripcion")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !categoria) {
    return {
      title: "Categoría no encontrada",
      description: "La categoría solicitada no está disponible.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const titulo = categoria.nombre;

  const descripcion =
    categoria.descripcion?.trim().slice(0, 155) ||
    `Explora las plantas de la categoría ${titulo}, sus características e información botánica en Plantitis Informativa.`;

  const url = `/categorias/${categoria.slug}`;

  return {
    title: titulo,
    description: descripcion,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${titulo} | Plantitis Informativa`,
      description: descripcion,
      url,
      siteName: "Plantitis Informativa",
      locale: "es_SV",
      type: "website",
    },

    twitter: {
      card: "summary",
      title: `${titulo} | Plantitis Informativa`,
      description: descripcion,
    },
  };
}

export default async function CategoriaPage({
  params,
}: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select(`
      id,
      nombre,
      slug,
      descripcion,
      planta_categorias (
        planta_id,
        plantas (
          id,
          nombre_cientifico,
          descripcion,
          imagenes (
            id,
            url,
            texto_alternativo,
            es_portada,
            orden
          )
        )
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error al obtener la categoría:", error.message);

    return (
      <main className="min-h-screen bg-[#faf9f5] px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-700">
            No se pudo cargar la categoría
          </h1>

          <p className="mt-3 leading-7 text-gray-600">
            Intenta nuevamente más tarde.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-green-800 px-6 py-3 font-medium text-white transition hover:bg-green-900"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    notFound();
  }

  const categoria = data as unknown as Categoria;

  const plantas = (categoria.planta_categorias ?? [])
    .map((relacion) => relacion.plantas)
    .filter((planta): planta is Planta => planta !== null)
    .sort((a, b) =>
      a.nombre_cientifico.localeCompare(b.nombre_cientifico)
    );

  return (
    <main className="min-h-screen bg-[#faf9f5] text-gray-800">
      <header className="border-b border-stone-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-green-900 sm:text-2xl"
          >
            Plantitis Informativa
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-green-800 transition hover:bg-green-100"
        >
          <span aria-hidden="true" className="mr-2">
            ←
          </span>
          Volver al inicio
        </Link>

        <header className="mb-12 mt-8 rounded-3xl border border-green-100 bg-gradient-to-br from-green-100 via-[#f1f6e9] to-[#faf9f5] px-6 py-10 sm:px-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Catálogo botánico
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
            {categoria.nombre}
          </h1>

          {categoria.descripcion && (
            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600">
              {categoria.descripcion}
            </p>
          )}

          <div className="mt-6 inline-flex rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-medium text-green-900">
            {plantas.length}{" "}
            {plantas.length === 1
              ? "planta registrada"
              : "plantas registradas"}
          </div>
        </header>

        {plantas.length === 0 ? (
          <section className="rounded-3xl border border-green-100 bg-white px-6 py-14 text-center shadow-sm">
            <div className="text-5xl" aria-hidden="true">
              🌱
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Todavía no hay plantas en esta categoría
            </h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-gray-600">
              Próximamente agregaremos más información botánica para
              ampliar nuestro catálogo.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-full bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900"
            >
              Explorar otras categorías
            </Link>
          </section>
        ) : (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Plantas de esta categoría
              </h2>

              <p className="mt-2 text-gray-600">
                Conoce sus características y consulta sus fichas botánicas.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {plantas.map((planta) => {
                const imagenes = [...(planta.imagenes ?? [])].sort(
                  (a, b) =>
                    Number(b.es_portada) - Number(a.es_portada) ||
                    a.orden - b.orden
                );

                const portada = imagenes[0];
                const portadaUrl = getSafeHttpUrl(portada?.url);

                return (
                  <article
                    key={planta.id}
                    className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl"
                  >
                    <Link
                      href={`/plantas/${planta.id}`}
                      className="flex h-full flex-col"
                    >
                      {portadaUrl ? (
                        <div className="relative h-56 overflow-hidden bg-green-50">
                          <Image
                            src={portadaUrl}
                            alt={
                              portada?.texto_alternativo ??
                              planta.nombre_cientifico
                            }
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex h-56 items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-6xl transition-colors group-hover:from-green-100 group-hover:to-green-200">
                          🌿
                        </div>
                      )}

                      <div className="flex min-h-56 flex-1 flex-col p-6">
                        <h3 className="text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-green-800">
                          <span className="italic">
                            {planta.nombre_cientifico}
                          </span>
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                          {planta.descripcion ??
                            "Información botánica próximamente."}
                        </p>

                        <span className="mt-auto inline-flex items-center pt-6 font-semibold text-green-800 transition-colors group-hover:text-green-600">
                          Ver información
                          <span
                            className="ml-2 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <footer className="mt-12 bg-green-950 px-6 py-8 text-center text-sm text-green-100">
        <p>
          © 2026 Plantitis Informativa. Todos los derechos reservados
          para mi gato.
        </p>

        <p className="mt-2 text-green-200/70">
          Un proyecto educativo dedicado al conocimiento de las plantas.
        </p>
      </footer>
    </main>
  );
}
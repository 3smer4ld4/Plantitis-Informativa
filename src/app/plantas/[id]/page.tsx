
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSafeHttpUrl } from "@/lib/security/urls";

export const instant = false;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Imagen = {
  id: number;
  url: string;
  texto_alternativo: string | null;
  autor: string | null;
  licencia: string | null;
  fuente_url: string | null;
  es_portada: boolean;
  orden: number;
};

type NombreComun = {
  id: number;
  nombre: string;
  region: string | null;
  idioma: string | null;
};

type Familia = {
  id: number;
  nombre: string;
};

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
};

type RelacionCategoria = {
  categorias: Categoria[] | null;
};

type Fuente = {
  id: number;
  titulo: string;
  autores: string | null;
  publicacion: string | null;
  anio: number | null;
  url: string | null;
  tipo: string | null;
};

type RelacionUsoFuente = {
  fuentes: Fuente | Fuente[] | null;
};

type UsoDocumentado = {
  id: number;
  tipo: string;
  descripcion: string;
  contexto: string | null;
  observaciones: string | null;
  uso_fuentes: RelacionUsoFuente[] | null;
};

// Metadatos SEO dinámicos de cada planta
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const plantaId = Number(id);

  if (!Number.isInteger(plantaId) || plantaId <= 0) {
    return {
      title: "Planta no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const supabase = await createClient();

  const { data: planta } = await supabase
    .from("plantas")
    .select("nombre_cientifico, nombre_autoridad, descripcion")
    .eq("id", plantaId)
    .maybeSingle();

  if (!planta) {
    return {
      title: "Planta no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const titulo = planta.nombre_cientifico;

  const descripcion =
    planta.descripcion?.slice(0, 155) ||
    `Conoce las características, distribución y cuidados de ${titulo} en Plantitis Informativa.`;

  return {
    title: titulo,
    description: descripcion,

    alternates: {
      canonical: `/plantas/${plantaId}`,
    },

    openGraph: {
      title: `${titulo} | Plantitis Informativa`,
      description: descripcion,
      type: "article",
      siteName: "Plantitis Informativa",
    },

    twitter: {
      card: "summary",
      title: `${titulo} | Plantitis Informativa`,
      description: descripcion,
    },
  };
}

export default async function PlantaPage({ params }: Props) {
  const { id } = await params;
  const plantaId = Number(id);

  if (!Number.isInteger(plantaId) || plantaId <= 0) {
    notFound();
  }

  const supabase = await createClient();

  const { data: planta, error } = await supabase
    .from("plantas")
    .select(`
      id,
      nombre_cientifico,
      nombre_autoridad,
      descripcion,
      distribucion,
      origen,
      tipo_crecimiento,
      ciclo_vida,
      luz,
      riego,
      humedad,
      temperatura,
      suelo,
      dificultad,
      toxicidad,
      estado_conservacion,
      observaciones,

      imagenes (
        id,
        url,
        texto_alternativo,
        autor,
        licencia,
        fuente_url,
        es_portada,
        orden
      ),

      nombres_comunes (
        id,
        nombre,
        region,
        idioma
      ),

      familias_botanicas (
        id,
        nombre
      ),

      planta_categorias (
        categorias (
          id,
          nombre,
          slug
        )
      ),

      usos_documentados (
        id,
        tipo,
        descripcion,
        contexto,
        observaciones,

        uso_fuentes (
          fuentes (
            id,
            titulo,
            autores,
            publicacion,
            anio,
            url,
            tipo
          )
        )
      )
    `)
    .eq("id", plantaId)
    .maybeSingle();

  if (error) {
    console.error("Error al consultar la planta:", error);

    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-bold">
          No pudimos cargar la información
        </h1>

        <p className="mt-3 text-gray-600">
          Intenta nuevamente más tarde.
        </p>
      </main>
    );
  }

  if (!planta) {
    notFound();
  }

  // Fotografías
  const imagenes = [...((planta.imagenes ?? []) as Imagen[])].sort(
    (a, b) => {
      if (a.es_portada !== b.es_portada) {
        return Number(b.es_portada) - Number(a.es_portada);
      }

      return a.orden - b.orden;
    }
  );

  const imagenPortada = imagenes[0];

  // Validación de URL de la fotografía principal y su fuente
  const imagenPortadaUrl = getSafeHttpUrl(imagenPortada?.url);

  const imagenPortadaFuenteUrl = getSafeHttpUrl(
    imagenPortada?.fuente_url
  );

  // Nombres comunes
  const nombresComunes =
    (planta.nombres_comunes ?? []) as NombreComun[];

  // Familia botánica
  const familiaRelacion = planta.familias_botanicas as
    | Familia
    | Familia[]
    | null;

  const familia = Array.isArray(familiaRelacion)
    ? familiaRelacion[0]
    : familiaRelacion;

  // Categorías
  const relacionesCategoria =
    (planta.planta_categorias ?? []) as RelacionCategoria[];

  const categorias: Categoria[] = relacionesCategoria.flatMap(
    (relacion) => relacion.categorias ?? []
  );

  // Usos documentados
  const usosDocumentados =
    (planta.usos_documentados ?? []) as UsoDocumentado[];

  // Información botánica y cuidados
  const informacion = [
    ["Origen", planta.origen],
    ["Distribución", planta.distribucion],
    ["Crecimiento", planta.tipo_crecimiento],
    ["Ciclo de vida", planta.ciclo_vida],
    ["Iluminación", planta.luz],
    ["Riego", planta.riego],
    ["Humedad", planta.humedad],
    ["Temperatura", planta.temperatura],
    ["Suelo", planta.suelo],
    ["Dificultad", planta.dificultad],
    ["Toxicidad", planta.toxicidad],
    ["Estado de conservación", planta.estado_conservacion],
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">

      {/* Navegación */}
      <Link
        href="/"
        className="text-sm text-green-700 hover:underline"
      >
        ← Volver al inicio
      </Link>

      {/* Información principal */}
      <section className="mt-8">

        {/* Fotografía de portada */}
        {imagenPortadaUrl ? (
          <figure className="mb-8">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl">
              <Image
                src={imagenPortadaUrl}
                alt={
                  imagenPortada?.texto_alternativo ??
                  `Fotografía de ${planta.nombre_cientifico}`
                }
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>

            <figcaption className="mt-2 text-sm text-gray-500">
              {imagenPortada?.autor && (
                <span>
                  Fotografía: {imagenPortada.autor}
                </span>
              )}

              {imagenPortada?.licencia && (
                <span>
                  {" · "}Licencia: {imagenPortada.licencia}
                </span>
              )}

              {imagenPortadaFuenteUrl && (
                <>
                  {" · "}
                  <a
                    href={imagenPortadaFuenteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:underline"
                  >
                    Ver fuente
                  </a>
                </>
              )}
            </figcaption>
          </figure>
        ) : (
          <div className="mb-8 flex h-64 items-center justify-center rounded-2xl bg-green-50 text-green-800">
            Fotografía próximamente
          </div>
        )}

        <p className="text-sm font-medium uppercase tracking-wider text-green-700">
          Catálogo botánico
        </p>

        <h1 className="mt-2 text-4xl font-bold text-gray-900">
          {planta.nombre_cientifico}
        </h1>

        {planta.nombre_autoridad && (
          <p className="mt-2 italic text-gray-500">
            {planta.nombre_autoridad}
          </p>
        )}

        {familia && (
          <p className="mt-3 text-gray-600">
            <strong>Familia:</strong> {familia.nombre}
          </p>
        )}

        {planta.descripcion && (
          <p className="mt-6 text-lg leading-8 text-gray-700">
            {planta.descripcion}
          </p>
        )}

        {/* Nombres comunes */}
        {nombresComunes.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-gray-900">
              Nombres comunes
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">
              {nombresComunes.map((nombre) => (
                <span
                  key={nombre.id}
                  className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-800"
                >
                  {nombre.nombre}
                  {nombre.region && ` · ${nombre.region}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Categorías */}
        {categorias.length > 0 && (
          <div className="mt-5">
            <h2 className="font-semibold text-gray-900">
              Categorías
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">
              {categorias.map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/categorias/${categoria.slug}`}
                  className="rounded-full border border-green-200 px-3 py-1 text-sm text-green-800 hover:bg-green-50"
                >
                  {categoria.nombre}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Información botánica y cuidados */}
      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-bold text-gray-900">
          Información botánica y cuidados
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {informacion
            .filter(([, valor]) => valor)
            .map(([titulo, valor]) => (
              <article
                key={titulo}
                className="rounded-xl border border-gray-200 p-5"
              >
                <h3 className="font-semibold text-gray-900">
                  {titulo}
                </h3>

                <p className="mt-2 text-gray-600">
                  {valor}
                </p>
              </article>
            ))}
        </div>
      </section>

      {/* Usos documentados */}
      {usosDocumentados.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            Usos documentados
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {usosDocumentados.map((uso) => (
              <article
                key={uso.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-sm font-medium capitalize text-green-800">
                  {uso.tipo}
                </span>

                <p className="mt-4 leading-7 text-gray-700">
                  {uso.descripcion}
                </p>

                {uso.contexto && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900">
                      Contexto
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {uso.contexto}
                    </p>
                  </div>
                )}

                {uso.observaciones && (
                  <div className="mt-4 rounded-lg bg-amber-50 p-3">
                    <h3 className="font-semibold text-amber-900">
                      Observaciones
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      {uso.observaciones}
                    </p>
                  </div>
                )}

                {/* Fuentes bibliográficas */}
                {uso.uso_fuentes &&
                  uso.uso_fuentes.length > 0 && (
                    <div className="mt-5 border-t border-gray-200 pt-4">
                      <h3 className="font-semibold text-gray-900">
                        Fuentes consultadas
                      </h3>

                      <ul className="mt-3 space-y-3">
                        {uso.uso_fuentes.flatMap((relacion) => {
                          const fuentes = Array.isArray(
                            relacion.fuentes
                          )
                            ? relacion.fuentes
                            : relacion.fuentes
                              ? [relacion.fuentes]
                              : [];

                          return fuentes.map((fuente) => {
                            const fuenteUrl = getSafeHttpUrl(
                              fuente.url
                            );

                            return (
                              <li key={fuente.id}>
                                <p className="font-medium text-gray-800">
                                  {fuente.titulo}
                                </p>

                                {fuente.autores && (
                                  <p className="text-sm text-gray-600">
                                    {fuente.autores}
                                  </p>
                                )}

                                {fuente.publicacion && (
                                  <p className="text-sm text-gray-600">
                                    {fuente.publicacion}
                                  </p>
                                )}

                                {fuente.anio && (
                                  <p className="text-sm text-gray-600">
                                    Año: {fuente.anio}
                                  </p>
                                )}

                                {fuenteUrl && (
                                  <a
                                    href={fuenteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-block text-sm text-green-700 hover:underline"
                                  >
                                    Consultar fuente →
                                  </a>
                                )}
                              </li>
                            );
                          });
                        })}
                      </ul>
                    </div>
                  )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Observaciones generales */}
      {planta.observaciones && (
        <section className="mt-8 rounded-xl bg-green-50 p-6">
          <h2 className="font-semibold text-green-900">
            Observaciones generales
          </h2>

          <p className="mt-2 text-green-800">
            {planta.observaciones}
          </p>
        </section>
      )}

      {/* Galería de fotografías */}
      {imagenes.length > 1 && (
        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            Más fotografías
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {imagenes.slice(1).map((imagen) => {
              const imagenUrl = getSafeHttpUrl(imagen.url);

              const imagenFuenteUrl = getSafeHttpUrl(
                imagen.fuente_url
              );

              if (!imagenUrl) {
                return null;
              }

              return (
                <figure key={imagen.id}>
                  <div className="relative h-64 w-full overflow-hidden rounded-xl">
                    <Image
                      src={imagenUrl}
                      alt={
                        imagen.texto_alternativo ??
                        `Fotografía de ${planta.nombre_cientifico}`
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <figcaption className="mt-2 text-sm text-gray-500">
                    {imagen.autor && (
                      <span>
                        Fotografía: {imagen.autor}
                      </span>
                    )}

                    {imagen.licencia && (
                      <span>
                        {" · "}{imagen.licencia}
                      </span>
                    )}

                    {imagenFuenteUrl && (
                      <>
                        {" · "}
                        <a
                          href={imagenFuenteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:underline"
                        >
                          Ver fuente
                        </a>
                      </>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}

    </main>
  );
}

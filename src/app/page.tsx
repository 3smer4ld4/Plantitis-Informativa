import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/auth/actions";

export const instant = false;

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
};

const imagenesPorCategoria: Record<string, string> = {
  "plantas-interior":
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
  "plantas-exterior":
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
  cactus:
    "https://images.unsplash.com/photo-1509423350716-97f9360b4e09",
  suculentas:
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a",
  "plantas-acuaticas":
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
  "plantas-carnivoras":
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  "plantas-ornamentales":
    "https://images.unsplash.com/photo-1497250681960-ef046c08a56e",
  "plantas-comestibles":
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
  "plantas-medicinales":
    "https://images.unsplash.com/photo-1504545102780-26774c1bb073",
  "plantas-aromaticas":
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  arboles:
    "https://images.unsplash.com/photo-1448375240586-882707db888b",
  arbustos:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "plantas-trepadoras":
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc",
  "plantas-epifitas":
    "https://images.unsplash.com/photo-1509423350716-97f9360b4e09",
  "nativas-el-salvador":
    "https://images.unsplash.com/photo-1472396961693-142e6e269027",
  "endemicas-el-salvador":
    "https://images.unsplash.com/photo-1448375240586-882707db888b",
};

async function ListaCategorias() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, slug, descripcion")
    .order("nombre");

  if (error) {
    console.error("Error al cargar categorías:", error.message);

    return (
      <p className="rounded-xl bg-red-50 p-5 text-center text-red-700">
        No se pudieron cargar las categorías.
      </p>
    );
  }

  const listaCategorias: Categoria[] = data ?? [];

  if (listaCategorias.length === 0) {
    return (
      <p className="rounded-xl bg-stone-100 p-5 text-center text-gray-600">
        Todavía no hay categorías registradas.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listaCategorias.map((categoria) => (
        <article
          key={categoria.id}
          className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl"
        >
          <Link
            href={`/categorias/${categoria.slug}`}
            className="flex h-full flex-col"
          >
            <div className="relative h-56 overflow-hidden bg-green-50">
              <Image
                src={
                  imagenesPorCategoria[categoria.slug] ??
                  imagenesPorCategoria["plantas-interior"]
                }
                alt={`Imagen de ${categoria.nombre}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="flex min-h-52 flex-1 flex-col p-6">
              <h3 className="text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-green-800">
                {categoria.nombre}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                {categoria.descripcion ??
                  "Explora información y características de esta categoría botánica."}
              </p>

              <span className="mt-auto inline-block pt-5 font-semibold text-green-800 transition-colors group-hover:text-green-600">
                Explorar categoría
                <span aria-hidden="true"> →</span>
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

async function Navegacion() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav
      aria-label="Navegación principal"
      className="flex items-center gap-2"
    >
      <Link
        href="/"
        className="rounded-full px-4 py-2 font-medium text-green-900 transition hover:bg-green-50 hover:text-green-700"
      >
        Inicio
      </Link>

      {user ? (
        <>
          <Link
            href="/dashboard"
            className="rounded-full px-5 py-2 font-semibold text-green-800 transition hover:bg-green-50"
          >
            Mi cuenta
          </Link>

          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full bg-red-700 px-5 py-2 font-semibold text-white transition hover:bg-red-800"
            >
              Cerrar sesión
            </button>
          </form>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-full px-5 py-2 font-semibold text-green-800 transition hover:bg-green-50"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/registro"
            className="rounded-full bg-green-800 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-green-900"
          >
            Crear cuenta
          </Link>
        </>
      )}
    </nav>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f5] text-gray-800">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-green-900 sm:text-2xl"
          >
            Plantitis Informativa
          </Link>

          <Suspense fallback={<div className="h-10 w-40" />}>
            <Navegacion />
          </Suspense>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-green-100 via-[#f1f6e9] to-[#faf9f5] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full border border-green-200 bg-white/70 px-4 py-2 text-sm font-medium text-green-900">
            Enciclopedia botánica
          </span>

          <div className="mt-7 text-5xl" aria-hidden="true">
            🪴
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
            Descubre el fascinante mundo de las plantas
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            Un espacio informativo para conocer distintas especies vegetales,
            sus características, cuidados, distribución y usos documentados.
          </p>

          <a
            href="#categorias"
            className="mt-9 inline-flex items-center rounded-full bg-green-800 px-8 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-900 hover:shadow-md"
          >
            Explorar categorías
            <span className="ml-2" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>
      </section>

      <section
        id="categorias"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 sm:py-20"
      >
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Catálogo botánico
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explora nuestras categorías
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Encuentra plantas según sus características, formas de crecimiento
            y clasificación.
          </p>
        </div>

        <Suspense
          fallback={
            <p className="rounded-xl bg-white p-8 text-center text-gray-500">
              Cargando categorías...
            </p>
          }
        >
          <ListaCategorias />
        </Suspense>
      </section>

      <section className="border-y border-green-100 bg-green-50/70 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-4xl" aria-hidden="true">
            🌿
          </span>

          <h2 className="mt-5 text-2xl font-bold text-green-950 sm:text-3xl">
            Conocimiento botánico a tu alcance
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            Plantitis Informativa busca reunir información botánica organizada
            y accesible, promoviendo el conocimiento y la conservación de la
            diversidad vegetal.
          </p>
        </div>
      </section>

      <footer className="bg-green-950 px-6 py-8 text-center text-sm text-green-100">
        <p>
          © 2026 Plantitis Informativa. Todos los derechos reservados para mi
          gato.
        </p>

        <p className="mt-2 text-green-200/70">
          Un proyecto educativo dedicado al conocimiento de las plantas.
        </p>
      </footer>
    </main>
  );
}
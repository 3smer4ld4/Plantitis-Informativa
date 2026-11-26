
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Panel privado de usuario.",
  robots: {
    index: false,
    follow: false,
  },
};

async function DashboardContent() {
  // Espera a que exista una petición real antes de consultar la sesión.
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <section className="w-full max-w-2xl space-y-6 rounded-xl border p-8 shadow-sm">
      <div>
        <p className="text-sm font-medium text-green-700">
          Plantitis Informativa
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Mi cuenta
        </h1>

        <p className="mt-3 text-gray-600">
          Has iniciado sesión correctamente.
        </p>
      </div>

      <div className="rounded-lg bg-gray-100 p-4">
        <p className="text-sm text-gray-500">
          Correo de la cuenta
        </p>

        <p className="break-all font-medium">
          {user.email}
        </p>
      </div>

      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-lg bg-red-700 px-5 py-3 text-white hover:bg-red-800"
        >
          Cerrar sesión
        </button>
      </form>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="text-center" role="status">
            Cargando tu cuenta...
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </main>
  );
}

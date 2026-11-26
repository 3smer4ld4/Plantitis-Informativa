
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UpdatePasswordForm from "./update-password-form";

export const metadata: Metadata = {
  title: "Actualizar contraseña",
  description: "Establece una nueva contraseña para tu cuenta.",
  robots: {
    index: false,
    follow: false,
  },
};

async function ActualizarPasswordContent() {
  // Espera a una petición real antes de consultar la sesión.
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="w-full max-w-md space-y-6 rounded-xl border p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Nueva contraseña
        </h1>

        <p className="mt-2 text-gray-600">
          Introduce y confirma tu nueva contraseña.
        </p>
      </div>

      <UpdatePasswordForm />
    </section>
  );
}

export default function ActualizarPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="text-center" role="status">
            Verificando tu sesión...
          </div>
        }
      >
        <ActualizarPasswordContent />
      </Suspense>
    </main>
  );
}

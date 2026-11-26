
import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/app/auth/auth-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Regístrate en Plantitis Informativa y crea tu cuenta.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegistroPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-green-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Link
          href="/"
          className="mb-8 block text-center text-2xl font-bold text-green-800"
        >
          Plantitis Informativa
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Crear una cuenta
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Únete a nuestra comunidad botánica.
          </p>
        </div>

        <AuthForm mode="register" />
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import RecoveryForm from "./recovery-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Solicita instrucciones para recuperar tu contraseña.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecuperarPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md space-y-6 rounded-xl border p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
          <p className="mt-2 text-gray-600">
            Introduce tu correo electrónico para recibir instrucciones.
          </p>
        </div>

        <RecoveryForm />
      </section>
    </main>
  );
}
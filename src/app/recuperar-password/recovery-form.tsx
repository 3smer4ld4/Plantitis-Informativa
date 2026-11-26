"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/auth/actions";

export default function RecoveryForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className="w-full rounded-lg border p-3"
          placeholder="correo@ejemplo.com"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-red-600">
          {state.error}
        </p>
      )}

      {state.success && (
        <p role="status" className="text-green-700">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-green-700 p-3 text-white disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar instrucciones"}
      </button>

      <p className="text-center">
        <Link href="/login" className="text-green-700 underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </form>
  );
}
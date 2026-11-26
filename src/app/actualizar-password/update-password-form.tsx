"use client";

import { useActionState } from "react";
import { updatePasswordAction } from "@/app/auth/actions";

export default function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-2 block font-medium">
          Nueva contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block font-medium">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
          className="w-full rounded-lg border p-3"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-green-700 p-3 text-white disabled:opacity-50"
      >
        {pending ? "Actualizando..." : "Actualizar contraseña"}
      </button>
    </form>
  );
}
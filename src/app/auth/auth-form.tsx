
"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  signInAction,
  signUpAction,
} from "@/app/auth/actions";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";

  const action = isRegister ? signUpAction : signInAction;

  const [state, formAction, pending] = useActionState(
    action,
    {}
  );

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Correo electrónico
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="correo@ejemplo.com"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete={
            isRegister ? "new-password" : "current-password"
          }
          placeholder="Mínimo 8 caracteres"
          className={inputClass}
        />
      </div>

      {isRegister && (
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
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
            placeholder="Repite tu contraseña"
            className={inputClass}
          />
        </div>
      )}

      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      {state.success && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
        >
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? "Procesando..."
          : isRegister
            ? "Crear cuenta"
            : "Iniciar sesión"}
      </button>

      <div className="text-center text-sm text-gray-600">
        {isRegister ? (
          <>
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-green-700 hover:underline"
            >
              Inicia sesión
            </Link>
          </>
        ) : (
          <>
            ¿No tienes una cuenta? {" "}
            <Link
              href="/registro"
              className="font-semibold text-green-700 hover:underline"
            >
              Regístrate
            </Link>
          </>
        )}
      </div>

      {!isRegister && (
        <div className="text-center">
          <Link
            href="/recuperar-password"
            className="text-sm text-green-700 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      )}
    </form>
  );
}


"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type AuthResult = {
  error?: string;
  success?: string;
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signUpAction(
  _previousState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(
    formData.get("confirmPassword") ?? ""
  );

  if (!validateEmail(email)) {
    return { error: "Introduce un correo electrónico válido." };
  }

  if (password.length < 8) {
    return {
      error: "La contraseña debe tener al menos 8 caracteres.",
    };
  }

  if (password.length > 128) {
    return { error: "La contraseña es demasiado larga." };
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  const supabase = await createClient();

  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    return {
      error: "La aplicación no tiene configurada su URL.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error de registro:", error.message);

    return {
      error:
        "No fue posible completar el registro. Verifica tus datos e inténtalo nuevamente.",
    };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    success:
      "Registro recibido. Revisa tu correo electrónico para confirmar tu cuenta.",
  };
}

export async function signInAction(
  _previousState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  if (!validateEmail(email) || !password) {
    return {
      error: "Introduce un correo y una contraseña válidos.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: "Correo o contraseña incorrectos.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("No fue posible cerrar la sesión.");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
export async function requestPasswordResetAction(
  _previousState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!validateEmail(email)) {
    return { error: "Introduce un correo electrónico válido." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    return { error: "La aplicación no tiene configurada su URL." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/actualizar-password`,
  });

  if (error) {
    console.error("Error al solicitar recuperación:", error.message);
  }

  // Mensaje genérico para no revelar si el correo está registrado.
  return {
    success:
      "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.",
  };
}

export async function updatePasswordAction(
  _previousState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (password.length > 128) {
    return { error: "La contraseña es demasiado larga." };
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Error al actualizar contraseña:", error.message);
    return {
      error: "No fue posible actualizar la contraseña. Solicita un nuevo enlace.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/login?password=actualizada");
}
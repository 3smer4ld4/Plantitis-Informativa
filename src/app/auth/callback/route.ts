
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Solo permitimos redirecciones internas.
  const safeNext =
    next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", origin)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error al intercambiar el código:", error.message);

    return NextResponse.redirect(
      new URL("/login?error=auth_callback_failed", origin)
    );
  }

  return NextResponse.redirect(new URL(safeNext, origin));
}

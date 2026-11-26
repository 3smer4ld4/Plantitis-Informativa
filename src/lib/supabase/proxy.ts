import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Faltan las variables de entorno de Supabase.");
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });

        Object.entries(headers ?? {}).forEach(([key, value]) => {
          supabaseResponse.headers.set(key, value);
        });
      },
    },
  });

  // Comprueba los claims de la sesión y permite renovar los tokens.
  const { data, error } = await supabase.auth.getClaims();
  const hasSession = !error && Boolean(data?.claims);

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/actualizar-password"];
  const guestRoutes = ["/login", "/registro"];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isGuestRoute = guestRoutes.includes(pathname);

  function redirectWithCookies(destination: string) {
    const response = NextResponse.redirect(
      new URL(destination, request.url)
    );

    // Conserva las cookies que Supabase haya renovado.
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });

    return response;
  }

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);

    return redirectWithCookies(loginUrl.toString());
  }

  if (isGuestRoute && hasSession) {
    return redirectWithCookies("/dashboard");
  }

  return supabaseResponse;
}
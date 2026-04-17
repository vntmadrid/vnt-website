import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

let locales = ['en', 'es'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude Sanity studio, images, apis, etc. from being redirected
  if (pathname.startsWith("/studio") || pathname.startsWith("/api") || pathname.includes('.')) return;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Read computer's preferred language, fallback to EN
  const acceptLang = request.headers.get("accept-language") || "";
  const isSpanish = acceptLang.includes("es");
  const locale = isSpanish ? "es" : "en";

  // Redirect to /[lang]/...
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|studio).*)'],
}

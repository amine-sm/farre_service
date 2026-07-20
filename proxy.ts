import {
  NextRequest,
  NextResponse,
} from "next/server";

const COOKIE_NAME =
  "farre_admin_token";

export function proxy(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  const token =
    request.cookies.get(
      COOKIE_NAME
    )?.value;

  const isLoginPage =
    pathname ===
    "/admin/connexion";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(
      new URL(
        "/admin/connexion",
        request.url
      )
    );
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(
      new URL(
        "/admin/admin-acces",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
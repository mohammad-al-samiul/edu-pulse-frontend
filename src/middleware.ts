import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/register", "/"];

  // Check if the path is a public route
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route),
    )
  ) {
    // If user is already logged in, redirect to their dashboard
    if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      if (role === "INSTRUCTOR") {
        return NextResponse.redirect(
          new URL("/instructor/dashboard", request.url),
        );
      }
      if (role === "STUDENT") {
        return NextResponse.redirect(
          new URL("/student/dashboard", request.url),
        );
      }
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Role-based route protection
  // Admin routes - accessible by ADMIN and SUPER_ADMIN
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Instructor routes - accessible by INSTRUCTOR, ADMIN, and SUPER_ADMIN
  if (pathname.startsWith("/instructor")) {
    if (role !== "INSTRUCTOR" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Student routes - accessible by STUDENT, ADMIN, SUPER_ADMIN, and INSTRUCTOR
  if (pathname.startsWith("/student")) {
    if (
      role !== "STUDENT" &&
      role !== "ADMIN" &&
      role !== "SUPER_ADMIN" &&
      role !== "INSTRUCTOR"
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

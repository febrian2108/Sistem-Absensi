import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const protectedPaths = ["/students", "/dashboard", "/attendance"];
export const publicPaths = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;
  const isProtected = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );
  const isPublic = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const matcher = [
  "/students/:path*",
  "/dashboard/:path*",
  "/attendance/:path*",
  "/login",
  "/register",
  "/",
];

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/editor/**"];

export async function middleware(request: NextRequest) {
  // Continue normally
  return NextResponse.next();
}

export const config = {
  // Runs middleware on all routes except static assets and _next
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

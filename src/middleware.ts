import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Only protect API routes that require authentication
  const protectedApiPaths = [
    "/api/tutors/create",
    "/api/messages",
    // Add other protected API endpoints here
  ];

  const isProtectedApiPath = protectedApiPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedApiPath) {
    const session = request.cookies.get("session");
    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/tutors/create", "/api/messages/:path*"],
};

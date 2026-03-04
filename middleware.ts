import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Get the token from the request
    const token = request.cookies.get("authToken")?.value;

    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Get user information from cookie
    const userCookie = request.cookies.get("user")?.value;

    if (userCookie) {
      try {
        // Decode the user cookie
        const userStr = decodeURIComponent(userCookie);
        const user = JSON.parse(userStr);

        // Check if user has admin role (role should be 1 for admin)
        if (user.role !== 1) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

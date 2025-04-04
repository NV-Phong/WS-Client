import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
   const token = request.cookies.get("access_token");
   const root = ["/"];

   if (root.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
   }
   if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ["/((?!_next|auth|test).*)"],
};

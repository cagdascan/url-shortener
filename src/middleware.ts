import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  const res = await fetch(
    // TODO: get a better way to get alias
    `${process.env.NEXT_PUBLIC_HOST}/api/slug/${request.nextUrl.pathname
      .split("/")
      .pop()}`
  );
  const data = await res.json();
  if (data) {
    console.log("redirect url", data.longUrl);
    return NextResponse.redirect(
      // TODO: This is a hack. Need a better way to create URL
      new URL(`http://${data.longUrl}`, request.url)
    );
  }
}

export const config = {
  matcher: "/u/:path*",
};

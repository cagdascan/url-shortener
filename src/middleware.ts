import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

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

  if (data?.longUrl) {
    try {
      const url = isValidUrl(data.longUrl)
        ? new URL(data.longUrl)
        : new URL(`https://${data.longUrl}`);
      return NextResponse.redirect(url);
    } catch (error) {
      return NextResponse.redirect(
        new URL("/not-found", process.env.NEXT_PUBLIC_HOST)
      );
    }
  }

  return NextResponse.redirect(
    new URL("/not-found", process.env.NEXT_PUBLIC_HOST)
  );
}

export const config = {
  matcher: "/u/:path*",
};

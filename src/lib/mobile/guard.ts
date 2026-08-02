import { NextResponse } from "next/server";

// Defense in depth: middleware.ts (matcher: /api/mobile/:path*) always
// authenticates and stamps this header before a request reaches here. If
// it's missing, either the route was hit in a way that bypassed the
// middleware or something is misconfigured — refuse either way.
export function requireStoreKey(request: Request): { keyId: string } | NextResponse {
  const keyId = request.headers.get("x-store-key-id");
  if (!keyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { keyId };
}

export function isGuardResponse(v: unknown): v is NextResponse {
  return v instanceof NextResponse;
}

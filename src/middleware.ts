import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { sha256Hex } from "@/lib/mobile/crypto";

// Gates every /api/mobile/* route behind a Store API Key (Authorization:
// Bearer <key>). Runs before the route handler, so a missing/invalid/revoked
// key never reaches application code. Also enforces a rolling-window rate
// limit and writes an audit log row per request — both backed by Supabase via
// plain fetch (PostgREST) rather than the supabase-js client, which keeps
// this edge-safe without pulling in extra dependencies.
export const config = {
  matcher: ["/api/mobile/:path*"],
};

const RATE_LIMIT_PER_MINUTE = 120;

function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

async function restFetch(base: string, serviceKey: string, path: string, init?: RequestInit) {
  return fetch(`${base}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(init?.headers || {}),
    },
  });
}

async function logRequest(
  base: string,
  serviceKey: string,
  request: NextRequest,
  apiKeyId: string | null,
  statusCode: number
) {
  try {
    await restFetch(base, serviceKey, "/mobile_api_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        api_key_id: apiKeyId,
        device_id: request.headers.get("x-device-id"),
        platform: request.headers.get("x-device-platform"),
        app_version: request.headers.get("x-app-version"),
        ip: request.headers.get("x-forwarded-for"),
        method: request.method,
        path: new URL(request.url).pathname,
        status_code: statusCode,
      }),
    });
  } catch {
    // Logging is best-effort; never let it break the actual request.
  }
}

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !serviceKey) {
    return NextResponse.json({ error: "Store API is not configured." }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return unauthorized("Missing bearer token.");

  const rawKey = match[1].trim();
  const keyHash = await sha256Hex(rawKey);

  const lookupRes = await restFetch(
    base,
    serviceKey,
    `/store_api_keys?key_hash=eq.${keyHash}&revoked_at=is.null&select=id,label`
  );
  const rows: { id: string; label: string }[] = lookupRes.ok ? await lookupRes.json() : [];
  const keyRow = rows[0];
  if (!keyRow) {
    event.waitUntil(logRequest(base, serviceKey, request, null, 401));
    return unauthorized("Invalid or revoked API key.");
  }

  // Rolling 60s window rate limit for this key.
  const since = new Date(Date.now() - 60_000).toISOString();
  const countRes = await restFetch(
    base,
    serviceKey,
    `/mobile_api_logs?api_key_id=eq.${keyRow.id}&created_at=gte.${since}&select=id`,
    { headers: { Prefer: "count=exact", Range: "0-0" } }
  );
  const contentRange = countRes.headers.get("content-range") || "";
  const total = Number(contentRange.split("/")[1] || 0);
  if (total >= RATE_LIMIT_PER_MINUTE) {
    event.waitUntil(logRequest(base, serviceKey, request, keyRow.id, 429));
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  // Non-blocking bookkeeping: bump last_used_at and write the audit log row.
  event.waitUntil(
    Promise.all([
      restFetch(base, serviceKey, `/store_api_keys?id=eq.${keyRow.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ last_used_at: new Date().toISOString() }),
      }),
      logRequest(base, serviceKey, request, keyRow.id, 200),
    ])
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-store-key-id", keyRow.id);
  requestHeaders.set("x-store-key-label", keyRow.label || "");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

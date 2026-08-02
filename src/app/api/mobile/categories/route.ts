import { NextResponse } from "next/server";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import { buildCategoryCounts } from "@/lib/mobile/catalogue";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  return NextResponse.json({ categories: buildCategoryCounts() });
}

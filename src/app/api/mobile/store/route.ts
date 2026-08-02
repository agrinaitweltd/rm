import { NextResponse } from "next/server";
import { site, DELIVERY_FEE_PENCE } from "@/lib/site";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import type { MobileStoreInfo } from "@/lib/mobile/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  const body: MobileStoreInfo = {
    name: site.name,
    logo: `${site.url}/logo-2.png`,
    currency: "GBP",
    deliveryFee: DELIVERY_FEE_PENCE,
    version: "1.0.0",
  };
  return NextResponse.json(body);
}

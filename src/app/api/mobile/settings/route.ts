import { NextResponse } from "next/server";
import { site, DELIVERY_FEE_PENCE } from "@/lib/site";
import { requireStoreKey, isGuardResponse } from "@/lib/mobile/guard";
import type { MobileSettings } from "@/lib/mobile/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const guard = requireStoreKey(request);
  if (isGuardResponse(guard)) return guard;

  const body: MobileSettings = {
    email: site.email,
    phone: site.phoneDisplay,
    whatsapp: site.whatsapp,
    deliveryFee: DELIVERY_FEE_PENCE,
    currency: "GBP",
  };
  return NextResponse.json(body);
}

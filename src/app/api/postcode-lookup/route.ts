import { NextResponse } from "next/server";

export const runtime = "nodejs";

type IdealPostcodesAddress = {
  line_1: string;
  line_2: string;
  line_3: string;
  post_town: string;
  county: string;
  postcode: string;
};

// Looks up real addresses for a UK postcode via Ideal Postcodes, server-side
// (the API key never reaches the browser). Returns an empty list — never an
// error the customer can't recover from — whenever the key is missing or the
// lookup fails, so the checkout form always falls back to manual entry.
export async function GET(request: Request) {
  const postcode = new URL(request.url).searchParams.get("postcode")?.trim();
  if (!postcode) {
    return NextResponse.json({ error: "Missing postcode." }, { status: 400 });
  }

  const apiKey = process.env.IDEAL_POSTCODES_API_KEY;
  if (!apiKey) {
    // Not configured yet — the frontend treats this the same as "no matches
    // found" and offers manual entry immediately.
    return NextResponse.json({ addresses: [] });
  }

  try {
    const res = await fetch(
      `https://api.ideal-postcodes.co.uk/v1/postcodes/${encodeURIComponent(postcode)}?api_key=${encodeURIComponent(apiKey)}`,
      { next: { revalidate: 0 } }
    );

    if (res.status === 404) {
      // Valid-shaped postcode, but Ideal Postcodes has no addresses for it.
      return NextResponse.json({ addresses: [] });
    }
    if (!res.ok) {
      console.error("[postcode-lookup] Ideal Postcodes error:", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ addresses: [] });
    }

    const body = await res.json();
    const results: IdealPostcodesAddress[] = body?.result || [];
    const addresses = results.map((a) => ({
      line1: a.line_1,
      line2: [a.line_2, a.line_3].filter(Boolean).join(", "),
      city: a.post_town,
      county: a.county,
      postcode: a.postcode,
    }));
    return NextResponse.json({ addresses });
  } catch (err) {
    console.error("[postcode-lookup] request failed:", err);
    return NextResponse.json({ addresses: [] });
  }
}

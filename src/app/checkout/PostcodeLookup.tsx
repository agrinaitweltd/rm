"use client";

import { useState } from "react";

export type LookedUpAddress = {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
};

// Postcode-first address entry: type a postcode, pick from the real addresses
// registered at it. If none are found (or the lookup isn't configured yet),
// the customer can always fall back to typing their address manually in the
// fields below this — nothing here is required to proceed.
export default function PostcodeLookup({ onSelect }: { onSelect: (address: LookedUpAddress) => void }) {
  const [postcode, setPostcode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "results" | "none">("idle");
  const [addresses, setAddresses] = useState<LookedUpAddress[]>([]);
  const [manual, setManual] = useState(false);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    if (!postcode.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/postcode-lookup?postcode=${encodeURIComponent(postcode.trim())}`);
      const data = await res.json().catch(() => ({ addresses: [] }));
      const found: LookedUpAddress[] = data.addresses || [];
      setAddresses(found);
      setStatus(found.length > 0 ? "results" : "none");
    } catch {
      setStatus("none");
    }
  }

  if (manual) return null; // customer chose to type it manually — get out of the way

  return (
    <div className="rm-postcode-lookup">
      {status !== "results" && (
        // A plain div, not <form> — this sits inside the page's own checkout
        // <form>, and nested <form> elements are invalid HTML (browsers
        // silently drop them, which broke submission entirely).
        <div className="rm-postcode-row">
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), lookup())}
            placeholder="Enter your postcode"
            maxLength={10}
            aria-label="Postcode"
          />
          <button type="button" onClick={() => lookup()} disabled={status === "loading" || !postcode.trim()}>
            {status === "loading" ? "…" : "Find address"}
          </button>
        </div>
      )}

      {status === "none" && (
        <p className="rm-postcode-none">
          We couldn&rsquo;t find that postcode.{" "}
          <button type="button" className="rm-postcode-link" onClick={() => setManual(true)}>
            Enter address manually
          </button>
        </p>
      )}

      {status === "results" && (
        <div className="rm-postcode-results">
          <p className="rm-postcode-results-label">{addresses.length} address{addresses.length === 1 ? "" : "es"} found</p>
          <ul>
            {addresses.map((addr, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(addr);
                    setManual(true); // done — hand off to the (now pre-filled) fields
                  }}
                >
                  {[addr.line1, addr.line2, addr.city, addr.postcode].filter(Boolean).join(", ")}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="rm-postcode-link" onClick={() => setManual(true)}>
            None of these — enter manually
          </button>
        </div>
      )}
    </div>
  );
}

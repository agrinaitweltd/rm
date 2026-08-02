// Uses only Web Crypto (globalThis.crypto), which is available in both the
// Node.js API routes and the Edge middleware — one implementation, no risk of
// the two runtimes hashing a key differently.

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// rmm_live_<43 url-safe base64 chars> — 256 bits of entropy.
export function generateApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64url = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `rmm_live_${b64url}`;
}

// What's safe to display in the admin UI once the raw key is gone.
export function keyPrefix(rawKey: string): string {
  return rawKey.slice(0, 16);
}

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Simple, secret-less-storage admin session: the cookie holds an HMAC derived
// from ADMIN_PASSWORD, so it can only be produced by someone who knows the
// password and can't be forged. No user accounts to create manually.
export const ADMIN_COOKIE = "rm_admin";

function expectedToken(): string {
  const password = process.env.ADMIN_PASSWORD || "";
  return createHmac("sha256", password).update("rm-admin-session-v1").digest("hex");
}

export function makeSessionToken(): string {
  return expectedToken();
}

export function verifyPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD || "";
  if (!password) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthed(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = expectedToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

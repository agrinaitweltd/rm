import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sha256Hex } from "@/lib/mobile/crypto";

export const OTP_EXPIRY_MINUTES = 10;
export const MAX_OTP_ATTEMPTS = 5;

export function generateOtp(): string {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
}

export function hashOtp(code: string): Promise<string> {
  return sha256Hex(code);
}

// supabase-js's admin API has no "get user by email" — only paginated
// listUsers — so this walks pages until it finds a match or runs out.
export async function findAuthUserByEmail(supabase: SupabaseClient, email: string) {
  const perPage = 200;
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error || !data) return null;
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < perPage) return null;
  }
  return null;
}

export async function sendOtpEmail(email: string, code: string, purpose: "signup" | "reset") {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  const resend = new Resend(apiKey);

  const heading = purpose === "signup" ? "Verify your email" : "Reset your password";
  const body =
    purpose === "signup"
      ? "Enter this code in the RM Mangoes app to verify your email and finish creating your account."
      : "Enter this code in the RM Mangoes app to reset your password.";

  await resend.emails.send({
    from: "RM Mangoes <noreply@rmmangoes.co.uk>",
    to: email,
    subject: `${code} — your RM Mangoes verification code`,
    html: `
      <div style="background:#0B0B0B;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">
        <div style="max-width:420px;margin:0 auto;background:#161616;border-radius:12px;padding:32px 28px;color:#f5f5f5">
          <h2 style="margin:0 0 8px;color:#f6a200;font-size:20px">${heading}</h2>
          <p style="margin:0 0 24px;color:#c9c9c9;font-size:14px;line-height:1.5">${body}</p>
          <div style="background:#0B0B0B;border:1px solid #f6a200;border-radius:8px;padding:18px;text-align:center;margin-bottom:20px">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#f6a200">${code}</span>
          </div>
          <p style="margin:0;color:#8b8b8b;font-size:13px">This code expires in ${OTP_EXPIRY_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      </div>`,
  });
}

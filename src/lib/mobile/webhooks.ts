import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export type WebhookEvent = "order.created" | "order.status_changed" | "stock.low" | "promo.redeemed";

type WebhookEndpoint = {
  id: string;
  url: string;
  event_types: string[];
  secret: string | null;
};

// Best-effort fan-out to admin-registered outbound webhooks (webhook_endpoints
// in this same Supabase project). Never throws — a receiver being down or
// slow must never break the order/stock/promo flow that triggered the event.
export async function dispatchWebhookEvent(event: WebhookEvent, data: Record<string, unknown>) {
  try {
    const supabase = createAdminClient();
    const { data: endpoints, error } = await supabase
      .from("webhook_endpoints")
      .select("id, url, event_types, secret")
      .eq("active", true)
      .contains("event_types", [event]);

    if (error || !endpoints?.length) return;

    const sentAt = new Date().toISOString();
    const payload = JSON.stringify({ event, data, sent_at: sentAt });

    await Promise.all(
      (endpoints as WebhookEndpoint[]).map((endpoint) => deliverOne(supabase, endpoint, payload))
    );
  } catch (err) {
    console.error("[webhooks] dispatch failed:", err);
  }
}

async function deliverOne(
  supabase: ReturnType<typeof createAdminClient>,
  endpoint: WebhookEndpoint,
  payload: string
) {
  let status: string;
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (endpoint.secret) {
      headers["X-Webhook-Signature"] = crypto
        .createHmac("sha256", endpoint.secret)
        .update(payload)
        .digest("hex");
    }
    const res = await fetch(endpoint.url, { method: "POST", headers, body: payload });
    status = `${res.status}`;
  } catch (err) {
    status = `error: ${(err as Error).message}`.slice(0, 200);
  }

  const { error } = await supabase
    .from("webhook_endpoints")
    .update({ last_triggered_at: new Date().toISOString(), last_status: status })
    .eq("id", endpoint.id);
  if (error) console.error("[webhooks] failed to update endpoint status:", error.message);
}

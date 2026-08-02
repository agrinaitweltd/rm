"use client";

import { useCallback, useEffect, useState } from "react";

type KeyInfo = {
  id: string;
  label: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
};

type StatusResponse = {
  key: KeyInfo | null;
  connectedDevices: number;
  lastSync: string | null;
};

type Device = {
  id: string;
  device_name: string | null;
  platform: string | null;
  app_version: string | null;
  last_sync_at: string | null;
  created_at: string;
  disconnected_at: string | null;
};

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "Never";

export default function StoreConnectionPanel() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const [statusRes, devicesRes] = await Promise.all([
        fetch("/api/admin/store-connection"),
        fetch("/api/admin/store-connection/devices"),
      ]);
      if (!statusRes.ok || !devicesRes.ok) throw new Error();
      setStatus(await statusRes.json());
      setDevices((await devicesRes.json()).devices);
    } catch {
      setError("Could not load Store Connection settings.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runAction(action: "generate" | "regenerate" | "revoke") {
    if (action === "revoke" && !confirm("Revoke the Store API Key? Every connected app will stop syncing immediately.")) {
      return;
    }
    if (action === "regenerate" && !confirm("Regenerate the key? The old key stops working immediately.")) {
      return;
    }
    setBusy(true);
    setError("");
    setRevealedKey(null);
    try {
      const res = await fetch("/api/admin/store-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed.");
      if (data.rawKey) setRevealedKey(data.rawKey);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    }
    setBusy(false);
  }

  async function copyKey() {
    if (!revealedKey) return;
    try {
      await navigator.clipboard.writeText(revealedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. non-HTTPS) — the key is still selectable text.
    }
  }

  async function disconnectDevice(id: string) {
    if (!confirm("Disconnect this device? It will need the API key entered again to resync.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/store-connection/devices/${id}`, { method: "POST" });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setError("Could not disconnect that device.");
    }
    setBusy(false);
  }

  if (loading) {
    return (
      <section className="rm-admin-stock">
        <h2>Store Connection</h2>
        <p className="rm-admin-stock-hint">Loading…</p>
      </section>
    );
  }

  const key = status?.key ?? null;
  const syncStatus = !key ? "No key" : status?.lastSync ? "Active" : "Never connected";
  const syncBadgeClass = !key ? "rm-admin-badge--off" : status?.lastSync ? "rm-admin-badge--on" : "rm-admin-badge--warn";

  return (
    <>
      <section className="rm-admin-stock">
        <h2>Store API Key</h2>
        <p className="rm-admin-stock-hint">
          Lets the RM Mangoes mobile app securely sync the live catalogue, stock and orders from this website. The
          website stays the single source of truth — the app never stores its own master data.
        </p>

        {error && <p className="rm-admin-error">{error}</p>}

        {revealedKey && (
          <div className="rm-admin-key-reveal">
            <p>
              <strong>Copy this now</strong> — it won&apos;t be shown again.
            </p>
            <div className="rm-admin-key-reveal-row">
              <code>{revealedKey}</code>
              <button type="button" onClick={copyKey}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div className="rm-admin-key-grid">
          <div>
            <span className="rm-admin-key-label">Store API Key</span>
            <span className="rm-admin-key-value">{key ? `${key.keyPrefix}••••••••••••••••` : "Not generated"}</span>
          </div>
          <div>
            <span className="rm-admin-key-label">Last generated</span>
            <span className="rm-admin-key-value">{key ? when(key.createdAt) : "—"}</span>
          </div>
          <div>
            <span className="rm-admin-key-label">Last used</span>
            <span className="rm-admin-key-value">{key ? when(key.lastUsedAt) : "—"}</span>
          </div>
          <div>
            <span className="rm-admin-key-label">Connected apps</span>
            <span className="rm-admin-key-value">{status?.connectedDevices ?? 0}</span>
          </div>
          <div>
            <span className="rm-admin-key-label">Sync status</span>
            <span className={`rm-admin-badge ${syncBadgeClass}`}>{syncStatus}</span>
          </div>
        </div>

        <div className="rm-admin-key-actions">
          {!key && (
            <button type="button" disabled={busy} onClick={() => runAction("generate")}>
              Generate API Key
            </button>
          )}
          {key && (
            <>
              <button type="button" disabled={busy} onClick={() => runAction("regenerate")}>
                Regenerate
              </button>
              <button type="button" className="rm-admin-promo-delete" disabled={busy} onClick={() => runAction("revoke")}>
                Revoke
              </button>
            </>
          )}
        </div>
      </section>

      <section className="rm-admin-stock">
        <h2>Connected Devices</h2>
        {!devices || devices.length === 0 ? (
          <p className="rm-admin-empty">No devices have synced yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Platform</th>
                <th>Version</th>
                <th>Last sync</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id}>
                  <td>{d.device_name || "Unnamed device"}</td>
                  <td>{d.platform || "—"}</td>
                  <td>{d.app_version || "—"}</td>
                  <td>{when(d.last_sync_at)}</td>
                  <td>
                    <span className={`rm-admin-badge ${d.disconnected_at ? "rm-admin-badge--off" : "rm-admin-badge--on"}`}>
                      {d.disconnected_at ? "Disconnected" : "Connected"}
                    </span>
                  </td>
                  <td>
                    {!d.disconnected_at && (
                      <button type="button" className="rm-admin-promo-delete" disabled={busy} onClick={() => disconnectDevice(d.id)}>
                        Disconnect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

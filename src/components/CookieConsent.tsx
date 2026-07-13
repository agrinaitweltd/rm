"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

const STORAGE_KEY = "rm-cookie-consent";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

/**
 * GDPR cookie banner with Accept All / Reject Non-Essential / Manage
 * Preferences. The visitor's choice is persisted to localStorage so the
 * banner does not reappear on subsequent visits.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let stored = false;
    try {
      stored = Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      stored = false;
    }
    if (stored) return;
    // Small delay so it animates in after the page settles.
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  const persist = (consent: Consent) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...consent, ts: Date.now() }),
      );
    } catch {
      /* storage unavailable — ignore */
    }
    setVisible(false);
  };

  const acceptAll = () =>
    persist({ necessary: true, analytics: true, marketing: true });
  const rejectNonEssential = () =>
    persist({ necessary: true, analytics: false, marketing: false });
  const savePreferences = () =>
    persist({ necessary: true, analytics, marketing });

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5 motion-safe:animate-[cookieUp_0.5s_cubic-bezier(0.22,1,0.36,1)]"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <style>{`@keyframes cookieUp{from{transform:translateY(120%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div className="container-x">
        <div className="mx-auto max-w-4xl rounded-2xl border border-black/5 bg-white p-5 shadow-2xl shadow-black/10 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 hidden shrink-0 rounded-xl bg-brand-100 p-2 text-brand-700 sm:block">
              <Icon name="leaf" size={22} />
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-ink">We value your privacy</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                We use cookies to keep the site running smoothly, remember your
                preferences and understand how it&apos;s used. You can accept
                all, reject non-essential cookies, or manage your choices.
              </p>

              {managing && (
                <div className="mt-4 space-y-3 rounded-xl bg-cream p-4">
                  <label className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        Strictly necessary
                      </span>
                      <span className="text-xs text-muted">
                        Required for the site to function. Always on.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="h-5 w-5 accent-brand-600"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        Analytics
                      </span>
                      <span className="text-xs text-muted">
                        Helps us improve the site with anonymous usage data.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="h-5 w-5 accent-brand-600"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        Marketing
                      </span>
                      <span className="text-xs text-muted">
                        Used to show you relevant offers and content.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="h-5 w-5 accent-brand-600"
                    />
                  </label>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
                >
                  Reject Non-Essential
                </button>
                {managing ? (
                  <button
                    type="button"
                    onClick={savePreferences}
                    className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
                  >
                    Save Preferences
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setManaging(true)}
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    Manage Preferences
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

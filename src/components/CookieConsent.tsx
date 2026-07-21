"use client";

import { useEffect, useState } from "react";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "rm-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  // Only show the banner if the visitor has never made a choice — previously
  // this wasn't persisted at all, so it reappeared on every page.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const close = (consent: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, decidedAt: Date.now() }));
    } catch {
      /* storage blocked — banner will just reappear next visit */
    }
    setVisible(false);
  };

  return (
    <div className="rm-cookie-banner" role="dialog" aria-modal="false" aria-label="Cookie consent">
      <h3>We value your privacy</h3>
      <p>
        We use cookies to make our website work and to understand how it is used. You can accept all cookies, reject
        non-essential cookies, or manage your preferences.
      </p>
      {showPrefs && (
        <div className="rm-cookie-prefs">
          <div className="rm-cookie-pref">
            <label>
              <strong>Essential</strong>
              <span>Required for the website to function. Always on.</span>
            </label>
            <input type="checkbox" checked disabled aria-label="Essential cookies (always on)" />
          </div>
          <div className="rm-cookie-pref">
            <label htmlFor="rm-cookie-analytics">
              <strong>Analytics</strong>
              <span>Help us understand how visitors use the site.</span>
            </label>
            <input
              id="rm-cookie-analytics"
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
          </div>
          <div className="rm-cookie-pref">
            <label htmlFor="rm-cookie-marketing">
              <strong>Marketing</strong>
              <span>Used to show relevant offers and content.</span>
            </label>
            <input
              id="rm-cookie-marketing"
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
          </div>
        </div>
      )}
      <div className="rm-cookie-actions">
        <button
          type="button"
          className="rm-cookie-btn rm-cookie-btn--accept"
          onClick={() => close({ essential: true, analytics: true, marketing: true })}
        >
          Accept All
        </button>
        <button
          type="button"
          className="rm-cookie-btn rm-cookie-btn--reject"
          onClick={() => close({ essential: true, analytics: false, marketing: false })}
        >
          Reject Non-Essential
        </button>
        {showPrefs ? (
          <button
            type="button"
            className="rm-cookie-btn rm-cookie-btn--manage"
            onClick={() => close({ essential: true, analytics, marketing })}
          >
            Save Preferences
          </button>
        ) : (
          <button type="button" className="rm-cookie-btn rm-cookie-btn--manage" onClick={() => setShowPrefs(true)}>
            Manage Preferences
          </button>
        )}
      </div>
    </div>
  );
}

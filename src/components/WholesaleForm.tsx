"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

// reCAPTCHA site keys are public by design; the secret stays server-side.
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfAwlQtAAAAAFkqBF7edcECWDMhYaV7RV36fiLe";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

function getRecaptchaToken(): Promise<string> {
  const grecaptcha = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
  if (!SITE_KEY || !grecaptcha) return Promise.resolve("");
  return new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(SITE_KEY, { action: "wholesale_enquiry" })
        .then(resolve)
        .catch(() => resolve(""));
    });
  });
}

export default function WholesaleForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Load the reCAPTCHA v3 script once; its badge sits bottom-right by default.
  useEffect(() => {
    if (!SITE_KEY || document.getElementById("recaptcha-v3")) return;
    const script = document.createElement("script");
    script.id = "recaptcha-v3";
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setErrorMsg("");
    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(body.error || "Sorry, something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Sorry, something went wrong. Please check your connection and try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rm-wholesale-form rm-wholesale-success" role="status">
        <img className="rm-status-mark" src="/icon-mango.svg" alt="" width={120} height={120} />
        <h3>Thank you!</h3>
        <p>Your wholesale enquiry has been sent. Check your inbox — we&rsquo;ve emailed you a confirmation.</p>
      </div>
    );
  }

  return (
    <form className="rm-wholesale-form" onSubmit={handleSubmit}>
      <div className="rm-form-row">
        <label>
          Business name *
          <input name="business" type="text" required maxLength={200} placeholder="Your shop or restaurant" />
        </label>
        <label>
          Your name *
          <input name="name" type="text" required maxLength={200} placeholder="Full name" />
        </label>
      </div>
      <div className="rm-form-row">
        <label>
          Email *
          <input name="email" type="email" required maxLength={200} placeholder="you@business.co.uk" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" maxLength={50} placeholder="+44 ..." />
        </label>
      </div>
      <label>
        Estimated quantity
        <input name="quantity" type="text" maxLength={200} placeholder="e.g. 20 boxes per week" />
      </label>
      <label>
        Message *
        <textarea name="message" required rows={5} maxLength={5000} placeholder="Tell us about your business and what you need" />
      </label>
      {status === "error" && <p className="rm-form-error" role="alert">{errorMsg}</p>}
      <button type="submit" className="elementor-button elementor-size-md rm-form-submit" disabled={status === "sending"}>
        <span className="elementor-button-text">{status === "sending" ? "Sending…" : "Send enquiry"}</span>
      </button>
      <p className="rm-form-recaptcha-note">
        Protected by reCAPTCHA — Google{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy</a> &amp;{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms</a> apply.
      </p>
    </form>
  );
}

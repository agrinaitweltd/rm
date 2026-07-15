"use client";

import { useEffect } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfAwlQtAAAAAFkqBF7edcECWDMhYaV7RV36fiLe";

// Loads reCAPTCHA v3 on every page so its badge is always visible bottom-right
// (the cart button is lifted clear of it in CSS). Same element id as the
// WholesaleForm loader, so the script is never added twice.
export default function RecaptchaLoader() {
  useEffect(() => {
    if (!SITE_KEY || document.getElementById("recaptcha-v3")) return;
    const script = document.createElement("script");
    script.id = "recaptcha-v3";
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);
  return null;
}

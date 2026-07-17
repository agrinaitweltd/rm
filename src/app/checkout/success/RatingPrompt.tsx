"use client";

import { useState } from "react";

// Post-payment feedback: pick 1-10 stars, optional comment.
export default function RatingPrompt() {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit() {
    if (!stars || state === "sending") return;
    setState("sending");
    try {
      const paymentIntent =
        new URLSearchParams(window.location.search).get("payment_intent") || "";
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, comment, paymentIntent }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rm-rating" role="status">
        <p className="rm-rating-thanks">Thank you for the feedback!</p>
      </div>
    );
  }

  return (
    <div className="rm-rating">
      <h3>How was your experience?</h3>
      <p className="rm-rating-sub">Rate our website out of 10 stars</p>
      <div className="rm-rating-stars" role="radiogroup" aria-label="Rating out of 10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={stars === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className={n <= (hover || stars) ? "is-lit" : ""}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setStars(n)}
          >
            ★
          </button>
        ))}
      </div>
      {stars > 0 && (
        <>
          <p className="rm-rating-picked">{stars}/10</p>
          <textarea
            placeholder="Anything we could do better? (optional)"
            value={comment}
            maxLength={1000}
            rows={3}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="button" className="rm-rating-submit" onClick={submit} disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send rating"}
          </button>
        </>
      )}
      {state === "error" && (
        <p className="rm-pay-error" role="alert">
          Sorry, that didn&rsquo;t save — please try again.
        </p>
      )}
    </div>
  );
}

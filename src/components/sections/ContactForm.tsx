"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { boxSizes, contact } from "@/config/site";
import { links } from "@/lib/links";

type Status = "idle" | "submitting" | "success" | "error";

const initial = {
  name: "",
  phone: "",
  email: "",
  boxSize: boxSizes[0],
  quantity: "1",
  message: "",
  company: "", // honeypot
};

/** Order / contact form. Posts to /api/contact (ready for email integration). */
export default function ContactForm() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [badFields, setBadFields] = useState<string[]>([]);

  const update =
    (field: keyof typeof initial) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setBadFields((f) => f.filter((x) => x !== field));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setBadFields(body.fields ?? []);
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      setValues(initial);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Please try again.");
    }
  };

  const fieldCls = (field: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${
      badFields.includes(field) ? "border-red-400" : "border-black/10"
    }`;

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-leaf-300/50 bg-leaf-300/10 p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500 text-white">
          <Icon name="check" size={32} />
        </span>
        <h3 className="mt-5 text-2xl font-bold text-ink">Thank you!</h3>
        <p className="mt-2 max-w-sm text-muted">
          Your order enquiry has been received. We&apos;ll be in touch very
          soon. For a faster response, message us on WhatsApp.
        </p>
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Icon name="whatsapp" size={18} /> Message on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 text-sm font-semibold text-brand-700 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl shadow-black/5 sm:p-8"
      noValidate
    >
      {/* Honeypot (hidden from users) */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={update("company")}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">
            Name <span className="text-brand-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={update("name")}
            className={fieldCls("name")}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink">
            Phone <span className="text-brand-600">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={update("phone")}
            className={fieldCls("phone")}
            placeholder="Your phone number"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
            Email <span className="text-brand-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={update("email")}
            className={fieldCls("email")}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="boxSize" className="mb-1.5 block text-sm font-semibold text-ink">
            Box Size <span className="text-brand-600">*</span>
          </label>
          <select
            id="boxSize"
            value={values.boxSize}
            onChange={update("boxSize")}
            className={fieldCls("boxSize")}
          >
            {boxSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="mb-1.5 block text-sm font-semibold text-ink">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={99}
            value={values.quantity}
            onChange={update("quantity")}
            className={fieldCls("quantity")}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={values.message}
          onChange={update("message")}
          className={`${fieldCls("message")} resize-y`}
          placeholder="Delivery address, preferred date, or any questions…"
        />
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Sending…" : "Send Order Enquiry"}
        {status !== "submitting" && <Icon name="arrow" size={20} />}
      </button>

      <p className="mt-4 text-center text-xs text-muted">
        Prefer to talk? Call{" "}
        <a href={links.tel} className="font-semibold text-brand-700 hover:underline">
          {contact.phoneDisplay}
        </a>{" "}
        or email{" "}
        <a href={links.mailto} className="font-semibold text-brand-700 hover:underline">
          {contact.email}
        </a>
        .
      </p>
    </form>
  );
}

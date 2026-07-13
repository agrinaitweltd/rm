"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { faqs } from "@/config/site";

/** Accessible FAQ accordion. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-white py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="FAQs"
          title={
            <>
              Frequently Asked <span className="text-gradient">Questions</span>
            </>
          }
          subtitle="Everything you need to know about ordering premium Pakistani mangoes."
          className="mb-12"
        />

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-brand-200 bg-brand-50/50"
                    : "border-black/5 bg-cream"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-base font-bold text-ink">
                      {faq.question}
                    </span>
                    <Icon
                      name="chevron"
                      size={22}
                      className={`shrink-0 text-brand-700 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  className="grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

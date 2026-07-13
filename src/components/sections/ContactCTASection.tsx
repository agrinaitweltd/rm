import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import ContactForm from "@/components/sections/ContactForm";
import { contact } from "@/config/site";
import { links } from "@/lib/links";

const methods = [
  {
    icon: "whatsapp" as const,
    label: "WhatsApp",
    value: "Chat & order instantly",
    href: links.whatsapp,
    external: true,
  },
  {
    icon: "phone" as const,
    label: "Call us",
    value: contact.phoneDisplay,
    href: links.tel,
    external: false,
  },
  {
    icon: "mail" as const,
    label: "Email",
    value: contact.email,
    href: links.mailto,
    external: false,
  },
  {
    icon: "tiktok" as const,
    label: "TikTok",
    value: contact.tiktokHandle,
    href: links.tiktok,
    external: true,
  },
];

/** Contact section: quick-contact methods + the order form. */
export default function ContactCTASection({
  withHeading = true,
}: {
  withHeading?: boolean;
}) {
  return (
    <section id="contact" className="scroll-mt-24 py-16 md:py-24">
      <div className="container-x">
        {withHeading && (
          <SectionHeading
            eyebrow="Contact"
            title={
              <>
                Order Your <span className="text-gradient">Mangoes</span>
              </>
            }
            subtitle="Ready to taste the best? Reach out any way you like, or send us an order enquiry below."
            className="mb-12"
          />
        )}

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Contact methods */}
          <Reveal className="flex flex-col gap-4">
            {methods.map((m) => (
              <a
                key={m.label}
                href={m.href}
                {...(m.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon name={m.icon} size={24} />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted">
                    {m.label}
                  </span>
                  <span className="block text-base font-bold text-ink">
                    {m.value}
                  </span>
                </span>
              </a>
            ))}

            <div className="mt-2 rounded-2xl bg-ink p-6 text-white">
              <h3 className="text-lg font-bold">Delivering across Scotland</h3>
              <p className="mt-2 text-sm text-white/70">
                Glasgow · Edinburgh · Aberdeen · Dundee · Stirling · Perth · and
                everywhere in between.
              </p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

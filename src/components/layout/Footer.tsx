import Link from "next/link";
import NewsletterForm from "@/components/forms/NewsletterForm";

const EXPLORE_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/flights", label: "Flight Search" },
  { href: "/deals", label: "Package Deals" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  // Not present in the Figma file — kept because it's a legal requirement (Israeli standard ת"י 5568).
  { href: "/accessibility", label: "Accessibility Statement" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <span className="text-lg font-extrabold">Mr. Travels</span>
          <p className="text-sm leading-relaxed text-white/70">Crafting unforgettable journeys for the sophisticated adventurer since 2012.</p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold tracking-wider text-white/50">EXPLORE</h3>
          <ul className="space-y-2.5 text-sm">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/80 transition-colors hover:text-brand-pink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold tracking-wider text-white/50">COMPANY</h3>
          <ul className="space-y-2.5 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/80 transition-colors hover:text-brand-pink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold tracking-wider text-white/50">STAY UPDATED</h3>
          <p className="mb-3 text-sm text-white/70">Get exclusive travel deals delivered to your inbox.</p>
          <NewsletterForm variant="footer" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/60 sm:flex-row">
          <p>© 2024 Mr. Travels. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="rounded border border-white/20 px-1.5 py-0.5">VISA</span>
            <span className="rounded border border-white/20 px-1.5 py-0.5">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

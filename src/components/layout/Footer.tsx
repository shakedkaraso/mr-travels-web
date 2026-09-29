import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "@/components/forms/NewsletterForm";
import SocialLinks from "@/components/layout/SocialLinks";

const EXPLORE_LINKS = [
  { href: "/destinations", label: "יעדים" },
  { href: "/flights", label: "חיפוש טיסות" },
  { href: "/deals", label: "חבילות נופש" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "אודותינו" },
  { href: "/cookie-policy", label: "מדיניות עוגיות" },
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/terms", label: "תנאי שימוש" },
  // Not present in the Figma file — kept because it's a legal requirement (Israeli standard ת"י 5568).
  { href: "/accessibility", label: "הצהרת נגישות" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Image src="/images/logo-white.png" alt="Mr.travels" width={180} height={46} className="h-10 w-auto" />
          <p className="text-sm leading-relaxed text-white/70">יוצרים עבורכם חוויות טיול בלתי נשכחות כבר מ-2012.</p>
          <SocialLinks variant="dark" />
        </div>

        <div>
          <h3 className="mb-4 text-[20px] font-semibold tracking-wider text-white/50">ניווט</h3>
          <ul className="space-y-2.5 text-[18px] font-normal">
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
          <h3 className="mb-4 text-[20px] font-semibold tracking-wider text-white/50">החברה</h3>
          <ul className="space-y-2.5 text-[18px] font-normal">
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
          <h3 className="mb-4 text-[20px] font-semibold tracking-wider text-white/50">הישארו מעודכנים</h3>
          <p className="mb-3 text-sm text-white/70">קבלו דילים בלעדיים ישירות למייל.</p>
          <NewsletterForm variant="footer" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/60 sm:flex-row">
          <p>© 2024 Mr.travels. כל הזכויות שמורות.</p>
          <div className="flex items-center gap-3">
            <span className="rounded border border-white/20 px-1.5 py-0.5">VISA</span>
            <span className="rounded border border-white/20 px-1.5 py-0.5">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

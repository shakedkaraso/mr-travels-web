import Image from "next/image";
import Link from "next/link";
import SocialLinks from "@/components/layout/SocialLinks";

const NAV_LINKS = [{ href: "/flights", label: "חיפוש טיסות" }];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/images/logo.png" alt="Mr.travels" width={75} height={64} priority className="h-16 w-auto" />
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-medium text-brand-ink-soft">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brand-pink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SocialLinks />
      </div>
    </header>
  );
}

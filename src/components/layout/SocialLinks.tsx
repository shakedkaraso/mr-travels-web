const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "פייסבוק", icon: "facebook" as const },
  { href: "https://instagram.com", label: "אינסטגרם", icon: "instagram" as const },
  { href: "https://tiktok.com", label: "טיקטוק", icon: "tiktok" as const },
];

function SocialIcon({ icon }: { icon: "facebook" | "instagram" | "tiktok" }) {
  const paths: Record<typeof icon, React.ReactNode> = {
    facebook: (
      <path d="M13.5 9H15V6.5h-1.75C11.34 6.5 10 7.79 10 9.7V11H8.5v2.5H10V18h2.5v-4.5h1.75L14.75 11H12.5v-1c0-.55.2-1 1-1Z" />
    ),
    instagram: (
      <path d="M8.5 6h7A2.5 2.5 0 0 1 18 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 15.5v-7A2.5 2.5 0 0 1 8.5 6Zm0 1.5c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-7c0-.55-.45-1-1-1h-7ZM12 9.25A2.75 2.75 0 1 1 9.25 12 2.75 2.75 0 0 1 12 9.25Zm0 1.5A1.25 1.25 0 1 0 13.25 12 1.25 1.25 0 0 0 12 10.75Zm3.4-2.15a.65.65 0 1 1-.65.65.65.65 0 0 1 .65-.65Z" />
    ),
    tiktok: (
      <path d="M14.5 6c.28 1.36 1.13 2.32 2.5 2.6v1.9a4.6 4.6 0 0 1-2.5-.77v4.02a3.75 3.75 0 1 1-3.75-3.75c.13 0 .25 0 .38.02v1.94a1.83 1.83 0 1 0 1.62 1.82V6Z" />
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className="h-[30px] w-[30px] fill-current" aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

export default function SocialLinks({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <ul className="flex items-center gap-2">
      {SOCIAL_LINKS.map((social) => (
        <li key={social.icon}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              variant === "dark"
                ? "bg-white/10 text-white focus-visible:outline-white"
                : "bg-brand-pink text-white focus-visible:outline-brand-pink"
            }`}
          >
            <SocialIcon icon={social.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}

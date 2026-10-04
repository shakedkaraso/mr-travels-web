export default function MagnifyingGlassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="54" cy="46" r="34" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="54" cy="46" r="24" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M30 70 L10 92" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="68" r="5" fill="currentColor" />
    </svg>
  );
}

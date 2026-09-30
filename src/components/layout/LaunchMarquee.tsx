const MESSAGE = "האתר החדש שלנו הושק והוא בהרצה ונשמח לביקורות";

export default function LaunchMarquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-[#0a3a4a] py-2 text-sm font-semibold text-white" aria-label={MESSAGE}>
      <div className="inline-flex animate-marquee">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="mx-8" aria-hidden={i > 0}>
            {MESSAGE}
          </span>
        ))}
      </div>
    </div>
  );
}

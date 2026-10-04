const MESSAGE = "האתר שלנו בהרצה, נשמח לפידבקים והמלצות :)";

export default function LaunchMarquee() {
  return (
    <div className="bg-brand-dark py-2 text-center text-[16px] font-semibold text-white">
      {MESSAGE}
    </div>
  );
}

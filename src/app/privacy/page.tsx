import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | Mr.travels",
  description: "מדיניות הפרטיות של אתר Mr.travels.",
};

const COLLECTED_DATA_ITEMS = ["שם מלא", "מספר טלפון", "כתובת אימייל"];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="mb-6 text-[36px] font-extrabold text-brand-dark sm:text-[42px]">מדיניות פרטיות</h1>

      <p className="mb-10 text-[16px] leading-relaxed text-brand-ink-soft">
        הפרטיות שלכם חשובה לנו, כמו שחשוב לנו גם לפעול בהתאם לחוק בישראל. לכן אנו מספקים הצהרת פרטיות,
        שמסבירה בצורה ברורה אילו נתונים נאספים באתר, כיצד אנו משתמשים בהם ואילו אפשרויות בחירה עומדות
        לרשותכם בעת השימוש באתר.
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="mb-3 text-[22px] font-bold text-brand-dark">איזה מידע אנחנו אוספים על המשתמשים שלנו?</h2>
          <p className="mb-3 text-[16px] leading-relaxed text-brand-ink-soft">
            האתר שלנו קיים, בין היתר, כדי לאפשר יצירת קשר ואיסוף לידים. לשם כך, קיימת באתר אפשרות
            להשאיר פרטים אישיים לצורך יצירת קשר והצעת שירותים. המידע שנאסף כולל:
          </p>
          <ul className="mb-3 space-y-3">
            {COLLECTED_DATA_ITEMS.map((item) => (
              <li key={item} className="flex gap-2.5 text-[16px] leading-relaxed text-brand-ink-soft">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[16px] leading-relaxed text-brand-ink-soft">
            מסירת המידע נעשית לבחירתכם בלבד, ואינכם מחויבים למסור אותו. בנוסף לכך, כמו ברוב אתרי
            האינטרנט, אנו עושים שימוש בעוגיות (Cookies). עוגיות אלו מאפשרות לנו לבצע טירגוט מדויק יותר
            של קהלים במסגרת פעילות פרסום ממומן.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[22px] font-bold text-brand-dark">אנחנו חייבים לשמור על פרטיות המידע שלכם!</h2>
          <div className="space-y-3">
            <p className="text-[16px] leading-relaxed text-brand-ink-soft">
              שמירה על פרטיות המידע שלכם היא ערך עליון עבורנו. כל המידע שנאסף באתר נשמר במערכות
              מאובטחות, בין אם מדובר במידע שנאסף באמצעות עוגיות ובין אם בפרטים שנמסרו דרך טפסי יצירת
              קשר.
            </p>
            <p className="text-[16px] leading-relaxed text-brand-ink-soft">
              אנו מתחייבים לא להעביר את פרטיכם לצד שלישי, אלא אם התקבל מכם אישור מפורש מראש. בנוסף, אנו
              פועלים לשמירה על רמת אבטחה גבוהה ככל האפשר, תוך תחזוקה שוטפת, מקצועית ועדכנית של האתר. כל
              זאת במטרה להגן על המידע מפני פריצות, שימוש לא מורשה או אירועי אבטחה אחרים.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

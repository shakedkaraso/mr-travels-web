import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הצהרת נגישות | Mr.travels",
  description: "הצהרת הנגישות של אתר Mr.travels.",
};

const SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: "מידע על נגישות האתר",
    paragraphs: [
      "המידע מעודכן ליום 29/09/2026. אנחנו בליעד פתרונות פרסום שואפים לספק לקהל הרחב תוכן נגיש ככל שניתן. האתר מותאם לדרישות הנגישות לרמה 2 (AA) של התקן W.C.A.G 2. בנוסף, הנגישות באתר מותאמת לדפדפנים המובילים בשוק ותומכת בטכנולוגיות מסייעות.",
      "האתר מונגש באמצעות רכיב נגישות ייעודי המציע מגוון רחב של אפשרויות לשיפור חוויית הגלישה. לשם כך, ניתן להיעזר בתפריט הנגישות המוטמע באתר לביצוע התאמות אישיות. יחד עם זאת, בשל תנאים שאינם בשליטתנו, ייתכנו חלקים באתר שטרם הונגשו במלואם. אנחנו פועלים באופן רציף כדי לאתר ולפתור מקרים אלו.",
    ],
  },
  {
    title: "מסירת מידע בפורמט נגיש",
    paragraphs: [
      "אנו מעמידים עבור לקוחותינו אפשרות לקבלת מידע בפורמטים נגישים בהתאם לצורך. מסירת המידע הינה ללא עלות ומיועדת עבור אנשים עם מוגבלות. כמו כן, ניתן ליצור קשר עם רכזת הנגישות של החברה לכל בקשה בנושא זה. פרטי ההתקשרות המלאים מופיעים בהמשך ההצהרה לנוחיותכם.",
      "אנחנו ממשיכים באופן תדיר במאמץ לשפר את נגישות האתר. במידה ונתקלתם בבעיה או תקלה, נשמח מאוד להתעדכן בכך. לכן, אתם מוזמנים לפנות לרכזת הנגישות כדי שנוכל למצוא פתרון מהיר. כדי שנטפל בבעיה בצורה הטובה ביותר, מומלץ לצרף את תיאור הבעיה, סוג הדפדפן ודף הגלישה.",
    ],
  },
];

const CONTACT_ITEMS = [
  "שם רכזת הנגישות: שקד אבוגזל.",
  "טלפון: 050-9351802.",
  "מייל: mrtravels2027@gmail.com.",
];

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="mb-6 text-[36px] font-extrabold text-brand-dark sm:text-[42px]">הצהרת נגישות</h1>

      <p className="mb-10 text-[16px] leading-relaxed text-brand-ink-soft">
        ברוכים הבאים לאתר שלנו Mr.travels – אנחנו שמחים שבאתם! חברת ליעד פתרונות פרסום נוקטת את מירב
        המאמצים כדי לספק לכל לקוחותיה שירות שוויוני, מכובד ונגיש. לכן, אנו משקיעים משאבים רבים בביצוע
        התאמות נגישות נדרשות. המטרה שלנו היא שכל אדם עם מוגבלות יוכל לקבל את השירותים הניתנים לכלל
        הלקוחות באופן עצמאי.
      </p>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-[22px] font-bold text-brand-dark">{section.title}</h2>
            <div className="space-y-3">
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-[16px] leading-relaxed text-brand-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-3 text-[22px] font-bold text-brand-dark">פרטי רכזת הנגישות ודרכי התקשרות</h2>
          <ul className="space-y-3">
            {CONTACT_ITEMS.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-[16px] leading-relaxed text-brand-ink-soft">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[16px] leading-relaxed text-brand-ink-soft">
            תיאומי נגישות לפני ביקור: ניתן לתאם ליווי מראש באמצעות המייל או הטלפון המופיעים לעיל. בנוסף,
            אנשים עם מוגבלות בשמיעה מוזמנים ליצור איתנו קשר במייל הרשום לכל שאלה או תיאום.
          </p>
        </section>
      </div>
    </div>
  );
}

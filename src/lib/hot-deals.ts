const TRAVELPAYOUTS_MARKER = process.env.TRAVELPAYOUTS_MARKER ?? "777777";

// City codes chosen (and named in Hebrew) by us — not translated from API
// text — so there's no risk of a wrong/guessed translation reaching the page.
export const EUROPE_DESTINATIONS = [
  { code: "PAR", name: "פריז" },
  { code: "ROM", name: "רומא" },
  { code: "BCN", name: "ברצלונה" },
  { code: "ATH", name: "אתונה" },
  { code: "MIL", name: "מילאנו" },
  { code: "AMS", name: "אמסטרדם" },
  { code: "PRG", name: "פראג" },
  { code: "BUD", name: "בודפשט" },
  { code: "VIE", name: "וינה" },
  { code: "BER", name: "ברלין" },
  { code: "LON", name: "לונדון" },
  { code: "LIS", name: "ליסבון" },
];

// prices_for_dates only returns a 2-letter IATA airline code, not a brand
// name — this covers carriers that actually fly TLV-Europe; anything not
// listed falls back to showing the raw code rather than a guessed name.
const AIRLINE_NAMES: Record<string, string> = {
  LY: "El Al",
  IZ: "Arkia",
  "6H": "Israir",
  W6: "Wizz Air",
  W4: "Wizz Air Malta",
  W9: "Wizz Air UK",
  FR: "Ryanair",
  U2: "easyJet",
  RO: "TAROM",
  LO: "LOT",
  A3: "Aegean Airlines",
  HV: "Transavia",
  VY: "Vueling",
  LH: "Lufthansa",
  OS: "Austrian Airlines",
  AZ: "ITA Airways",
  KL: "KLM",
  AF: "Air France",
  TP: "TAP Air Portugal",
  TK: "Turkish Airlines",
  PC: "Pegasus",
  TO: "Transavia France",
  U8: "Tus Airways",
};

function toAirlineName(code: string): string {
  return AIRLINE_NAMES[code] ?? code;
}

type DateFare = {
  destination: string;
  airline: string;
  price: number;
  departure_at: string;
  return_at: string;
  link: string;
};

export type Deal = {
  airline: string;
  city: string;
  departureLabel: string;
  price: string;
  bookingUrl: string;
};

const HEBREW_MONTHS = [
  "בינואר",
  "בפברואר",
  "במרץ",
  "באפריל",
  "במאי",
  "ביוני",
  "ביולי",
  "באוגוסט",
  "בספטמבר",
  "באוקטובר",
  "בנובמבר",
  "בדצמבר",
];

function formatRoundTripRange(departureIso: string, returnIso: string): string {
  const depart = new Date(departureIso);
  const back = new Date(returnIso);
  const departMonth = HEBREW_MONTHS[depart.getMonth()];
  const backMonth = HEBREW_MONTHS[back.getMonth()];
  if (departMonth === backMonth) return `${depart.getDate()}-${back.getDate()} ${departMonth}`;
  return `${depart.getDate()} ${departMonth} - ${back.getDate()} ${backMonth}`;
}

/** Real round-trip fares from Tel Aviv to popular European cities in
 * December, via Travelpayouts' "Flight tickets for specific dates" endpoint
 * (server-side only — the API token must never reach the browser):
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Aviasales-Data-API
 * Falls back to an empty list if the token is missing or every request
 * fails, rather than showing fabricated prices.
 *
 * @param limit how many of the (up to EUROPE_DESTINATIONS.length) cheapest
 * results to return, sorted by price ascending.
 */
export async function getHotDeals(limit: number): Promise<Deal[]> {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  if (!token) return [];

  const departureMonth = "2026-12";

  try {
    const perDestination = await Promise.all(
      EUROPE_DESTINATIONS.map(async ({ code, name }) => {
        const res = await fetch(
          `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=TLV&destination=${code}&departure_at=${departureMonth}&return_at=${departureMonth}&one_way=false&direct=true&sorting=price&currency=usd&limit=1&token=${token}`,
          { next: { revalidate: 3600 } }
        );
        if (!res.ok) return null;
        const json: { success: boolean; data: DateFare[] } = await res.json();
        if (!json.success || !Array.isArray(json.data) || json.data.length === 0) return null;
        return { fare: json.data[0], hebrewName: name };
      })
    );

    return perDestination
      .filter((entry): entry is { fare: DateFare; hebrewName: string } => entry !== null)
      .sort((a, b) => a.fare.price - b.fare.price)
      .slice(0, limit)
      .map(({ fare, hebrewName }) => ({
        airline: toAirlineName(fare.airline),
        city: hebrewName,
        departureLabel: formatRoundTripRange(fare.departure_at, fare.return_at),
        price: `$${Math.round(fare.price)}`,
        bookingUrl: `https://www.aviasales.com${fare.link}&marker=${TRAVELPAYOUTS_MARKER}`,
      }));
  } catch {
    return [];
  }
}

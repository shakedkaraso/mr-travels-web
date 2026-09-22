const TRAVELPAYOUTS_MARKER = process.env.TRAVELPAYOUTS_MARKER ?? "777777";

type DestinationSpec = { code: string; name: string; maxTripDuration: number };

// City codes chosen (and named in Hebrew) by us — not translated from API
// text — so there's no risk of a wrong/guessed translation reaching the
// page. European destinations are capped at an 8-day trip, longer-haul
// destinations at 10 days (both per the user's request).
export const EUROPE_DESTINATIONS: DestinationSpec[] = [
  { code: "PAR", name: "פריז", maxTripDuration: 8 },
  { code: "ROM", name: "רומא", maxTripDuration: 8 },
  { code: "BCN", name: "ברצלונה", maxTripDuration: 8 },
  { code: "ATH", name: "אתונה", maxTripDuration: 8 },
  { code: "MIL", name: "מילאנו", maxTripDuration: 8 },
  { code: "AMS", name: "אמסטרדם", maxTripDuration: 8 },
  { code: "PRG", name: "פראג", maxTripDuration: 8 },
  { code: "BUD", name: "בודפשט", maxTripDuration: 8 },
  { code: "VIE", name: "וינה", maxTripDuration: 8 },
  { code: "BER", name: "ברלין", maxTripDuration: 8 },
  { code: "LON", name: "לונדון", maxTripDuration: 8 },
  { code: "LIS", name: "ליסבון", maxTripDuration: 8 },
];

export const FAR_DESTINATIONS: DestinationSpec[] = [
  { code: "BKK", name: "בנגקוק", maxTripDuration: 10 },
  { code: "HKT", name: "פוקט", maxTripDuration: 10 },
  { code: "DXB", name: "דובאי", maxTripDuration: 10 },
  { code: "ZNZ", name: "זנזיבר", maxTripDuration: 10 },
  { code: "NYC", name: "ניו יורק", maxTripDuration: 10 },
];

export const ALL_DESTINATIONS: DestinationSpec[] = [...EUROPE_DESTINATIONS, ...FAR_DESTINATIONS];

// grouped_prices only returns a 2-letter IATA airline code, not a brand
// name — this covers carriers that actually fly direct from TLV; anything
// not listed falls back to showing the raw code rather than a guessed name.
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

/** Cheapest direct round-trip fare from TLV to `code` in December, capped
 * at `maxTripDuration` days — via Travelpayouts' "Cheapest tickets grouped
 * by the specific attribute" endpoint (grouped_prices), which is the only
 * one of their date-search endpoints that actually supports a trip-duration
 * cap: https://support.travelpayouts.com/hc/en-us/articles/203956163-Aviasales-Data-API
 * Returns null if the token is missing, the request fails, or no fare
 * matches (e.g. no direct route, or nothing within the duration cap). */
async function getCheapestFare(
  code: string,
  maxTripDuration: number,
  token: string
): Promise<DateFare | null> {
  const departureMonth = "2026-12";
  const res = await fetch(
    `https://api.travelpayouts.com/aviasales/v3/grouped_prices?origin=TLV&destination=${code}&departure_at=${departureMonth}&direct=true&min_trip_duration=1&max_trip_duration=${maxTripDuration}&currency=usd&token=${token}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const json: { success: boolean; data: Record<string, DateFare> } = await res.json();
  if (!json.success || !json.data || typeof json.data !== "object") return null;

  const fares = Object.values(json.data);
  if (fares.length === 0) return null;
  return fares.reduce((cheapest, fare) => (fare.price < cheapest.price ? fare : cheapest));
}

/** Real direct round-trip fares from Tel Aviv for December, European
 * destinations capped at an 8-day trip and longer-haul destinations at 10
 * days. Falls back to an empty list if the token is missing or every
 * request fails, rather than showing fabricated prices.
 *
 * @param limit how many of the (up to ALL_DESTINATIONS.length) cheapest
 * results to return, sorted by price ascending.
 */
export async function getHotDeals(limit: number): Promise<Deal[]> {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  if (!token) return [];

  try {
    const perDestination = await Promise.all(
      ALL_DESTINATIONS.map(async ({ code, name, maxTripDuration }) => {
        const fare = await getCheapestFare(code, maxTripDuration, token);
        return fare ? { fare, hebrewName: name } : null;
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

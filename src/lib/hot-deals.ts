const TRAVELPAYOUTS_MARKER = process.env.TRAVELPAYOUTS_MARKER ?? "777777";

export type DestinationSpec = { code: string; name: string; nameEn: string; maxTripDuration: number };

// City codes chosen (and named in Hebrew) by us — not translated from API
// text — so there's no risk of a wrong/guessed translation reaching the
// page. `nameEn` is only used as the Pexels photo search query, never
// rendered. European destinations are capped at an 8-day trip, longer-haul
// destinations at 10 days (both per the user's request).
export const EUROPE_DESTINATIONS: DestinationSpec[] = [
  { code: "PAR", name: "פריז", nameEn: "Paris", maxTripDuration: 8 },
  { code: "ROM", name: "רומא", nameEn: "Rome", maxTripDuration: 8 },
  { code: "BCN", name: "ברצלונה", nameEn: "Barcelona", maxTripDuration: 8 },
  { code: "ATH", name: "אתונה", nameEn: "Athens", maxTripDuration: 8 },
  { code: "MIL", name: "מילאנו", nameEn: "Milan", maxTripDuration: 8 },
  { code: "AMS", name: "אמסטרדם", nameEn: "Amsterdam", maxTripDuration: 8 },
  { code: "PRG", name: "פראג", nameEn: "Prague", maxTripDuration: 8 },
  { code: "BUD", name: "בודפשט", nameEn: "Budapest", maxTripDuration: 8 },
  { code: "VIE", name: "וינה", nameEn: "Vienna", maxTripDuration: 8 },
  { code: "BER", name: "ברלין", nameEn: "Berlin", maxTripDuration: 8 },
  { code: "LON", name: "לונדון", nameEn: "London", maxTripDuration: 8 },
  { code: "LIS", name: "ליסבון", nameEn: "Lisbon", maxTripDuration: 8 },
];

export const FAR_DESTINATIONS: DestinationSpec[] = [
  { code: "BKK", name: "בנגקוק", nameEn: "Bangkok", maxTripDuration: 10 },
  { code: "HKT", name: "פוקט", nameEn: "Phuket", maxTripDuration: 10 },
  { code: "DXB", name: "דובאי", nameEn: "Dubai", maxTripDuration: 10 },
  { code: "ZNZ", name: "זנזיבר", nameEn: "Zanzibar", maxTripDuration: 10 },
  { code: "NYC", name: "ניו יורק", nameEn: "New York City", maxTripDuration: 10 },
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
  imageQuery: string;
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

async function fetchGroupedPrices(
  code: string,
  departureMonth: string,
  maxTripDuration: number,
  token: string,
  revalidateSeconds: number
): Promise<DateFare[]> {
  const res = await fetch(
    `https://api.travelpayouts.com/aviasales/v3/grouped_prices?origin=TLV&destination=${code}&departure_at=${departureMonth}&direct=true&min_trip_duration=1&max_trip_duration=${maxTripDuration}&currency=usd&token=${token}`,
    { next: { revalidate: revalidateSeconds } }
  );
  if (!res.ok) return [];
  const json: { success: boolean; data: Record<string, DateFare> } = await res.json();
  if (!json.success || !json.data || typeof json.data !== "object") return [];
  return Object.values(json.data);
}

/** Cheapest direct round-trip fare from TLV to `code`, capped at
 * `maxTripDuration` days — via Travelpayouts' "Cheapest tickets grouped by
 * the specific attribute" endpoint (grouped_prices), the only one of their
 * date-search endpoints that actually supports a trip-duration cap:
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Aviasales-Data-API
 * `departureMonths` are queried and merged (a narrow departure window can
 * straddle a month boundary); `allowedDepartureDates`, if given, further
 * restricts results to fares departing on one of those exact YYYY-MM-DD
 * dates. Returns null if the token is missing, every request fails, or
 * nothing matches. */
async function getCheapestFare(
  code: string,
  maxTripDuration: number,
  token: string,
  departureMonths: string[],
  revalidateSeconds: number,
  allowedDepartureDates?: Set<string>
): Promise<DateFare | null> {
  const perMonth = await Promise.all(
    departureMonths.map((month) => fetchGroupedPrices(code, month, maxTripDuration, token, revalidateSeconds))
  );
  const fares = perMonth.flat().filter((fare) => !allowedDepartureDates || allowedDepartureDates.has(fare.departure_at.slice(0, 10)));
  if (fares.length === 0) return null;
  return fares.reduce((cheapest, fare) => (fare.price < cheapest.price ? fare : cheapest));
}

function toDeal(fare: DateFare, hebrewName: string, nameEn: string): Deal {
  return {
    airline: toAirlineName(fare.airline),
    city: hebrewName,
    imageQuery: nameEn,
    departureLabel: formatRoundTripRange(fare.departure_at, fare.return_at),
    price: `$${Math.round(fare.price)}`,
    bookingUrl: `https://www.aviasales.com${fare.link}&marker=${TRAVELPAYOUTS_MARKER}`,
  };
}

/** YYYY-MM-DD for each of the next `count` days, starting tomorrow. */
function nextDays(count: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
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
      ALL_DESTINATIONS.map(async ({ code, name, nameEn, maxTripDuration }) => {
        const fare = await getCheapestFare(code, maxTripDuration, token, ["2026-12"], 3600);
        return fare ? { fare, hebrewName: name, nameEn } : null;
      })
    );

    return perDestination
      .filter((entry): entry is { fare: DateFare; hebrewName: string; nameEn: string } => entry !== null)
      .sort((a, b) => a.fare.price - b.fare.price)
      .slice(0, limit)
      .map(({ fare, hebrewName, nameEn }) => toDeal(fare, hebrewName, nameEn));
  } catch {
    return [];
  }
}

const LAST_MINUTE_MAX_TRIP_DURATION = 7;
const LAST_MINUTE_WINDOW_DAYS = 2;

/** "דקה ה-90" — real direct round-trips departing in the next two days,
 * capped at a 7-day trip, across the same destination list as getHotDeals.
 * Same fallback behavior: empty list rather than fabricated deals. */
export async function getLastMinuteDeals(limit: number): Promise<Deal[]> {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  if (!token) return [];

  const allowedDates = new Set(nextDays(LAST_MINUTE_WINDOW_DAYS));
  const months = Array.from(new Set(Array.from(allowedDates, (d) => d.slice(0, 7))));

  try {
    const perDestination = await Promise.all(
      ALL_DESTINATIONS.map(async ({ code, name, nameEn }) => {
        const fare = await getCheapestFare(code, LAST_MINUTE_MAX_TRIP_DURATION, token, months, 1800, allowedDates);
        return fare ? { fare, hebrewName: name, nameEn } : null;
      })
    );

    return perDestination
      .filter((entry): entry is { fare: DateFare; hebrewName: string; nameEn: string } => entry !== null)
      .sort((a, b) => a.fare.price - b.fare.price)
      .slice(0, limit)
      .map(({ fare, hebrewName, nameEn }) => toDeal(fare, hebrewName, nameEn));
  } catch {
    return [];
  }
}

export function findDestination(code: string): DestinationSpec | undefined {
  return ALL_DESTINATIONS.find((d) => d.code === code.toUpperCase());
}

/** Real most-booked destinations from Tel Aviv, via Travelpayouts' route-
 * popularity sort (the documented replacement for the old /v1/city-directions
 * endpoint: sorting=route + unique=true, origin only — see
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Aviasales-Data-API).
 * That raw popularity ranking spans Aviasales' whole user base and skews
 * toward CIS destinations (Moscow, Tbilisi, Batumi...) that don't fit this
 * site's positioning, so results are filtered down to our own curated
 * destination list (which already has Hebrew names, photos and trip-length
 * rules wired up) and ranked within it — real popularity data, scoped to a
 * deliberately curated set rather than fabricated. */
export async function getPopularDestinations(limit: number): Promise<DestinationSpec[]> {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=TLV&sorting=route&unique=true&direct=true&currency=usd&limit=100&token=${token}`,
      { next: { revalidate: 3600 * 12 } }
    );
    if (!res.ok) return [];
    const json: { success: boolean; data: DateFare[] } = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];

    const seen = new Set<string>();
    const ranked: DestinationSpec[] = [];
    for (const fare of json.data) {
      const spec = findDestination(fare.destination);
      if (spec && !seen.has(spec.code)) {
        seen.add(spec.code);
        ranked.push(spec);
      }
      if (ranked.length >= limit) break;
    }
    return ranked;
  } catch {
    return [];
  }
}

/** Every direct round-trip fare option for a single destination in
 * December (not just the cheapest), sorted by price — for the "see all
 * deals to this destination" page a Destinations card links to. */
export async function getDealsForDestination(code: string, limit: number): Promise<Deal[]> {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  const spec = findDestination(code);
  if (!token || !spec) return [];

  try {
    const fares = await fetchGroupedPrices(spec.code, "2026-12", spec.maxTripDuration, token, 3600);
    return fares
      .sort((a, b) => a.price - b.price)
      .slice(0, limit)
      .map((fare) => toDeal(fare, spec.name, spec.nameEn));
  } catch {
    return [];
  }
}

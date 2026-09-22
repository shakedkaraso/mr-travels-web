"use client";

import { useId, useState } from "react";
import PassengersPicker, { type PassengerCounts } from "@/components/home/PassengersPicker";
import AirportAutocomplete from "@/components/home/AirportAutocomplete";

type TripType = "round-trip" | "one-way";
type FlightClass = "tourist" | "business" | "first";

const TRAVELPAYOUTS_MARKER = "777777";
const CLASS_CODE: Record<FlightClass, string> = { tourist: "", business: "c", first: "f" };

/** DDMM per Travelpayouts' deep-link spec (two digits each, no separator):
 * https://support.travelpayouts.com/hc/en-us/articles/5711895629714-Aviasales-affiliate-links */
function toDDMM(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${day}${month}`;
}

export default function FlightSearchWidget() {
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [originCode, setOriginCode] = useState<string | null>(null);
  const [destinationCode, setDestinationCode] = useState<string | null>(null);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightClass, setFlightClass] = useState<FlightClass>("tourist");
  const [passengers, setPassengers] = useState<PassengerCounts>({ adults: 1, children: 0, infants: 0 });
  const [formError, setFormError] = useState<string | null>(null);

  const originId = useId();
  const destinationId = useId();
  const departId = useId();
  const returnId = useId();
  const classId = useId();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!originCode || !destinationCode) {
      setFormError("בחרו יעד מהרשימה הנפתחת (מאיפה ולאן)");
      return;
    }
    if (!departDate || (tripType === "round-trip" && !returnDate)) {
      setFormError("בחרו תאריך טיסה");
      return;
    }
    setFormError(null);

    let params = `${originCode}${toDDMM(departDate)}${destinationCode}`;
    if (tripType === "round-trip") params += toDDMM(returnDate);
    params += CLASS_CODE[flightClass];
    params += String(Math.min(9, passengers.adults));
    params += String(Math.min(9, passengers.children));
    params += String(Math.min(9, passengers.infants));

    const url = `https://www.aviasales.com/search/${params}?marker=${TRAVELPAYOUTS_MARKER}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-3xl bg-white/95 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-brand-paper p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setTripType("round-trip")}
            aria-pressed={tripType === "round-trip"}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-colors ${
              tripType === "round-trip" ? "bg-brand-ink text-white" : "text-brand-ink-soft"
            }`}
          >
            <PlaneIcon className="rotate-[225deg]" />
            <PlaneIcon className="rotate-45" />
            טיסות הלוך חזור
          </button>
          <button
            type="button"
            onClick={() => setTripType("one-way")}
            aria-pressed={tripType === "one-way"}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-colors ${
              tripType === "one-way" ? "bg-brand-ink text-white" : "text-brand-ink-soft"
            }`}
          >
            <PlaneIcon className={`rotate-45 ${tripType === "one-way" ? "" : "text-brand-pink"}`} />
            טיסה לכיוון אחד
          </button>
        </div>

        <div className="flex items-center gap-2">
          <PassengersPicker onChange={setPassengers} />
          <select
            id={classId}
            aria-label="מחלקה"
            value={flightClass}
            onChange={(event) => setFlightClass(event.target.value as FlightClass)}
            className="rounded-full bg-brand-paper px-4 py-1.5 text-sm font-medium text-brand-ink-soft focus:outline-none focus:ring-2 focus:ring-brand-pink"
          >
            <option value="tourist">מחלקת תיירים</option>
            <option value="business">מחלקת עסקים</option>
            <option value="first">מחלקה ראשונה</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
        <AirportAutocomplete id={originId} label="מאיפה" placeholder="מאיפה יוצאים?" onSelect={setOriginCode} />
        <AirportAutocomplete id={destinationId} label="לאן ממריאים" placeholder="לאן טסים?" onSelect={setDestinationCode} />
        <DateField id={departId} label="תאריכים" value={departDate} onChange={setDepartDate} />
        {tripType === "round-trip" && (
          <DateField id={returnId} label="תאריך חזרה" value={returnDate} onChange={setReturnDate} />
        )}

        <button
          type="submit"
          className="col-span-full rounded-full bg-brand-pink py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-pink/30 transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink lg:col-span-1"
        >
          חיפוש טיסות
        </button>

        {formError && <p className="col-span-full text-sm font-semibold text-brand-pink">{formError}</p>}
      </form>
    </div>
  );
}

function DateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-base font-semibold text-brand-dark">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-pink"
      />
    </div>
  );
}

function PlaneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 fill-current ${className}`}>
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

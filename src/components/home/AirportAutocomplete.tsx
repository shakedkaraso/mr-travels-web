"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = {
  code: string;
  name: string;
  country_name: string;
  type: string;
};

/** Real Travelpayouts autocomplete endpoint (public, no key needed):
 * https://support.travelpayouts.com/hc/en-us/articles/360002322572 */
const AUTOCOMPLETE_URL = "https://autocomplete.travelpayouts.com/places2";

export default function AirportAutocomplete({
  id,
  label,
  placeholder,
  onSelect,
}: {
  id: string;
  label: string;
  placeholder: string;
  onSelect: (code: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function handleInput(text: string) {
    setQuery(text);
    onSelect(null);
    window.clearTimeout(debounceRef.current);
    if (text.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const url = `${AUTOCOMPLETE_URL}?locale=he&types[]=city&types[]=airport&term=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data: Suggestion[] = await res.json();
        setSuggestions(data.slice(0, 8));
        setOpen(data.length > 0);
      } catch {
        // Network hiccup — leave the field editable, just no suggestions this keystroke.
      }
    }, 250);
  }

  function selectSuggestion(s: Suggestion) {
    setQuery(`${s.name} (${s.code})`);
    onSelect(s.code);
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="mb-1.5 block text-base font-semibold text-brand-dark">
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        value={query}
        onChange={(event) => handleInput(event.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-pink"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-w-sm rounded-xl border border-brand-line bg-white py-1 shadow-2xl">
          {suggestions.map((s) => (
            <li key={`${s.type}-${s.code}`}>
              <button
                type="button"
                onClick={() => selectSuggestion(s)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-sm hover:bg-brand-paper"
              >
                <span className="text-brand-ink">
                  {s.name}
                  <span className="text-brand-ink-muted"> · {s.country_name}</span>
                </span>
                <span className="shrink-0 font-semibold text-brand-ink-soft">{s.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

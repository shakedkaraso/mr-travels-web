export type DestinationPhoto = {
  url: string;
  photographer: string;
  photographerUrl: string;
};

type PexelsPhoto = {
  src: { large: string };
  photographer: string;
  photographer_url: string;
};

/** Real destination photos via the Pexels API (server-side only — the key
 * must never reach the browser): https://www.pexels.com/api/documentation/
 * Pexels' terms ask for attribution when possible, which is why this
 * returns the photographer's name/link alongside the image, not just the
 * URL — DealCard renders it as a small credit line. Returns null (caller
 * falls back to the gradient placeholder) if the key is missing, the
 * request fails, or nothing matches — never a wrong/guessed image. */
export async function getDestinationPhoto(englishQuery: string): Promise<DestinationPhoto | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(englishQuery)}&per_page=1&orientation=landscape`,
      {
        headers: { Authorization: key },
        next: { revalidate: 60 * 60 * 24 * 7 }, // photos don't change day to day — cache a week
      }
    );
    if (!res.ok) return null;
    const json: { photos: PexelsPhoto[] } = await res.json();
    const photo = json.photos?.[0];
    if (!photo) return null;
    return { url: photo.src.large, photographer: photo.photographer, photographerUrl: photo.photographer_url };
  } catch {
    return null;
  }
}

/** Attaches a `photo` to each item that has an `imageQuery`, fetched in
 * parallel. Items whose lookup fails simply keep `photo: null` (handled by
 * the caller's UI fallback) rather than blocking the whole batch. */
export async function attachPhotos<T extends { imageQuery: string }>(
  items: T[]
): Promise<(T & { photo: DestinationPhoto | null })[]> {
  return Promise.all(
    items.map(async (item) => ({ ...item, photo: await getDestinationPhoto(item.imageQuery) }))
  );
}

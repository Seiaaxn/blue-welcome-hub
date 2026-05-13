// Sankavollerei API client (samehadaku source).
const BASE = "https://www.sankavollerei.com/anime";

export type Source = "samehadaku";

export type SvAnime = {
  title: string;
  poster?: string;
  animeId: string;
  href?: string;
  type?: string;
  score?: string;
  status?: string;
  episodes?: string | number;
  releasedOn?: string;
  estimation?: string;
  source: Source;
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    if ([404, 500, 502, 503].includes(res.status) && /[?&]page=\d+/.test(path)) {
      return { animeList: [] } as unknown as T;
    }
    throw new Error(`API ${path} → ${res.status}`);
  }
  const j: any = await res.json().catch(() => ({ status: "error" }));
  if (j.status !== "success") {
    if (/[?&]page=\d+/.test(path)) return { animeList: [] } as unknown as T;
    throw new Error(j.message || "API error");
  }
  return j.data as T;
}

const norm = (arr: any[] = []): SvAnime[] =>
  arr.map((x) => ({ ...x, source: "samehadaku" as Source }));

export async function svHome(): Promise<{ recent: SvAnime[]; popular: SvAnime[]; top10: SvAnime[] }> {
  const d = await get<any>(`/samehadaku/home`);
  return {
    recent: norm(d?.recent?.animeList || []),
    popular: norm(d?.popular?.animeList || []),
    top10: norm(d?.top10?.animeList || []),
  };
}
export async function svPopular(page = 1): Promise<SvAnime[]> {
  const d = await get<any>(`/samehadaku/popular?page=${page}`); return norm(d?.animeList || []);
}
export async function svOngoing(page = 1): Promise<SvAnime[]> {
  const d = await get<any>(`/samehadaku/ongoing?page=${page}`); return norm(d?.animeList || []);
}
export async function svCompleted(page = 1): Promise<SvAnime[]> {
  const d = await get<any>(`/samehadaku/completed?page=${page}`); return norm(d?.animeList || []);
}
export async function svMovies(page = 1): Promise<SvAnime[]> {
  const d = await get<any>(`/samehadaku/movies?page=${page}`); return norm(d?.animeList || []);
}
export async function svSchedule(): Promise<{ day: string; animeList: SvAnime[] }[]> {
  const d = await get<any>(`/samehadaku/schedule`);
  return (d?.days || []).map((x: any) => ({ day: x.day, animeList: norm(x.animeList || []) }));
}
export async function svGenres(): Promise<{ title: string; genreId: string }[]> {
  const d = await get<any>(`/samehadaku/genres`);
  return (d?.genreList || []).map((g: any) => ({ title: g.title, genreId: g.genreId }));
}

import { cleanTitle } from "@/lib/title";
import type { AnimeCard } from "@/lib/anime-types";
export function svToCard(a: SvAnime): AnimeCard {
  const epNum = typeof a.episodes === "string" ? parseInt(a.episodes) || 0 : (a.episodes || 0);
  const t = (a.type || "TV").toUpperCase();
  return {
    id: `sv-${a.animeId}`,
    title: cleanTitle(a.title),
    type: (["TV", "MOVIE", "ONA", "OVA"].includes(t) ? t : "TV") as "TV" | "MOVIE" | "ONA" | "OVA",
    episodes: epNum,
    year: new Date().getFullYear(),
    cover: a.poster || "",
    banner: a.poster || "",
    synopsis: "",
    genres: [],
    rating: a.score || "HD",
    sub: epNum || undefined,
  };
}

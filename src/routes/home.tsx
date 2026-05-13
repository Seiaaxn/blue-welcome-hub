import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2, Calendar, Star, Sparkles, Search, Menu, Shuffle, Film, Flame, MessageSquare,
} from "lucide-react";
import { Spotlight } from "@/components/Spotlight";
import {
  PortraitGrid, LandscapeGrid, RowList, SectionTitle, TrendingRow,
} from "@/components/AnimeBlocks";
import type { AnimeCard } from "@/lib/anime-types";
import {
  svHome, svPopular, svOngoing, svCompleted, svMovies, svSchedule, svGenres,
  svToCard, type SvAnime,
} from "@/lib/sankavollerei";
import { cleanTitle } from "@/lib/title";

export const Route = createFileRoute("/home")({
  component: Home,
});

const DAYS_ID: Record<string, string> = {
  Monday: "Senin", Tuesday: "Selasa", Wednesday: "Rabu", Thursday: "Kamis",
  Friday: "Jumat", Saturday: "Sabtu", Sunday: "Minggu",
};

function Header() {
  const [draft, setDraft] = useState("");
  const nav = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q) return;
    nav({ to: "/search", search: { q } });
  };
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-16 flex items-center gap-3">
        <button aria-label="Menu" className="h-10 w-10 grid place-items-center rounded-lg hover:bg-secondary">
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="text-xl font-black tracking-wider shrink-0">
          CIHUYN<span className="text-primary">!</span>ME
        </Link>
        <form onSubmit={submit} className="ml-2 sm:ml-4 flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Mau nonton apa hari ini?..."
              className="w-full h-10 rounded-xl bg-input/60 border border-border pl-4 pr-10 text-sm focus:outline-none focus:border-primary"
            />
            <button type="submit" aria-label="Cari" className="absolute right-1 top-1 h-8 w-8 grid place-items-center rounded-lg text-primary hover:bg-secondary">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <Link to="/search" search={{ q: "" }} aria-label="Cari" className="sm:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-secondary">
            <Search className="h-5 w-5" />
          </Link>
          <HeaderIcon icon={<Shuffle className="h-4 w-4" />} label="Random" />
          <HeaderIcon icon={<Film className="h-4 w-4" />} label="Movie" />
          <HeaderIcon icon={<Flame className="h-4 w-4" />} label="Popular" />
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg bg-[#5865F2]/20 text-[#7d8af0] hover:bg-[#5865F2]/30"
            aria-label="Discord"
          >
            <MessageSquare className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function HeaderIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="hidden md:flex flex-col items-center text-muted-foreground hover:text-primary cursor-pointer">
      <div className="h-10 w-10 grid place-items-center rounded-full bg-secondary border border-border">
        {icon}
      </div>
      <span className="text-[9px] mt-0.5 font-bold tracking-wider uppercase">{label}</span>
    </div>
  );
}

function Home() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState<AnimeCard[]>([]);
  const [recent, setRecent] = useState<AnimeCard[]>([]);
  const [popular, setPopular] = useState<AnimeCard[]>([]);
  const [ongoing, setOngoing] = useState<AnimeCard[]>([]);
  const [completed, setCompleted] = useState<AnimeCard[]>([]);
  const [movies, setMovies] = useState<AnimeCard[]>([]);
  const [top10, setTop10] = useState<AnimeCard[]>([]);
  const [schedule, setSchedule] = useState<{ day: string; animeList: SvAnime[] }[]>([]);
  const [activeDay, setActiveDay] = useState<string>("");
  const [genreList, setGenreList] = useState<{ title: string; genreId: string }[]>([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const safe = <T,>(p: Promise<T>, fallback: T): Promise<T> =>
          p.catch((e) => { console.warn("api err", e); return fallback; });

        const [home, pop, ong, comp, mov, sch, gen] = await Promise.all([
          safe(svHome(), { recent: [], popular: [], top10: [] }),
          safe(svPopular(), [] as SvAnime[]),
          safe(svOngoing(), [] as SvAnime[]),
          safe(svCompleted(), [] as SvAnime[]),
          safe(svMovies(), [] as SvAnime[]),
          safe(svSchedule(), [] as { day: string; animeList: SvAnime[] }[]),
          safe(svGenres(), [] as { title: string; genreId: string }[]),
        ]);
        if (!alive) return;

        const recentCards = home.recent.map(svToCard);
        setRecent(recentCards);
        setSpotlight(recentCards.slice(0, 6));
        setTop10(home.top10.map(svToCard));
        setPopular(pop.map(svToCard));
        setOngoing(ong.map(svToCard));
        setCompleted(comp.map(svToCard));
        setMovies(mov.map(svToCard));
        setSchedule(sch);
        setGenreList(gen);
        const today = new Date().toLocaleString("en-US", { weekday: "long" });
        setActiveDay(sch.find((d) => d.day === today)?.day || sch[0]?.day || "");

        if (recentCards.length === 0 && pop.length === 0) {
          setError("Tidak ada data dari server. Coba muat ulang.");
        }
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const watchAnime = (a: AnimeCard) =>
    nav({ to: "/search", search: { q: a.title } });

  const todaySchedule = schedule.find((d) => d.day === activeDay)?.animeList || [];
  const trending = popular.length ? popular.slice(0, 10) : recent.slice(0, 10);

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-5 mt-4 sm:mt-6 space-y-10 sm:space-y-14">
        {loading ? (
          <div className="py-32 grid place-items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error && spotlight.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-destructive font-bold">Gagal memuat data anime</p>
            <p className="text-xs text-muted-foreground mt-2">{error}</p>
          </div>
        ) : (
          <>
            <Spotlight items={spotlight} onWatch={watchAnime} />

            {trending.length > 0 && (
              <section>
                <SectionTitle title="Trending" />
                <TrendingRow items={trending} onClick={watchAnime} />
              </section>
            )}

            {recent.length > 0 && (
              <section>
                <SectionTitle title="Episode Terbaru" />
                <LandscapeGrid items={recent.slice(0, 12)} onClick={watchAnime} />
              </section>
            )}

            {top10.length > 0 && (
              <section className="bg-card rounded-2xl border border-border p-4 sm:p-7">
                <h3 className="text-xl sm:text-2xl font-black mb-4 flex items-center gap-3 uppercase tracking-wider">
                  <Sparkles className="h-6 w-6 text-primary" /> Top 10
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  {top10.slice(0, 10).map((a, i) => (
                    <li key={a.id}>
                      <button onClick={() => watchAnime(a)} className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-secondary transition group text-left">
                        <span className={`text-2xl sm:text-3xl font-black w-8 sm:w-10 text-center ${i < 3 ? "text-primary" : "text-muted-foreground/40"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <img src={a.cover} alt={a.title} loading="lazy" className="h-14 w-10 rounded object-cover border border-border" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate group-hover:text-primary">{a.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                            <span>{a.type}</span>
                            {a.rating && <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 text-primary" />{a.rating}</span>}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: "Sedang Tayang", items: ongoing.slice(0, 6) },
                { title: "Most Popular", items: popular.slice(0, 6) },
                { title: "Selesai", items: completed.slice(0, 6) },
                { title: "Movies", items: movies.slice(0, 6) },
              ].filter((b) => b.items.length > 0).map((b) => (
                <div key={b.title} className="bg-card rounded-2xl border border-border p-4">
                  <SectionTitle title={b.title} />
                  <RowList items={b.items} onClick={watchAnime} />
                </div>
              ))}
            </section>

            {popular.length > 0 && (
              <section>
                <SectionTitle title="Populer" />
                <PortraitGrid items={popular.slice(0, 12)} onClick={watchAnime} />
              </section>
            )}

            {schedule.length > 0 && (
              <section className="bg-card rounded-2xl border border-border p-4 sm:p-7">
                <SectionTitle title="Jadwal Tayang" />
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-hide">
                  {schedule.map((d) => (
                    <button
                      key={d.day}
                      onClick={() => setActiveDay(d.day)}
                      className={`shrink-0 px-4 h-12 rounded-xl flex flex-col items-center justify-center border transition ${activeDay === d.day
                        ? "bg-primary text-primary-foreground border-primary glow-primary"
                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}
                    >
                      <span className="text-[10px] uppercase tracking-wider">{DAYS_ID[d.day]?.slice(0, 3) || d.day.slice(0, 3)}</span>
                      <span className="text-xs font-black">{DAYS_ID[d.day] || d.day}</span>
                    </button>
                  ))}
                </div>
                {todaySchedule.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-6">Tidak ada jadwal hari ini.</p>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {todaySchedule.map((s) => (
                      <li key={s.animeId}>
                        <button
                          onClick={() => nav({ to: "/search", search: { q: cleanTitle(s.title) } })}
                          className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border hover:border-primary transition"
                        >
                          <img src={s.poster} alt={s.title} loading="lazy" className="h-14 w-10 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{cleanTitle(s.title)}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{s.estimation || s.type || "TV"}</p>
                          </div>
                          <Calendar className="h-4 w-4 text-primary shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {genreList.length > 0 && (
              <section>
                <SectionTitle title="Genre" />
                <div className="flex flex-wrap gap-2">
                  {genreList.map((g) => (
                    <button
                      key={g.genreId}
                      onClick={() => nav({ to: "/search", search: { q: g.title } })}
                      className="text-xs sm:text-sm px-4 py-2 rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary transition"
                    >
                      {g.title}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="pt-6 border-t border-border text-center text-xs text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>·</span>
            <Link to="/search" search={{ q: "" }} className="hover:text-primary">Cari</Link>
            <span>·</span>
            <a href="https://discord.com/" target="_blank" rel="noreferrer" className="hover:text-primary">Discord</a>
          </div>
          <p>© {new Date().getFullYear()} Cihuynime — data via Sankavollerei API.</p>
        </footer>
      </main>
    </div>
  );
}

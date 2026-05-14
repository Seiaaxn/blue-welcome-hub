import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useState } from "react";
import { ArrowLeft, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Cari Anime — Nexzhu" },
      { name: "description", content: "Cari Anime Favorit Kamu Hanya Di Nexzhu." },
    ],
  }),
  component: SearchPage,
});

type Anime = {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string; large_image_url?: string } };
  score?: number | null;
  episodes?: number | null;
  type?: string | null;
  year?: number | null;
  synopsis?: string | null;
};

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [draft, setDraft] = useState(q);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jikan-search", q],
    enabled: q.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Anime[]> => {
      const r = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=20&sfw=true`,
      );
      if (!r.ok) throw new Error("Gagal memuat");
      const j = await r.json();
      return j.data ?? [];
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { q: draft.trim() } });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3 backdrop-blur">
        <Link
          to="/"
          aria-label="Kembali"
          className="rounded-lg p-2 hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-lg font-extrabold tracking-wider">
          NEX<span className="text-primary">Z</span>HU
        </span>
      </header>

      <form onSubmit={submit} className="flex items-center gap-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ketik judul anime..."
          className="h-14 rounded-xl bg-input/60 text-base"
          autoFocus
        />
        <Button type="submit" aria-label="Cari" className="h-14 w-14 rounded-xl glow-primary">
          <Search className="h-5 w-5" />
        </Button>
      </form>

      <section className="mt-6">
        {q.trim() === "" && (
          <p className="text-sm text-muted-foreground">
            Ketik Judul Anime Untuk Mencari 
          </p>
        )}

        {q.trim() !== "" && (
          <h1 className="mb-4 text-lg font-bold">
            Hasil Untuk:{" "}
            <span className="text-primary">"{q}"</span>
          </h1>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-card/60" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Gagal Memuat Hasil. Coba Lagi Sebentar — API Sedang Membatasi Permintaan.
          </p>
        )}

        {data && data.length === 0 && (
          <p className="text-sm text-muted-foreground">Tidak Ada Hasil Ditemukan.</p>
        )}

        {data && data.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.map((a) => (
              <li
                key={a.mal_id}
                className="group overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur transition hover:border-primary/60"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
                  <img
                    src={a.images.jpg.image_url}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold">{a.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    {a.score != null && (
                      <span className="flex items-center gap-1 text-primary">
                        <Star className="h-3 w-3 fill-primary" /> {a.score}
                      </span>
                    )}
                    {a.type && <span>{a.type}</span>}
                    {a.episodes != null && <span>· {a.episodes} eps</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CommentBox />

      <footer className="mt-10 pb-10 text-center text-xs text-muted-foreground">
        Data Anime via Api
      </footer>
    </main>
  );
}

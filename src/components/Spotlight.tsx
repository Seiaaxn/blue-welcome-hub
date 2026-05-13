import { useState } from "react";
import { Play, Info, ChevronLeft, ChevronRight, Tv } from "lucide-react";
import type { AnimeCard } from "@/lib/anime-types";
import { Badge } from "@/components/ui/badge";

export const Spotlight = ({ items, onWatch }: { items: AnimeCard[]; onWatch: (a: AnimeCard) => void }) => {
  const [idx, setIdx] = useState(0);
  if (!items || items.length === 0) return null;
  const safeIdx = idx % items.length;
  const a = items[safeIdx];
  const next = () => setIdx((safeIdx + 1) % items.length);
  const prev = () => setIdx((safeIdx - 1 + items.length) % items.length);

  return (
    <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border bg-card min-h-[340px] sm:min-h-[480px]">
      <div className="absolute inset-0">
        <img src={a.banner || a.cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative p-4 sm:p-10 max-w-2xl space-y-3 sm:space-y-4">
        <p className="text-primary font-extrabold text-xs sm:text-sm">#{safeIdx + 1} Spotlight</p>
        <h2 className="text-2xl sm:text-5xl font-black leading-tight line-clamp-2">{a.title}</h2>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Tv className="h-3.5 w-3.5" /> {a.type}</span>
          {a.episodes > 0 && <span className="flex items-center gap-1.5"><Play className="h-3 w-3 fill-current" /> {a.episodes} Eps</span>}
          <span>📅 {a.year}</span>
          {a.rating && <Badge className="bg-primary text-primary-foreground rounded font-bold">{a.rating}</Badge>}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2">
          <button onClick={() => onWatch(a)} className="h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-primary text-primary-foreground font-extrabold text-xs sm:text-sm flex items-center gap-2 glow-primary hover:scale-[1.02] transition">
            <Play className="h-4 w-4 fill-current" /> Watch Now
          </button>
          <button onClick={() => onWatch(a)} className="h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-secondary text-foreground font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:bg-secondary/80 transition border border-border">
            Detail <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        <button onClick={prev} className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur border border-border grid place-items-center hover:text-primary"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={next} className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur border border-border grid place-items-center hover:text-primary"><ChevronRight className="h-5 w-5" /></button>
      </div>

      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === safeIdx ? "w-8 bg-primary" : "w-2 bg-muted-foreground/40"}`} />
        ))}
      </div>
    </section>
  );
};

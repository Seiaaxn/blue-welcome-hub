import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommentBox } from "@/components/CommentBox";
import heroImg from "@/assets/hero-anime.jpg";

export const Route = createFileRoute("/")({
  component: Welcome,
});

const TOP_SEARCHES = [
  "Attack on Titan",
  "Demon Slayer: Kimetsu no Yaiba",
  "JUJUTSU KAISEN",
  "Death Note",
  "My Hero Academia",
  "Hunter x Hunter (2011)",
  "One-Punch Man",
  "Tokyo Ghoul",
  "Attack on Titan Season 2",
  "ONE PIECE",
];

function Logo() {
  return (
    <span className="text-xl font-extrabold tracking-wider text-foreground">
      CIHUYN
      <span className="text-primary">!</span>
      ME
    </span>
  );
}

function Welcome() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      {/* Top nav card */}
      <header className="flex items-center justify-between rounded-2xl border border-border bg-card/70 px-5 py-4 backdrop-blur">
        <Logo />
        <button
          aria-label="Menu"
          className="rounded-lg p-2 text-foreground/80 hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Hero card */}
      <section className="mt-5 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
        <div className="overflow-hidden rounded-xl">
          <img
            src={heroImg}
            alt="Cihuynime hero"
            width={1024}
            height={768}
            className="h-auto w-full object-cover"
          />
        </div>

        <h1 className="mt-6 text-center text-4xl font-extrabold tracking-wider">
          CIHUYN<span className="text-primary">!</span>ME
        </h1>

        <p className="mt-4 text-center text-lg font-semibold text-primary">
          Selamat Datang di Markas Besar Cihuynime!
        </p>
        <p className="mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          Platform Streaming Anime Terbaik dengan koleksi terlengkap dan server
          super cepat. Cari, tonton, dan nikmati petualanganmu!
        </p>

        {/* Search */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 flex items-center gap-3"
        >
          <Input
            placeholder="Ketik judul anime..."
            className="h-14 rounded-xl bg-input/60 text-base"
          />
          <Button
            type="submit"
            aria-label="Cari"
            className="h-14 w-14 rounded-xl glow-primary"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          <span className="font-bold tracking-wide text-primary">TOP SEARCH:</span>{" "}
          {TOP_SEARCHES.map((t, i) => (
            <span key={t}>
              <a href="#" className="hover:text-foreground">
                {t}
              </a>
              {i < TOP_SEARCHES.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>

        {/* CTAs */}
        <div className="mt-7 space-y-3">
          <Button className="h-14 w-full rounded-xl text-base font-bold tracking-wider glow-primary">
            MULAI NONTON <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <button className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 text-sm font-bold tracking-wider text-destructive transition hover:bg-destructive/20">
            <Heart className="h-5 w-5 fill-destructive" /> SUPPORT US
          </button>
          <button className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 text-sm font-bold tracking-wider text-primary transition hover:bg-primary/20">
            <DiscordIcon /> DISCORD
          </button>
        </div>
      </section>

      {/* FAQ banner */}
      <section className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-5 py-5 backdrop-blur">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        <h2 className="text-base font-bold tracking-wider text-foreground">
          PAPAN INFORMASI (FAQ)
        </h2>
      </section>

      {/* Comments via Firebase */}
      <CommentBox />

      <footer className="mt-10 pb-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Cihuynime
      </footer>
    </main>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a13.95 13.95 0 0 0-.617 1.265 18.27 18.27 0 0 0-5.882 0A13.7 13.7 0 0 0 9.44 3a19.74 19.74 0 0 0-3.76 1.37C2.27 9.043 1.39 13.58 1.83 18.058a19.9 19.9 0 0 0 6.073 3.064 14.55 14.55 0 0 0 1.3-2.1 12.85 12.85 0 0 1-2.05-.98c.172-.126.34-.258.504-.394 3.927 1.81 8.18 1.81 12.06 0 .166.136.334.268.504.394-.654.39-1.34.717-2.052.98a14.4 14.4 0 0 0 1.3 2.1 19.86 19.86 0 0 0 6.075-3.063c.5-5.177-.838-9.674-3.227-13.69ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.42 0-1.336.953-2.42 2.157-2.42 1.21 0 2.18 1.094 2.157 2.42 0 1.335-.953 2.42-2.157 2.42Zm7.96 0c-1.18 0-2.157-1.085-2.157-2.42 0-1.336.954-2.42 2.158-2.42 1.21 0 2.18 1.094 2.157 2.42 0 1.335-.946 2.42-2.157 2.42Z" />
    </svg>
  );
}

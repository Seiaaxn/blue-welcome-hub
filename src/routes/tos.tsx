import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/tos")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Nexzhu" },
      { name: "description", content: "Syarat & Ketentuan penggunaan Nexzhu." },
    ],
  }),
  component: TosPage,
});

function TosPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.history.back()} aria-label="Kembali" className="h-10 w-10 grid place-items-center rounded-lg hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link to="/" className="text-lg font-black tracking-wider">NEX<span className="text-primary">Z</span>HU</Link>
          <span className="ml-2 text-sm text-muted-foreground">/ Terms</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        <h1 className="text-2xl font-black uppercase tracking-wider">Syarat & Ketentuan</h1>

        <section>
          <h2 className="text-base font-black uppercase tracking-wider mb-2">1. Penggunaan Layanan</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nexzhu adalah agregator yang menampilkan informasi dan tautan anime
            dari sumber pihak ketiga. Dengan menggunakan layanan ini, Anda
            setuju untuk tidak menyalahgunakan situs, melakukan scraping
            berlebihan, atau mengganggu pengguna lain.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black uppercase tracking-wider mb-2">2. Akun & Sosial</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Akun login digunakan untuk fitur komentar, follow, dan chat antar
            teman yang sudah saling follow. Anda bertanggung jawab atas
            aktivitas akun Anda. Konten yang melanggar (SARA, kekerasan, NSFW
            ekstrem, doxxing) akan dihapus tanpa pemberitahuan.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black uppercase tracking-wider mb-2">3. Privasi & Enkripsi</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pesan chat antar teman dienkripsi end-to-end di sisi perangkat
            menggunakan ECDH P-256 + AES-GCM. Server hanya menyimpan
            ciphertext — admin sekalipun tidak dapat membaca isinya.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black uppercase tracking-wider mb-2">4. Konten Pihak Ketiga</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kami tidak meng-host file video. Seluruh stream berasal dari
            penyedia pihak ketiga dan tunduk pada kebijakan masing-masing.
            Lihat halaman <Link to="/dmca" className="text-primary underline">DMCA</Link>{" "}
            untuk laporan hak cipta.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black uppercase tracking-wider mb-2">5. Penafian</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Layanan disediakan "apa adanya". Kami tidak menjamin ketersediaan
            tanpa gangguan dan tidak bertanggung jawab atas kerugian yang
            timbul dari penggunaan layanan ini.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-6">© {new Date().getFullYear()} NEXZHU</p>
      </main>
    </div>
  );
}

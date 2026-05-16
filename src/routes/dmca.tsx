import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA — Nexzhu" },
      { name: "description", content: "Kebijakan DMCA Nexzhu untuk laporan pelanggaran hak cipta." },
    ],
  }),
  component: DmcaPage,
});

function DmcaPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.history.back()} aria-label="Kembali" className="h-10 w-10 grid place-items-center rounded-lg hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link to="/" className="text-lg font-black tracking-wider">NEX<span className="text-primary">Z</span>HU</Link>
          <span className="ml-2 text-sm text-muted-foreground">/ DMCA</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 mt-6 prose prose-invert prose-sm sm:prose-base">
        <h1 className="text-2xl font-black uppercase tracking-wider mb-4">DMCA</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Nexzhu menghormati hak kekayaan intelektual pihak lain dan mengharapkan
          pengguna kami melakukan hal yang sama. Kami <b>tidak menyimpan</b>
          satupun berkas video, gambar, atau konten yang dapat diunduh di server
          kami sendiri. Seluruh konten ditampilkan melalui penyedia pihak ketiga.
        </p>
        <h2 className="mt-6 text-base font-black uppercase tracking-wider">Pengajuan Laporan</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Jika Anda adalah pemegang hak cipta yang sah dan meyakini ada konten
          di Nexzhu yang melanggar hak Anda, silakan kirim laporan resmi yang berisi:
        </p>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>Identitas dan kontak Anda.</li>
          <li>Bukti kepemilikan atau kuasa atas karya yang dimaksud.</li>
          <li>URL halaman Nexzhu yang menampilkan tautan terkait.</li>
          <li>URL sumber asli (penyedia pihak ketiga) bila tersedia.</li>
          <li>Pernyataan bahwa informasi yang Anda berikan akurat.</li>
        </ul>
        <h2 className="mt-6 text-base font-black uppercase tracking-wider">Kontak</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Kirim laporan ke{" "}
          <a className="text-primary underline" href="mailto:ryu694602@gmail.com">ryu694602@gmail.com</a>{" "}
          dengan subjek <code>[DMCA] Nexzhu</code>. Permintaan yang lengkap akan
          kami proses dalam waktu wajar dengan menonaktifkan tautan terkait di sisi kami.
        </p>
        <p className="mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} NEXZHU</p>
      </main>
    </div>
  );
}

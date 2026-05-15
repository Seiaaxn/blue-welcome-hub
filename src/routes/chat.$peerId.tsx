import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";
import { chatId, isMutual, useChatMessages, useProfile, sendChatMessage } from "@/lib/social";
import { RoleBadge } from "@/components/Badges";

export const Route = createFileRoute("/chat/$peerId")({
  component: ChatPage,
});

function ChatPage() {
  const { peerId } = Route.useParams();
  const router = useRouter();
  const { user } = useAuth();
  const peer = useProfile(peerId);
  const cid = user ? chatId(user.uid, peerId) : undefined;
  const msgs = useChatMessages(cid);
  const [text, setText] = useState("");
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { setAllowed(false); return; }
    isMutual(user.uid, peerId).then(setAllowed).catch(() => setAllowed(false));
  }, [user, peerId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !cid || !text.trim()) return;
    if (!allowed) { toast.error("Kalian belum saling follow."); return; }
    await sendChatMessage(cid, {
      uid: user.uid,
      name: user.displayName ?? "Anon",
      text: text.trim().slice(0, 1000),
    });
    setText("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.history.back()} aria-label="Kembali" className="h-10 w-10 grid place-items-center rounded-lg hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          {peer?.photoURL ? (
            <img src={peer.photoURL} alt="" className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-secondary" />
          )}
          <Link to="/u/$uid" params={{ uid: peerId }} className="font-bold flex items-center gap-2">
            {peer?.displayName || "Pengguna"}
            <RoleBadge email={peer?.email} />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 overflow-y-auto">
        {!user ? (
          <p className="text-center text-sm text-muted-foreground py-20">Login dulu untuk chat.</p>
        ) : allowed === null ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : !allowed ? (
          <p className="text-center text-sm text-destructive py-20">
            Kalian harus saling follow dulu untuk bisa chat.
          </p>
        ) : (
          <ul className="space-y-2">
            {msgs.length === 0 && (
              <li className="text-center text-xs text-muted-foreground py-10">Belum ada pesan, sapa duluan!</li>
            )}
            {msgs.map((m) => {
              const mine = m.uid === user.uid;
              return (
                <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary border border-border rounded-bl-sm"
                  }`}>
                    {!mine && <p className="text-[10px] font-bold opacity-70 mb-0.5">{m.name}</p>}
                    <p className="break-words whitespace-pre-wrap">{m.text}</p>
                  </div>
                </li>
              );
            })}
            <div ref={endRef} />
          </ul>
        )}
      </main>

      {user && allowed && (
        <form onSubmit={send} className="sticky bottom-0 bg-background/90 backdrop-blur border-t border-border px-4 py-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis pesan..."
            maxLength={1000}
            className="flex-1 h-11 rounded-xl bg-input/60 border border-border px-4 text-sm focus:outline-none focus:border-primary"
          />
          <button type="submit" className="h-11 w-11 grid place-items-center rounded-xl bg-primary text-primary-foreground glow-primary">
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { ref, push, onValue, serverTimestamp, query, limitToLast } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Comment = {
  id: string;
  uid: string;
  name: string;
  photo?: string | null;
  text: string;
  ts: number;
};

export function CommentBox() {
  const { user, signInGoogle, logout } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(ref(db, "comments"), limitToLast(50));
    const unsub = onValue(q, (snap) => {
      const list: Comment[] = [];
      snap.forEach((c) => {
        list.push({ id: c.key!, ...(c.val() as Omit<Comment, "id">) });
      });
      setComments(list.reverse());
    });
    return () => unsub();
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim()) return;
    await push(ref(db, "comments"), {
      uid: user.uid,
      name: user.displayName ?? "Anon",
      photo: user.photoURL ?? null,
      text: text.trim().slice(0, 500),
      ts: serverTimestamp(),
    });
    setText("");
  };

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Komentar</h2>
        {user ? (
          <div className="flex items-center gap-2 text-sm">
            {user.photoURL && (
              <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full" />
            )}
            <span className="text-muted-foreground">{user.displayName}</span>
            <Button size="sm" variant="ghost" onClick={() => logout()}>
              Keluar
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => signInGoogle()}>
            Masuk dengan Google
          </Button>
        )}
      </div>

      {user && (
        <form onSubmit={send} className="mb-4 flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis komentar..."
            maxLength={500}
          />
          <Button type="submit">Kirim</Button>
        </form>
      )}

      <ul className="space-y-3">
        {comments.length === 0 && (
          <li className="text-sm text-muted-foreground">Belum ada komentar. Jadilah yang pertama!</li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3 rounded-lg bg-background/60 p-3">
            {c.photo ? (
              <img src={c.photo} alt="" className="h-8 w-8 rounded-full" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/30" />
            )}
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.text}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

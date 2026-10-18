import { useCallback, useEffect, useRef, useState } from "react";
import { streamAnswer } from "./api";
import type { Chat } from "./types";

const KEY = "jpm-chats-v1";
const uid = () => crypto.randomUUID();

const blankChat = (): Chat => ({
  id: uid(),
  title: "New chat",
  messages: [],
  updatedAt: Date.now(),
});

function load(): Chat[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Chat[]) : [];
    return parsed.length ? parsed : [blankChat()];
  } catch {
    return [blankChat()];
  }
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(load);
  const [activeId, setActiveId] = useState<string>(() => load()[0].id);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(chats));
  }, [chats]);

  const active = chats.find((c) => c.id === activeId) ?? chats[0];

  const patch = useCallback((id: string, fn: (c: Chat) => Chat) => {
    setChats((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
  }, []);

  const newChat = () => {
    const existing = chats.find((c) => c.messages.length === 0);
    if (existing) return setActiveId(existing.id);
    const c = blankChat();
    setChats((p) => [c, ...p]);
    setActiveId(c.id);
  };

  const removeChat = (id: string) => {
    const rest = chats.filter((c) => c.id !== id);
    const next = rest.length ? rest : [blankChat()];
    setChats(next);
    if (id === activeId) setActiveId(next[0].id);
  };

  const stop = () => abortRef.current?.abort();

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    const id = active.id;
    const assistantId = uid();

    patch(id, (c) => ({
      ...c,
      title: c.messages.length ? c.title : question.slice(0, 40),
      updatedAt: Date.now(),
      messages: [
        ...c.messages,
        { id: uid(), role: "user", content: question },
        { id: assistantId, role: "assistant", content: "" },
      ],
    }));

    const append = (chunk: string) =>
      patch(id, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === assistantId ? { ...m, content: m.content + chunk } : m
        ),
      }));

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    try {
      await streamAnswer(question, append, ctrl.signal);
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        append("\n\n**Error:** could not reach the backend. Is `uvicorn server:app` running?");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return { chats, active, setActiveId, newChat, removeChat, send, stop, loading };
}

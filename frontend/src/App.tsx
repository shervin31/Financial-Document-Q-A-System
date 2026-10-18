import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Message from "./components/Message";
import Composer from "./components/Composer";
import { useChats } from "./useChats";

export default function App() {
  const { chats, active, setActiveId, newChat, removeChat, send, stop, loading } = useChats();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [active.messages, active.id]);

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeId={active.id}
        open={sidebarOpen}
        onSelect={setActiveId}
        onNew={newChat}
        onDelete={removeChat}
      />
      <main className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle sidebar">☰</button>
          <div className="thread-title">{active.title}</div>
          <div className="status">
            <span className={`dot ${loading ? "busy" : ""}`} />
            Document QA
          </div>
        </header>

        <section className="feed">
          <div className="feed-inner">
            {active.messages.length === 0 ? (
              <div className="empty">
                <h1>JPM 2025 10-K</h1>
                <p>Ask anything about the filing.</p>
              </div>
            ) : (
              active.messages.map((m, i) => (
                <Message key={m.id} msg={m} thinking={loading && i === active.messages.length - 1} />
              ))
            )}
            <div ref={endRef} />
          </div>
        </section>

        <Composer loading={loading} onSend={send} onStop={stop} />
      </main>
    </div>
  );
}

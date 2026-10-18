import type { Chat } from "../types";

interface Props {
  chats: Chat[];
  activeId: string;
  open: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({ chats, activeId, open, onSelect, onNew, onDelete }: Props) {
  const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
  return (
    <aside className={`sidebar ${open ? "" : "collapsed"}`}>
      <button className="new-chat" onClick={onNew}>+ New chat</button>
      <div className="sidebar-label">Chat history</div>
      <nav className="history">
        {sorted.map((c) => (
          <div key={c.id} className={`history-item ${c.id === activeId ? "active" : ""}`}>
            <button className="history-title" onClick={() => onSelect(c.id)} title={c.title}>
              {c.title}
            </button>
            <button className="history-del" onClick={() => onDelete(c.id)} aria-label="Delete chat">×</button>
          </div>
        ))}
      </nav>
    </aside>
  );
}

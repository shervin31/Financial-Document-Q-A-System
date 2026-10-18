import { useEffect, useRef, useState } from "react";

interface Props {
  loading: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export default function Composer({ loading, onSend, onStop }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  const submit = () => {
    if (!value.trim() || loading) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="composer-wrap">
      <div className="composer">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          placeholder="Ask about the JPMorgan 2025 10-K…"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        {loading ? (
          <button className="send stop" onClick={onStop}>Stop</button>
        ) : (
          <button className="send" onClick={submit} disabled={!value.trim()}>Send</button>
        )}
      </div>
      <div className="hint">Enter to send · Shift+Enter for a new line</div>
    </div>
  );
}

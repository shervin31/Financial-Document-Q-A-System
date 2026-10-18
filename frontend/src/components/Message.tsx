import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message as Msg } from "../types";

export default function Message({ msg, thinking }: { msg: Msg; thinking: boolean }) {
  if (msg.role === "user") {
    return (
      <div className="row user">
        <div className="bubble">{msg.content}</div>
      </div>
    );
  }
  return (
    <div className="row assistant">
      <div className="label">Assistant</div>
      {msg.content ? (
        <div className="md">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
        </div>
      ) : thinking ? (
        <div className="thinking"><span /><span /><span /></div>
      ) : null}
    </div>
  );
}

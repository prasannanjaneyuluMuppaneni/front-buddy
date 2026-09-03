import { Check, Copy, Paperclip, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/nova-logo.png";
import { Message, MessageAction, MessageActions, MessageContent } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Markdown } from "@/components/chat/markdown";
import { useChatStore } from "@/lib/chat/store";
import type { ChatMessage } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

interface Props {
  chatId: string;
  message: ChatMessage;
  isLast: boolean;
  isStreamingThis: boolean;
}

export function MessageItem({ chatId, message, isLast, isStreamingThis }: Props) {
  const setFeedback = useChatStore((s) => s.setFeedback);
  const regenerate = useChatStore((s) => s.regenerate);
  const status = useChatStore((s) => s.status);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (message.role === "user") {
    return (
      <Message from="user" className="animate-message-in max-w-[85%] sm:max-w-[75%]">
        <MessageContent className="group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-md group-[.is-user]:bg-user-bubble group-[.is-user]:text-user-bubble-foreground group-[.is-user]:px-4 group-[.is-user]:py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm">
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-1.5">
              {message.attachments.map((a) => (
                <span
                  key={a.name}
                  className="inline-flex items-center gap-1 rounded-md bg-primary-foreground/15 px-2 py-0.5 text-xs"
                >
                  <Paperclip className="size-3" /> {a.name}
                </span>
              ))}
            </div>
          )}
          {message.content}
        </MessageContent>
      </Message>
    );
  }

  const pending = isStreamingThis && message.content === "";

  return (
    <Message from="assistant" className="animate-message-in max-w-full">
      <div className="flex gap-3">
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card">
          <img src={logo} alt="" width={512} height={512} className="size-4" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <MessageContent className="w-full max-w-full">
            {pending ? (
              <Shimmer className="text-sm text-muted-foreground" duration={1.6}>
                Thinking...
              </Shimmer>
            ) : (
              <Markdown content={message.content} />
            )}
          </MessageContent>

          {!isStreamingThis && message.content && (
            <MessageActions
              className={cn(
                "-ml-1.5 mt-1.5 text-muted-foreground transition-opacity",
                isLast ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
              )}
            >
              <MessageAction tooltip={copied ? "Copied" : "Copy"} onClick={copy} className="h-7 w-7">
                {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
              </MessageAction>
              <MessageAction
                tooltip="Good response"
                className={cn("h-7 w-7", message.feedback === "up" && "text-primary")}
                onClick={() => setFeedback(chatId, message.id, message.feedback === "up" ? null : "up")}
              >
                <ThumbsUp className="size-3.5" />
              </MessageAction>
              <MessageAction
                tooltip="Bad response"
                className={cn("h-7 w-7", message.feedback === "down" && "text-destructive")}
                onClick={() =>
                  setFeedback(chatId, message.id, message.feedback === "down" ? null : "down")
                }
              >
                <ThumbsDown className="size-3.5" />
              </MessageAction>
              {isLast && (
                <MessageAction
                  tooltip="Regenerate"
                  className="h-7 w-7"
                  disabled={status !== "ready"}
                  onClick={() => regenerate(chatId)}
                >
                  <RefreshCw className="size-3.5" />
                </MessageAction>
              )}
            </MessageActions>
          )}
        </div>
      </div>
    </Message>
  );
}

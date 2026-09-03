import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Composer } from "@/components/chat/composer";
import { MessageItem } from "@/components/chat/message-item";
import { selectChat, useChatStore } from "@/lib/chat/store";

export function ChatView({ chatId }: { chatId: string }) {
  const chat = useChatStore(selectChat(chatId));
  const hydrated = useChatStore((s) => s.hydrated);
  const streaming = useChatStore((s) => s.streaming);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const navigate = useNavigate();

  const onSend = useCallback(
    (text: string, attachments: { name: string; size: number }[]) =>
      sendMessage(chatId, text, attachments.length ? attachments : undefined),
    [chatId, sendMessage],
  );

  if (!chat) {
    if (!hydrated) return <div className="flex-1" />;
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-lg font-semibold">Chat not found</h1>
        <p className="text-sm text-muted-foreground">
          This conversation may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Start a new chat
        </button>
      </div>
    );
  }

  const lastAssistantId = [...chat.messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="relative min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 pb-8 pt-6 sm:px-6">
          {chat.messages.map((m) => (
            <MessageItem
              key={m.id}
              chatId={chat.id}
              message={m}
              isLast={m.id === lastAssistantId}
              isStreamingThis={streaming?.messageId === m.id}
            />
          ))}
        </ConversationContent>
        <ConversationScrollButton className="bottom-4 rounded-full border-border bg-card shadow-md" />
      </Conversation>
      <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-2 sm:px-6">
        <Composer onSend={onSend} className="mx-auto max-w-3xl" />
      </div>
    </div>
  );
}

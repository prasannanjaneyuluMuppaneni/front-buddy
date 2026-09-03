import { createFileRoute } from "@tanstack/react-router";

import { ChatView } from "@/components/chat/chat-view";

export const Route = createFileRoute("/c/$chatId")({
  head: () => ({
    meta: [
      { title: "Conversation — Nova" },
      { name: "description", content: "Continue your conversation with Nova, your AI assistant." },
      { property: "og:title", content: "Conversation — Nova" },
      { property: "og:description", content: "Continue your conversation with Nova, your AI assistant." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatRoute,
});

function ChatRoute() {
  const { chatId } = Route.useParams();
  return <ChatView key={chatId} chatId={chatId} />;
}

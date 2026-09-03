import { createFileRoute } from "@tanstack/react-router";

import { EmptyState } from "@/components/chat/empty-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova — AI Chat Assistant" },
      {
        name: "description",
        content:
          "Chat with Nova, a fast AI assistant for coding help, writing, practice questions and mock tests.",
      },
      { property: "og:title", content: "Nova — AI Chat Assistant" },
      {
        property: "og:description",
        content: "A fast AI assistant for coding help, writing, practice questions and mock tests.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <EmptyState />;
}

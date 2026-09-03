import { useNavigate } from "@tanstack/react-router";
import { BookOpenCheck, ClipboardList, Code2, PenLine } from "lucide-react";
import { useCallback } from "react";

import logo from "@/assets/nova-logo.png";
import { Composer } from "@/components/chat/composer";
import { useChatStore } from "@/lib/chat/store";

const SUGGESTIONS = [
  {
    icon: BookOpenCheck,
    title: "Practice questions",
    text: "Give me 5 practice questions on JavaScript closures",
  },
  {
    icon: ClipboardList,
    title: "Mock test",
    text: "Start a 10-question mock test on general aptitude",
  },
  {
    icon: Code2,
    title: "Write code",
    text: "Write a debounce function in TypeScript",
  },
  {
    icon: PenLine,
    title: "Draft an email",
    text: "Write a friendly follow-up email about a proposal",
  },
];

function greeting(hydrated: boolean) {
  if (!hydrated) return "Hello";
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function EmptyState() {
  const createChat = useChatStore((s) => s.createChat);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const hydrated = useChatStore((s) => s.hydrated);
  const userName = useChatStore((s) => s.userName);
  const navigate = useNavigate();

  const start = useCallback(
    (text: string, attachments?: { name: string; size: number }[]) => {
      const id = createChat();
      navigate({ to: "/c/$chatId", params: { chatId: id } });
      sendMessage(id, text, attachments?.length ? attachments : undefined);
    },
    [createChat, navigate, sendMessage],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-4 pt-10 sm:px-6">
        <div className="animate-message-in flex w-full max-w-3xl flex-col items-center text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <img src={logo} alt="Nova" width={512} height={512} className="size-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {greeting(hydrated)}, {userName.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            How can I help you today?
          </p>

          <div className="mt-8 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => start(s.text)}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <s.icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{s.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {s.text}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="shrink-0 px-4 pb-3 sm:px-6">
        <Composer onSend={start} autoFocus className="mx-auto max-w-3xl" />
      </div>
    </div>
  );
}

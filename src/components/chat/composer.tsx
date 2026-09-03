import { ArrowUp, ChevronDown, Paperclip, Square, X } from "lucide-react";
import { useCallback } from "react";

import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputController,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/lib/chat/store";
import { MODELS } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (text: string, attachments: { name: string; size: number }[]) => void;
  autoFocus?: boolean;
  className?: string;
}

function AttachmentChips() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 px-3 pt-3">
      {attachments.files.map((f) => (
        <span
          key={f.id}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2 py-1 text-xs text-foreground"
        >
          <Paperclip className="size-3 text-muted-foreground" />
          <span className="max-w-[160px] truncate">{f.filename ?? "file"}</span>
          <button
            type="button"
            onClick={() => attachments.remove(f.id)}
            className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Remove attachment"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

function AttachButton() {
  const attachments = usePromptInputAttachments();
  return (
    <PromptInputButton
      tooltip="Attach file"
      onClick={() => attachments.openFileDialog()}
      className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
    >
      <Paperclip className="size-4" />
    </PromptInputButton>
  );
}

function ModelSelector() {
  const model = useChatStore((s) => s.model);
  const setModel = useChatStore((s) => s.setModel);
  const current = MODELS.find((m) => m.id === model) ?? MODELS[0]!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {current.name}
          <ChevronDown className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {MODELS.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onSelect={() => setModel(m.id)}
            className={cn("flex-col items-start gap-0.5 py-2", m.id === model && "bg-accent")}
          >
            <span className="text-sm font-medium">{m.name}</span>
            <span className="text-xs text-muted-foreground">{m.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubmitOrStop() {
  const status = useChatStore((s) => s.status);
  const stop = useChatStore((s) => s.stopStreaming);
  const { textInput } = usePromptInputController();
  const empty = textInput.value.trim().length === 0;

  if (status !== "ready") {
    return (
      <PromptInputSubmit
        status="streaming"
        onStop={stop}
        tooltip="Stop generating"
        className="size-8 rounded-lg bg-foreground text-background hover:bg-foreground/90"
      >
        <Square className="size-3.5 fill-current" />
      </PromptInputSubmit>
    );
  }
  return (
    <PromptInputSubmit
      disabled={empty}
      tooltip="Send"
      className="size-8 rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
    >
      <ArrowUp className="size-4" />
    </PromptInputSubmit>
  );
}

export function Composer({ onSend, autoFocus, className }: Props) {
  const status = useChatStore((s) => s.status);
  const busy = status !== "ready";

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (busy) return;
      const text = message.text.trim();
      if (!text) return;
      onSend(
        text,
        message.files.map((f) => ({ name: f.filename ?? "file", size: 0 })),
      );
    },
    [busy, onSend],
  );

  return (
    <div className={cn("w-full", className)}>
      <PromptInputProvider>
        <PromptInput
          onSubmit={handleSubmit}
          multiple
          maxFiles={5}
          className="rounded-2xl border-border bg-card shadow-[0_8px_30px_-12px_color-mix(in_oklab,var(--foreground)_25%,transparent)] transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30"
        >
          <AttachmentChips />
          <PromptInputTextarea
            autoFocus={autoFocus}
            placeholder="Message Nova…"
            className="max-h-52 min-h-[52px] field-sizing-content px-4 text-[15px] leading-relaxed placeholder:text-muted-foreground/70"
          />
          <PromptInputFooter className="px-2 pb-2">
            <PromptInputTools>
              <AttachButton />
              <ModelSelector />
            </PromptInputTools>
            <SubmitOrStop />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
      <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
        Nova can make mistakes. Check important information.
      </p>
    </div>
  );
}

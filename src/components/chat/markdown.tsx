import { Check, Copy } from "lucide-react";
import { memo, useState, type ComponentProps, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function CodeBlock({ children, className, ...props }: ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false);
  const child = Array.isArray(children) ? children[0] : children;
  const codeClass =
    child && typeof child === "object" && "props" in child
      ? ((child as { props: { className?: string } }).props.className ?? "")
      : "";
  const lang = /language-([\w-]+)/.exec(codeClass)?.[1] ?? "text";

  const copy = async () => {
    await navigator.clipboard.writeText(extractText(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-block my-3 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {lang}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={copy}
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className={cn(className)} {...props}>
        {children}
      </pre>
    </div>
  );
}

export const Markdown = memo(function Markdown({ content }: { content: string }) {
  return (
    <div className="chat-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
        components={{
          pre: CodeBlock,
          a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

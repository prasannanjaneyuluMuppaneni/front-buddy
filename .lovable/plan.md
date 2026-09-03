# AI Chatbot Frontend (Dark, Emerald Accent)

A polished ChatGPT/Claude-style chat interface. Frontend only: replies are simulated (streamed word-by-word) so the UI feels alive; chat history is saved in the browser (localStorage). Real AI can be wired in later without changing the UI.

## Look and feel

- Dark by default: deep charcoal backgrounds (#0f1117 / #1a1d27 / #2a2e3d), subtle 1px dividers, emerald (#10b981) accent for user bubbles, send button, and active states.
- Typography: Geist (or similar clean sans) for UI, JetBrains Mono for code blocks; clear hierarchy between greeting, message text, and metadata.
- Smooth transitions on sidebar collapse, hover states on every button, auto-scroll as messages stream, subtle fade-in for new messages.
- Fully responsive: sidebar becomes a slide-in drawer on mobile (matches your current mobile viewport), persistent collapsible sidebar on desktop.

## Layout

```text
+-------------+-----------------------------------------+
| [+ New chat]|  Model selector v          [theme] [...] |
| [search   ] |                                          |
| Today       |     Greeting / suggestion cards          |
|  - chat     |        or                                |
| Previous 7  |     message stream (user / assistant)    |
|  - chat     |                                          |
|             |  +------------------------------------+  |
| [avatar]    |  | [clip] textarea (auto-resize) [send]|  |
| Settings    |  +------------------------------------+  |
+-------------+-----------------------------------------+
```

### Left sidebar (collapsible)
- "New Chat" button at top.
- Search box filtering chat titles.
- History grouped by time: Today, Yesterday, Previous 7 Days, Previous 30 Days, Older.
- Each item: title, hover actions (rename, delete), active highlight.
- Bottom: user avatar/name and Settings entry (opens a Settings dialog with theme toggle and "clear all chats").
- Pre-seeded with ~10 realistic placeholder conversations so it looks lived-in on first load.

### Main chat area
- Empty state: greeting ("Good evening, how can I help?") plus 4 clickable suggestion cards that start a chat.
- Active chat: user messages in emerald bubbles (right-aligned), assistant replies as plain text on the background (no bubble), with a small assistant avatar.
- Assistant messages render Markdown: headings, lists, links, inline code, and syntax-highlighted code blocks with a copy button.
- Per-message actions: copy, thumbs up / thumbs down (state persisted), regenerate on the last reply.
- Streaming effect: simulated assistant reply typed out progressively with a "Thinking..." shimmer before it starts; stop button while streaming.

### Input bar (fixed at bottom)
- Auto-resizing textarea (Enter sends, Shift+Enter newline).
- Attachment button (opens file picker, shows selected file chips; frontend only).
- Model selector dropdown (e.g. "GPT-5.6", "Claude Sonnet", "Gemini Flash") as UI state.
- Emerald send icon button, disabled when empty.
- Footer disclaimer line.

## Behavior and persistence
- Chats, messages, feedback, selected model, and theme saved to localStorage; reload restores everything.
- Each chat has its own URL (`/c/:chatId`); `/` shows the empty state and creates a chat on first message.
- Mock reply generator returns varied Markdown responses (with code samples) keyed loosely to the prompt, so demos look realistic.

## Technical details

- Routes: `src/routes/index.tsx` (empty state), `src/routes/c.$chatId.tsx` (active chat); shared shell in `__root.tsx` with per-route `head()` metadata.
- UI: shadcn/ui primitives (Sidebar, Sheet for mobile drawer, DropdownMenu, Dialog, Tooltip, ScrollArea, Button, Input), Lucide icons, AI Elements components (Conversation, Message, PromptInput, Shimmer) for the transcript and composer.
- Markdown: `react-markdown` + `remark-gfm`, code highlighting via `shiki` or `rehype-highlight`, with a copy-to-clipboard button per block.
- State: a small `useChatStore` (zustand with localStorage persist) holding chats, messages, feedback, model, theme; seeded with placeholder data when storage is empty.
- Theme: design tokens in `src/styles.css` (oklch), dark as default with `.dark` class on `<html>`; light mode available via toggle.
- Fonts loaded via `<link>` in `__root.tsx`.
- No backend or Lovable Cloud in this phase; the mock reply function is isolated so it can be swapped for a real `/api/chat` stream later.

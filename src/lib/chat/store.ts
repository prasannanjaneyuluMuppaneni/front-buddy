import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { generateReply, deriveTitle } from "./mock-replies";
import { buildSeedChats } from "./seed-data";
import { MODELS, uid, type Chat, type ChatMessage, type Feedback, type ModelId, type Theme } from "./types";

export type StreamStatus = "ready" | "submitted" | "streaming";

interface ChatState {
  chats: Chat[];
  model: ModelId;
  theme: Theme;
  userName: string;
  hydrated: boolean;
  streaming: { chatId: string; messageId: string } | null;
  status: StreamStatus;

  setHydrated: (v: boolean) => void;
  setModel: (m: ModelId) => void;
  setTheme: (t: Theme) => void;
  setUserName: (n: string) => void;

  createChat: () => string;
  sendMessage: (chatId: string, text: string, attachments?: ChatMessage["attachments"]) => void;
  stopStreaming: () => void;
  regenerate: (chatId: string) => void;
  setFeedback: (chatId: string, messageId: string, feedback: Feedback) => void;
  renameChat: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
  clearAll: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

const clearTimer = () => {
  if (timer) clearTimeout(timer);
  timer = null;
};

// Deterministic seed timestamp so SSR and first client render agree.
const SEED_NOW = Date.UTC(2026, 8, 3, 15, 0, 0);

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => {
      const updateChat = (chatId: string, fn: (c: Chat) => Chat) =>
        set((s) => ({ chats: s.chats.map((c) => (c.id === chatId ? fn(c) : c)) }));

      const streamReply = (chatId: string, prompt: string) => {
        clearTimer();
        const messageId = uid();
        const full = generateReply(prompt, get().model);
        const tokens = full.match(/\S+\s*/g) ?? [full];

        set({ status: "submitted", streaming: { chatId, messageId } });

        const start = () => {
          const now = Date.now();
          updateChat(chatId, (c) => ({
            ...c,
            updatedAt: now,
            messages: [
              ...c.messages,
              { id: messageId, role: "assistant", content: "", createdAt: now, feedback: null },
            ],
          }));
          set({ status: "streaming" });
          let i = 0;
          const tick = () => {
            const s = get().streaming;
            if (!s || s.messageId !== messageId) return;
            const chunk = tokens.slice(i, i + 2).join("");
            i += 2;
            updateChat(chatId, (c) => ({
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content: m.content + chunk } : m,
              ),
            }));
            if (i < tokens.length) {
              timer = setTimeout(tick, 18 + Math.random() * 40);
            } else {
              timer = null;
              set({ streaming: null, status: "ready" });
            }
          };
          tick();
        };

        timer = setTimeout(start, 700 + Math.random() * 600);
      };

      return {
        chats: buildSeedChats(SEED_NOW),
        model: MODELS[0]!.id,
        theme: "dark",
        userName: "Prasanna",
        hydrated: false,
        streaming: null,
        status: "ready",

        setHydrated: (v) => set({ hydrated: v }),
        setModel: (model) => set({ model }),
        setTheme: (theme) => set({ theme }),
        setUserName: (userName) => set({ userName }),

        createChat: () => {
          const id = uid();
          const now = Date.now();
          set((s) => ({
            chats: [{ id, title: "New chat", createdAt: now, updatedAt: now, messages: [] }, ...s.chats],
          }));
          return id;
        },

        sendMessage: (chatId, text, attachments) => {
          const trimmed = text.trim();
          if (!trimmed) return;
          const now = Date.now();
          updateChat(chatId, (c) => ({
            ...c,
            title: c.messages.length === 0 ? deriveTitle(trimmed) : c.title,
            updatedAt: now,
            messages: [
              ...c.messages,
              { id: uid(), role: "user", content: trimmed, createdAt: now, attachments },
            ],
          }));
          streamReply(chatId, trimmed);
        },

        stopStreaming: () => {
          const s = get().streaming;
          clearTimer();
          if (s) {
            // Remove an empty placeholder if we stopped before any text arrived.
            updateChat(s.chatId, (c) => ({
              ...c,
              messages: c.messages.filter((m) => !(m.id === s.messageId && m.content === "")),
            }));
          }
          set({ streaming: null, status: "ready" });
        },

        regenerate: (chatId) => {
          get().stopStreaming();
          const chat = get().chats.find((c) => c.id === chatId);
          if (!chat) return;
          const lastUser = [...chat.messages].reverse().find((m) => m.role === "user");
          if (!lastUser) return;
          // Drop trailing assistant messages after the last user message.
          const idx = chat.messages.findIndex((m) => m.id === lastUser.id);
          updateChat(chatId, (c) => ({ ...c, messages: c.messages.slice(0, idx + 1) }));
          streamReply(chatId, lastUser.content + " " + uid());
        },

        setFeedback: (chatId, messageId, feedback) =>
          updateChat(chatId, (c) => ({
            ...c,
            messages: c.messages.map((m) => (m.id === messageId ? { ...m, feedback } : m)),
          })),

        renameChat: (chatId, title) =>
          updateChat(chatId, (c) => ({ ...c, title: title.trim() || c.title })),

        deleteChat: (chatId) => {
          if (get().streaming?.chatId === chatId) get().stopStreaming();
          set((s) => ({ chats: s.chats.filter((c) => c.id !== chatId) }));
        },

        clearAll: () => {
          get().stopStreaming();
          set({ chats: [] });
        },
      };
    },
    {
      name: "nova-chat-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ chats: s.chats, model: s.model, theme: s.theme, userName: s.userName }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export const selectChat = (id: string | undefined) => (s: ChatState) =>
  id ? s.chats.find((c) => c.id === id) : undefined;

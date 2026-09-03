export type Role = "user" | "assistant";

export type Feedback = "up" | "down" | null;

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  feedback?: Feedback;
  attachments?: { name: string; size: number }[];
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export type ModelId = "gpt-5.6" | "claude-sonnet" | "gemini-flash";

export interface ModelOption {
  id: ModelId;
  name: string;
  description: string;
}

export const MODELS: ModelOption[] = [
  { id: "gpt-5.6", name: "GPT-5.6", description: "Most capable, best for complex reasoning" },
  { id: "claude-sonnet", name: "Claude Sonnet", description: "Balanced speed and thoughtful writing" },
  { id: "gemini-flash", name: "Gemini Flash", description: "Fastest responses for quick tasks" },
];

export type Theme = "dark" | "light";

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 12)
    : Math.random().toString(36).slice(2, 14);

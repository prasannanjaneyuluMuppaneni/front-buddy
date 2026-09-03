// Isolated mock reply generator. Swap `generateReply` for a real /api/chat
// stream later without touching the UI.

const pick = (arr: string[], seed: number): string => arr[seed % arr.length] ?? "";

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const codeReplies = [
  `Here's a clean way to do that in TypeScript:

\`\`\`ts
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay = 300,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
\`\`\`

**How it works**

1. Each call clears the previous timer.
2. A new timer is scheduled for \`delay\` ms.
3. Only the last call within the window actually runs.

A common use case is debouncing a search input so you don't fire a request on every keystroke.`,
  `You can achieve this with a small custom hook:

\`\`\`tsx
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const raw = window.localStorage.getItem(key);
    if (raw) setValue(JSON.parse(raw) as T);
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
\`\`\`

> Tip: reading storage inside \`useEffect\` avoids hydration mismatches in server-rendered apps.

Want me to add cross-tab syncing with the \`storage\` event?`,
  `Here's a Python version that handles edge cases:

\`\`\`python
from collections import Counter

def top_k_frequent(words: list[str], k: int) -> list[str]:
    counts = Counter(words)
    return [w for w, _ in counts.most_common(k)]

print(top_k_frequent(["a", "b", "a", "c", "b", "a"], 2))
# ['a', 'b']
\`\`\`

| Step | Complexity |
| --- | --- |
| Counting | O(n) |
| Sorting top-k | O(n log k) |

Let me know if you'd like the heap-based variant for very large inputs.`,
];

const explainReplies = [
  `Great question. Let me break it down:

### The core idea
At its heart, this is about **trade-offs**. Every option optimises for something and pays for it somewhere else.

### Key points
- **Clarity first** — the simplest explanation that's still correct usually wins.
- **Context matters** — what's ideal for a prototype is rarely ideal at scale.
- **Measure, don't guess** — a quick benchmark beats a long debate.

### A practical next step
Start with the simplest approach, write down the assumption you're making, and revisit it once you have real data.

Would you like me to go deeper on any of these?`,
  `Here's a concise overview:

1. **Definition** — the term describes a pattern where responsibilities are separated so each part can evolve independently.
2. **Why it matters** — it reduces coupling, which makes testing and refactoring much cheaper.
3. **Common pitfalls** — over-abstracting too early, and hiding important behaviour behind too many layers.

A useful mental model: *if you can't explain what a piece does in one sentence, it's probably doing too much.*

Shall I give a concrete example?`,
  `Sure — here's the short version, then the detail.

**TL;DR:** It works by turning a hard problem into a sequence of smaller ones you already know how to solve.

**In more depth**

- The input is normalised so edge cases collapse into the general case.
- Each stage produces a well-defined intermediate result.
- The final step composes those results back together.

This is the same shape you see in compilers, data pipelines, and even good essay outlines.`,
];

const writingReplies = [
  `Here's a polished draft:

---

**Subject: Quick update on this week's progress**

Hi team,

A short note to keep everyone aligned. We shipped the new onboarding flow on Tuesday, and early numbers look encouraging — completion is up **12%** week over week.

Next up, we're focusing on:
- Reducing time-to-first-value for new accounts
- Cleaning up the settings page
- Tightening the mobile layout

Thanks for the great work. Reach out if anything's blocking you.

Best,
Alex

---

Want it more formal, shorter, or with a different tone?`,
  `Here are three options with different tones:

**Friendly**
> Hey! Just checking in — did you get a chance to look at the proposal? No rush, happy to walk through it whenever suits you.

**Professional**
> Hello, I wanted to follow up on the proposal I shared last week. Please let me know if you have any questions or would like to schedule a brief call.

**Direct**
> Following up on the proposal — could you confirm by Friday whether we're moving forward?

Let me know which direction you prefer and I'll refine it.`,
];

const practiceReplies = [
  `Here's a set of practice questions. Try them first, then scroll for the answers.

### Questions
1. What is the time complexity of binary search on a sorted array of *n* elements?
2. Explain the difference between \`let\`, \`const\`, and \`var\` in JavaScript.
3. A train travels 180 km in 2.5 hours. What is its average speed?
4. What does the acronym **ACID** stand for in databases?
5. Simplify: (3x² · 4x³) ÷ 6x

---

### Answers
1. **O(log n)** — the search space halves each step.
2. \`var\` is function-scoped and hoisted; \`let\` and \`const\` are block-scoped. \`const\` cannot be reassigned.
3. **72 km/h** (180 ÷ 2.5).
4. Atomicity, Consistency, Isolation, Durability.
5. **2x⁴**

Want a harder set, or questions on a specific topic?`,
  `Let's practise! Answer these five, and I'll check your work when you reply.

1. Which HTTP status code means *"Not Found"*?
2. Convert 0.375 to a fraction in lowest terms.
3. Name the process by which plants convert light into chemical energy.
4. In React, what hook would you use to run code after a component renders?
5. What is the plural of "criterion"?

Take your time — reply with your answers whenever you're ready.`,
];

const mockTestReplies = [
  `## Mock Test — General Aptitude
**Duration:** 15 minutes · **Questions:** 10 · **Marks:** 1 each

Answer all questions. Reply with your answers as a list (e.g. \`1-B, 2-A, ...\`) and I'll grade you instantly.

| # | Question | Options |
| --- | --- | --- |
| 1 | If 5 pens cost ₹60, what do 8 pens cost? | A) ₹84 B) ₹96 C) ₹100 D) ₹108 |
| 2 | Next in the series: 2, 6, 12, 20, ? | A) 28 B) 30 C) 32 D) 36 |
| 3 | Antonym of *frugal* | A) thrifty B) lavish C) careful D) modest |
| 4 | 15% of 240 is | A) 32 B) 34 C) 36 D) 38 |
| 5 | Which is a prime number? | A) 51 B) 57 C) 59 D) 63 |
| 6 | "Break the ice" means | A) start a conversation B) cool down C) freeze D) argue |
| 7 | Odd one out: Cat, Dog, Lion, Rose | A) Cat B) Dog C) Lion D) Rose |
| 8 | Square root of 1,296 | A) 34 B) 36 C) 38 D) 42 |
| 9 | A clock shows 3:15. Angle between hands? | A) 0° B) 7.5° C) 15° D) 30° |
| 10 | Synonym of *candid* | A) secretive B) frank C) rude D) shy |

⏱️ Timer starts now. Good luck!`,
  `## Mock Test — Web Development Fundamentals
**Duration:** 20 minutes · **Questions:** 8

1. Which CSS property controls the stacking order of elements?
2. What does \`Array.prototype.reduce\` return?
3. Explain the difference between \`==\` and \`===\`.
4. Write a CSS rule that centres a flex child both horizontally and vertically.
5. What is the purpose of the \`key\` prop in React lists?
6. Name two ways to prevent Cross-Site Scripting (XSS).
7. What does the \`defer\` attribute on a \`<script>\` tag do?
8. Write a SQL query to count users per country from a \`users(id, country)\` table.

Reply with your answers and I'll provide a detailed score breakdown with explanations.`,
];

const generalReplies = [
  `Happy to help with that! Here's what I'd suggest:

- **Start small.** Pick the single most important outcome and focus there.
- **Set a checkpoint.** Decide up front how you'll know it's working.
- **Iterate.** Adjust based on what you learn rather than on the original plan.

If you share a bit more context — your goal, constraints, and timeline — I can tailor this into a concrete step-by-step plan.`,
  `Absolutely. A few thoughts:

1. Clarify the *why* before the *how* — it prevents a lot of wasted effort.
2. Write down the two or three options you're weighing, with one pro and one con each.
3. Pick the option that's easiest to reverse if you're wrong.

Want me to turn this into a checklist you can reuse?`,
  `Here's a quick summary:

The main thing to remember is that **consistency beats intensity**. Small, repeatable actions compound; big one-off pushes usually fade.

Practical ideas:
- Block a fixed 25-minute slot each day.
- Track streaks, not totals.
- Review weekly and adjust one variable at a time.

Would you like a template to track this?`,
];

export function generateReply(prompt: string, model: string): string {
  const p = prompt.toLowerCase();
  const seed = hashString(prompt + model);

  if (/mock test|exam|quiz|test me/.test(p)) return pick(mockTestReplies, seed);
  if (/practice|question|drill|exercise/.test(p)) return pick(practiceReplies, seed);
  if (/code|function|typescript|javascript|python|react|hook|bug|api|sql|regex|debounce/.test(p))
    return pick(codeReplies, seed);
  if (/email|write|draft|letter|message|rewrite|summar|essay/.test(p))
    return pick(writingReplies, seed);
  if (/explain|what is|how does|why|difference|meaning/.test(p))
    return pick(explainReplies, seed);
  return pick(generalReplies, seed);
}

export function deriveTitle(prompt: string): string {
  const cleaned = prompt.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 42) return cleaned;
  return cleaned.slice(0, 42).replace(/\s+\S*$/, "") + "…";
}

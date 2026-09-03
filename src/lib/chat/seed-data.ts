import type { Chat } from "./types";

const H = 60 * 60 * 1000;
const D = 24 * H;

type Seed = {
  id: string;
  title: string;
  ago: number;
  turns: [string, string][];
};

const seeds: Seed[] = [
  {
    id: "seed-debounce",
    title: "Debounce a search input in React",
    ago: 2 * H,
    turns: [
      [
        "How do I debounce a search input in React without lodash?",
        `You can write a tiny hook for it:

\`\`\`tsx
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
\`\`\`

Then use \`useDebouncedValue(query)\` as the dependency for your fetch effect. Only the last keystroke inside the 300 ms window triggers a request.`,
      ],
      [
        "Can it also cancel in-flight requests?",
        `Yes — pass an \`AbortController\` signal to \`fetch\` and abort it in the effect cleanup:

\`\`\`ts
useEffect(() => {
  const controller = new AbortController();
  fetch(\`/api/search?q=\${debounced}\`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResults)
    .catch((e) => { if (e.name !== "AbortError") throw e; });
  return () => controller.abort();
}, [debounced]);
\`\`\``,
      ],
    ],
  },
  {
    id: "seed-standup",
    title: "Draft a weekly stand-up update",
    ago: 5 * H,
    turns: [
      [
        "Write a short weekly update email for my team about the onboarding launch.",
        `**Subject: Onboarding launch — week 1 recap**

Hi team,

The new onboarding flow went live on Tuesday. Early signal is positive: activation is up **12%** and support tickets about setup are down by a third.

**This week**
- Fix the two edge cases reported on mobile Safari
- Add the "skip for now" option to step 3

Thanks for a smooth launch. Shout if anything's blocking you.

— Alex`,
      ],
    ],
  },
  {
    id: "seed-mock-test",
    title: "Mock test: general aptitude",
    ago: 1 * D + 3 * H,
    turns: [
      [
        "Give me a 10-question mock test on general aptitude.",
        `## Mock Test — General Aptitude
**Duration:** 15 minutes · **Questions:** 10

1. If 5 pens cost ₹60, what do 8 pens cost?
2. Next in the series: 2, 6, 12, 20, ?
3. Antonym of *frugal*
4. 15% of 240 is
5. Which is prime: 51, 57, 59, 63?
6. "Break the ice" means…
7. Odd one out: Cat, Dog, Lion, Rose
8. √1296 = ?
9. Angle between clock hands at 3:15?
10. Synonym of *candid*

Reply with your answers and I'll grade them.`,
      ],
    ],
  },
  {
    id: "seed-sql",
    title: "Explain SQL window functions",
    ago: 1 * D + 9 * H,
    turns: [
      [
        "Explain SQL window functions with a simple example.",
        `A **window function** computes a value across a set of rows related to the current row *without collapsing them* like \`GROUP BY\` does.

\`\`\`sql
SELECT
  employee,
  department,
  salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees;
\`\`\`

- \`PARTITION BY\` splits rows into groups.
- \`ORDER BY\` defines ordering inside each group.
- Every row keeps its identity; you just gain an extra computed column.`,
      ],
    ],
  },
  {
    id: "seed-practice-js",
    title: "Practice questions on closures",
    ago: 3 * D,
    turns: [
      [
        "Give me 5 practice questions about JavaScript closures.",
        `1. What will this log, and why?
   \`\`\`js
   for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
   \`\`\`
2. Rewrite the loop above so it logs 0, 1, 2.
3. Implement \`once(fn)\` so \`fn\` runs at most once.
4. Explain how closures enable private state in a counter factory.
5. What is a common memory-leak pattern involving closures in event listeners?

Reply with your answers and I'll give feedback.`,
      ],
    ],
  },
  {
    id: "seed-trip",
    title: "3-day Kyoto itinerary",
    ago: 4 * D + 6 * H,
    turns: [
      [
        "Plan a relaxed 3-day itinerary for Kyoto in autumn.",
        `### Day 1 — East Kyoto
- Morning: Kiyomizu-dera before the crowds
- Afternoon: Higashiyama lanes, Yasaka Shrine
- Evening: Gion, dinner along Pontocho

### Day 2 — Arashiyama
- Bamboo grove at sunrise, Tenryu-ji gardens
- Lunch: yudofu (tofu hot pot)
- Late afternoon: Togetsukyo Bridge for foliage

### Day 3 — North & temples
- Kinkaku-ji, then Ryoan-ji rock garden
- Afternoon tea in a machiya café
- Sunset at Fushimi Inari's lower gates`,
      ],
    ],
  },
  {
    id: "seed-regex",
    title: "Regex for validating email",
    ago: 6 * D,
    turns: [
      [
        "What's a reasonable regex for email validation?",
        `For most apps, keep it permissive and let a confirmation email do the real validation:

\`\`\`ts
const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
\`\`\`

It checks for *something@something.tld* and rejects whitespace. Overly strict patterns reject valid addresses more often than they catch typos.`,
      ],
    ],
  },
  {
    id: "seed-interview",
    title: "System design interview prep",
    ago: 12 * D,
    turns: [
      [
        "How should I structure a system design interview answer?",
        `A reliable structure:

1. **Clarify requirements** — functional and non-functional (scale, latency, consistency).
2. **Estimate** — QPS, storage, bandwidth. Rough numbers are fine.
3. **High-level design** — clients, API, services, data stores.
4. **Deep dive** — pick the two riskiest components and detail them.
5. **Trade-offs & bottlenecks** — caching, sharding, failure modes.

Talk out loud and check in with the interviewer at each step.`,
      ],
    ],
  },
  {
    id: "seed-tailwind",
    title: "Tailwind dark mode strategy",
    ago: 18 * D,
    turns: [
      [
        "What's the best way to handle dark mode with Tailwind v4?",
        `Use a class-based variant so the user can override the system preference:

\`\`\`css
@custom-variant dark (&:is(.dark *));
\`\`\`

Then toggle \`.dark\` on \`<html>\` and define your colours as CSS variables in \`:root\` and \`.dark\`. Components only ever use semantic tokens like \`bg-background\`, so they never need \`dark:\` prefixes.`,
      ],
    ],
  },
  {
    id: "seed-book",
    title: "Book recommendations on habits",
    ago: 40 * D,
    turns: [
      [
        "Recommend a few books on building better habits.",
        `- **Atomic Habits** — James Clear. Practical systems over goals.
- **Tiny Habits** — BJ Fogg. Start absurdly small and anchor to existing routines.
- **The Power of Habit** — Charles Duhigg. The cue → routine → reward loop.
- **Deep Work** — Cal Newport. Less about habits per se, more about protecting focus.

If you only read one, start with *Atomic Habits*.`,
      ],
    ],
  },
];

export function buildSeedChats(now = Date.now()): Chat[] {
  return seeds.map((s) => {
    const start = now - s.ago;
    const messages = s.turns.flatMap(([u, a], i) => [
      {
        id: `${s.id}-u${i}`,
        role: "user" as const,
        content: u,
        createdAt: start + i * 2 * 60_000,
      },
      {
        id: `${s.id}-a${i}`,
        role: "assistant" as const,
        content: a,
        createdAt: start + i * 2 * 60_000 + 15_000,
        feedback: null,
      },
    ]);
    return {
      id: s.id,
      title: s.title,
      createdAt: start,
      updatedAt: messages[messages.length - 1]!.createdAt,
      messages,
    };
  });
}

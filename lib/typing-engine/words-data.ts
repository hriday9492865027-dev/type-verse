// Rich dictionary, curated quotes, and code snippets for TYPEVERSE

export const COMMON_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "focus", "speed", "flow", "rhythm", "keystroke", "precision", "effort", "mastery",
  "future", "system", "matrix", "energy", "vector", "signal", "pulse", "stream",
  "orbit", "galaxy", "stellar", "circuit", "digital", "quantum", "dynamic", "spark",
  "challenge", "victory", "champion", "reflex", "instinct", "zen", "balance", "target",
  "evolve", "progress", "achieve", "execute", "craft", "design", "create", "inspire"
];

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  {
    text: "The future belongs to people who practice with purpose and refuse to settle for mediocrity.",
    author: "TYPEVERSE Philosophy"
  },
  {
    text: "Simplicity is the soul of efficiency. Keep your thoughts clear and your keystrokes precise.",
    author: "Austin Freeman"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "The only way to go fast is to go well. Clean code and clean typing share the same discipline.",
    author: "Robert C. Martin"
  },
  {
    text: "In the middle of difficulty lies opportunity. Every misplaced key is a lesson in rhythm.",
    author: "Albert Einstein"
  },
  {
    text: "Stay hungry, stay foolish. Push through every boundary until the keyboard feels like an extension of your mind.",
    author: "Steve Jobs"
  },
  {
    text: "Mastery is not about perfection. It is about continuous, humble iteration over time.",
    author: "Seneca"
  }
];

export const CODE_SNIPPETS = {
  javascript: [
    "function calculateWpm(chars, timeSeconds) {\n  const minutes = timeSeconds / 60;\n  return Math.round((chars / 5) / minutes);\n}",
    "const debounce = (fn, delay) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn(...args), delay);\n  };\n};",
    "const filterUnique = (items) => [...new Set(items)];\nconst total = items.reduce((acc, val) => acc + val, 0);"
  ],
  python: [
    "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr",
    "def find_fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b",
    "import asyncio\nasync def fetch_user_data(user_id: str) -> dict:\n    await asyncio.sleep(0.1)\n    return {'id': user_id, 'status': 'active'}"
  ],
  html: [
    "<div class=\"terminal-window\">\n  <header class=\"flex items-center space-x-2\">\n    <span class=\"dot bg-red-500\" />\n    <span class=\"dot bg-yellow-500\" />\n  </header>\n</div>",
    "<button type=\"button\" class=\"btn-glow primary\">\n  <span>Execute Command</span>\n</button>"
  ]
};

// Generate random words passage
export function generateWordsPassage(count: number = 25): string {
  const chosen: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * COMMON_WORDS.length);
    chosen.push(COMMON_WORDS[idx]);
  }
  return chosen.join(" ");
}

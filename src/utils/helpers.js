import he from "he";
export function decodeHTML(str) {
  return he.decode(str || "");
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const LETTERS = ['A', 'B', 'C', 'D'];

export const CATEGORIES = [
  { value: '', label: 'Any Category' },
  { value: '9', label: 'General Knowledge' },
  { value: '18', label: 'Computers' },
  { value: '21', label: 'Sports' },
  { value: '23', label: 'History' },
  { value: '17', label: 'Science & Nature' },
  { value: '11', label: 'Film' },
  { value: '12', label: 'Music' },
  { value: '14', label: 'Television' },
  { value: '22', label: 'Geography' },
];

export const DIFFICULTIES = [
  { value: '', label: 'Any Difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

import API_BASE from "../config/api";

export async function fetchQuestions({ category, difficulty, count }) {
  const res = await fetch(
    `${API_BASE}/api/questions?count=${count || 5}&category=${category || ""}&difficulty=${difficulty || ""}`
  );

  if (!res.ok) {
    throw new Error("Backend fetch failed");
  }

  return res.json();
}

export function getResultLabel(pct) {
  if (pct === 100) return { label: 'Perfect Score! 🏆', color: '#f59e0b' };
  if (pct >= 80)  return { label: 'Excellent Work! 🌟', color: '#22c55e' };
  if (pct >= 60)  return { label: 'Good Job! 👍',       color: '#6c63ff' };
  if (pct >= 40)  return { label: 'Keep Practicing! 💪', color: '#f59e0b' };
  return          { label: 'Better Luck Next Time! 📚',  color: '#ef4444' };
}

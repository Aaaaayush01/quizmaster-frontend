const STATS_KEY = 'qm_stats';

const defaultStats = {
  best: 0,
  games: 0,
  correct: 0,
  total: 0,
};

export function getStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : { ...defaultStats };
  } catch {
    return { ...defaultStats };
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function updateStats({ score, total }) {
  const stats = getStats();
  const isNewBest = score > stats.best;
  stats.best = Math.max(stats.best, score);
  stats.games += 1;
  stats.correct += score;
  stats.total += total;
  saveStats(stats);
  return { stats, isNewBest };
}

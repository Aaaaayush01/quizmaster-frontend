import React from 'react';
import styles from './StartScreen.module.css';
import { CATEGORIES, DIFFICULTIES } from '../utils/helpers';

export default function StartScreen({ config, onConfigChange, onStart, stats, loading }) {
  const { category, difficulty, count } = config;

  function handleCountChange(delta) {
    const next = Math.min(20, Math.max(5, count + delta));
    onConfigChange({ count: next });
  }

  const accuracy =
    stats.total > 0
      ? Math.round((stats.correct / stats.total) * 100) + '%'
      : '—';

  return (
    <div className={styles.wrapper}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>⚡</div>
        <h1 className={styles.logoTitle}>QuizMaster</h1>
        <p className={styles.logoSub}>Test your knowledge · Beat your high score</p>
      </div>

      {/* Settings card */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Configure your quiz</div>

        <div className={styles.settingsGrid}>
          {/* Category */}
          <div className={styles.selectWrap}>
            <select
              value={category}
              onChange={(e) => onConfigChange({ category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <span className={styles.caret}>▾</span>
          </div>

          {/* Difficulty */}
          <div className={styles.selectWrap}>
            <select
              value={difficulty}
              onChange={(e) => onConfigChange({ difficulty: e.target.value })}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            <span className={styles.caret}>▾</span>
          </div>
        </div>

        {/* Question count */}
        <div className={styles.countRow}>
          <span className={styles.countLabel}>Questions</span>
          <div className={styles.countBtns}>
            <button
              className={styles.countBtn}
              onClick={() => handleCountChange(-1)}
              disabled={count <= 5}
              aria-label="Decrease count"
            >−</button>
            <span className={styles.countVal}>{count}</span>
            <button
              className={styles.countBtn}
              onClick={() => handleCountChange(1)}
              disabled={count >= 20}
              aria-label="Increase count"
            >+</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <div className={`${styles.statVal} ${styles.gold}`}>
            {stats.games ? stats.best : '—'}
          </div>
          <div className={styles.statLabel}>Best</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statVal}>{stats.games || '—'}</div>
          <div className={styles.statLabel}>Games</div>
        </div>
        <div className={styles.statBox}>
          <div className={`${styles.statVal} ${styles.green}`}>{accuracy}</div>
          <div className={styles.statLabel}>Accuracy</div>
        </div>
      </div>

      <button
        className={styles.startBtn}
        onClick={onStart}
        disabled={loading}
      >
        {loading ? 'Loading…' : 'Start Quiz →'}
      </button>
    </div>
  );
}

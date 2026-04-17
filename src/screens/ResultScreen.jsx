import API_BASE from "../config/api";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ResultScreen.module.css";
import { getResultLabel } from "../utils/helpers";
import { updateStats } from "../utils/storage";

const CIRCUMFERENCE = 2 * Math.PI * 58; // r=58

export default function ResultScreen({ result, onPlayAgain, onSettings }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
  const loadLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/results`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Leaderboard error:", err);
      setLeaderboard([]); // safe fallback
    }
  };

  loadLeaderboard();
}, []);


  const { score, total, bestStreak, history } = result;
  const pct = Math.round((score / total) * 100);
  const wrong = total - score;
  const { label, color } = getResultLabel(pct);
  const ringRef = useRef(null);

  // Persist stats and check high score
  const { isNewBest } = updateStats({ score, total });

  useEffect(() => {
    // Animate ring after mount
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
    if (ringRef.current) {
      setTimeout(() => {
        ringRef.current.style.strokeDashoffset = offset;
      }, 100);
    }
  }, [pct]);

  return (
    <div className={styles.wrapper}>
      {/* Score ring */}
      <div className={styles.hero}>
        <div className={styles.ring}>
          <svg className={styles.ringSvg} viewBox="0 0 140 140">
            <circle className={styles.ringTrack} cx="70" cy="70" r="58" />
            <circle
              ref={ringRef}
              className={styles.ringFill}
              cx="70"
              cy="70"
              r="58"
              stroke={color}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
            />
          </svg>
          <div className={styles.ringContent}>
            <div className={styles.scoreBig}>{score}</div>
            <div className={styles.scoreDenom}>/ {total}</div>
          </div>
        </div>

        <div className={styles.resultLabel}>
          {label}
          {isNewBest && <span className={styles.newBadge}>NEW BEST</span>}
        </div>
        <div className={styles.resultSub}>You scored {pct}% correct</div>
      </div>

      {/* Stat grid */}
      <div className={styles.statGrid}>
        <div className={styles.statBox}>
          <div className={`${styles.statVal} ${styles.green}`}>{score}</div>
          <div className={styles.statLabel}>Correct</div>
        </div>
        <div className={styles.statBox}>
          <div className={`${styles.statVal} ${styles.red}`}>{wrong}</div>
          <div className={styles.statLabel}>Wrong</div>
        </div>
        <div className={styles.statBox}>
          <div className={`${styles.statVal} ${styles.gold}`}>{bestStreak}</div>
          <div className={styles.statLabel}>Best Streak</div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Breakdown */}
      <div className={styles.breakdown}>
        <div className={styles.breakdownTitle}>Question Review</div>
        {history.map((h, i) => (
          <div key={i} className={styles.breakdownItem}>
            <span className={styles.breakdownQ}>
              {i + 1}. {h.question}
            </span>
            <span
              className={`${styles.dot} ${h.correct ? styles.dotC : h.timeout ? styles.dotT : styles.dotW}`}
            />
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.leaderboard}>
        <div className={styles.breakdownTitle}>Leaderboard</div>

        {leaderboard.length === 0 ? (
          <div>No scores yet</div>
        ) : (
          leaderboard.slice(0, 5).map((item, index) => (
            <div key={item.id} className={styles.breakdownItem}>
              <span>
                #{index + 1} — {item.score}/{item.total}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={onPlayAgain}>
          Play Again
        </button>
        <button className={styles.btnSecondary} onClick={onSettings}>
          Settings
        </button>
      </div>
    </div>
  );
}


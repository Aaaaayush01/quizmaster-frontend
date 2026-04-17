import React from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} aria-label="Loading" />
      <div className={styles.title}>Fetching Questions</div>
      <div className={styles.sub}>Connecting to trivia database…</div>
    </div>
  );
}

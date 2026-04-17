import React from 'react';
import styles from './Background.module.css';

export default function Background() {
  return (
    <>
      <div className={styles.stars} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowA}`} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowB}`} aria-hidden="true" />
    </>
  );
}

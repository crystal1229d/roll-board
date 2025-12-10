'use client';

import styles from './loading.module.css';

export default function LoadingPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.glassCard}>
        <div className={styles.loader}></div>
        <div className={styles.text}>Loading...</div>
      </div>
    </div>
  );
}

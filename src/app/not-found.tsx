'use client';

import styles from './not-found.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.glassCard}>
        <div className={styles.code}>404</div>
        <div className={styles.message}>Page Not Found</div>

        <p className={styles.description}>
          찾으시는 페이지가 존재하지 않거나
          <br />
          이동되었을 수 있어요.
        </p>

        <a href="/" className={styles.homeButton}>
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <div className={styles.page}>
      {/* 배경 데코 */}
      <div className={styles.bgStars} />
      <div className={styles.bgGradient} />

      <div className={styles.frame}>
        <div className={styles.frameHeader}>
          <span className={styles.dotPink} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
          <span className={styles.title}>ROLLING PAPER LOGIN</span>
        </div>

        <div className={styles.frameBody}>
          <h1 className={styles.logo}>✧ ROLL✶BOARD ✧</h1>
          <p className={styles.subcopy}>
            친구들에게서 오는 <span className={styles.highlight}>Y2K 감성 롤링페이퍼</span>
            <br />
            구글 계정 하나로 바로 시작해봐!
          </p>

          <button type="button" className={styles.googleButton} disabled={loading}>
            <span className={styles.googleIcon}>G</span>
            {loading ? '로그인 중...' : 'Google 계정으로 시작하기'}
          </button>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <p className={styles.notice}>
            계속 진행하면{' '}
            <a href="/terms" className={styles.link}>
              서비스 이용약관
            </a>
            과{' '}
            <a href="/privacy" className={styles.link}>
              개인정보처리방침
            </a>
            에 동의한 것으로 간주됩니다.
          </p>

          <div className={styles.footerNote}>
            <span>★ BETA VERSION ★</span>
            <span>Made with ☺ in 2000-something</span>
          </div>
        </div>
      </div>
    </div>
  );
}

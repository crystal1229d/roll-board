'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.glitterBg}></div>

      <div className={styles.window}>
        <div className={styles.titleBar}>
          <span>★ Welcome to Roll-Board Login ★</span>
          <div className={styles.windowBtns}>
            <button>_</button>
            <button>X</button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.headerBadge}>
            <img src="/img/star-yellow-glitter.png" alt="star" height={30} />
            <p>
              YOU ARE ENTERING
              <br />A CYBER ZONE…
            </p>
          </div>

          <h1 className={styles.logo}>Roll✶Board</h1>

          <p className={styles.sub}>
            <span className={styles.bubble}>FREE E-HUGS</span>
            <span className={styles.bubble}>GLITTER MAIL</span>
            <span className={styles.bubble}>CYBER FRIENDS</span>
          </p>

          <button className={styles.googleBtn}>
            <span>Log in with</span>
            <img src="/img/google-logo.png" height={60} />
          </button>

          <div className={styles.footerBox}>
            <img src="/img/computer.png" height={70} />
            <p>
              ※ Login required to enter
              <br />
              your personal cyber room.
            </p>
          </div>
        </div>
      </div>

      <img src="/img/star-blue.png" className={styles.floating1} />
      <img src="/img/star-pink-glitter.png" className={styles.floating2} />
      <img src="/img/gun-pink-glitter.png" className={styles.floating3} />
      <img src="/img/circle-green-glitter.png" className={styles.floating4} />
      <img src="/img/heart-purple-glitter-love.png" className={styles.floating5} />
      <img src="/img/smile.png" className={styles.floating6} />
      <img src="/img/star-yellow-glitter.png" className={styles.floating7} />
      <img src="/img/arrow-pink-glitter.png" className={styles.floating8} />
      <img src="/img/heart-pink-glitter-loveya.png" className={styles.floating9} />
      <img src="/img/heart-purple-stripe.png" className={styles.floating10} />
      <img src="/img/computer-glitter.png" className={styles.floating11} />
      <img src="/img/star-pink-glitter-online.png" className={styles.floating12} />
    </div>
  );
}

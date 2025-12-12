'use client';

import PaperWindow from '@/widget/paper/PaperWindow';
import styles from '../window.module.css';

export default function BoardwindowOnDesktop() {
  return (
    <div className={styles.overlay}>
      <div className={styles.windowWrap}>
        <PaperWindow />
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import BoardWindow from '@/widget/board/Boardwindow';
import styles from '../window.module.css';

export default function BoardwindowOnDesktop() {
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.windowWrap}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        <BoardWindow />
      </div>
    </div>
  );
}

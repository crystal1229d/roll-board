'use client';

import { useRouter } from 'next/navigation';
import MessageWindow from '@/widget/message/MessageWindow';
import styles from '../window.module.css';

export default function MessageModalOnDesktop() {
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
        <MessageWindow />
      </div>
    </div>
  );
}

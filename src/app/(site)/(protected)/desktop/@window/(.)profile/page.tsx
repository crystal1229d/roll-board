'use client';

import { useRouter } from 'next/navigation';
import ProfileWindow from '@/widget/profile/ProfileWindow';
import styles from '../window.module.css';

export default function ProfileModalOnDesktop() {
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
        <ProfileWindow />
      </div>
    </div>
  );
}

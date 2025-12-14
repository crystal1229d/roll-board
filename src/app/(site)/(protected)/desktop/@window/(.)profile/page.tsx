'use client';

import ProfileWindow from '@/widget/profile/ProfileWindow';
import styles from '../window.module.css';

export default function ProfileModalOnDesktop() {
  return (
    <div className={styles.overlay}>
      <div className={styles.windowWrap}>
        <ProfileWindow mode="me" />
      </div>
    </div>
  );
}

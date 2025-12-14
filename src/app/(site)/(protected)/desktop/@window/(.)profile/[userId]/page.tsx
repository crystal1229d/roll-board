'use client';

import { useParams } from 'next/navigation';
import ProfileWindow from '@/widget/profile/ProfileWindow';
import styles from '../../window.module.css';

export default function UserProfileModalOnDesktop() {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className={styles.overlay}>
      <div className={styles.windowWrap}>
        <ProfileWindow mode="user" userId={userId} />
      </div>
    </div>
  );
}

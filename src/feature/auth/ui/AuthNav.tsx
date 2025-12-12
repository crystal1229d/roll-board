'use client';

import Image from 'next/image';
import { useAuth } from '../hook/useAuth';
import styles from './AuthNav.module.css';

export default function AuthNav() {
  const { user, isLoggedIn, logout, loadingLogout } = useAuth();

  if (!isLoggedIn) {
    return <button>Login</button>;
  }

  return (
    <div className={styles.authNav}>
      {user?.user_metadata?.avatar_url && (
        <Image
          src={user.user_metadata.avatar_url}
          alt="Avatar"
          width={28}
          height={28}
          className={styles.avatar}
        />
      )}
      <span className={styles.email}>{user?.email}</span>
      <button
        type="button"
        onClick={logout}
        className={styles.logoutButton}
        disabled={loadingLogout}
      >
        {loadingLogout ? '로그아웃 중…' : 'logout'}
      </button>
    </div>
  );
}

'use client';

import styles from './ProfileWindow.module.css';

export default function ProfileWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.titleBar}>
        <span>★ Roll✶Board - My Profile</span>
      </div>

      <div className={styles.body}>
        <h3>My Profile</h3>
        <p>이 영역은 나중에 프로필 이미지, 닉네임, 소개글 등을 보여줄거야.</p>

        <ul>
          <li>닉네임: …</li>
          <li>한 줄 소개: …</li>
          <li>받은 쪽지: …개</li>
        </ul>
      </div>
    </div>
  );
}

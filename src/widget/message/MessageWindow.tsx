'use client';

import styles from './MessageWindow.module.css';

export default function MessageWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.titleBar}>
        <span>★ Roll✶Board - Messages</span>
      </div>

      <div className={styles.body}>
        <h3>Messages</h3>
        <p>나중에 받은 쪽지 리스트나 쪽지 작성 UI가 들어올 영역이야.</p>

        <ul>
          <li>쪽지 #1</li>
          <li>쪽지 #2</li>
        </ul>
      </div>
    </div>
  );
}

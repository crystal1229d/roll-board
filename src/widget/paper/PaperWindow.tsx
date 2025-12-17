'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import { usePaperIndex } from '@/feature/paper/hook/usePaperIndex';
import { useDesktopStore } from '@/feature/desktop/model/useDesktopStore';
import styles from './PaperWindow.module.css';

export default function PaperWindow() {
  const { items, loading, error } = usePaperIndex();
  const openWindow = useDesktopStore((s) => s.openWindow);

  const [myUserId, setMyUserId] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setMyUserId(data.user?.id ?? null);
    });
  }, []);

  const openProfile = (userId: string) => {
    const isMe = !!myUserId && userId === myUserId;

    openWindow(isMe ? { type: 'profile', mode: 'me' } : { type: 'profile', mode: 'user', userId });
  };

  const openPaper = (paperSlug: string) => {
    openWindow({ type: 'paper', paperSlug });
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <h1 className={styles.title}>✶ {currentYear} Friends&apos; Rollingpapers ✶</h1>
          <p className={styles.subTitle}>
            올해 롤링페이퍼를 만든 유저들의 작은 사이버 방을 둘러보고, 편지를 남겨보세요 ✉
          </p>
        </div>

        {loading && (
          <div className={styles.stateBox}>
            <span className={styles.stateEmoji}>⌛</span>
            <span className={styles.stateText}>
              CYBER SPACE SCANNING… {currentYear}년 롤링페이퍼를 불러오는 중이에요.
            </span>
          </div>
        )}

        {error && !loading && (
          <div className={`${styles.stateBox} ${styles.errorBox}`}>
            <span className={styles.stateEmoji}>⚠</span>
            <span className={styles.stateText}>{error}</span>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className={styles.stateBox}>
            <span className={styles.stateEmoji}>📭</span>
            <span className={styles.stateText}>
              아직 {currentYear}년 롤링페이퍼를 만든 유저가 없어요.
            </span>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className={styles.userGrid}>
            {items.map((item) => (
              <li key={item.paperId} className={styles.userCard}>
                <div className={styles.userTop}>
                  <button
                    type="button"
                    className={styles.avatarWrap}
                    onClick={() => openProfile(item.userId)}
                  >
                    <img src={item.avatarUrl} alt={item.displayName} />
                  </button>

                  <div className={styles.userInfo}>
                    <div className={styles.nameRow}>
                      <button
                        type="button"
                        className={styles.userNameButton}
                        onClick={() => openProfile(item.userId)}
                      >
                        {item.displayName}
                      </button>
                      <span className={styles.badge}>PROFILE</span>
                    </div>
                    <p className={styles.intro}>{item.intro || '-'}</p>
                  </div>
                </div>

                <div className={styles.paperBox}>
                  <div className={styles.paperHeader}>
                    <span className={styles.paperYear}>[{item.paperYear}]</span>
                    <button
                      type="button"
                      className={styles.paperTitleButton}
                      onClick={() => openPaper(item.paperSlug)}
                    >
                      {item.paperTitle}
                    </button>
                  </div>

                  <div className={styles.paperMeta}>
                    <span className={styles.paperMetaLabel}>Created</span>
                    <span className={styles.paperMetaValue}>
                      {item.paperCreatedAt?.slice(0, 10) || '????-??-??'}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    className={styles.writeButton}
                    onClick={() => openPaper(item.paperSlug)}
                  >
                    ✉ 이 롤링페이퍼 열기
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footerStrip}>
          <span>★ FRIENDS&apos; PAPER DIRECTORY ★</span>
          <span>YEAR {currentYear} MEMORY ARCHIVE</span>
          <span>GLITTER LETTER READY</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useBoardUsers } from '@/feature/board/hook/useBoardUsers';
import styles from './BoardWidget.module.css';

export default function BoardWindow() {
  const { users, loading, error } = useBoardUsers();

  return (
    <div className={styles.page}>
      <div className={styles.window}>
        {/* ── Old 웹 브라우저 헤더 ───────────────────────── */}
        <div className={styles.titleBar}>
          <span className={styles.titleText}>★ Roll✶Board Friend Index ★</span>
          <div className={styles.titleBtns}>
            <button>_</button>
            <button>[]</button>
            <button>X</button>
          </div>
        </div>

        <div className={styles.browserBar}>
          <div className={styles.browserButtons}>
            <button>◀</button>
            <button>▶</button>
            <button>⟳</button>
            <button>🏠</button>
          </div>
          <div className={styles.browserAddress}>
            <span className={styles.addrLabel}>URL</span>
            <span className={styles.addrField}>http://roll-board.cyber/friends.htm</span>
          </div>
        </div>

        {/* ── 코르크 보드 ─────────────────────────────── */}
        <div className={styles.board}>
          <div className={styles.boardInner}>
            {/* 상단 로고/뱃지 */}
            <header className={styles.boardHeader}>
              <div className={styles.brandBadge}>
                <span className={styles.brandMain}>ROLL✶BOARD</span>
                <span className={styles.brandSub}>CYBER FRIENDS COLLECTION SYSTEM</span>
              </div>
              <span className={styles.cornerTag}>E-HUG ZONE™</span>
            </header>

            {/* 상태 */}
            {loading && (
              <div className={styles.stateBox}>
                <span className={styles.stateEmoji}>⌛</span>
                <span className={styles.stateText}>LOADING FRIEND DATA… PLEASE WAIT</span>
              </div>
            )}

            {error && !loading && (
              <div className={`${styles.stateBox} ${styles.errorBox}`}>
                <span className={styles.stateEmoji}>⚠</span>
                <span className={styles.stateText}>{error}</span>
              </div>
            )}

            {!loading && !error && users.length === 0 && (
              <div className={styles.stateBox}>
                <span className={styles.stateEmoji}>📭</span>
                <span className={styles.stateText}>NO FRIENDS PINNED YET (T_T)</span>
              </div>
            )}

            {/* 유저 카드들 */}
            {!loading && !error && users.length > 0 && (
              <ul className={styles.userGrid}>
                {users.map((user) => (
                  <li key={user.id} className={styles.userCard}>
                    {/* 핀 */}
                    <div className={styles.pin} />

                    <div className={styles.userTop}>
                      <div className={styles.avatarWrap}>
                        <img src={user.avatarUrl} alt={user.name} />
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.nameRow}>
                          <span className={styles.userName}>{user.name}</span>
                          <span className={styles.smallBadge}>FULL DAY★</span>
                        </div>
                        <p className={styles.tagline}>{user.tagline}</p>
                      </div>
                    </div>

                    <div className={styles.userFooter}>
                      <span className={styles.noteCount}>
                        ✉ {user.receivedNotes} note
                        {user.receivedNotes !== 1 ? 's' : ''}
                      </span>

                      {user.hasSentNoteFromMe ? (
                        <span className={`${styles.noteStatus} ${styles.noteStatusSent}`}>
                          ♥ SENT FROM YOU
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.noteStatus} ${styles.noteStatusNotSent}`}
                        >
                          WRITE NOTE
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* 아래 88x31 느낌 배너줄 */}
            <div className={styles.bannerStrip}>
              <span className={styles.banner}>★ SIGN MY GUESTBOOK ★</span>
              <span className={styles.banner}>ERROR FREE ZONE</span>
              <span className={styles.banner}>GLITTER MAIL READY</span>
            </div>
          </div>
        </div>

        {/* 상태바 */}
        <div className={styles.statusBar}>
          <span>ROLL-BOARD SYSTEM STATUS</span>
          <span>♥ cyber-friends online: {users.length.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* 배경 스티커 (로그인 페이지 분위기 맞추기) */}
      <img src="/img/star-blue.png" className={styles.floating1} alt="" />
      <img src="/img/star-pink-glitter.png" className={styles.floating2} alt="" />
      <img src="/img/heart-pink-glitter-loveya.png" className={styles.floating3} alt="" />
      <img src="/img/heart-purple-stripe.png" className={styles.floating4} alt="" />
    </div>
  );
}

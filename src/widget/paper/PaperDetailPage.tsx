'use client';

import { useState } from 'react';
import { usePaperDetail } from '@/feature/paper/hook/usePaperDetail';
import LetterComposer from '../letter/LetterComposer';
import styles from './PaperDetailPage.module.css';

type Props = { paperSlug: string };

export default function PaperDetailPage({ paperSlug }: Props) {
  const { data, myLetter, isOwner, loading, error, refresh } = usePaperDetail(paperSlug);
  const [openCompose, setOpenCompose] = useState(false);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.window}>
          <div className={styles.titleBar}>★ Loading Rollingpaper… ★</div>
          <div className={styles.body}>불러오는 중…</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <div className={styles.window}>
          <div className={styles.titleBar}>★ Rollingpaper ★</div>
          <div className={styles.body}>
            <div className={styles.errorBox}>{error ?? '해당 롤링페이퍼를 찾을 수 없어요.'}</div>
          </div>
        </div>
      </div>
    );
  }

  const { paper, letters } = data;

  return (
    <div className={styles.page}>
      <div className={styles.window}>
        <div className={styles.titleBar}>
          ★ {paper.year} · {paper.title} ★
          <span className={styles.ownerText}>— by {paper.owner?.display_name ?? 'Unknown'}</span>
        </div>

        <div className={styles.body}>
          <div className={styles.layout}>
            {/* 왼쪽: 코르크보드 */}
            <div className={styles.boardOuter}>
              <div className={styles.boardInner}>
                <div className={styles.boardHeader}>
                  <div className={styles.paperMeta}>
                    <span className={styles.metaLabel}>SLUG</span>
                    <span className={styles.metaValue}>{paper.slug}</span>
                  </div>
                  <div className={styles.paperMeta}>
                    <span className={styles.metaLabel}>CREATED</span>
                    <span className={styles.metaValue}>
                      {paper.created_at?.slice(0, 10) ?? '????-??-??'}
                    </span>
                  </div>

                  {/* ✅ 내 보드 표시 */}
                  {isOwner && <div className={styles.ownerBadge}>★ MY BOARD ★</div>}
                </div>

                <div className={styles.pinArea}>
                  {letters.length === 0 ? (
                    <div className={styles.emptyNote}>아직 편지가 없어요 ✉</div>
                  ) : (
                    letters.map((l) => {
                      const writerLabel = l.is_anonymous
                        ? 'Anonymous'
                        : l.writer?.display_name ?? l.writer_name ?? 'Unknown';

                      const teaserX = l.teaser_x ?? 30;
                      const teaserY = l.teaser_y ?? 30;
                      const rot = l.teaser_rotation ?? 0;

                      return (
                        <button
                          key={l.id}
                          type="button"
                          className={styles.note}
                          style={{
                            left: `${Math.max(0, Math.min(85, teaserX))}%`,
                            top: `${Math.max(0, Math.min(85, teaserY))}%`,
                            transform: `rotate(${rot}deg)`,
                          }}
                          onClick={() => {
                            // TODO: 다음 단계에서 상세/모달 연결
                          }}
                        >
                          <div className={styles.notePin} />
                          <div className={styles.noteTitle}>{l.teaser_title ?? 'LETTER'}</div>
                          <div className={styles.noteWriter}>{writerLabel}</div>
                          <div className={styles.noteDate}>{l.created_at?.slice(0, 10) ?? ''}</div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* 오른쪽 패널 */}
            <aside className={styles.sidePanel}>
              <div className={styles.panelTitle}>★ Letters List</div>

              {letters.length === 0 ? (
                <div className={styles.panelEmpty}>표시할 편지가 없어요.</div>
              ) : (
                <ul className={styles.letterList}>
                  {letters.map((l) => {
                    const writerLabel = l.is_anonymous
                      ? 'Anonymous'
                      : l.writer?.display_name ?? l.writer_name ?? 'Unknown';

                    return (
                      <li key={l.id} className={styles.letterItem}>
                        <div className={styles.letterRowTop}>
                          <span className={styles.letterWriter}>{writerLabel}</span>
                          <span className={styles.letterDate}>{l.created_at?.slice(0, 10)}</span>
                        </div>
                        <div className={styles.letterPreview}>
                          {l.content.length > 80 ? `${l.content.slice(0, 80)}…` : l.content}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* ✅ Footer 분기 */}
              <div className={styles.panelFooter}>
                {/* 🔥 내 보드면 “편지쓰기” 자체가 없어야 함 */}
                {isOwner ? (
                  <div className={styles.ownerFooterHint}>내 롤링페이퍼입니다.</div>
                ) : (
                  <>
                    {myLetter.status === 'none' && (
                      <button
                        type="button"
                        className={styles.primaryBtn}
                        onClick={() => setOpenCompose(true)}
                      >
                        ✉ 이 롤링페이퍼에 편지 쓰기
                      </button>
                    )}

                    {!isOwner && myLetter.status === 'sent' && (
                      <>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          onClick={() => {
                            // 내 편지 상세/수정
                          }}
                        >
                          📖 내가 보낸 편지 보기
                        </button>

                        <button
                          type="button"
                          className={styles.dangerBtn}
                          onClick={() => {
                            // 삭제 confirm → delete
                          }}
                        >
                          🗑 편지 삭제
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {openCompose && (
                <LetterComposer
                  paperId={paper.id}
                  paperTitle={paper.title}
                  onClose={() => setOpenCompose(false)}
                  onSaved={() => {
                    refresh();
                  }}
                />
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

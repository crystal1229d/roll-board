'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { usePaperDetail } from '@/feature/paper/hook/usePaperDetail';
import { useDesktopStore } from '@/feature/desktop/model/useDesktopStore';
import { findStickerDef } from '@/entity/sticker/model/catalog';
import { FaPenNib, FaBookmark, FaMapPin, FaLink } from 'react-icons/fa';
import styles from './PaperDetailPage.module.css';

type Props = { paperSlug: string };

const hashToInt = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const makeRng = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export default function PaperDetailPage({ paperSlug }: Props) {
  const { data, myLetter, isOwner, loading, error } = usePaperDetail(paperSlug);
  const openWindow = useDesktopStore((s) => s.openWindow);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const openComposer = useCallback(() => {
    if (!data) return;
    openWindow({
      type: 'letterComposer',
      paperId: data.paper.id,
      paperTitle: data.paper.title,
      paperSlug: data.paper.slug,
    });
  }, [openWindow, data]);

  const openMyLetterDetail = useCallback(() => {
    if (myLetter.status !== 'sent') return;
    openWindow({
      type: 'letterDetail',
      letterId: myLetter.letter.id,
      paperSlug,
    });
  }, [openWindow, myLetter, paperSlug]);

  const openLetterDetail = useCallback(
    (letterId: string) => {
      openWindow({ type: 'letterDetail', letterId, paperSlug });
    },
    [openWindow, paperSlug],
  );

  const copySlug = useCallback(async () => {
    const slug = data?.paper?.slug;
    if (!slug) return;

    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 900);
    } catch {
      // noop
    }
  }, [data]);

  const sortedLetters = useMemo(() => {
    const arr = data?.letters ?? [];
    return [...arr].sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (ta !== tb) return ta - tb;
      return a.id.localeCompare(b.id);
    });
  }, [data?.letters]);

  const rotationMap = useMemo(() => {
    if (!data) return new Map<string, number>();
    const seed = hashToInt(`${data.paper.slug}:${data.paper.year}`);
    const rng = makeRng(seed);

    const map = new Map<string, number>();
    for (const l of sortedLetters) {
      const rot = Math.round((rng() * 10 - 5) * 10) / 10; // -5~+5deg
      map.set(l.id, rot);
    }
    return map;
  }, [data, sortedLetters]);

  const moveToMyLetter = useCallback(() => {
    if (myLetter.status !== 'sent') return;
    const id = myLetter.letter.id;

    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-letter-id="${id}"]`);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightId(id);
    window.setTimeout(() => setHighlightId(null), 1200);
  }, [myLetter]);

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

  const { paper } = data;

  const canWrite = !isOwner && myLetter.status === 'none';
  const hasMyLetter = !isOwner && myLetter.status === 'sent';

  return (
    <div className={styles.page}>
      <div className={styles.window}>
        <div className={styles.titleBar}>
          ★ Rollingpaper ★
          <span className={styles.ownerText}>— by {paper.owner?.display_name ?? 'Unknown'}</span>
        </div>

        <div className={styles.body}>
          <div className={styles.boardOuter}>
            <section className={styles.boardInner}>
              {/* 상단: 명판 + 우측 액션 */}
              <header className={styles.boardHeader}>
                <div className={styles.topActions}>
                  <button
                    type="button"
                    className={`${styles.pinChip} ${copied ? styles.pinChipCopied : ''}`}
                    onClick={copySlug}
                    title="슬러그 복사"
                  >
                    <FaLink />
                    <span className={styles.pinChipText}>{copied ? 'copied' : 'share'}</span>
                  </button>

                  {canWrite && (
                    <button
                      type="button"
                      className={`${styles.pinBtn} ${styles.pinBtnTilt}`}
                      onClick={openComposer}
                      title="편지 쓰기"
                    >
                      <FaPenNib />
                    </button>
                  )}

                  {hasMyLetter && (
                    <>
                      <button
                        type="button"
                        className={styles.pinBtn}
                        onClick={openMyLetterDetail}
                        title="내가 보낸 편지 보기"
                      >
                        <FaBookmark />
                      </button>
                      <button
                        type="button"
                        className={styles.pinBtn}
                        onClick={moveToMyLetter}
                        title="내 편지로 이동"
                      >
                        <FaMapPin />
                      </button>
                    </>
                  )}

                  {isOwner && <span className={styles.ownerBadgeTiny}>MY</span>}
                </div>

                <div className={styles.plateWrap}>
                  <img
                    className={styles.plateStickerLeft}
                    src="/img/sticker/heart-pink-glitter-loveya.png"
                    alt=""
                    draggable={false}
                  />
                  <img
                    className={styles.plateStickerRight}
                    src="/img/sticker/star-blue.png"
                    alt=""
                    draggable={false}
                  />

                  <div className={styles.titlePlate}>
                    <div className={styles.platePins}>
                      <span className={styles.pinDot} />
                      <span className={styles.pinDot} />
                    </div>

                    <div className={styles.titleRow}>
                      <h1 className={styles.boardTitle}>{paper.title}</h1>
                      <span className={styles.boardYear}>{paper.year}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* 스크롤 영역(그리드) */}
              <div ref={scrollRef} className={styles.boardScroll}>
                {sortedLetters.length === 0 ? (
                  <div className={styles.emptyNote}>아직 편지가 없어요 ✉</div>
                ) : (
                  <div className={styles.grid}>
                    {sortedLetters.map((l) => {
                      const writerLabel = l.is_anonymous
                        ? 'Anonymous'
                        : l.writer?.display_name ?? l.writer_name ?? 'Unknown';

                      const isMine = myLetter.status === 'sent' && myLetter.letter.id === l.id;
                      const isHighlight = highlightId === l.id;
                      const rot = rotationMap.get(l.id) ?? 0;

                      const stickerDef =
                        findStickerDef(l.teaser_sticker_type) ?? findStickerDef('smile');

                      return (
                        <button
                          key={l.id}
                          type="button"
                          data-letter-id={l.id}
                          className={[
                            styles.note,
                            isMine ? styles.myNote : '',
                            isHighlight ? styles.flash : '',
                          ].join(' ')}
                          style={
                            {
                              ['--rot' as any]: `${rot}deg`,
                            } as React.CSSProperties
                          }
                          onClick={() => openLetterDetail(l.id)}
                          title="편지 보기"
                        >
                          <span className={styles.paperLift} aria-hidden />

                          {stickerDef && (
                            <img
                              className={styles.stickerImg}
                              src={stickerDef.src}
                              alt={stickerDef.label}
                              draggable={false}
                            />
                          )}

                          <div className={styles.noteTitle}>{l.teaser_title ?? 'LETTER'}</div>
                          <div className={styles.noteWriter}>{writerLabel}</div>
                          {isMine && <div className={styles.myBadge}>MY</div>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

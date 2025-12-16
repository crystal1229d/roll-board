'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLetterComposer } from '@/feature/letter/hook/useLetterComposer';
import {
  DEFAULT_STICKER_ID,
  type StickerTypeId,
  findStickerDef,
  StickerPalette,
} from '@/entity/sticker';
import styles from './LetterComposer.module.css';

type Props = {
  paperId: string;
  paperTitle: string;
  onClose: () => void;
  onSaved: () => void;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function LetterComposer({ paperId, paperTitle, onClose, onSaved }: Props) {
  const { createLetter, saving, error } = useLetterComposer();

  const boardRef = useRef<HTMLButtonElement | null>(null);

  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [x, setX] = useState(30);
  const [y, setY] = useState(28);
  const [rot, setRot] = useState(() => Math.floor(Math.random() * 11) - 5);
  const [scale, setScale] = useState(1);

  // 대표 스티커(보드에서 보이는 teaser 스티커)
  const [teaserStickerType, setTeaserStickerType] = useState<StickerTypeId>(DEFAULT_STICKER_ID);

  const teaserTitle = useMemo(() => {
    const first = content.trim().split('\n')[0] ?? '';
    if (first.length === 0) return 'LETTER';
    return first.length > 14 ? `${first.slice(0, 14)}…` : first;
  }, [content]);

  const teaserStickerDef = useMemo(() => findStickerDef(teaserStickerType), [teaserStickerType]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const setByPointer = (clientX: number, clientY: number) => {
    const el = boardRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = ((clientX - r.left) / r.width) * 100;
    const py = ((clientY - r.top) / r.height) * 100;

    setX(clamp(px, 6, 88));
    setY(clamp(py, 6, 88));
  };

  const handleBoardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setByPointer(e.clientX, e.clientY);
  };

  const handleSave = async () => {
    if (saving) return;

    const trimmed = content.trim();
    if (trimmed.length < 2) return;

    const ok = await createLetter({
      paperId,
      content: trimmed,
      isAnonymous,
      teaserTitle,
      teaserX: x,
      teaserY: y,
      teaserRotation: rot,
      teaserScale: scale,

      // ✅ DB letters.teaser_sticker_type로 저장
      teaserStickerType,
    });

    if (!ok) return;
    onSaved();
    onClose();
  };

  return (
    <div
      className={styles.overlayDialog}
      aria-label="Letter composer dialog overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <dialog
        open
        className={styles.window}
        aria-label="Letter composer dialog"
        onCancel={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <div className={styles.window} role="document">
          <div className={styles.titleBar}>
            ★ Write a Letter ★ <span className={styles.dim}>— to {paperTitle}</span>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
              X
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.layout}>
              {/* LEFT */}
              <div className={styles.leftPane}>
                <div className={styles.paneTitle}>★ Place Your Post-it</div>

                <button
                  ref={boardRef}
                  type="button"
                  className={styles.corkBoard}
                  onClick={handleBoardClick}
                  aria-label="Cork board. Click to move the post-it."
                >
                  <div
                    className={styles.note}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -30%) rotate(${rot}deg) scale(${scale})`,
                      pointerEvents: 'none',
                    }}
                    aria-hidden="true"
                  >
                    <div className={styles.pin} />

                    {/* ✅ 대표 스티커 미리보기 */}
                    {teaserStickerDef && (
                      <img
                        className={styles.noteSticker}
                        src={teaserStickerDef.src}
                        alt={teaserStickerDef.label}
                        draggable={false}
                      />
                    )}

                    <div className={styles.noteTitle}>{teaserTitle}</div>
                    <div className={styles.noteHint}>click board to move</div>
                  </div>
                </button>

                <div className={styles.miniControls}>
                  <div className={styles.sliderRow}>
                    <span>ROT</span>
                    <input
                      type="range"
                      min={-20}
                      max={20}
                      value={rot}
                      onChange={(e) => setRot(Number(e.target.value))}
                    />
                    <span className={styles.mono}>{rot}°</span>
                  </div>

                  <div className={styles.sliderRow}>
                    <span>SCALE</span>
                    <input
                      type="range"
                      min={70}
                      max={130}
                      value={Math.round(scale * 100)}
                      onChange={(e) => setScale(Number(e.target.value) / 100)}
                    />
                    <span className={styles.mono}>{Math.round(scale * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className={styles.rightPane}>
                <div className={styles.paneTitle}>★ Letter Editor</div>

                {/* ✅ Sticker palette */}
                <div className={styles.stickerBlock}>
                  <div className={styles.blockLabel}>Teaser Sticker</div>
                  <StickerPalette value={teaserStickerType} onChange={setTeaserStickerType} />
                  <div className={styles.blockHint}>보드에서 편지 대표 스티커로 보여져요.</div>
                </div>

                <label className={styles.field}>
                  <span>Content</span>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    placeholder="여기에 편지를 적어줘… ✶"
                  />
                </label>

                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span>익명으로 보내기</span>
                </label>

                {error && <div className={styles.errorBox}>⚠ {error}</div>}

                <div className={styles.btnRow}>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={onClose}
                    disabled={saving}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleSave}
                    disabled={saving || content.trim().length < 2}
                  >
                    {saving ? '★ Saving… ★' : '★ Post-it 붙이기 ★'}
                  </button>
                </div>

                <div className={styles.footerHint}>
                  첫 줄은 자동으로 <b>포스트잇 제목</b>이 돼요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

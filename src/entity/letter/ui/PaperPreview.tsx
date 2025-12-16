'use client';

import { useMemo, useRef } from 'react';
import styles from './PaperPreview.module.css';
import type { LetterStickerDraft } from '@/entity/letter/type';
import { findStickerDef, type StickerTypeId } from '@/entity/sticker/model/catalog';

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

type Props = {
  noteColor: string;
  fontFamilyCss: string;
  pattern: string;

  content: string;

  selectedSticker: StickerTypeId | null;
  stickers: LetterStickerDraft[];
  onStickersChange: (next: LetterStickerDraft[]) => void;
};

export default function PaperPreview({
  noteColor,
  fontFamilyCss,
  pattern,
  content,
  selectedSticker,
  stickers,
  onStickersChange,
}: Props) {
  const paperRef = useRef<HTMLDivElement | null>(null);

  const paperStyle = useMemo(
    () =>
      ({
        ['--paper-color' as any]: noteColor,
        ['--paper-font' as any]: fontFamilyCss,
        ['data-pattern' as any]: pattern,
      } as React.CSSProperties),
    [fontFamilyCss, noteColor, pattern],
  );

  const addStickerAt = (clientX: number, clientY: number) => {
    if (!selectedSticker) return;
    const el = paperRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = clamp(((clientX - r.left) / r.width) * 100, 2, 98);
    const y = clamp(((clientY - r.top) / r.height) * 100, 2, 98);

    const rot = Math.round((Math.random() * 16 - 8) * 10) / 10; // -8~+8
    const scale = Math.round((0.9 + Math.random() * 0.35) * 100) / 100;

    onStickersChange([
      ...stickers,
      {
        id: crypto.randomUUID(),
        sticker_type: selectedSticker,
        x,
        y,
        rotation: rot,
        scale,
      },
    ]);
  };

  const startDrag = (id: string, startClientX: number, startClientY: number) => {
    const el = paperRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const idx = stickers.findIndex((s) => s.id === id);
    if (idx < 0) return;

    const start = stickers[idx];
    const startX = start.x;
    const startY = start.y;

    const onMove = (e: PointerEvent) => {
      const dx = ((e.clientX - startClientX) / r.width) * 100;
      const dy = ((e.clientY - startClientY) / r.height) * 100;
      const nx = clamp(startX + dx, 0, 100);
      const ny = clamp(startY + dy, 0, 100);

      const next = stickers.slice();
      next[idx] = { ...next[idx], x: nx, y: ny };
      onStickersChange(next);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const removeSticker = (id: string) => {
    onStickersChange(stickers.filter((s) => s.id !== id));
  };

  return (
    <div className={styles.wrap}>
      <div
        ref={paperRef}
        className={`${styles.paper} ${styles[`pattern_${pattern}`] ?? ''}`}
        style={paperStyle}
        onClick={(e) => addStickerAt(e.clientX, e.clientY)}
        role="button"
        tabIndex={0}
        aria-label="paper preview"
      >
        <div className={styles.content}>
          {content.trim().length === 0 ? (
            <span className={styles.placeholder}>여기에 편지를 써보자… ✶</span>
          ) : (
            content
          )}
        </div>

        {stickers.map((s) => {
          const def = findStickerDef(s.sticker_type);
          const size = 58 * (s.scale ?? 1);
          return (
            <div
              key={s.id}
              className={styles.sticker}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${size}px`,
                height: `${size}px`,
                transform: `translate(-50%, -50%) rotate(${s.rotation ?? 0}deg)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                startDrag(s.id, e.clientX, e.clientY);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                removeSticker(s.id);
              }}
              title="드래그로 이동 / 더블클릭으로 제거"
            >
              {def ? (
                <img
                  className={styles.stickerImg}
                  src={def.src}
                  alt={def.label}
                  draggable={false}
                />
              ) : (
                <div className={styles.missing}>?</div>
              )}
            </div>
          );
        })}

        <div className={styles.tip}>
          {selectedSticker ? (
            <span>
              선택됨: <b>{selectedSticker}</b> (클릭해서 붙이기)
            </span>
          ) : (
            <span>스티커를 선택하면 클릭으로 붙일 수 있어요.</span>
          )}
        </div>
      </div>

      <div className={styles.subHint}>스티커는 더블클릭으로 제거</div>
    </div>
  );
}

'use client';

import { useMemo, useRef, useState } from 'react';
import { findStickerDef } from '@/entity/sticker';
import type { LetterStickerDraft, LetterStyleDraft } from '@/entity/letter/type';

type Props = {
  content: string;
  style: LetterStyleDraft;
  stickers: LetterStickerDraft[];
  editable: boolean;

  onChangeContent: (v: string) => void;
  onMoveSticker: (id: string, patch: Partial<LetterStickerDraft>) => void;
  onRemoveSticker: (id: string) => void;
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export function LetterPaper({
  content,
  style,
  stickers,
  editable,
  onChangeContent,
  onMoveSticker,
  onRemoveSticker,
}: Props) {
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);

  const paperBg = useMemo(() => {
    const base = style.noteColor ?? '#fffdf0';

    if (style.pattern === 'grid') {
      return {
        backgroundColor: base,
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      } as const;
    }

    if (style.pattern === 'lined') {
      return {
        backgroundColor: base,
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.09) 1px, transparent 1px)',
        backgroundSize: '100% 26px',
      } as const;
    }

    return { backgroundColor: base } as const;
  }, [style.noteColor, style.pattern]);

  const startDrag = (e: React.PointerEvent, id: string) => {
    if (!editable) return;

    const root = paperRef.current;
    const target = e.currentTarget as HTMLElement;
    if (!root) return;

    const tr = target.getBoundingClientRect();

    // pointer가 스티커 안에서 찍힌 위치 유지
    dragOffset.current = {
      dx: e.clientX - tr.left,
      dy: e.clientY - tr.top,
    };

    setDragId(id);
    target.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onMove = (e: React.PointerEvent) => {
    if (!editable) return;
    if (!dragId || !paperRef.current || !dragOffset.current) return;

    const rr = paperRef.current.getBoundingClientRect();

    const xPx = e.clientX - rr.left - dragOffset.current.dx;
    const yPx = e.clientY - rr.top - dragOffset.current.dy;

    const x = clamp((xPx / rr.width) * 100, 0, 100);
    const y = clamp((yPx / rr.height) * 100, 0, 100);

    onMoveSticker(dragId, { x, y });
    e.preventDefault();
  };

  const endDrag = () => {
    setDragId(null);
    dragOffset.current = null;
  };

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {/* Paper */}
      <div
        ref={paperRef}
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          position: 'relative',
          border: '2px solid #000',
          borderRadius: 14,
          overflow: 'hidden',
          minHeight: 520,
          boxShadow: '6px 6px 0 rgba(0,0,0,0.35)',
          ...paperBg,
          fontFamily: style.fontFamily,
          color: style.textColor,
        }}
      >
        {/* 왼쪽 여백*/}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 22,
            background: 'rgba(255, 80, 140, 0.12)',
            borderRight: '1px solid rgba(0,0,0,0.2)',
          }}
        />

        {/* Content */}
        {editable ? (
          <textarea
            value={content}
            onChange={(e) => onChangeContent(e.target.value)}
            style={{
              position: 'absolute',
              inset: 0,
              padding: '22px 18px 18px 34px',
              border: 0,
              outline: 'none',
              background: 'transparent',
              fontSize: 14,
              lineHeight: 1.7,
              resize: 'none',
            }}
          />
        ) : (
          <div
            style={{
              padding: '22px 18px 18px 34px',
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {content}
          </div>
        )}

        {/* Stickers */}
        {stickers.map((s) => {
          const def = findStickerDef(s.stickerType);
          if (!def) return null;

          return (
            <div
              key={s.id}
              onPointerDown={(e) => startDrag(e, s.id)}
              onDoubleClick={() => editable && onRemoveSticker(s.id)}
              title={editable ? '드래그 이동 / 더블클릭 삭제' : ''}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: `translate(-20%, -20%) rotate(${s.rotation}deg) scale(${s.scale})`,
                transformOrigin: 'center',
                cursor: editable ? 'grab' : 'default',
                userSelect: 'none',
                touchAction: 'none',
                zIndex: dragId === s.id ? 50 : 5,
                filter:
                  dragId === s.id
                    ? 'drop-shadow(10px 12px 0 rgba(0,0,0,0.25))'
                    : 'drop-shadow(2px 2px 0 #000)',
                transition: dragId === s.id ? 'none' : 'transform 120ms ease, filter 120ms ease',
              }}
            >
              <img
                src={def.src}
                alt={def.label}
                draggable={false}
                style={{ width: 72, height: 72, objectFit: 'contain', pointerEvents: 'none' }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, opacity: 0.78, fontWeight: 700 }}>
        {editable
          ? '스티커: 드래그 이동 / 더블클릭 삭제 · 편지지는 바로 수정됩니다.'
          : '작성자만 편집할 수 있어요.'}
      </div>
    </div>
  );
}

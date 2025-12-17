'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { findStickerDef, DEFAULT_STICKER_ID } from '@/entity/sticker';
import type { StickerTypeId } from '@/entity/sticker';
import type { LetterStickerDraft, LetterStyleDraft } from '@/entity/letter/type';
import { TeaserCard } from './TeaserCard';

type TeaserPreview = {
  title: string;
  stickerType: StickerTypeId | null;
  writerName: string;
  rot?: number;
};

type Props = {
  content: string;
  style: LetterStyleDraft;
  stickers: LetterStickerDraft[];
  editable: boolean;

  onChangeContent: (v: string) => void;
  onMoveSticker: (id: string, patch: Partial<LetterStickerDraft>) => void;
  onRemoveSticker: (id: string) => void;

  teaserPreview?: TeaserPreview;
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
  teaserPreview,
}: Props) {
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);

  const CANVAS_W = 760;
  const CANVAS_H = 520;

  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), 850);
    return () => window.clearTimeout(t);
  }, []);

  const paperBg = useMemo(() => {
    const base = style.noteColor ?? '#fffdf0';

    switch (style.pattern) {
      case 'grid':
        return {
          backgroundColor: base,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        } as const;
      case 'lined':
        return {
          backgroundColor: base,
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.09) 1px, transparent 1px)',
          backgroundSize: '100% 26px',
        } as const;
      case 'dots':
        return {
          backgroundColor: base,
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        } as const;
      case 'diagonal':
        return {
          backgroundColor: base,
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 12px)',
        } as const;
      case 'check':
        return {
          backgroundColor: base,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          backgroundPosition: '0 0, 13px 13px',
        } as const;
      case 'notebook':
        return {
          backgroundColor: base,
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.085) 1px, transparent 1px), linear-gradient(to right, rgba(255, 80, 140, 0.20) 22px, transparent 22px)',
          backgroundSize: '100% 26px, 100% 100%',
        } as const;
      default:
        return { backgroundColor: base } as const;
    }
  }, [style.noteColor, style.pattern]);

  const startDrag = (e: React.PointerEvent, id: string) => {
    if (!editable) return;

    const root = paperRef.current;
    const target = e.currentTarget as HTMLElement;
    if (!root) return;

    const tr = target.getBoundingClientRect();
    dragOffset.current = { dx: e.clientX - tr.left, dy: e.clientY - tr.top };

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
    <div style={{ display: 'grid', gap: 10, minWidth: 0 }}>
      {/* 상단 티저 */}
      {teaserPreview && (
        <div
          style={{
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            border: '2px solid #000',
            borderRadius: 14,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.25)',
            overflow: 'hidden',
          }}
        >
          <TeaserCard
            variant="badge"
            title={teaserPreview.title}
            writerName={teaserPreview.writerName}
            stickerType={teaserPreview.stickerType}
            rot={(teaserPreview.rot ?? -1.5) + 1.2}
          />
        </div>
      )}

      {/* 작은 화면에서 잘리도록 */}
      <div style={{ overflow: 'hidden' }}>
        <div
          ref={paperRef}
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{
            position: 'relative',
            width: CANVAS_W,
            height: CANVAS_H,
            border: '2px solid #000',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.35)',
            ...paperBg,
            fontFamily: style.fontFamily,
            color: style.textColor,
          }}
        >
          {/* 인트로 오버레이 */}
          {teaserPreview && intro && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                zIndex: 40,
                pointerEvents: 'none',
              }}
            >
              <TeaserCard
                title={teaserPreview.title}
                writerName={teaserPreview.writerName}
                stickerType={teaserPreview.stickerType}
                rot={(teaserPreview.rot ?? -1.5) + 1.2}
              />
            </div>
          )}

          {/* margin */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 22,
              background: 'rgba(255, 80, 140, 0.10)',
              borderRight: '1px solid rgba(0,0,0,0.18)',
              pointerEvents: 'none',
            }}
          />

          {/* content */}
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
                overflow: 'auto',
                color: style.textColor,
                fontFamily: style.fontFamily,
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                padding: '22px 18px 18px 34px',
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                overflow: 'auto',
              }}
            >
              {content}
            </div>
          )}

          {/* stickers */}
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
      </div>

      {/* hint */}
      <div
        style={{
          display: 'grid',
          gap: 6,
          borderRadius: 14,
          padding: '10px 12px',
          border: '2px dashed rgba(0,0,0,0.35)',
          background: 'rgba(255,255,255,0.70)',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.18)',
          fontSize: 12,
          fontWeight: 800,
          lineHeight: 1.45,
        }}
      >
        {editable ? (
          <>
            <div>
              💡 스티커는 <b>드래그</b>로 이동해요
            </div>
            <div>
              💡 스티커는 <b>더블클릭</b>으로 삭제돼요
            </div>
            <div style={{ opacity: 0.78 }}>💾 수정 후 오른쪽 아래에서 저장을 눌러야 반영돼요</div>
          </>
        ) : (
          <div>✋ 작성자만 편집할 수 있어요.</div>
        )}
      </div>
    </div>
  );
}

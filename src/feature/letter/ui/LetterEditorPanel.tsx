'use client';

import { useMemo } from 'react';
import { STICKER_CATALOG, DEFAULT_STICKER_ID } from '@/entity/sticker';
import type { LetterStyleDraft } from '@/entity/letter/type';
import type { StickerTypeId } from '@/entity/sticker/type';

type Props = {
  style: LetterStyleDraft;
  onChangeStyle: (patch: Partial<LetterStyleDraft>) => void;
  onAddSticker: (stickerType?: string) => void;

  teaserTitle: string;
  teaserStickerType: StickerTypeId | null;
  onChangeTeaser: (patch: {
    teaserTitle?: string;
    teaserStickerType?: StickerTypeId | string | null;
  }) => void;

  isAnonymous: boolean;
  onChangeWriterMeta: (patch: { isAnonymous?: boolean }) => void;
};

const FONTS = [
  { id: 'verdana', label: 'Verdana', css: 'Verdana, Tahoma, sans-serif' },
  { id: 'serif', label: 'Serif', css: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', label: 'Mono', css: '"Courier New", Courier, monospace' },
] as const;

const PATTERNS: Array<{ id: LetterStyleDraft['pattern']; label: string }> = [
  { id: 'plain', label: 'Plain' },
  { id: 'lined', label: 'Lined' },
  { id: 'grid', label: 'Grid' },
  { id: 'dots', label: 'Dots' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'check', label: 'Check' },
  { id: 'notebook', label: 'Notebook' },
];

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: '2px solid #000',
        borderRadius: 14,
        background: '#fff',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.20)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '9px 10px',
          borderBottom: '2px solid #000',
          background: '#fff3b0',
          fontWeight: 900,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontSize: 12,
        }}
      >
        {title}
      </div>
      <div style={{ padding: 12, display: 'grid', gap: 10 }}>{children}</div>
    </div>
  );
}

export function LetterEditorPanel({
  style,
  onChangeStyle,
  onAddSticker,
  teaserTitle,
  teaserStickerType,
  onChangeTeaser,
  isAnonymous,
  onChangeWriterMeta,
}: Props) {
  const stickerThumbs = useMemo(() => STICKER_CATALOG, []);
  const teaserType = (teaserStickerType ?? (DEFAULT_STICKER_ID as StickerTypeId)) as StickerTypeId;

  return (
    <div style={{ display: 'grid', gap: 10, fontFamily: 'Verdana, Tahoma, sans-serif' }}>
      <PanelSection title="Writer">
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 900 }}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => onChangeWriterMeta({ isAnonymous: e.target.checked })}
          />
          익명으로 작성
        </label>
        <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 800 }}>
          익명일 때 발신자는 <b>발신자 불명</b>으로 표시돼요.
        </div>
      </PanelSection>

      <PanelSection title="Teaser">
        <input
          value={teaserTitle}
          onChange={(e) => onChangeTeaser({ teaserTitle: e.target.value.slice(0, 40) })}
          placeholder="목록에 보일 제목"
          style={{
            border: '2px solid #000',
            borderRadius: 12,
            padding: '10px 12px',
            fontWeight: 900,
            outline: 'none',
          }}
        />

        <div style={{ fontSize: 11, fontWeight: 900, opacity: 0.75 }}>
          티저 스티커 선택 (목록 썸네일)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {STICKER_CATALOG.map((s) => {
            const active = s.id === teaserType;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChangeTeaser({ teaserStickerType: s.id })}
                title={s.label}
                style={{
                  border: `2px solid ${active ? '#000' : 'rgba(0,0,0,0.35)'}`,
                  background: active ? '#fff3b0' : '#fff',
                  borderRadius: 12,
                  padding: 8,
                  cursor: 'pointer',
                  boxShadow: active ? '3px 3px 0 #000' : '2px 2px 0 rgba(0,0,0,0.35)',
                  fontWeight: 900,
                }}
              >
                <img
                  src={s.src}
                  alt={s.label}
                  draggable={false}
                  style={{ width: '100%', height: 44, objectFit: 'contain' }}
                />
              </button>
            );
          })}
        </div>
      </PanelSection>

      <PanelSection title="Paper">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 900 }}>
            Paper Color
            <input
              type="color"
              value={style.noteColor}
              onChange={(e) => onChangeStyle({ noteColor: e.target.value })}
              style={{ width: '100%', height: 38, border: '2px solid #000', borderRadius: 12 }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 900 }}>
            Text Color
            <input
              type="color"
              value={style.textColor}
              onChange={(e) => onChangeStyle({ textColor: e.target.value })}
              style={{ width: '100%', height: 38, border: '2px solid #000', borderRadius: 12 }}
            />
          </label>
        </div>

        <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 900 }}>
          Pattern
          <select
            value={style.pattern}
            onChange={(e) =>
              onChangeStyle({ pattern: e.target.value as LetterStyleDraft['pattern'] })
            }
            style={{
              border: '2px solid #000',
              borderRadius: 12,
              padding: '10px 12px',
              fontWeight: 900,
            }}
          >
            {PATTERNS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 900 }}>
          Font
          <select
            value={style.fontFamily}
            onChange={(e) => onChangeStyle({ fontFamily: e.target.value })}
            style={{
              border: '2px solid #000',
              borderRadius: 12,
              padding: '10px 12px',
              fontWeight: 900,
            }}
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.css}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </PanelSection>

      <PanelSection title="Stickers">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {stickerThumbs.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onAddSticker(s.id)}
              title={s.label}
              style={{
                border: '2px solid #000',
                background: '#fff',
                borderRadius: 12,
                padding: 8,
                cursor: 'pointer',
                boxShadow: '2px 2px 0 #000',
              }}
            >
              <img
                src={s.src}
                alt={s.label}
                draggable={false}
                style={{ width: '100%', height: 44, objectFit: 'contain' }}
              />
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 900 }}>
          클릭하면 편지지에 스티커가 추가돼요.
        </div>
      </PanelSection>
    </div>
  );
}

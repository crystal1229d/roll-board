'use client';

import { useMemo, useState } from 'react';
import { STICKER_CATALOG, DEFAULT_STICKER_ID } from '@/entity/sticker';
import type { LetterStyle } from '@/feature/letter/hook/useLetterEditor';

type Props = {
  style: LetterStyle;
  onChangeStyle: (patch: Partial<LetterStyle>) => void;
  onAddSticker: (stickerType?: string) => void;

  // optional: teaser 설정은 LetterDetailContent에서 같이 넘겨도 됨
  teaserTitle?: string | null;
  teaserStickerType?: string | null;
  onChangeTeaser?: (patch: { teaserTitle?: string; teaserStickerType?: string }) => void;
};

const FONTS = [
  { id: 'verdana', label: 'Verdana', css: 'Verdana, Tahoma, sans-serif' },
  { id: 'serif', label: 'Serif', css: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', label: 'Mono', css: '"Courier New", Courier, monospace' },
] as const;

export function LetterEditorPanel({
  style,
  onChangeStyle,
  onAddSticker,
  teaserTitle,
  teaserStickerType,
  onChangeTeaser,
}: Props) {
  const [localTeaser, setLocalTeaser] = useState(teaserTitle ?? '');

  const stickerThumbs = useMemo(() => STICKER_CATALOG, []);

  return (
    <div
      style={{
        border: '2px solid #000',
        borderRadius: 14,
        background: '#fff',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.35)',
        overflow: 'hidden',
        fontFamily: 'Verdana, Tahoma, sans-serif',
      }}
    >
      <div
        style={{
          padding: '10px 12px',
          borderBottom: '2px solid #000',
          background: '#fff3b0',
          fontWeight: 900,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        ★ Customize
      </div>

      <div style={{ padding: 12, display: 'grid', gap: 14 }}>
        {/* teaser */}
        {onChangeTeaser && (
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 900 }}>TEASER</div>

            <input
              value={localTeaser}
              onChange={(e) => setLocalTeaser(e.target.value)}
              onBlur={() => onChangeTeaser({ teaserTitle: localTeaser.trim().slice(0, 40) })}
              placeholder="목록에 보일 제목"
              style={{
                border: '2px solid #000',
                borderRadius: 10,
                padding: '8px 10px',
                fontWeight: 800,
              }}
            />

            <select
              value={teaserStickerType ?? DEFAULT_STICKER_ID}
              onChange={(e) => onChangeTeaser({ teaserStickerType: e.target.value })}
              style={{ border: '2px solid #000', borderRadius: 10, padding: '8px 10px' }}
            >
              {STICKER_CATALOG.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* paper style */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 900 }}>PAPER</div>

          <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800 }}>
            Color
            <input
              type="color"
              value={style.noteColor}
              onChange={(e) => onChangeStyle({ noteColor: e.target.value })}
              style={{ width: '100%', height: 38, border: '2px solid #000', borderRadius: 10 }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800 }}>
            Pattern
            <select
              value={style.pattern}
              onChange={(e) => onChangeStyle({ pattern: e.target.value as any })}
              style={{ border: '2px solid #000', borderRadius: 10, padding: '8px 10px' }}
            >
              <option value="plain">Plain</option>
              <option value="lined">Lined</option>
              <option value="grid">Grid</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800 }}>
            Font
            <select
              value={style.fontFamily}
              onChange={(e) => onChangeStyle({ fontFamily: e.target.value })}
              style={{ border: '2px solid #000', borderRadius: 10, padding: '8px 10px' }}
            >
              {FONTS.map((f) => (
                <option key={f.id} value={f.css}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* sticker palette */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 900 }}>STICKERS</div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
            }}
          >
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

          <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700 }}>
            클릭하면 편지지에 스티커가 추가돼요.
          </div>
        </div>
      </div>
    </div>
  );
}

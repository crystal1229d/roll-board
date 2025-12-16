'use client';

import { STICKER_CATALOG } from '../model/catalog';
import type { StickerTypeId } from '../type';
import styles from './StickerPalette.module.css';

type Props = {
  value: StickerTypeId;
  onChange: (id: StickerTypeId) => void;
};

export function StickerPalette({ value, onChange }: Props) {
  return (
    <div className={styles.palette}>
      {STICKER_CATALOG.map((s) => {
        const selected = s.id === value;

        return (
          <button
            key={s.id}
            type="button"
            className={`${styles.thumb} ${selected ? styles.selected : ''}`}
            onClick={() => onChange(s.id)}
            title={s.label}
          >
            <img src={s.src} alt={s.label} draggable={false} />
          </button>
        );
      })}
    </div>
  );
}

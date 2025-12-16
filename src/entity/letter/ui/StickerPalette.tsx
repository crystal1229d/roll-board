'use client';

import { STICKER_CATALOG } from '@/entity/sticker/model/catalog';
import styles from './StickerPalette.module.css';

type Props = { onAdd: (stickerType: string) => void };

export default function StickerPalette({ onAdd }: Props) {
  return (
    <div className={styles.wrap}>
      {STICKER_CATALOG.map((s) => (
        <button key={s.id} type="button" className={styles.item} onClick={() => onAdd(s.id)}>
          <img className={styles.img} src={s.src} alt={s.label} draggable={false} />
          <div className={styles.label}>{s.label}</div>
        </button>
      ))}
    </div>
  );
}

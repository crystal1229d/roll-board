'use client';

import { STICKER_CATALOG } from '@/feature/paper/config/stickerCatalog';
import styles from './StickerPalette.module.css';

interface Props {
  onPick: (id: string) => void;
}

export default function StickerPalette({ onPick }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>★ Sticker Box</div>
      <div className={styles.grid}>
        {STICKER_CATALOG.map((st) => (
          <button key={st.id} type="button" className={styles.item} onClick={() => onPick(st.id)}>
            <img src={st.src} alt={st.label} />
            <span>{st.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

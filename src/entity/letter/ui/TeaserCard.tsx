'use client';

import { DEFAULT_STICKER_ID, findStickerDef } from '@/entity/sticker';
import type { StickerTypeId } from '@/entity/sticker/type';
import styles from './TeaserCard.module.css';

type Props = {
  title: string;
  writerName: string;
  stickerType: StickerTypeId | null;
  rot?: number;
  variant?: 'card' | 'badge';
};

export function TeaserCard({ title, writerName, stickerType, rot = 0, variant = 'card' }: Props) {
  const id = (stickerType ?? DEFAULT_STICKER_ID) as StickerTypeId;
  const def = findStickerDef(id);

  return (
    <div
      className={variant === 'card' ? styles.card : styles.badge}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <span className={styles.gloss} aria-hidden />
      {def && <img className={styles.sticker} src={def.src} alt={def.label} draggable={false} />}

      <div className={styles.title} title={title || 'LETTER'}>
        {title || 'LETTER'}
      </div>
      <div className={styles.writer}>{writerName}</div>
    </div>
  );
}

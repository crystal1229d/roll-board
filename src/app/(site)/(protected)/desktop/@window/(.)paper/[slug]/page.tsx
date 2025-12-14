'use client';

import { useParams } from 'next/navigation';
import PaperDetailWindow from '@/widget/paper/PaperDetailWindow';
import styles from '../window.module.css';

export default function PaperDetailModalOnDesktop() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className={styles.overlay}>
      <div className={styles.windowWrap}>
        <PaperDetailWindow paperSlug={slug} />
      </div>
    </div>
  );
}

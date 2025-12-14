import styles from './PaperPreviewBoard.module.css';

interface Props {
  theme: string;
  bgTexture: string;
  paperTitle: string;
}

export default function PaperPreviewBoard({ theme, bgTexture, paperTitle }: Props) {
  const isSolid = bgTexture.startsWith('solid:');
  const solidColor = isSolid ? bgTexture.replace('solid:', '') : '';

  return (
    <div className={`${styles.board} ${styles[`theme_${theme}`]}`}>
      <div
        className={`${styles.inner} ${!isSolid ? styles[`bg_${bgTexture}`] : ''}`}
        style={isSolid ? { background: solidColor } : undefined}
      >
        <div className={styles.title}>{paperTitle}</div>
      </div>
    </div>
  );
}

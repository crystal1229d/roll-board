import styles from './PaperPreviewBoard.module.css';

interface Sticker {
  id: string;
  src: string;
  x: number;
  y: number;
}

interface Props {
  theme: string;
  bgTexture: string;
  paperTitle: string;
  stickers: Sticker[];
  onMoveSticker?: (id: string, x: number, y: number) => void;
}

export default function PaperPreviewBoard({
  theme,
  bgTexture,
  paperTitle,
  stickers,
  onMoveSticker,
}: Props) {
  return (
    <div className={`${styles.board} ${styles[`theme_${theme}`]}`}>
      <div className={`${styles.inner} ${styles[`bg_${bgTexture}`]}`}>
        <div className={styles.title}>{paperTitle}</div>

        {stickers.map((st) => (
          <img
            key={st.id}
            src={st.src}
            className={styles.sticker}
            style={{ top: st.y, left: st.x }}
            draggable={true}
            onDragEnd={(e) => {
              onMoveSticker?.(st.id, e.clientX - 50, e.clientY - 50);
            }}
          />
        ))}
      </div>
    </div>
  );
}

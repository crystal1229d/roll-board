import styles from './StickerList.module.css';

interface StickerListProps {
  stickers: string[];
  onSelect: (src: string) => void;
}

export default function StickerList({ stickers, onSelect }: StickerListProps) {
  return (
    <div className={styles.list}>
      {stickers.map((src) => (
        <button key={src} className={styles.item} onClick={() => onSelect(src)}>
          <img src={src} alt="sticker" />
        </button>
      ))}
    </div>
  );
}

import styles from './PaperBoard.module.css';

interface PaperBoardProps {
  bgTexture: string | null; // papers.bg_texture
  children?: React.ReactNode;
  className?: string; // 🔹 추가
}

export function PaperBoard({ bgTexture, children, className }: PaperBoardProps) {
  const key = bgTexture || 'cork';
  const boardClass = styles[`board_${key}`] ?? styles.board_cork;

  return <div className={`${styles.boardBase} ${boardClass} ${className ?? ''}`}>{children}</div>;
}

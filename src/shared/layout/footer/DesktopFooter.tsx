import Link from 'next/link';
import styles from './DesktopFooter.module.css';

export default function DesktopFooter() {
  const year = new Date().getFullYear();

  return (
    <div className={styles.footerLinks}>
      <span>© {year} Roll-Board</span>
      <Link href="/terms">이용약관</Link>
      <Link href="/privacy">개인정보처리방침</Link>
    </div>
  );
}

import MessageWindow from '@/widget/message/MessageWindow';
import styles from './page.module.css';

export default function MessagePage() {
  return (
    <main className={styles.page}>
      <MessageWindow />
    </main>
  );
}

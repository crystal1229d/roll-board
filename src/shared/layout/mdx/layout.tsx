import styles from './layout.module.css';

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.container}>{children}</div>;
}

'use client';

import { useDesktopStore } from '@/feature/desktop/model/useDesktopStore';
import { DESKTOP_APPS } from '@/feature/desktop/config/app';
import styles from './page.module.css';

export default function MainDesktopPage() {
  const openApp = useDesktopStore((s) => s.openApp);
  const desktopApps = DESKTOP_APPS.filter((app) => app.showOnDesktop);

  return (
    <div className={styles.desktop}>
      <div className={styles.iconGrid}>
        {desktopApps.map((app) => (
          <button key={app.id} className={styles.icon} onClick={() => openApp(app.id)}>
            <div className={styles.iconImage}>
              <img src={app.iconSrc} alt={app.label} width={app.iconWidth} />
            </div>
            <span>
              {app.label}
              {app.subLabel && (
                <>
                  <br />
                  {app.subLabel}
                </>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

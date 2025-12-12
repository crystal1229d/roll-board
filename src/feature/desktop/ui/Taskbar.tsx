'use client';

import { useEffect, useState } from 'react';
import { useDesktopStore } from '../model/useDesktopStore';
import { useAuth } from '@/feature/auth/hook/useAuth';
import { DesktopAppId, DESKTOP_APPS } from '../config/app';
import DesktopFooter from '@/shared/layout/footer/DesktopFooter';
import styles from './Taskbar.module.css';

type StartMenuAction = DesktopAppId | 'logout';

export default function Taskbar() {
  const { logout, loadingLogout } = useAuth();

  const windows = useDesktopStore((s) => s.windows);
  const openWindow = useDesktopStore((s) => s.openWindow);
  const toggleMinimize = useDesktopStore((s) => s.toggleMinimize);
  const bringToFront = useDesktopStore((s) => s.bringToFront);

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  const startMenuApps = DESKTOP_APPS.filter((a) => a.showInStartMenu);

  /* ─────────────────────────────
     Taskbar 창 버튼 클릭 로직
     - 열려 있는 창(visible)  클릭 → minimize
     - 최소화된 창(minimized) 클릭 → restore(최소화 해제 + bringToFront)
  ───────────────────────────── */
  const handleClickTaskbarWindow = (id: string) => {
    const target = windows.find((w) => w.id === id);
    if (!target) return;

    if (target.minimized) {
      // 최소화된 창 → 다시 보여주기
      toggleMinimize(target.id);
      bringToFront(target.id);
    } else {
      // 열려 있는 창 → 최소화
      toggleMinimize(target.id);
    }
  };

  /* ─────────────────────────────
     START 버튼 / 메뉴
  ───────────────────────────── */
  const handleStartClick = () => {
    setIsStartOpen((prev) => !prev);
  };

  const handleStartMenuClick = async (action: StartMenuAction) => {
    setIsStartOpen(false);

    if (action === 'logout') {
      await logout();
      return;
    }

    openWindow(action);
  };

  /* ─────────────────────────────
     시계 (YYYY-MM-DD HH:mm)
  ───────────────────────────── */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setTimeString(`${y}-${m}-${d} ${hh}:${mm}`);
    };

    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  const [datePart, timePart] = timeString.split(' ');

  return (
    <div className={styles.taskbar}>
      {/* START 버튼 + 메뉴 */}
      <div className={styles.startArea}>
        <button className={styles.startBtn} onClick={handleStartClick}>
          <span className={styles.startText}>Start</span>
        </button>

        <div
          className={`${styles.startMenu} ${
            isStartOpen ? styles.startMenuOpen : styles.startMenuClosed
          }`}
        >
          {startMenuApps.map((app) => (
            <button
              key={app.id}
              className={styles.startMenuItem}
              onClick={() => handleStartMenuClick(app.id as StartMenuAction)}
              disabled={app.id === 'logout' && loadingLogout}
            >
              <img src={app.iconSrc} alt={app.label} width={25} />
              {app.startMenuLabel ?? app.label}
            </button>
          ))}
        </div>
      </div>

      {/* 열린 창 목록 (Taskbar 버튼들) */}
      <div className={styles.windowList}>
        {windows.map((w) => {
          const app = DESKTOP_APPS.find((a) => a.id === w.type);

          return (
            <button
              key={w.id}
              className={`${styles.taskBtn} ${w.minimized ? styles.inactive : ''}`}
              onClick={() => handleClickTaskbarWindow(w.id)}
            >
              {app && <img src={app.iconSrc} width={16} alt={app.label} />}
              <span className={styles.label}>{w.title ?? w.type}</span>
            </button>
          );
        })}
      </div>

      {/* DesktopFooter + 시계 */}
      <div className={styles.footerArea}>
        <DesktopFooter />
        <div className={styles.clock}>
          {datePart}
          <br />
          {timePart}
        </div>
      </div>
    </div>
  );
}

'use client';

import { ReactNode, useRef } from 'react';
import WinWindow from '@/shared/ui/window/WinWindow';
import { DesktopWindowState, useDesktopStore } from '../model/useDesktopStore';
import styles from './DesktopWindow.module.css';

type Props = {
  win: DesktopWindowState;
  children: ReactNode;
};

export default function DesktopWindow({ win, children }: Props) {
  const bringToFront = useDesktopStore((s) => s.bringToFront);
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const toggleMinimize = useDesktopStore((s) => s.toggleMinimize);
  const toggleMaximize = useDesktopStore((s) => s.toggleMaximize);

  const moveWindow = useDesktopStore((s) => s.moveWindow);
  const resizeWindow = useDesktopStore((s) => s.resizeWindow);

  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  /* ─────────────────────────────
     드래그 이동 (타이틀바에서 시작)
  ─────────────────────────────── */
  const onMouseDownTitleBar = (e: React.MouseEvent) => {
    bringToFront(win.id);

    dragRef.current = {
      offsetX: e.clientX - win.x,
      offsetY: e.clientY - win.y,
    };

    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      moveWindow(win.id, e.clientX - dragRef.current.offsetX, e.clientY - dragRef.current.offsetY);
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  /* ─────────────────────────────
     Resize 핸들 (우하단)
  ─────────────────────────────── */
  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    bringToFront(win.id);

    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: win.width,
      startH: win.height,
    };

    const onMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;

      const diffX = e.clientX - resizeRef.current.startX;
      const diffY = e.clientY - resizeRef.current.startY;

      const newWidth = Math.max(280, resizeRef.current.startW + diffX);
      const newHeight = Math.max(180, resizeRef.current.startH + diffY);

      resizeWindow(win.id, newWidth, newHeight);
    };

    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  /* minimized/maximized 상태 적용 */
  const windowStyle = win.maximized
    ? {
        left: 20,
        top: 10,
        width: 'calc(100vw - 40px)',
        height: 'calc(100vh - 60px)',
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
      };

  return (
    <div
      className={styles.window}
      style={{ ...windowStyle, zIndex: win.zIndex }}
      onMouseDown={() => bringToFront(win.id)}
    >
      <WinWindow
        osTitle={win.title.toUpperCase()}
        browserTitle={`Roll✶Board – ${win.title}`}
        address={`http://roll-board.cyber/${win.payload.type}.htm`}
        statusLeft="Opening page..."
        statusRight={win.minimized ? 'Minimized' : 'Online 97%'}
        onTitleBarMouseDown={onMouseDownTitleBar}
        onClickMinimize={() => toggleMinimize(win.id)}
        onClickMaximize={() => toggleMaximize(win.id)}
        onClickClose={() => closeWindow(win.id)}
        showMinimize
        showMaximize
        showClose
      >
        {children}
      </WinWindow>

      {/* Resize Handle */}
      {!win.maximized && !win.minimized && (
        <div className={styles.resizeHandle} onMouseDown={onResizeMouseDown} />
      )}
    </div>
  );
}

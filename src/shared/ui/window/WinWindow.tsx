'use client';

import { ReactNode, MouseEventHandler } from 'react';
import { BiSolidLeftArrow, BiSolidRightArrow, BiSolidHome, BiMinus } from 'react-icons/bi';
import { MdOutlineReplay, MdCropSquare, MdClose } from 'react-icons/md';
import styles from './WinWindow.module.css';

type WinWindowProps = {
  /** OS 창 제목 (최상단 바) */
  osTitle?: string;
  /** 브라우저 상단 타이틀 */
  browserTitle?: string;
  /** 주소창 텍스트 */
  address?: string;
  /** 상태바 왼쪽 텍스트 */
  statusLeft?: string;
  /** 상태바 오른쪽 텍스트 */
  statusRight?: string;
  /** 내용 영역 */
  children: ReactNode;

  /** DesktopWindow에서 넘겨줄 이벤트들 */
  onTitleBarMouseDown?: MouseEventHandler<HTMLDivElement>;
  onClickMinimize?: () => void;
  onClickMaximize?: () => void;
  onClickClose?: () => void;

  showMinimize?: boolean;
  showMaximize?: boolean;
  showClose?: boolean;
};

export default function WinWindow({
  osTitle = '★ Roll-Board Window ★',
  browserTitle = 'Roll✶Board Cyber Window',
  address = 'http://roll-board.cyber/window.htm',
  statusLeft = 'Ready',
  statusRight = 'Online 99%',
  children,
  onTitleBarMouseDown,
  onClickMinimize,
  onClickMaximize,
  onClickClose,
  showMinimize = true,
  showMaximize = true,
  showClose = true,
}: WinWindowProps) {
  return (
    <div className={styles.window}>
      {/* ── Title bar (OS 창) ─────────────────────────────── */}
      <div className={styles.titleBar} onMouseDown={onTitleBarMouseDown}>
        <span>{osTitle}</span>
        <div className={styles.windowBtns}>
          {showMinimize && (
            <button
              type="button"
              className={styles.browserIconBtn}
              onClick={(e) => {
                e.stopPropagation();
                onClickMinimize?.();
              }}
            >
              <BiMinus />
            </button>
          )}
          {showMaximize && (
            <button
              type="button"
              className={styles.browserIconBtn}
              onClick={(e) => {
                e.stopPropagation();
                onClickMaximize?.();
              }}
            >
              <MdCropSquare />
            </button>
          )}
          {showClose && (
            <button
              type="button"
              className={styles.browserIconBtn}
              onClick={(e) => {
                e.stopPropagation();
                onClickClose?.();
              }}
            >
              <MdClose />
            </button>
          )}
        </div>
      </div>

      {/* ── Fake 브라우저 바(주소창) ───────────────────────── */}
      <div className={styles.browserChrome}>
        <div className={styles.browserTop}>
          <div className={styles.browserBtns}>
            <button className={styles.browserIconBtn} type="button">
              <BiSolidLeftArrow />
            </button>
            <button className={styles.browserIconBtn} type="button">
              <BiSolidRightArrow />
            </button>
            <button className={styles.browserIconBtn} type="button">
              <MdOutlineReplay />
            </button>
            <button className={styles.browserIconBtn} type="button">
              <BiSolidHome />
            </button>
          </div>
          <span className={styles.browserTitle}>{browserTitle}</span>
        </div>
        <div className={styles.browserUrl}>
          <span className={styles.urlLabel}>Address</span>
          <div className={styles.urlField}>{address}</div>
        </div>
      </div>

      {/* ── 본문 ─────────────────────────────────────────── */}
      <div className={styles.body}>{children}</div>

      {/* ── 상태바 ───────────────────────────────────────── */}
      <div className={styles.statusBar}>
        <span>{statusLeft}</span>
        <span>{statusRight}</span>
      </div>
    </div>
  );
}

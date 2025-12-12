'use client';

import { BiSolidLeftArrow, BiSolidRightArrow, BiSolidHome, BiMinus } from 'react-icons/bi';
import { MdOutlineReplay, MdCropSquare, MdClose } from 'react-icons/md';
import { useAuth } from '@/feature/auth/hook/useAuth';
import styles from './LoginPage.module.css';

export default function LoginWidget() {
  const { loginWithGoogle, loadingLogin, error } = useAuth();

  const handleClick = async () => {
    await loginWithGoogle();
  };

  return (
    <div className={styles.page}>
      <div className={styles.window}>
        {/* ── Title bar (OS 창) ─────────────────────────────── */}
        <div className={styles.titleBar}>
          <span>★ Welcome to Roll-Board Login ★</span>
          <div className={styles.windowBtns}>
            <button className={styles.browserIconBtn}>
              <BiMinus />
            </button>
            <button className={styles.browserIconBtn}>
              <MdCropSquare />
            </button>
            <button className={styles.browserIconBtn}>
              <MdClose />
            </button>
          </div>
        </div>

        {/* ── Fake 브라우저 바(주소창) ───────────────────────── */}
        <div className={styles.browserChrome}>
          <div className={styles.browserTop}>
            <div className={styles.browserBtns}>
              <button className={styles.browserIconBtn}>
                <BiSolidLeftArrow />
              </button>
              <button className={styles.browserIconBtn}>
                <BiSolidRightArrow />
              </button>
              <button className={styles.browserIconBtn}>
                <MdOutlineReplay />
              </button>
              <button className={styles.browserIconBtn}>
                <BiSolidHome />
              </button>
            </div>
            <span className={styles.browserTitle}>Roll✶Board Cyber Login</span>
          </div>
          <div className={styles.browserUrl}>
            <span className={styles.urlLabel}>Address</span>
            <div className={styles.urlField}>http://roll-board.cyber/login.htm</div>
          </div>
        </div>

        {/* ── 본문 ─────────────────────────────────────────── */}
        <div className={styles.body}>
          {/* 펫/마이룸 카드 영역 */}
          <div className={styles.heroPanel}>
            <div className={styles.petFrame}>
              <div className={styles.petFrameInner}>
                <img src="/img/dogs.png" alt="cyber pet" />
              </div>
              <span className={styles.petStamp}>MY CYBER ROOM</span>
            </div>

            <div className={styles.heroText}>
              <div className={styles.headerBadge}>
                <img src="/img/star-yellow-glitter.png" alt="star" height={30} />
                <p>
                  YOU ARE ENTERING
                  <br />A CYBER ZONE…
                </p>
              </div>

              <h1 className={styles.logo}>Roll✶Board</h1>
              {/* <img src="/img/logo5.png" height={150} /> */}
              {/* <img src="/img/logo6.png" height={150} /> */}
              {/* <img src="/img/logo7.png" height={100} /> */}
              {/* <img src="/img/logo8.png" height={50} /> */}
              {/* <img src="/img/my-space.png" height={70} /> */}
              {/* <img src="/img/logo9.png" height={100} /> */}

              <p className={styles.sub}>
                <span className={styles.bubble}>FREE E-HUGS</span>
                <span className={styles.bubble}>GLITTER MAIL</span>
                <span className={styles.bubble}>CYBER FRIENDS</span>
              </p>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleClick}
            disabled={loadingLogin}
          >
            <span>{loadingLogin ? 'Connecting…' : 'Log in with'}</span>
            <img src="/img/google-logo.png" height={27} alt="Google logo" />
          </button>

          {/* 에러 메시지 */}
          {error && <p className={styles.errorMsg}>{error}</p>}

          {/* 아래 배너들 */}
          <div className={styles.bannerStrip}>
            <span className={styles.banner}>★ MY SWEET BOARD ★</span>
            <span className={styles.banner}>VISIT MY ROOM</span>
            <span className={styles.banner}>SIGN MY GUESTBOOK</span>
          </div>

          {/* 안내 박스 */}
          <div className={styles.footerBox}>
            <img src="/img/computer.png" height={70} alt="computer" />
            <p>
              ※ Login required to enter
              <br />
              your personal cyber room.
            </p>
          </div>
        </div>

        {/* 브라우저 상태바 */}
        <div className={styles.statusBar}>
          <span>Opening page…</span>
          <span>{loadingLogin ? 'Redirecting to Google…' : 'GIFs loading 97%'}</span>
        </div>
      </div>

      {/* 배경 스티커 */}
      <img src="/img/star-blue.png" className={styles.floating1} alt="" />
      <img src="/img/star-pink-glitter.png" className={styles.floating2} alt="" />
      <img src="/img/gun-pink-glitter.png" className={styles.floating3} alt="" />
      <img src="/img/circle-green-glitter.png" className={styles.floating4} alt="" />
      <img src="/img/heart-purple-glitter-love.png" className={styles.floating5} alt="" />
      <img src="/img/smile.png" className={styles.floating6} alt="" />
      <img src="/img/star-yellow-glitter.png" className={styles.floating7} alt="" />
      <img src="/img/arrow-pink-glitter.png" className={styles.floating8} alt="" />
      <img src="/img/heart-pink-glitter-loveya.png" className={styles.floating9} alt="" />
      <img src="/img/heart-purple-stripe.png" className={styles.floating10} alt="" />
      <img src="/img/computer-glitter.png" className={styles.floating11} alt="" />
      <img src="/img/star-pink-glitter-online.png" className={styles.floating12} alt="" />
      <img src="/img/star-yellow-glitter.png" className={styles.floating13} alt="" />
    </div>
  );
}

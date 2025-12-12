'use client';

import { useMyPaperSettings } from '@/feature/paper/hook/useMyPaperSettings';
import { BG_TEXTURE_OPTIONS } from '@/feature/paper/config/bgTexture';
import styles from './MyPaperSetting.module.css';
import PaperPreviewBoard from '../my-paper/PaperPreviewBoard';
import { findStickerDef, StickerTypeId } from '@/feature/paper/config/stickerCatalog';
import { PaperStickerRow } from '@/entity/paper/type';
import StickerPalette from './StickerPalette';

export default function MyPaperSetting() {
  const {
    items,
    current,
    currentPaperId,
    selectPaper,
    form,
    setForm,
    stickersView,
    addSticker,
    moveSticker,
    loading,
    saving,
    error,
    save,
    resetStickers,
  } = useMyPaperSettings();

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.headerBar}>★ Loading My Rollingpaper Settings… ★</div>
          <div className={styles.body}>불러오는 중… ✶</div>
        </div>
      </div>
    );
  }

  if (!current || !currentPaperId) {
    return (
      <div className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.headerBar}>★ My Rollingpaper Settings ★</div>
          <div className={styles.body}>관리할 롤링페이퍼가 없어요.</div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  const handleResetStickers = async () => {
    const ok = window.confirm('이 롤링페이퍼의 스티커를 모두 삭제할까요?');
    if (!ok) return;
    await resetStickers();
  };

  const currentBg = form.bg_texture || 'cork';

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.headerBar}>
          ★ My Rollingpaper Settings — {current.paper.year}년 {current.paper.title}
        </div>

        <div className={styles.body}>
          {/* 상단: 내가 가진 롤링페이퍼 선택 */}
          <div className={styles.row}>
            <label className={styles.field}>
              <span>관리할 롤링페이퍼 선택</span>
              <select value={currentPaperId ?? ''} onChange={(e) => selectPaper(e.target.value)}>
                {items.map((i) => (
                  <option key={i.paper.id} value={i.paper.id}>
                    {i.paper.year} · {i.paper.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Paper 이름 (title)</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm('title', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>테마 (theme)</span>
              <select
                value={form.theme ?? ''}
                onChange={(e) => setForm('theme', e.target.value === '' ? '' : e.target.value)}
              >
                <option value="">기본</option>
                <option value="retro">레트로 컴퓨터</option>
                <option value="pastel">파스텔 노트</option>
                <option value="dark">다크 모드</option>
              </select>
            </label>

            {/* 🔹 배경 텍스처 팔레트 */}
            <div className={styles.field}>
              <span>배경 텍스처 (bg_texture)</span>
              <div className={styles.textureSection}>
                <div className={styles.texturePreviewLabel}>현재 미리보기</div>

                <PaperPreviewBoard
                  theme={form.theme || 'pink'}
                  bgTexture={currentBg}
                  paperTitle={form.title || 'My Rollingpaper'}
                  stickers={stickersView}
                  onMoveSticker={moveSticker}
                />

                <StickerPalette onPick={(id) => addSticker(id as any)} />

                <div className={styles.textureGroupTitle}>단색</div>
                <div className={styles.textureGrid}>
                  {BG_TEXTURE_OPTIONS.filter((t) => t.group === 'solid').map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`${styles.textureItem} ${
                        currentBg === t.id ? styles.textureItemActive : ''
                      } ${styles[`texture_${t.id}`]}`}
                      onClick={() => setForm('bg_texture', t.id)}
                    >
                      <span className={styles.textureLabel}>{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.textureGroupTitle}>패턴</div>
                <div className={styles.textureGrid}>
                  {BG_TEXTURE_OPTIONS.filter((t) => t.group === 'pattern').map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`${styles.textureItem} ${
                        currentBg === t.id ? styles.textureItemActive : ''
                      } ${styles[`texture_${t.id}`]}`}
                      onClick={() => setForm('bg_texture', t.id)}
                    >
                      <span className={styles.textureLabel}>{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.textureGroupTitle}>기본 코르크</div>
                <div className={styles.textureGrid}>
                  <button
                    type="button"
                    className={`${styles.textureItem} ${
                      currentBg === 'cork' ? styles.textureItemActive : ''
                    } ${styles.texture_cork}`}
                    onClick={() => setForm('bg_texture', 'cork')}
                  >
                    <span className={styles.textureLabel}>코르크</span>
                  </button>
                </div>
              </div>
            </div>

            <label className={styles.checkboxField}>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm('is_published', e.target.checked)}
              />
              <span>공개 상태 (is_published)</span>
            </label>

            {error && <p className={styles.errorText}>{error}</p>}

            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? '★ Saving… ★' : '★ Save Rollingpaper ★'}
            </button>
          </form>

          {/* 스티커 관리 */}
          <div className={styles.stickerBox}>
            <div className={styles.stickerHeader}>
              <span>★ 스티커 관리 (paper_stickers)</span>
              <button
                type="button"
                className={styles.resetStickerBtn}
                onClick={handleResetStickers}
                disabled={saving}
              >
                스티커 모두 삭제
              </button>
            </div>
            <p className={styles.stickerInfo}>
              현재 스티커 개수: {current.stickers.length}개
              <br />* 드래그로 위치/회전 등을 편집하는 에디터는 나중에 붙여도 되고, 지금은 초기화만
              지원해요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

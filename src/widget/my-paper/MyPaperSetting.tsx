'use client';

import { useMyPaperSettings } from '@/feature/paper/hook/useMyPaperSettings';
import { BG_TEXTURE_OPTIONS } from '@/feature/paper/config/bgTexture';
import PaperPreviewBoard from './PaperPreviewBoard';
import styles from './MyPaperSetting.module.css';

export default function MyPaperSetting() {
  const {
    items,
    current,
    currentPaperId,
    selectPaper,
    form,
    setForm,
    loading,
    saving,
    error,
    save,
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

  const rawBg = form.bg_texture || 'texture_cork';

  const isSolid = rawBg.startsWith('solid:');
  const solidColor = isSolid ? rawBg.replace('solid:', '') : '#fff6e0';

  const currentBg = rawBg;

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
                <option value="basic">기본</option>
                <option value="retro">레트로</option>
                <option value="kitsch">키치</option>
                <option value="simple">심플</option>
              </select>
            </label>

            {/* 🔹 배경 텍스처 팔레트 */}
            <div className={styles.field}>
              <span>배경 텍스처 (bg_texture)</span>
              <div className={styles.textureSection}>
                <div className={styles.texturePreviewLabel}>현재 미리보기</div>

                <PaperPreviewBoard
                  theme={form.theme || 'basic'}
                  bgTexture={currentBg}
                  paperTitle={form.title || 'My Rollingpaper'}
                />

                <div className={styles.textureGroupTitle}>단색</div>
                <div className={styles.colorPalette}>
                  {[
                    '#fff6e0', // 크림
                    '#ffe1f0', // 핑크
                    '#e0f0ff', // 하늘
                    '#d6ffd8', // 민트
                    '#fff3b0', // 옐로우
                    '#e9ddff', // 라일락
                    '#ffffff', // 화이트
                    '#1a1a1a', // 다크
                  ].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      className={`${styles.colorSwatch} ${
                        solidColor === hex ? styles.colorSwatchActive : ''
                      }`}
                      style={{ backgroundColor: hex }}
                      onClick={() => setForm('bg_texture', `solid:${hex}`)}
                      aria-label={`bg color ${hex}`}
                    />
                  ))}
                </div>

                {/* ✅ 사용자가 직접 고르기 */}
                <div className={styles.colorPickerRow}>
                  <label className={styles.colorPickerLabel}>
                    <span>직접 선택</span>
                    <input
                      type="color"
                      value={solidColor}
                      onChange={(e) => setForm('bg_texture', `solid:${e.target.value}`)}
                    />
                  </label>

                  <div className={styles.colorHex}>{solidColor.toUpperCase()}</div>
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

                <div className={styles.textureGroupTitle}>텍스쳐</div>
                <div className={styles.textureGrid}>
                  {BG_TEXTURE_OPTIONS.filter((t) => t.group === 'texture').map((t) => (
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
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMyProfile } from '@/feature/profile/hook/useMyProfile';
import { useMyRollingpapers, SentLetterSummary } from '@/feature/profile/hook/useMyRollingpapers';
import styles from './ProfileWindow.module.css';

export default function ProfileWindow() {
  const {
    profile,
    loading,
    saving,
    error,
    form,
    setForm,
    save,
    updateAvatar,
    resetAvatarToDefault,
  } = useMyProfile();

  const {
    myPapers,
    sentLetters,
    receivedThisYearCount,
    sentThisYearCount,
    visitCount,
    loading: rollingLoading,
    updateSentLetter,
    deleteSentLetter,
  } = useMyRollingpapers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await updateAvatar(file);
  };

  const handleAvatarReset = async () => {
    await resetAvatarToDefault();
  };

  const handleEditSentLetter = async (letter: SentLetterSummary) => {
    const next = window.prompt('새 편지 내용을 입력하세요', letter.content);
    if (next == null || next.trim() === '' || next === letter.content) return;
    await updateSentLetter(letter.id, next);
  };

  const handleDeleteSentLetter = async (letterId: string) => {
    const ok = window.confirm('이 편지를 삭제할까요? 삭제 후에는 되돌릴 수 없어요.');
    if (!ok) return;
    await deleteSentLetter(letterId);
  };

  if (loading || rollingLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.profileShell}>
          <div className={styles.headerBar}>★ Loading My Cyber Profile… ★</div>
          <div className={styles.loadingBox}>Loading glitter data… ✧</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <div className={styles.profileShell}>
          <div className={styles.headerBar}>★ My Profile ★</div>
          <p className={styles.errorText}>프로필을 불러올 수 없어요 :(</p>
        </div>
      </div>
    );
  }

  const visitCountLabel = visitCount.toString().padStart(7, '0');
  const currentYear = new Date().getFullYear();
  const thisYearPapers = myPapers.filter((p) => p.year === currentYear);

  return (
    <div className={styles.page}>
      <div className={styles.profileShell}>
        {/* 상단 헤더 영역 */}
        <div className={styles.headerBar}>
          <span>★ {form.display_name || 'My Space'} ✶ Roll-Board Profile ★</span>
        </div>

        {/* 상단 메인 영역 */}
        <div className={styles.topSection}>
          <div className={styles.avatarColumn}>
            <div className={styles.avatarFrame}>
              {/* ✅ 상단 아바타는 "저장된 profile 기준" */}
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" />
              ) : (
                <div className={styles.avatarPlaceholder}>NO AVATAR</div>
              )}
            </div>
            <div className={styles.basicInfoBox}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Display Name</span>
                <span className={styles.infoValue}>{form.display_name || 'Anonymous'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Member Since</span>
                <span className={styles.infoValue}>
                  {profile.created_at?.slice(0, 10) ?? '????-??-??'}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Status</span>
                <span className={styles.infoValue}>★ ONLINE ★</span>
              </div>
            </div>
          </div>

          <div className={styles.greetingColumn}>
            <div className={styles.glitterTitle}>✶ WELCOME TO MY CYBER ROOM ✶</div>
            <p className={styles.introText}>
              {form.intro || '아직 자기소개가 없어요. 나를 소개하는 멋진 한 줄을 적어볼까?'}
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>올해 받은 Letter</span>
                <span className={styles.statValue}>{receivedThisYearCount}개</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>올해 보낸 Letter</span>
                <span className={styles.statValue}>{sentThisYearCount}개</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>방문자 수</span>
                <span className={styles.statValue}>{visitCountLabel}</span>
              </div>
            </div>

            {/* ✅ 올해 롤링페이퍼 상세 컴포넌트 (stats 하단) */}
            <div className={styles.thisYearBox}>
              <div className={styles.thisYearTitle}>★ {currentYear} 나의 롤링페이퍼</div>
              {thisYearPapers.length === 0 ? (
                <p className={styles.thisYearEmpty}>
                  올해 만든 롤링페이퍼가 아직 없어요. 새로운 추억을 시작해볼까요?
                </p>
              ) : (
                <ul className={styles.thisYearList}>
                  {thisYearPapers.map((p) => (
                    <li key={p.id} className={styles.thisYearItem}>
                      <span className={styles.thisYearPaperTitle}>{p.title}</span>
                      <span className={styles.thisYearMeta}>
                        {p.letterCount}개의 편지 · 생성일 {p.createdAt.slice(0, 10)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 메인 2열 그리드: 왼쪽(프로필 편집), 오른쪽(정보) */}
        <div className={styles.mainGrid}>
          {/* 왼쪽: 프로필 편집 */}
          <div className={styles.leftColumn}>
            <div className={styles.box}>
              <div className={styles.boxTitle}>★ Profile Edit</div>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span>Display Name</span>
                  <input
                    type="text"
                    value={form.display_name}
                    onChange={(e) => setForm('display_name', e.target.value)}
                  />
                </label>

                <label className={styles.field}>
                  <span>Avatar</span>
                  <div className={styles.avatarUploadPanel}>
                    <div className={styles.avatarUploadPreview}>
                      {form.avatar_url ? (
                        <img src={form.avatar_url} alt="avatar preview" />
                      ) : (
                        <span>NO AVATAR</span>
                      )}
                    </div>
                    <div className={styles.avatarUploadControls}>
                      <div className={styles.avatarUploadButtons}>
                        <label className={styles.fileButton}>
                          이미지 선택
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className={styles.fileInputHidden}
                          />
                        </label>
                        <button
                          type="button"
                          className={styles.resetAvatarBtn}
                          onClick={handleAvatarReset}
                          disabled={saving}
                        >
                          이미지 초기화
                        </button>
                      </div>
                      <p className={styles.avatarHint}>
                        1:1 비율의 작은 이미지를 추천해요. (최대 약 2MB, JPEG / PNG)
                      </p>
                    </div>
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Intro</span>
                  <textarea
                    rows={4}
                    value={form.intro}
                    onChange={(e) => setForm('intro', e.target.value)}
                    placeholder="마음껏 자기소개를 적어보세요 ✶"
                  />
                </label>

                {error && <p className={styles.errorText}>{error}</p>}

                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? '★ Saving My Space… ★' : '★ Save My Space ★'}
                </button>
              </form>
            </div>
          </div>

          {/* 오른쪽: 롤링페이퍼/편지 정보 */}
          <div className={styles.rightColumn}>
            <div className={styles.box}>
              <div className={styles.boxTitle}>★ About This Space</div>
              <p className={styles.aboutText}>
                이곳은 나만의 Roll✶Board 프로필이에요. 친구들에게 롤링페이퍼를 받고, 추억을 쌓고,
                방명록처럼 남겨둘 수 있는 작은 사이버 방입니다 ✶
              </p>
            </div>

            <div className={styles.box}>
              <div className={styles.boxTitle}>★ 내 롤링페이퍼</div>
              {myPapers.length === 0 ? (
                <p className={styles.emptyText}>아직 생성된 롤링페이퍼가 없어요.</p>
              ) : (
                <ul className={styles.paperList}>
                  {myPapers.map((p) => (
                    <li key={p.id} className={styles.paperItem}>
                      <strong>{p.year}</strong> · {p.title} — <span>{p.letterCount}개의 편지</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.box}>
              <div className={styles.boxTitle}>★ 내가 보낸 Letter</div>
              {sentLetters.length === 0 ? (
                <p className={styles.emptyText}>아직 보낸 편지가 없어요.</p>
              ) : (
                <ul className={styles.paperList}>
                  {sentLetters.slice(0, 10).map((l) => (
                    <li key={l.id} className={styles.paperItem}>
                      <div>
                        [{l.paperYear}] {l.paperTitle} · {l.paperOwnerName} 님에게 ·{' '}
                        {l.createdAt.slice(0, 10)}
                      </div>
                      <div className={styles.sentLetterActions}>
                        <button
                          type="button"
                          onClick={() => handleEditSentLetter(l)}
                          className={styles.smallBtn}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSentLetter(l.id)}
                          className={styles.smallBtnDanger}
                        >
                          삭제
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 하단 가짜 배너 영역 */}
        <div className={styles.bannerStripBottom}>
          <img src="/img/banner-unicorn-diary.png" alt="banner1" />
          <img src="/img/banner-adopt-a-pet.png" alt="banner2" />
          <img src="/img/banner-my-pixeled-world.png" alt="banner3" />
          <img src="/img/banner-red-friends-oly.png" alt="banner4" />
        </div>
      </div>
    </div>
  );
}

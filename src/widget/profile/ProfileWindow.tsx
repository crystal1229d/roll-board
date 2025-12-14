'use client';

import { useMemo } from 'react';
import { useMyProfile } from '@/feature/profile/hook/useMyProfile';
import { useMyRollingpapers, SentLetterSummary } from '@/feature/profile/hook/useMyRollingpapers';
import { useUserProfile } from '@/feature/profile/hook/useUserProfile';
import { useUserRollingpapers } from '@/feature/profile/hook/useUserRollingpapers';
import styles from './ProfileWindow.module.css';

type Props = { mode: 'me' } | { mode: 'user'; userId: string };

export default function ProfileWindow(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define, react/destructuring-assignment
  if (props.mode === 'me') return <ProfileMe />;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define, react/destructuring-assignment
  return <ProfileUser userId={props.userId} />;
}

/* ─────────────────────────────────────────────
 * Shared: Top section UI (너가 원하는 “딱 여기까지만”)
 * 방문자수는 제거
 * ───────────────────────────────────────────── */
type PaperSummary = {
  id: string;
  title: string;
  year: number;
  createdAt: string;
  letterCount: number;
};

type TopSectionProps = {
  currentYear: number;
  profile: { avatar_url: string | null; created_at: string | null };
  form: { display_name: string; intro: string; avatar_url?: string };
  receivedThisYearCount: number;
  sentThisYearCount: number;
  thisYearPapers: PaperSummary[];
};

function ProfileTopSection({
  currentYear,
  profile,
  form,
  receivedThisYearCount,
  sentThisYearCount,
  thisYearPapers,
}: TopSectionProps) {
  return (
    <>
      <div className={styles.headerBar}>
        <span>★ {form.display_name || 'My Space'} ✶ Roll-Board Profile ★</span>
      </div>

      <div className={styles.topSection}>
        <div className={styles.avatarColumn}>
          <div className={styles.avatarFrame}>
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
          </div>

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
    </>
  );
}

/* ─────────────────────────────────────────────
 * User mode: TopSection까지만 보여주기
 * ───────────────────────────────────────────── */
function ProfileUser({ userId }: { userId: string }) {
  const currentYear = new Date().getFullYear();

  const { profile, form, loading, error } = useUserProfile(userId);
  const userRolling = useUserRollingpapers(userId);

  const receivedThisYearCount = userRolling.receivedThisYearCount ?? 0;
  const sentThisYearCount = userRolling.sentThisYearCount ?? 0;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const papers = userRolling.papers ?? [];
  const thisYearPapers = useMemo(
    () => papers.filter((p) => p.year === currentYear),
    [papers, currentYear],
  );

  if (loading || userRolling.loading) {
    return (
      <div className={styles.page}>
        <div className={styles.profileShell}>
          <div className={styles.headerBar}>★ Loading Cyber Profile… ★</div>
          <div className={styles.loadingBox}>Loading glitter data… ✧</div>
        </div>
      </div>
    );
  }

  if (!profile || !form) {
    return (
      <div className={styles.page}>
        <div className={styles.profileShell}>
          <div className={styles.headerBar}>★ Profile ★</div>
          <p className={styles.errorText}>
            {error || userRolling.error || '프로필을 불러올 수 없어요 :('}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.profileShell}>
        <ProfileTopSection
          currentYear={currentYear}
          profile={profile}
          form={form}
          receivedThisYearCount={receivedThisYearCount}
          sentThisYearCount={sentThisYearCount}
          thisYearPapers={thisYearPapers}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Me mode: TopSection + 편집/내가보낸편지 유지
 * ───────────────────────────────────────────── */
function ProfileMe() {
  const currentYear = new Date().getFullYear();

  const meProfile = useMyProfile();
  const meRolling = useMyRollingpapers();

  const {
    profile,
    form,
    loading,
    saving,
    error,
    setForm,
    save,
    updateAvatar,
    resetAvatarToDefault,
  } = meProfile;

  const {
    myPapers,
    sentLetters,
    receivedThisYearCount,
    sentThisYearCount,
    loading: rollingLoading,
    updateSentLetter,
    deleteSentLetter,
  } = meRolling;

  const thisYearPapers = useMemo(
    () => (myPapers ?? []).filter((p) => p.year === currentYear),
    [myPapers, currentYear],
  );

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

  if (!profile || !form) {
    return (
      <div className={styles.page}>
        <div className={styles.profileShell}>
          <div className={styles.headerBar}>★ My Profile ★</div>
          <p className={styles.errorText}>{error || '프로필을 불러올 수 없어요 :('}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await updateAvatar(e.target.files[0]);
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

  return (
    <div className={styles.page}>
      <div className={styles.profileShell}>
        <ProfileTopSection
          currentYear={currentYear}
          profile={profile}
          form={form}
          receivedThisYearCount={receivedThisYearCount ?? 0}
          sentThisYearCount={sentThisYearCount ?? 0}
          thisYearPapers={thisYearPapers}
        />

        {/* me 전용 UI */}
        <div className={styles.mainGrid}>
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
                          onClick={resetAvatarToDefault}
                          disabled={saving}
                        >
                          이미지 초기화
                        </button>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={styles.field}>
                  <span>Intro</span>
                  <textarea
                    rows={4}
                    value={form.intro}
                    onChange={(e) => setForm('intro', e.target.value)}
                  />
                </label>

                {error && <p className={styles.errorText}>{error}</p>}

                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? '★ Saving My Space… ★' : '★ Save My Space ★'}
                </button>
              </form>
            </div>
          </div>

          <div className={styles.rightColumn}>
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
                        [{l.paperYear}] {l.paperTitle} · {l.paperOwnerName} ·{' '}
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

        <div className={styles.bannerStripBottom}>
          <img src="/img/banner/banner-unicorn-diary.png" alt="banner1" />
          <img src="/img/banner/banner-adopt-a-pet.png" alt="banner2" />
          <img src="/img/banner/banner-my-pixeled-world.png" alt="banner3" />
          <img src="/img/banner/banner-red-friends-oly.png" alt="banner4" />
        </div>
      </div>
    </div>
  );
}

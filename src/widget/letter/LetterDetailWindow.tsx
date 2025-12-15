'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLetterDetail } from '@/feature/paper/hook/useLetterDetail';
import { useDesktopStore } from '@/feature/desktop/model/useDesktopStore';
import { useMyUserId } from '@/shared/hook/useMyUserId';
import styles from './LetterDetailWindow.module.css';

type Props = {
  letterId: string;
  paperSlug: string;
  windowId: string;
};

export default function LetterDetailWindow({ letterId, windowId }: Props) {
  const myUserId = useMyUserId();
  const { letter, loading, error, saving, deleting, updateContent, deleteLetter } =
    useLetterDetail(letterId);

  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const notifyPaperChanged = useDesktopStore((s) => s.notifyPaperChanged);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (letter?.content != null) setDraft(letter.content);
  }, [letter]);

  const writerLabel = useMemo(() => {
    if (!letter) return '';
    if (letter.is_anonymous) return 'Anonymous';
    return letter.writer?.display_name ?? letter.writer_name ?? 'Unknown';
  }, [letter]);

  const canEdit = !!letter && !!myUserId && letter.writer_id === myUserId;

  const handleSave = async () => {
    const next = draft.trim();
    if (next.length < 2) return;
    const ok = await updateContent(next);
    if (!ok) return;
    notifyPaperChanged(); // ✅ 핀/리스트 즉시 갱신(다음 fetch에서 반영)
    setEditing(false);
  };

  const handleDelete = async () => {
    const okConfirm = window.confirm('이 편지를 삭제할까요? 삭제 후에는 되돌릴 수 없어요.');
    if (!okConfirm) return;

    const ok = await deleteLetter();
    if (!ok) return;

    notifyPaperChanged(); // ✅ 핀/리스트 즉시 제거
    closeWindow(windowId); // ✅ 상세창 닫기
  };

  if (loading) {
    return <div className={styles.wrap}>불러오는 중…</div>;
  }

  if (error || !letter) {
    return (
      <div className={styles.wrap}>
        <div className={styles.errorBox}>⚠ {error ?? '편지를 찾을 수 없어요.'}</div>
        <button type="button" className={styles.btn} onClick={() => closeWindow(windowId)}>
          닫기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div className={styles.title}>📌 {letter.teaser_title ?? 'LETTER'}</div>
        <div className={styles.meta}>
          <span>{writerLabel}</span>
          <span className={styles.dim}>{letter.created_at?.slice(0, 10) ?? ''}</span>
        </div>
      </div>

      {!editing ? (
        <div className={styles.content}>{letter.content}</div>
      ) : (
        <textarea
          className={styles.textarea}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={10}
        />
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={() => closeWindow(windowId)}>
          닫기
        </button>

        {canEdit && !editing && (
          <button type="button" className={styles.btnPrimary} onClick={() => setEditing(true)}>
            수정
          </button>
        )}

        {canEdit && editing && (
          <>
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                setDraft(letter.content);
                setEditing(false);
              }}
              disabled={saving}
            >
              취소
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleSave}
              disabled={saving || draft.trim().length < 2}
            >
              {saving ? '저장 중…' : '저장'}
            </button>
          </>
        )}

        {canEdit && (
          <button
            type="button"
            className={styles.btnDanger}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? '삭제 중…' : '삭제'}
          </button>
        )}
      </div>
    </div>
  );
}

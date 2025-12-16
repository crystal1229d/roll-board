'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLetterEditor, type LetterEditDraft } from '@/feature/letter/hook/useLetterEditor';
import { LetterEditorPanel } from '@/feature/letter/ui/LetterEditorPanel';
import { LetterPaper } from '@/entity/letter/ui/LetterPaper';

type Props = { letterId: string };

const isSame = (a: LetterEditDraft, b: LetterEditDraft) =>
  a.content === b.content &&
  a.teaserTitle === b.teaserTitle &&
  a.teaserStickerType === b.teaserStickerType &&
  a.isAnonymous === b.isAnonymous &&
  a.style.noteColor === b.style.noteColor &&
  a.style.textColor === b.style.textColor &&
  a.style.pattern === b.style.pattern &&
  a.style.fontFamily === b.style.fontFamily &&
  JSON.stringify(a.stickers) === JSON.stringify(b.stickers);

export default function LetterDetailContent({ letterId }: Props) {
  const { loading, saving, error, letter, canEdit, getInitialDraft, saveDraft } =
    useLetterEditor(letterId);

  const [base, setBase] = useState<LetterEditDraft | null>(null);
  const [draft, setDraft] = useState<LetterEditDraft | null>(null);

  // 서버 스냅샷 로드 후 draft 초기화
  useEffect(() => {
    const init = getInitialDraft();
    setBase(init);
    setDraft(init ? JSON.parse(JSON.stringify(init)) : null);
  }, [getInitialDraft]);

  const dirty = useMemo(() => {
    if (!base || !draft) return false;
    return !isSame(base, draft);
  }, [base, draft]);

  const onSave = async () => {
    if (!draft) return;
    const ok = await saveDraft(draft);
    if (ok) {
      // saveDraft 내부에서 reload 후 getInitialDraft가 갱신되지만,
      // UX상 즉시 dirty false를 만들기 위해 로컬도 갱신
      setBase(JSON.parse(JSON.stringify(draft)));
    }
  };

  if (loading) return <div>불러오는 중…</div>;
  if (error || !letter || !draft) return <div>⚠ {error ?? '편지를 찾을 수 없어요.'}</div>;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 14,
        alignItems: 'start',
      }}
    >
      {/* LEFT */}
      <div style={{ minWidth: 0 }}>
        <LetterPaper
          content={draft.content}
          style={draft.style}
          stickers={draft.stickers}
          editable={canEdit}
          onChangeContent={(v) => setDraft((p) => (p ? { ...p, content: v } : p))}
          onMoveSticker={(id, patch) =>
            setDraft((p) =>
              p
                ? { ...p, stickers: p.stickers.map((s) => (s.id === id ? { ...s, ...patch } : s)) }
                : p,
            )
          }
          onRemoveSticker={(id) =>
            setDraft((p) => (p ? { ...p, stickers: p.stickers.filter((s) => s.id !== id) } : p))
          }
          teaserPreview={{
            title: draft.teaserTitle,
            stickerType: draft.teaserStickerType,
            writerName: draft.isAnonymous ? '발신자 불명' : letter.writerName,
          }}
        />
      </div>

      {/* RIGHT */}
      {canEdit ? (
        <div style={{ display: 'grid', gap: 10 }}>
          <LetterEditorPanel
            style={draft.style}
            onChangeStyle={(patch) =>
              setDraft((p) => (p ? { ...p, style: { ...p.style, ...patch } } : p))
            }
            onAddSticker={(stickerType) =>
              setDraft((p) => {
                if (!p) return p;
                const id = crypto.randomUUID();
                const type = (stickerType ?? 'default') as any;
                return {
                  ...p,
                  stickers: [
                    ...p.stickers,
                    { id, stickerType: type, x: 70, y: 20, rotation: 0, scale: 1 },
                  ],
                };
              })
            }
            teaserTitle={draft.teaserTitle}
            teaserStickerType={draft.teaserStickerType}
            onChangeTeaser={(patch) =>
              setDraft((p) =>
                p
                  ? {
                      ...p,
                      teaserTitle: patch.teaserTitle ?? p.teaserTitle,
                      teaserStickerType:
                        patch.teaserStickerType !== undefined
                          ? (patch.teaserStickerType as any)
                          : p.teaserStickerType,
                    }
                  : p,
              )
            }
            isAnonymous={draft.isAnonymous}
            onChangeWriterMeta={(patch) =>
              setDraft((p) => (p ? { ...p, isAnonymous: patch.isAnonymous ?? p.isAnonymous } : p))
            }
          />

          {/* Save Bar */}
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              border: '2px solid #000',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '6px 6px 0 rgba(0,0,0,0.20)',
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.85 }}>
              {dirty ? '변경사항이 있어요' : '저장된 상태예요'}
            </div>

            <button
              type="button"
              onClick={onSave}
              disabled={!dirty || saving}
              style={{
                border: '2px solid #000',
                borderRadius: 12,
                padding: '10px 12px',
                fontWeight: 900,
                cursor: !dirty || saving ? 'default' : 'pointer',
                opacity: !dirty || saving ? 0.6 : 1,
                boxShadow: '2px 2px 0 #000',
                background:
                  !dirty || saving
                    ? '#eee'
                    : 'linear-gradient(180deg, #ffeafc, #ffb7f5 50%, #ffdffb 100%)',
              }}
            >
              {saving ? '저장 중…' : '저장'}
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            border: '2px dashed #000',
            borderRadius: 14,
            padding: 16,
            fontWeight: 900,
            fontSize: 13,
            opacity: 0.7,
          }}
        >
          ✋ 작성자만 편집할 수 있어요
        </div>
      )}
    </div>
  );
}

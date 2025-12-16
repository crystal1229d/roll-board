'use client';

import { useState } from 'react';
import { useLetterEditor } from '@/feature/letter/hook/useLetterEditor';
import { LetterEditorPanel } from '@/feature/letter/ui/LetterEditorPanel';
import { LetterPaper } from '@/entity/letter/ui/LetterPaper';

type Props = {
  letterId: string;
};

export default function LetterDetailContent({ letterId }: Props) {
  const {
    loading,
    error,
    letter,
    canEdit,

    style,
    stickers,

    updateContent,
    updateTeaser,
    updateStyle,

    addSticker,
    updateSticker,
    removeSticker,
  } = useLetterEditor(letterId);

  const [draft, setDraft] = useState('');

  if (loading) {
    return <div>불러오는 중…</div>;
  }

  if (error || !letter) {
    return <div>⚠ {error ?? '편지를 찾을 수 없어요.'}</div>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 14,
        alignItems: 'start',
      }}
    >
      {/* 📄 LEFT: 편지지 */}
      <LetterPaper
        content={draft || letter.content}
        style={style}
        stickers={stickers}
        editable={canEdit}
        onChangeContent={(v) => {
          setDraft(v);
          updateContent(v);
        }}
        onMoveSticker={(id, patch) => updateSticker(id, patch)}
        onRemoveSticker={(id) => removeSticker(id)}
      />

      {/* 🎨 RIGHT: 편집 패널 */}
      {canEdit ? (
        <LetterEditorPanel
          style={style}
          onChangeStyle={(patch) => updateStyle(patch)}
          onAddSticker={(type) => addSticker(type)}
          teaserTitle={letter.teaser_title}
          teaserStickerType={letter.teaser_sticker_type}
          onChangeTeaser={(patch) => updateTeaser(patch)}
        />
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

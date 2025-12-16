'use client';

import LetterComposer from '@/widget/letter/LetterComposer';
import { useDesktopStore } from '@/feature/desktop/model/useDesktopStore';

type Props = {
  paperId: string;
  paperTitle: string;
  windowId: string;
};

export default function LetterComposerWindow({ paperId, paperTitle, windowId }: Props) {
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const notifyPaperChanged = useDesktopStore((s) => s.notifyPaperChanged);

  return (
    <LetterComposer
      paperId={paperId}
      paperTitle={paperTitle}
      onClose={() => closeWindow(windowId)}
      onSaved={() => {
        notifyPaperChanged();
      }}
    />
  );
}

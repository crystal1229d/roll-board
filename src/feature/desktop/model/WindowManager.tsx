'use client';

import { useDesktopStore } from './useDesktopStore';
import PaperWindow from '@/widget/paper/PaperWindow';
import PaperDetailWindow from '@/widget/paper/PaperDetailWindow';
import ProfileWindow from '@/widget/profile/ProfileWindow';
import MessageWindow from '@/widget/message/MessageWindow';
import LetterComposerWindow from '@/widget/letter/LetterComposerWindow';
import LetterDetailWindow from '@/widget/letter/LetterDetailWindow';
import DesktopWindow from '../ui/DesktopWindow';

export default function WindowManager() {
  const windows = useDesktopStore((s) => s.windows);

  return (
    <div className="window-manager">
      {windows
        .filter((w) => !w.minimized)
        .map((w) => {
          const p = w.payload;
          let content: React.ReactNode = null;

          switch (p.type) {
            case 'board':
              content = <PaperWindow />;
              break;

            case 'paper':
              content = <PaperDetailWindow paperSlug={p.paperSlug} />;
              break;

            case 'profile':
              content =
                p.mode === 'me' ? (
                  <ProfileWindow mode="me" />
                ) : (
                  <ProfileWindow mode="user" userId={p.userId} />
                );
              break;

            case 'message':
              content = <MessageWindow />;
              break;

            case 'letterComposer':
              content = (
                <LetterComposerWindow
                  paperId={p.paperId}
                  paperTitle={p.paperTitle}
                  paperSlug={p.paperSlug}
                  windowId={w.id}
                />
              );
              break;

            case 'letterDetail':
              content = (
                <LetterDetailWindow letterId={p.letterId} paperSlug={p.paperSlug} windowId={w.id} />
              );
              break;

            default:
              content = <div>Unknown window</div>;
          }

          return (
            <DesktopWindow key={w.id} win={w}>
              {content}
            </DesktopWindow>
          );
        })}
    </div>
  );
}

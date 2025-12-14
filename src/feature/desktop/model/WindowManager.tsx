'use client';

import ProfileWindow from '@/widget/profile/ProfileWindow';
import MessageWindow from '@/widget/message/MessageWindow';
import PaperWindow from '@/widget/paper/PaperWindow';
import PaperDetailWindow from '@/widget/paper/PaperDetailWindow';
import DesktopWindow from '../ui/DesktopWindow';
import { useDesktopStore } from './useDesktopStore';

export default function WindowManager() {
  const windows = useDesktopStore((s) => s.windows);

  return (
    <div className="window-manager">
      {windows
        .filter((w) => !w.minimized)
        .map((w) => {
          let content = null;
          if (w.type === 'board') content = <PaperWindow />;

          if (w.type === 'paper') {
            const slug = w.payload?.paperSlug;
            content = slug ? <PaperDetailWindow paperSlug={slug} /> : <div>잘못된 paperSlug</div>;
          }

          if (w.type === 'profile') {
            const userId = w.payload?.userId;
            content = userId ? (
              <ProfileWindow mode="user" userId={userId} />
            ) : (
              <ProfileWindow mode="me" />
            );
          }

          if (w.type === 'message') content = <MessageWindow />;

          return (
            <DesktopWindow key={w.id} win={w}>
              {content}
            </DesktopWindow>
          );
        })}
    </div>
  );
}

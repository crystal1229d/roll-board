'use client';

import { useDesktopStore } from './useDesktopStore';
import ProfileWindow from '@/widget/profile/ProfileWindow';
import MessageWindow from '@/widget/message/MessageWindow';
import DesktopWindow from '../ui/DesktopWindow';
import PaperWindow from '@/widget/paper/PaperWindow';

export default function WindowManager() {
  const windows = useDesktopStore((s) => s.windows);

  return (
    <div className="window-manager">
      {windows
        .filter((w) => !w.minimized)
        .map((w) => {
          let content = null;
          if (w.type === 'board') content = <PaperWindow />;
          if (w.type === 'profile') content = <ProfileWindow />;
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

'use client';

import BoardWindow from '@/widget/board/Boardwindow';
import { useDesktopStore } from './useDesktopStore';
import ProfileWindow from '@/widget/profile/ProfileWindow';
import MessageWindow from '@/widget/message/MessageWindow';
import DesktopWindow from '../ui/DesktopWindow';

export default function WindowManager() {
  const windows = useDesktopStore((s) => s.windows);

  return (
    <>
      {windows.map((w) => {
        let content = null;
        if (w.type === 'board') content = <BoardWindow />;
        if (w.type === 'profile') content = <ProfileWindow />;
        if (w.type === 'message') content = <MessageWindow />;

        return (
          <>
            {windows
              .filter((w) => !w.minimized)
              .map((w) => {
                let content = null;
                if (w.type === 'board') content = <BoardWindow />;
                if (w.type === 'profile') content = <ProfileWindow />;
                if (w.type === 'message') content = <MessageWindow />;

                return (
                  <DesktopWindow key={w.id} win={w}>
                    {content}
                  </DesktopWindow>
                );
              })}
          </>
        );
      })}
    </>
  );
}

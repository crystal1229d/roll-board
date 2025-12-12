import WindowManager from '@/feature/desktop/model/WindowManager';
import Taskbar from '@/feature/desktop/ui/Taskbar';
import './layout.module.css';

export default function MainLayout({ children }: any) {
  return (
    <div className="main-root">
      {children}
      <WindowManager />
      <Taskbar />
    </div>
  );
}

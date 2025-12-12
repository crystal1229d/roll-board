type WindowKey = 'board' | 'profile' | 'message';

type DesktopState = {
  openWindows: WindowKey[];
  open: (key: WindowKey) => void;
  close: (key: WindowKey) => void;
};

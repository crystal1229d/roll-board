export type DesktopAppId =
  | 'profile'
  | 'board'
  | 'paper'
  | 'message'
  | 'info'
  | 'recycle'
  | 'logout';

export interface DesktopApp {
  id: DesktopAppId;
  label: string; // 바탕화면 아이콘에 보이는 이름
  subLabel?: string; // Board ↵ Explorer 같이 두 줄 쓰고 싶을 때
  iconSrc: string;
  iconWidth: number;
  showOnDesktop: boolean;
  showInStartMenu: boolean;
  startMenuLabel?: string; // Start 메뉴에서 보이는 텍스트 (없으면 label 사용)
}

export const DESKTOP_APPS: DesktopApp[] = [
  {
    id: 'profile',
    label: 'My Profile',
    iconSrc: '/icon/computer.png',
    iconWidth: 40,
    showOnDesktop: true,
    showInStartMenu: true,
    startMenuLabel: 'My Profile',
  },
  {
    id: 'board',
    label: 'Board',
    subLabel: 'Explorer',
    iconSrc: '/icon/globe.png',
    iconWidth: 35,
    showOnDesktop: true,
    showInStartMenu: true,
    startMenuLabel: 'Board Explorer',
  },
  {
    id: 'message',
    label: 'Message',
    iconSrc: '/icon/mail.png',
    iconWidth: 35,
    showOnDesktop: true,
    showInStartMenu: true,
    startMenuLabel: 'Message',
  },
  {
    id: 'info',
    label: 'Info',
    iconSrc: '/icon/lightbulb.png',
    iconWidth: 35,
    showOnDesktop: true,
    showInStartMenu: false,
  },
  {
    id: 'recycle',
    label: 'Recycle Bin',
    iconSrc: '/icon/recycle-bin.png',
    iconWidth: 45,
    showOnDesktop: true,
    showInStartMenu: true,
    startMenuLabel: 'Recycle Bin',
  },
  {
    id: 'logout',
    label: 'Logout',
    iconSrc: '/icon/shutdown.png',
    iconWidth: 20,
    showOnDesktop: false,
    showInStartMenu: true,
  },
];

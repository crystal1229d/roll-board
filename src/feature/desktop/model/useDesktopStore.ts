'use client';

import { create } from 'zustand';
import type { DesktopAppId } from '../config/app';

export type WindowPayload =
  | { type: 'board' }
  | { type: 'paper'; paperSlug: string }
  | { type: 'profile'; mode: 'me' }
  | { type: 'profile'; mode: 'user'; userId: string }
  | { type: 'message' }
  | { type: 'letterComposer'; paperId: string; paperTitle: string; paperSlug: string }
  | { type: 'letterDetail'; letterId: string; paperSlug: string };

export type WindowType = WindowPayload['type'];

export type DesktopWindowState = {
  id: string;
  type: WindowType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  payload: WindowPayload;
};

type DesktopStore = {
  windows: DesktopWindowState[];
  highestZ: number;

  // ✅ paper detail 같은 곳에서 “저장 후 갱신” 트리거로 쓰는 tick
  paperRefreshNonce: number;
  notifyPaperChanged: () => void;

  openWindow: (payload: WindowPayload) => void;
  openApp: (appId: DesktopAppId) => void;

  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
};

const makeTitle = (payload: WindowPayload) => {
  switch (payload.type) {
    case 'board':
      return 'Board';
    case 'paper':
      return 'Rollingpaper';
    case 'profile':
      return payload.mode === 'me' ? 'My Profile' : 'Profile';
    case 'message':
      return 'Messages';
    case 'letterComposer':
      return 'Write Letter';
    case 'letterDetail':
      return 'Letter';
    default:
      return 'Window';
  }
};

const makeSize = (payload: WindowPayload) => {
  switch (payload.type) {
    case 'letterComposer':
      return { width: 780, height: 520 };
    case 'paper':
      return { width: 860, height: 560 };
    default:
      return { width: 520, height: 420 };
  }
};

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],
  highestZ: 1,
  paperRefreshNonce: 0,

  notifyPaperChanged: () => set((s) => ({ paperRefreshNonce: s.paperRefreshNonce + 1 })),

  openApp: (appId) => {
    // ✅ 아이콘 클릭은 여기서 payload로 변환
    if (appId === 'profile') get().openWindow({ type: 'profile', mode: 'me' });
    else if (appId === 'board') get().openWindow({ type: 'board' });
    else if (appId === 'message') get().openWindow({ type: 'message' });
    else {
      // info/recycle/logout 등은 추후 구현
      console.warn('Not implemented app:', appId);
    }
  },

  openWindow: (payload) =>
    set((state) => {
      // “같은 타입 + 같은 대상”이면 기존 창 포커스
      const existing = state.windows.find((w) => {
        if (w.type !== payload.type) return false;

        if (payload.type === 'paper') {
          return w.payload.type === 'paper' && w.payload.paperSlug === payload.paperSlug;
        }
        if (payload.type === 'letterComposer') {
          return w.payload.type === 'letterComposer' && w.payload.paperId === payload.paperId;
        }
        if (payload.type === 'letterDetail') {
          return w.payload.type === 'letterDetail' && w.payload.letterId === payload.letterId;
        }
        if (payload.type === 'profile') {
          if (payload.mode === 'me') return w.payload.type === 'profile' && w.payload.mode === 'me';
          return (
            w.payload.type === 'profile' &&
            w.payload.mode === 'user' &&
            w.payload.userId === payload.userId
          );
        }
        return true; // board/message는 1개만
      });

      const nextZ = state.highestZ + 1;

      if (existing) {
        return {
          windows: state.windows.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, zIndex: nextZ } : w,
          ),
          highestZ: nextZ,
        };
      }

      const id = Date.now().toString();
      const size = makeSize(payload);

      return {
        windows: [
          ...state.windows,
          {
            id,
            type: payload.type,
            title: makeTitle(payload),
            x: 100 + state.windows.length * 20,
            y: 80 + state.windows.length * 20,
            width: size.width,
            height: size.height,
            zIndex: nextZ,
            minimized: false,
            maximized: false,
            payload,
          },
        ],
        highestZ: nextZ,
      };
    }),

  closeWindow: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),

  bringToFront: (id) =>
    set((s) => {
      const z = s.highestZ + 1;
      return {
        windows: s.windows.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
        highestZ: z,
      };
    }),

  moveWindow: (id, x, y) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)) })),

  toggleMinimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
    })),

  toggleMaximize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    })),

  resizeWindow: (id, width, height) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, width, height } : w)) })),
}));

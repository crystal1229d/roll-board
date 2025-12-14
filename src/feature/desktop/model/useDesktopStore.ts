'use client';

import { create } from 'zustand';
import { DesktopAppId } from '../config/app';

type WindowType = DesktopAppId;

export type DesktopWindowPayload = {
  mode?: 'me' | 'user';
  userId?: string;
  paperSlug?: string;
};

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

  payload?: DesktopWindowPayload;
};

type DesktopStore = {
  windows: DesktopWindowState[];
  highestZ: number;

  openWindow: (type: DesktopAppId, payload?: DesktopWindowPayload) => void;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;

  moveWindow: (id: string, x: number, y: number) => void;

  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;

  resizeWindow: (id: string, width: number, height: number) => void;
};

export const useDesktopStore = create<DesktopStore>((set) => ({
  windows: [],
  highestZ: 1,

  openWindow: (type, payload) =>
    set((state) => {
      const existing = state.windows.find((w) => w.type === type);

      if (existing) {
        const newHighestZ = state.highestZ + 1;
        return {
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? {
                  ...w,
                  minimized: false,
                  zIndex: newHighestZ,
                  payload: payload ?? w.payload,
                }
              : w,
          ),
          highestZ: newHighestZ,
        };
      }

      let title = 'Window';
      if (type === 'board') title = 'Board';
      if (type === 'profile') title = payload?.mode === 'user' ? 'Profile' : 'My Profile';
      if (type === 'message') title = 'Messages';

      const id = Date.now().toString();

      return {
        windows: [
          ...state.windows,
          {
            id,
            type,
            title,
            x: 100 + state.windows.length * 20,
            y: 80 + state.windows.length * 20,
            width: 420,
            height: 360,
            zIndex: state.highestZ + 1,
            minimized: false,
            maximized: false,
            payload,
          },
        ],
        highestZ: state.highestZ + 1,
      };
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  bringToFront: (id) =>
    set((state) => {
      const z = state.highestZ + 1;
      return {
        windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
        highestZ: z,
      };
    }),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  toggleMinimize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
    })),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    })),

  resizeWindow: (id, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, width, height } : w)),
    })),
}));

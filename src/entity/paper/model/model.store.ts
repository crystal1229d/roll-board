import { create } from 'zustand';
import type { Paper } from '../type';

interface PaperStore {
  currentPaper: Paper | null;
  setPaper: (paper: Paper) => void;
  clear: () => void;
}

export const usePaperStore = create<PaperStore>((set) => ({
  currentPaper: null,
  setPaper: (paper) => set({ currentPaper: paper }),
  clear: () => set({ currentPaper: null }),
}));

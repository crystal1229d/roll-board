import { create } from 'zustand';
import type { Letter } from '../type';

interface LetterStore {
  myLetter: Letter | null;
  setLetter: (letter: Letter) => void;
  clear: () => void;
}

export const useLetterStore = create<LetterStore>((set) => ({
  myLetter: null,
  setLetter: (letter) => set({ myLetter: letter }),
  clear: () => set({ myLetter: null }),
}));

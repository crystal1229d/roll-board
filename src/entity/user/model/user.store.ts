import { create } from 'zustand';

interface UserStore {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  clearUser: () => set({ userId: null }),
}));

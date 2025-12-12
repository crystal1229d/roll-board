// src/feature/board/hook/useBoardUsers.ts
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/feature/auth/hook/useAuth';

export type BoardUser = {
  id: string;
  name: string;
  avatarUrl: string;
  tagline: string;
  receivedNotes: number;
  /** 현재 로그인한 사용자가 이 사람에게 쪽지를 보냈는지 여부 */
  hasSentNoteFromMe: boolean;
};

type UseBoardUsersState = {
  users: BoardUser[];
  loading: boolean;
  error: string | null;
};

const MOCK_USERS: BoardUser[] = [
  {
    id: '1',
    name: 'THENCE BEAR',
    avatarUrl: '/img/profile-bear.png',
    tagline: 'Always be happy :)',
    receivedNotes: 12,
    hasSentNoteFromMe: true,
  },
  {
    id: '2',
    name: 'GLITTER GIRL',
    avatarUrl: '/img/profile-girl.png',
    tagline: 'CTRL + FUN + DEL STRESS',
    receivedNotes: 8,
    hasSentNoteFromMe: false,
  },
  {
    id: '3',
    name: 'CYBER DOG',
    avatarUrl: '/img/profile-dog.png',
    tagline: 'Welcome to my e-hug zone',
    receivedNotes: 20,
    hasSentNoteFromMe: true,
  },
  {
    id: '4',
    name: 'PINK RABBIT',
    avatarUrl: '/img/profile-rabbit.png',
    tagline: 'Full day of glitter mail',
    receivedNotes: 3,
    hasSentNoteFromMe: false,
  },
];

export function useBoardUsers() {
  const { user } = useAuth(); // 필요 없으면 나중에 제거해도 됨.
  const [state, setState] = useState<UseBoardUsersState>({
    users: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        // TODO: 실제 API 연동 시 이 부분을 fetch 로 교체
        // const res = await fetch('/api/board-users');
        // if (!res.ok) throw new Error('Failed to load users');
        // const data: BoardUser[] = await res.json();

        const data = MOCK_USERS;

        if (!ignore) {
          setState({
            users: data,
            loading: false,
            error: null,
          });
        }
      } catch (e: any) {
        if (!ignore) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: e?.message ?? 'Something went wrong',
          }));
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  return state;
}

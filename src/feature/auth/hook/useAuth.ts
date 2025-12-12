'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import { useUserStore } from '@/entity/user/model/user.store';

export function useAuth() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const { setUserId, clearUser } = useUserStore();

  const [user, setUser] = useState<User | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!user;

  /** 현재 유저 정보 가져오기 */
  const fetchUser = useCallback(async () => {
    try {
      // 1) 세션 확인
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(sessionError);
        setUser(null);
        clearUser();
        return;
      }

      // 세션이 아예 없으면(로그인 안 된 상태)
      if (!session) {
        setUser(null);
        clearUser();
        return;
      }

      // 2) 세션이 있을 때만 getUser 호출
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        setUser(null);
        clearUser();
        return;
      }

      if (user) {
        setUser(user);
        setUserId(user.id);
      } else {
        setUser(null);
        clearUser();
      }
    } catch (e) {
      console.error(e);
      setUser(null);
      clearUser();
    }
  }, [supabase, setUserId, clearUser]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  /** Google OAuth 로그인 */
  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoadingLogin(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO,
        },
      });

      if (error) {
        console.error(error);
        setError('로그인에 실패했어요. 잠시 후 다시 시도해주세요.');
        setLoadingLogin(false);
      }
      // 성공 시에는 Supabase가 redirect 처리하므로 여기서 추가 작업 거의 없음
    } catch (e) {
      console.error(e);
      setError('예상치 못한 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setLoadingLogin(false);
    }
  }, [supabase]);

  /** 로그아웃 */
  const logout = useCallback(async () => {
    try {
      setError(null);
      setLoadingLogout(true);

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
        setError('로그아웃에 실패했어요. 잠시 후 다시 시도해주세요.');
        setLoadingLogout(false);
        return;
      }

      setUser(null);
      clearUser();
      setLoadingLogout(false);
      router.push('/');
    } catch (e) {
      console.error(e);
      setError('예상치 못한 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setLoadingLogout(false);
    }
  }, [router, supabase, clearUser]);

  return {
    user,
    isLoggedIn,
    loadingLogin,
    loadingLogout,
    error,
    loginWithGoogle,
    logout,
    refetchUser: fetchUser,
  };
}

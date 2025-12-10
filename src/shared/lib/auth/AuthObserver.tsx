'use client';

import { useEffect } from 'react';
import { createSupabaseBrowserClient } from '../supabase/supabase-client';
import { useUserStore } from '@/entity/user/model/user.store';

export default function AuthObserver() {
  const setUserId = useUserStore((s) => s.setUserId);
  const clearUser = useUserStore((s) => s.clearUser);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.id) {
        setUserId(user.id);
      } else {
        clearUser();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        clearUser();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUserId, clearUser]);

  return null;
}

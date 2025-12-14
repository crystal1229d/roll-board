'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import { ProfileRow } from '@/entity/user/type';

type UserProfileForm = {
  display_name: string;
  intro: string;
  avatar_url: string;
};

export function useUserProfile(userId: string) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [form, setForm] = useState<UserProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: sbError } = await supabase
          .from('profiles')
          .select('id, display_name, intro, avatar_url, created_at')
          .eq('id', userId)
          .maybeSingle()
          .returns<ProfileRow>();

        if (sbError) throw sbError;

        if (!data) {
          setProfile(null);
          setForm(null);
          return;
        }

        setProfile(data);
        setForm({
          display_name: data.display_name ?? '',
          intro: data.intro ?? '',
          avatar_url: data.avatar_url ?? '',
        });
      } catch (e) {
        setError((e as Error).message);
        setProfile(null);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [supabase, userId]);

  return { profile, form, loading, error };
}

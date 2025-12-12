'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { ProfileRow, ProfileUpdate } from '@/entity/user/type';
import { fetchMyProfileClient, updateProfileClient } from '@/entity/user/api';

export function useMyProfile() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setFormState] = useState({
    display_name: '',
    intro: '',
    avatar_url: '',
  });

  const syncForm = useCallback((p: ProfileRow | null) => {
    if (!p) return;
    setFormState({
      display_name: p.display_name ?? '',
      intro: p.intro ?? '',
      avatar_url: p.avatar_url ?? '',
    });
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const myProfile = await fetchMyProfileClient(supabase);

      if (!myProfile) {
        throw new Error('프로필을 찾을 수 없어요.');
      }

      setProfile(myProfile);
      syncForm(myProfile);
    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(err.message ?? '알 수 없는 에러');
    } finally {
      setLoading(false);
    }
  }, [supabase, syncForm]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const setForm = (field: keyof typeof form, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const updateProfileRow = useCallback(
    async (payload: ProfileUpdate) => {
      if (!profile) return null;
      const updated = await updateProfileClient(supabase, profile.id, payload);
      setProfile(updated);
      syncForm(updated);
      return updated;
    },
    [profile, supabase, syncForm],
  );

  const save = useCallback(async () => {
    try {
      if (!profile) return;
      setSaving(true);
      setError(null);

      const payload: ProfileUpdate = {
        display_name: form.display_name,
        intro: form.intro,
        avatar_url: form.avatar_url,
        updated_at: new Date().toISOString(),
      };

      await updateProfileRow(payload);
    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(err.message ?? '저장 중 에러가 발생했어요');
    } finally {
      setSaving(false);
    }
  }, [form, profile, updateProfileRow]);

  const updateAvatar = useCallback(
    async (file: File) => {
      try {
        if (!profile) throw new Error('프로필 정보가 없어요.');
        setSaving(true);
        setError(null);

        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${profile.id}-${Date.now()}.${ext}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(filePath);

        setFormState((prev) => ({
          ...prev,
          avatar_url: publicUrl,
        }));
      } catch (e) {
        const err = e as Error;
        console.error(err);
        setError(err.message ?? '아바타 업로드 중 에러가 발생했어요');
      } finally {
        setSaving(false);
      }
    },
    [profile, supabase],
  );

  const resetAvatarToDefault = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error('로그인 정보를 찾을 수 없어요.');

      const meta = user.user_metadata as Record<string, unknown> | undefined;

      const defaultUrl =
        (meta?.avatar_url as string | undefined) ?? (meta?.picture as string | undefined) ?? '';

      if (!defaultUrl) {
        throw new Error('기본 아바타를 찾을 수 없어요.');
      }

      setFormState((prev) => ({
        ...prev,
        avatar_url: defaultUrl,
      }));
    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(err.message ?? '아바타 초기화 중 에러가 발생했어요');
    } finally {
      setSaving(false);
    }
  }, [supabase]);

  return {
    profile,
    loading,
    saving,
    error,
    form,
    setForm,
    save,
    refresh: fetchProfile,
    updateAvatar,
    resetAvatarToDefault,
  };
}

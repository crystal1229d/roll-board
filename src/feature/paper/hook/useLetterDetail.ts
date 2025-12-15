'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { Tables } from '@/shared/type';

type LetterRow = Tables<'letters'>;
type ProfileRow = Tables<'profiles'>;

export type LetterWithWriter = LetterRow & {
  writer?: Pick<ProfileRow, 'id' | 'display_name' | 'avatar_url'> | null;
};

export function useLetterDetail(letterId: string) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const client = useMemo(() => supabase as any, [supabase]);

  const [letter, setLetter] = useState<LetterWithWriter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await client
        .from('letters')
        .select(
          `
          id, content, created_at, updated_at,
          paper_id, writer_id, writer_name, is_anonymous,
          teaser_title, teaser_x, teaser_y, teaser_scale, teaser_rotation, teaser_sticker_type,
          writer:profiles ( id, display_name, avatar_url )
        `,
        )
        .eq('id', letterId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // join 결과는 타입이 애매하니 여기서만 캐스팅
      setLetter((data ?? null) as LetterWithWriter | null);
    } catch (e) {
      setError((e as Error).message ?? '불러오기 실패');
      setLetter(null);
    } finally {
      setLoading(false);
    }
  }, [client, letterId]);

  useEffect(() => {
    void fetchOne();
  }, [fetchOne]);

  const updateContent = useCallback(
    async (content: string) => {
      try {
        setSaving(true);
        setError(null);

        const { error: upError } = await client
          .from('letters')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', letterId);

        if (upError) throw upError;

        await fetchOne();
        return true;
      } catch (e) {
        setError((e as Error).message ?? '수정 실패');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [client, letterId, fetchOne],
  );

  const deleteLetter = useCallback(async () => {
    try {
      setDeleting(true);
      setError(null);

      const { error: delError } = await client.from('letters').delete().eq('id', letterId);
      if (delError) throw delError;

      return true;
    } catch (e) {
      setError((e as Error).message ?? '삭제 실패');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [client, letterId]);

  return {
    letter,
    loading,
    error,
    saving,
    deleting,
    refetch: fetchOne,
    updateContent,
    deleteLetter,
  };
}

'use client';

import { useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { Database, TablesInsert } from '@/shared/type/supabase';
import { useMyUserId } from '@/shared/hook/useMyUserId';

type LetterInsert = TablesInsert<'letters'>;

type Payload = {
  paperId: string;
  content: string;
  isAnonymous: boolean;
  writerName?: string;
  teaserTitle: string;
  teaserX: number;
  teaserY: number;
  teaserRotation: number;
  teaserScale: number;
};

export function useLetterComposer() {
  // ✅ 여기서 "Database가 붙은 SupabaseClient"로 확실히 좁혀줌
  const supabase = useMemo(
    () => getSupabaseBrowserClient() as unknown as SupabaseClient<Database>,
    [],
  );

  const myUserId = useMyUserId();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLetter = async (payload: Payload) => {
    try {
      setSaving(true);
      setError(null);

      if (!myUserId) {
        setError('로그인이 필요해요.');
        return false;
      }

      const row: LetterInsert = {
        paper_id: payload.paperId,
        writer_id: myUserId,
        content: payload.content,

        is_anonymous: payload.isAnonymous,
        writer_name: payload.isAnonymous ? null : payload.writerName ?? null,

        teaser_title: payload.teaserTitle,
        teaser_x: payload.teaserX,
        teaser_y: payload.teaserY,
        teaser_rotation: payload.teaserRotation,
        teaser_scale: payload.teaserScale,

        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase.from('letters').insert(row);
      if (insertError) throw insertError;

      return true;
    } catch (e) {
      setError((e as Error).message ?? '저장 실패');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { createLetter, saving, error };
}

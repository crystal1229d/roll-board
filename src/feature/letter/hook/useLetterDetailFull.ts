'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { Database } from '@/shared/type/supabase';

type LetterRow = Database['public']['Tables']['letters']['Row'];
type StyleRow = Database['public']['Tables']['letter_styles']['Row'];
type StickerRow = Database['public']['Tables']['letter_stickers']['Row'];

export function useLetterDetailFull(letterId: string) {
  const supabase = useMemo(
    () => getSupabaseBrowserClient() as unknown as SupabaseClient<Database>,
    [],
  );

  const [letter, setLetter] = useState<LetterRow | null>(null);
  const [style, setStyle] = useState<StyleRow | null>(null);
  const [stickers, setStickers] = useState<StickerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: l, error: le } = await supabase
        .from('letters')
        .select('*')
        .eq('id', letterId)
        .single();
      if (le) throw le;

      const { data: st, error: se } = await supabase
        .from('letter_styles')
        .select('*')
        .eq('letter_id', letterId)
        .maybeSingle();
      if (se) throw se;

      const { data: sk, error: ske } = await supabase
        .from('letter_stickers')
        .select('*')
        .eq('letter_id', letterId)
        .order('created_at', { ascending: true });
      if (ske) throw ske;

      setLetter(l);
      setStyle(st ?? null);
      setStickers(sk ?? []);
    } catch (e) {
      setError((e as Error).message ?? '불러오기 실패');
      setLetter(null);
      setStyle(null);
      setStickers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!letterId) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterId]);

  const updateContent = async (nextContent: string) => {
    try {
      if (!letter) return false;
      setSaving(true);
      setError(null);

      const { error: ue } = await supabase
        .from('letters')
        .update({ content: nextContent, updated_at: new Date().toISOString() })
        .eq('id', letterId);

      if (ue) throw ue;

      await refetch();
      return true;
    } catch (e) {
      setError((e as Error).message ?? '저장 실패');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteLetter = async () => {
    try {
      setDeleting(true);
      setError(null);

      // (스티커/스타일은 FK로 cascade가 없을 수도 있어서 안전하게 먼저 삭제)
      await supabase.from('letter_stickers').delete().eq('letter_id', letterId);
      await supabase.from('letter_styles').delete().eq('letter_id', letterId);

      const { error: de } = await supabase.from('letters').delete().eq('id', letterId);
      if (de) throw de;

      return true;
    } catch (e) {
      setError((e as Error).message ?? '삭제 실패');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    letter,
    style,
    stickers,
    loading,
    error,
    saving,
    deleting,
    updateContent,
    deleteLetter,
    refetch,
  };
}

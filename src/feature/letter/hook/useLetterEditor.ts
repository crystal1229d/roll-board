'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { Database } from '@/shared/type/supabase';
import { useMyUserId } from '@/shared/hook/useMyUserId';

import { DEFAULT_STICKER_ID, normalizeStickerTypeId } from '@/entity/sticker';
import type { StickerTypeId } from '@/entity/sticker';

import type {
  Letter,
  LetterStyleRow,
  LetterStickerRow,
  LetterStyleDraft,
  LetterStickerDraft,
  LetterWithWriterRow,
} from '@/entity/letter/type';

import { mapLetterWithWriterRowToLetter } from '@/entity/letter/lib';

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

const toStyleDraft = (row: LetterStyleRow | null | undefined): LetterStyleDraft => {
  const extra = (row?.extra ?? {}) as any;

  return {
    noteColor: row?.note_color ?? '#fffdf0',
    textColor: row?.text_color ?? '#222222',
    pattern: (extra?.pattern as LetterStyleDraft['pattern']) ?? 'lined',
    fontFamily: row?.font_family ?? 'Verdana, Tahoma, sans-serif',
  };
};

const toStickerDraft = (row: LetterStickerRow): LetterStickerDraft => ({
  id: row.id,
  stickerType: normalizeStickerTypeId(row.sticker_type),
  x: clamp(row.x, 0, 100),
  y: clamp(row.y, 0, 100),
  rotation: row.rotation ?? 0,
  scale: row.scale ?? 1,
});

export type LetterEditDraft = {
  content: string;
  teaserTitle: string;
  teaserStickerType: StickerTypeId | null;
  isAnonymous: boolean;

  style: LetterStyleDraft;
  stickers: LetterStickerDraft[];
};

export function useLetterEditor(letterId: string) {
  const supabase = useMemo(
    () => getSupabaseBrowserClient() as unknown as SupabaseClient<Database>,
    [],
  );

  const myUserId = useMyUserId();

  const [letter, setLetter] = useState<Letter | null>(null);
  const [style, setStyle] = useState<LetterStyleDraft>(() => toStyleDraft(null));
  const [stickers, setStickers] = useState<LetterStickerDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEdit = !!letter && !!myUserId && letter.writerId === myUserId;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: l, error: e1 } = await supabase
        .from('letters')
        .select('*, writer:profiles(id, display_name)')
        .eq('id', letterId)
        .maybeSingle();

      if (e1) throw e1;
      if (!l) throw new Error('편지를 찾을 수 없어요.');

      const { data: st, error: e2 } = await supabase
        .from('letter_styles')
        .select('*')
        .eq('letter_id', letterId)
        .maybeSingle();
      if (e2) throw e2;

      const { data: ss, error: e3 } = await supabase
        .from('letter_stickers')
        .select('*')
        .eq('letter_id', letterId)
        .order('created_at', { ascending: true });
      if (e3) throw e3;

      setLetter(mapLetterWithWriterRowToLetter(l as unknown as LetterWithWriterRow));
      setStyle(toStyleDraft(st as LetterStyleRow | null | undefined));
      setStickers(((ss ?? []) as LetterStickerRow[]).map(toStickerDraft));
    } catch (e) {
      setError((e as any)?.message ?? '불러오기 실패');
      setLetter(null);
      setStyle(toStyleDraft(null));
      setStickers([]);
    } finally {
      setLoading(false);
    }
  }, [letterId, supabase]);

  useEffect(() => {
    if (!letterId) return;
    load();
  }, [load, letterId]);

  const getInitialDraft = useCallback((): LetterEditDraft | null => {
    if (!letter) return null;
    return {
      content: letter.content ?? '',
      teaserTitle: letter.teaserTitle ?? '',
      teaserStickerType: letter.teaserStickerType
        ? (normalizeStickerTypeId(letter.teaserStickerType) as StickerTypeId)
        : null,
      isAnonymous: !!letter.isAnonymous,
      style,
      stickers,
    };
  }, [letter, style, stickers]);

  const saveDraft = useCallback(
    async (draft: LetterEditDraft) => {
      if (!letter) return false;

      setSaving(true);
      setError(null);

      try {
        // 1) letters
        const { data: updated, error: e1 } = await supabase
          .from('letters')
          .update({
            content: draft.content,
            teaser_title: draft.teaserTitle,
            teaser_sticker_type: draft.teaserStickerType ?? DEFAULT_STICKER_ID,
            is_anonymous: draft.isAnonymous,
            updated_at: new Date().toISOString(),
          })
          .eq('id', letterId)
          .select('id, content, teaser_title, teaser_sticker_type, is_anonymous, updated_at')
          .maybeSingle();

        if (e1) throw e1;
        if (!updated) throw new Error('업데이트 대상이 없어요 (권한/RLS/조건 확인 필요)');

        console.log('[letters updated]', updated);

        // 2) styles
        const { error: e2 } = await supabase.from('letter_styles').upsert(
          {
            letter_id: letterId,
            note_color: draft.style.noteColor,
            text_color: draft.style.textColor,
            font_family: draft.style.fontFamily,
            extra: { pattern: draft.style.pattern },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'letter_id' },
        );

        if (e2) throw e2;

        // 3) stickers (upsert all + delete removed)
        const ids = draft.stickers.map((s) => s.id);

        if (draft.stickers.length > 0) {
          const rows: Database['public']['Tables']['letter_stickers']['Insert'][] =
            draft.stickers.map((s) => ({
              id: s.id,
              letter_id: letterId,
              sticker_type: s.stickerType,
              x: clamp(s.x, 0, 100),
              y: clamp(s.y, 0, 100),
              rotation: s.rotation ?? 0,
              scale: s.scale ?? 1,
            }));

          const { error: e3 } = await supabase.from('letter_stickers').upsert(rows, {
            onConflict: 'id',
          });
          if (e3) throw e3;

          // delete removed
          const inExpr = `(${ids.map((x) => `"${x}"`).join(',')})`;
          const { error: e4 } = await supabase
            .from('letter_stickers')
            .delete()
            .eq('letter_id', letterId)
            .not('id', 'in', inExpr);
          if (e4) throw e4;
        } else {
          // no stickers => delete all
          const { error: e5 } = await supabase
            .from('letter_stickers')
            .delete()
            .eq('letter_id', letterId);
          if (e5) throw e5;
        }

        // reload once (final truth)
        await load();
        return true;
      } catch (e) {
        setError((e as any)?.message ?? '저장 실패');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [letter, letterId, load, supabase],
  );

  return {
    loading,
    saving,
    error,

    letter,
    canEdit,

    style,
    stickers,

    reload: load,
    getInitialDraft,
    saveDraft,
  };
}

// src/feature/letter/hook/useLetterEditor.ts
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { Database } from '@/shared/type/supabase';
import { useMyUserId } from '@/shared/hook/useMyUserId';

import { DEFAULT_STICKER_ID, normalizeStickerTypeId } from '@/entity/sticker';
import type { StickerTypeId } from '@/entity/sticker';

import type {
  LetterRow,
  LetterStyleRow,
  LetterStickerRow,
  LetterStyleDraft,
  LetterStickerDraft,
} from '@/entity/letter/type';

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
  stickerType: normalizeStickerTypeId(row.sticker_type), // ✅ string -> StickerTypeId
  x: clamp(row.x, 0, 100),
  y: clamp(row.y, 0, 100),
  rotation: row.rotation ?? 0,
  scale: row.scale ?? 1,
});

export function useLetterEditor(letterId: string) {
  const supabase = useMemo(
    () => getSupabaseBrowserClient() as unknown as SupabaseClient<Database>,
    [],
  );

  const myUserId = useMyUserId();

  const [letter, setLetter] = useState<LetterRow | null>(null);
  const [style, setStyle] = useState<LetterStyleDraft>(() => toStyleDraft(null));
  const [stickers, setStickers] = useState<LetterStickerDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canEdit = !!letter && !!myUserId && letter.writer_id === myUserId;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: l, error: e1 } = await supabase
        .from('letters')
        .select('*')
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

      setLetter(l as LetterRow);
      setStyle(toStyleDraft(st as LetterStyleRow | null | undefined));
      setStickers(((ss ?? []) as LetterStickerRow[]).map(toStickerDraft));
    } catch (e) {
      setError((e as any)?.message ?? '불러오기 실패');
    } finally {
      setLoading(false);
    }
  }, [letterId, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  // ----- Updates (DB 반영 포함) -----

  const updateContent = useCallback(
    async (next: string) => {
      if (!letter) return false;

      setLetter((p) => (p ? { ...p, content: next } : p));

      const { error: e } = await supabase
        .from('letters')
        .update({ content: next, updated_at: new Date().toISOString() })
        .eq('id', letterId);

      if (e) {
        setError(e.message);
        return false;
      }
      return true;
    },
    [letter, letterId, supabase],
  );

  const updateTeaser = useCallback(
    async (patch: { teaserTitle?: string; teaserStickerType?: StickerTypeId | string | null }) => {
      if (!letter) return false;

      const next: Partial<LetterRow> = {};

      if (patch.teaserTitle !== undefined) next.teaser_title = patch.teaserTitle;

      if (patch.teaserStickerType !== undefined) {
        next.teaser_sticker_type =
          patch.teaserStickerType === null
            ? null
            : (normalizeStickerTypeId(patch.teaserStickerType) as unknown as string);
      }

      setLetter((p) => (p ? { ...p, ...next } : p));

      const { error: e } = await supabase
        .from('letters')
        .update({ ...next, updated_at: new Date().toISOString() })
        .eq('id', letterId);

      if (e) {
        setError(e.message);
        return false;
      }
      return true;
    },
    [letter, letterId, supabase],
  );

  const updateStyle = useCallback(
    async (patch: Partial<LetterStyleDraft>) => {
      const next = { ...style, ...patch };
      setStyle(next);

      const { error: e } = await supabase.from('letter_styles').upsert(
        {
          letter_id: letterId,
          note_color: next.noteColor,
          text_color: next.textColor,
          font_family: next.fontFamily,
          extra: { pattern: next.pattern },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'letter_id' },
      );

      if (e) {
        setError(e.message);
        return false;
      }
      return true;
    },
    [letterId, style, supabase],
  );

  const addSticker = useCallback(
    async (stickerType?: StickerTypeId | string) => {
      const id = crypto.randomUUID();
      const type = normalizeStickerTypeId(stickerType ?? DEFAULT_STICKER_ID);

      const row: Database['public']['Tables']['letter_stickers']['Insert'] = {
        id,
        letter_id: letterId,
        sticker_type: type, // ✅ StickerTypeId(=string)
        x: 70,
        y: 20,
        rotation: 0,
        scale: 1,
      };

      const optimistic: LetterStickerDraft = {
        id,
        stickerType: type,
        x: row.x,
        y: row.y,
        rotation: row.rotation ?? 0,
        scale: row.scale ?? 1,
      };

      setStickers((prev) => [...prev, optimistic]);

      const { error: e } = await supabase.from('letter_stickers').insert(row);
      if (e) {
        setError(e.message);
        setStickers((prev) => prev.filter((s) => s.id !== id));
        return false;
      }
      return true;
    },
    [letterId, supabase],
  );

  const updateSticker = useCallback(
    async (id: string, patch: Partial<LetterStickerDraft>) => {
      setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

      const dbPatch: Database['public']['Tables']['letter_stickers']['Update'] = {};

      if (patch.x !== undefined) dbPatch.x = clamp(patch.x, 0, 100);
      if (patch.y !== undefined) dbPatch.y = clamp(patch.y, 0, 100);
      if (patch.rotation !== undefined) dbPatch.rotation = patch.rotation;
      if (patch.scale !== undefined) dbPatch.scale = patch.scale;
      if (patch.stickerType !== undefined) dbPatch.sticker_type = patch.stickerType;

      const { error: e } = await supabase.from('letter_stickers').update(dbPatch).eq('id', id);
      if (e) {
        setError(e.message);
        return false;
      }
      return true;
    },
    [supabase],
  );

  const removeSticker = useCallback(
    async (id: string) => {
      const prev = stickers;
      setStickers((p) => p.filter((s) => s.id !== id));

      const { error: e } = await supabase.from('letter_stickers').delete().eq('id', id);
      if (e) {
        setError(e.message);
        setStickers(prev);
        return false;
      }
      return true;
    },
    [stickers, supabase],
  );

  return {
    loading,
    error,

    letter,
    canEdit,

    style,
    stickers,

    updateContent,
    updateTeaser,
    updateStyle,

    addSticker,
    updateSticker,
    removeSticker,

    reload: load,
  };
}

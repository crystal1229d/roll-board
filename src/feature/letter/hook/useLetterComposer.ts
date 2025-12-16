'use client';

import { useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { Database, TablesInsert } from '@/shared/type/supabase';
import { useMyUserId } from '@/shared/hook/useMyUserId';
import type { LetterStickerDraft, LetterStyleDraft } from '@/entity/letter/type';
import { StickerTypeId } from '@/entity/sticker';

type LetterInsert = TablesInsert<'letters'>;
type LetterStyleInsert = TablesInsert<'letter_styles'>;
type LetterStickerInsert = TablesInsert<'letter_stickers'>;

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
  teaserStickerType?: StickerTypeId;

  style?: LetterStyleDraft;
  stickers?: LetterStickerDraft[];
};

export function useLetterComposer() {
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
        teaser_sticker_type: payload.teaserStickerType ?? null,

        updated_at: new Date().toISOString(),
      };

      const { data: inserted, error: insertError } = await supabase
        .from('letters')
        .insert(row)
        .select('id')
        .single();

      if (insertError) throw insertError;
      const letterId = inserted.id;

      if (payload.style) {
        const styleRow: LetterStyleInsert = {
          letter_id: letterId,
          note_color: payload.style.note_color ?? null,
          font_family: payload.style.font_family ?? null,
          extra: (payload.style.extra ?? null) as any,
          updated_at: new Date().toISOString(),
        };

        const { error: styleError } = await supabase
          .from('letter_styles')
          .upsert(styleRow, { onConflict: 'letter_id' });

        if (styleError) throw styleError;
      }

      const stickers = payload.stickers ?? [];
      if (stickers.length > 0) {
        const stickerRows: LetterStickerInsert[] = stickers.map((s) => ({
          letter_id: letterId,
          sticker_type: s.sticker_type,
          x: s.x,
          y: s.y,
          rotation: s.rotation ?? 0,
          scale: s.scale ?? 1,
        }));

        const { error: stickerError } = await supabase.from('letter_stickers').insert(stickerRows);
        if (stickerError) throw stickerError;
      }

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

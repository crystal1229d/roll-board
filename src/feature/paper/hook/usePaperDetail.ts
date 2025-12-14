'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import { useMyUserId } from '@/shared/hook/useMyUserId';
import type {
  LetterWithWriter,
  MyLetterState,
  PaperDetail,
  PaperWithOwner,
} from '../type/paperDetail';

export function usePaperDetail(paperSlug: string) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const myUserId = useMyUserId();

  const [data, setData] = useState<PaperDetail | null>(null);
  const [myLetter, setMyLetter] = useState<MyLetterState>({ status: 'none' });
  const [isOwner, setIsOwner] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    const currentYear = new Date().getFullYear();

    // 1) paper
    const { data: paperData, error: paperError } = await supabase
      .from('papers')
      .select(
        `
          id, title, slug, year, created_at, theme, bg_texture, is_published, owner_id,
          owner:profiles ( id, display_name, avatar_url, intro )
        `,
      )
      .eq('slug', paperSlug)
      .eq('year', currentYear)
      .eq('is_published', true)
      .maybeSingle();

    if (paperError) throw paperError;

    if (!paperData) {
      setData(null);
      setMyLetter({ status: 'none' });
      setIsOwner(false);
      return;
    }

    const paper = paperData as PaperWithOwner;
    const owner = !!(myUserId && paper.owner_id === myUserId);

    // 2) letters
    const { data: lettersData, error: lettersError } = await supabase
      .from('letters')
      .select(
        `
          id, content, created_at, updated_at, paper_id,
          writer_id, writer_name, is_anonymous,
          teaser_title, teaser_x, teaser_y, teaser_scale, teaser_rotation,
          writer:profiles ( id, display_name, avatar_url )
        `,
      )
      .eq('paper_id', paper.id)
      .order('created_at', { ascending: true });

    if (lettersError) throw lettersError;

    const letters = (lettersData ?? []) as LetterWithWriter[];

    // 3) my letter
    const mine = myUserId ? letters.find((l) => l.writer_id === myUserId) : undefined;

    setData({ paper, letters });
    setIsOwner(owner);
    setMyLetter(mine ? { status: 'sent', letter: mine } : { status: 'none' });
  }, [supabase, paperSlug, myUserId]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        await fetchDetail();
      } catch (e) {
        if (!alive) return;
        setErrorMsg((e as Error).message ?? '불러오는 중 오류가 발생했어요.');
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!alive) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [fetchDetail]);

  const refresh = useCallback(async () => {
    try {
      setErrorMsg(null);
      await fetchDetail();
    } catch (e) {
      setErrorMsg((e as Error).message ?? '새로고침 중 오류가 발생했어요.');
    }
  }, [fetchDetail]);

  return { data, myLetter, isOwner, loading, error: errorMsg, refresh };
}

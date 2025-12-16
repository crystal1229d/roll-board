'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import { useMyUserId } from '@/shared/hook/useMyUserId';
import { useDesktopStore } from '@/feature/desktop/model/useDesktopStore';

export type PaperWithOwner = {
  id: string;
  title: string;
  slug: string;
  year: number;
  created_at: string | null;
  theme: string | null;
  bg_texture: string | null;
  is_published: boolean | null;
  owner_id: string;
  owner?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    intro: string | null;
  } | null;
};

export type LetterWithWriter = {
  id: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  paper_id: string;
  writer_id: string;
  writer_name: string | null;
  is_anonymous: boolean | null;

  teaser_title: string | null;
  teaser_sticker_type: string | null;
  teaser_x: number | null;
  teaser_y: number | null;
  teaser_scale: number | null;
  teaser_rotation: number | null;

  writer?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
};

export type PaperDetail = {
  paper: PaperWithOwner;
  letters: LetterWithWriter[];
};

export type MyLetterState = { status: 'none' } | { status: 'sent'; letter: LetterWithWriter };

export function usePaperDetail(paperSlug: string) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const nonce = useDesktopStore((s) => s.paperRefreshNonce);
  const myUserId = useMyUserId();

  const [data, setData] = useState<PaperDetail | null>(null);
  const [myLetter, setMyLetter] = useState<MyLetterState>({ status: 'none' });
  const [isOwner, setIsOwner] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = useCallback(() => {
    setRefreshTick((v) => v + 1);
  }, []);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!myUserId) {
        if (alive) {
          setData(null);
          setIsOwner(false);
          setMyLetter({ status: 'none' });
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setErrorMsg(null);

        const currentYear = new Date().getFullYear();

        const paperRes = await supabase
          .from('papers')
          .select(
            `
              id, title, slug, year, created_at, theme, bg_texture, is_published, owner_id,
              owner:profiles ( id, display_name, avatar_url, intro )
            `,
          )
          .eq('slug', paperSlug)
          .eq('year', currentYear)
          .maybeSingle();

        if (paperRes.error) throw paperRes.error;

        if (!paperRes.data) {
          if (alive) {
            setData(null);
            setIsOwner(false);
            setMyLetter({ status: 'none' });
          }
          return;
        }

        const paper = paperRes.data as unknown as PaperWithOwner;
        const owner = paper.owner_id === myUserId;

        const lettersRes = await supabase
          .from('letters')
          .select(
            `
              id, content, created_at, updated_at, paper_id,
              writer_id, writer_name, is_anonymous,
              teaser_title, teaser_sticker_type, teaser_x, teaser_y, teaser_scale, teaser_rotation,
              writer:profiles ( id, display_name, avatar_url )
            `,
          )
          .eq('paper_id', paper.id)
          .order('created_at', { ascending: true });

        if (lettersRes.error) throw lettersRes.error;

        const letters = (lettersRes.data ?? []) as unknown as LetterWithWriter[];
        const mine = letters.find((l) => l.writer_id === myUserId);

        if (alive) {
          setIsOwner(owner);
          setData({ paper, letters });
          setMyLetter(mine ? { status: 'sent', letter: mine } : { status: 'none' });
        }
      } catch (e) {
        if (alive) setErrorMsg((e as Error).message ?? '불러오기 실패');
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [supabase, paperSlug, myUserId, nonce, refreshTick]);

  return { data, myLetter, isOwner, loading, error: errorMsg, refresh };
}

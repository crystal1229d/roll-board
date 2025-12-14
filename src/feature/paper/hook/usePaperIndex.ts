'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { Tables } from '@/shared/type/supabase';

type ProfileRow = Tables<'profiles'>;
type PaperRow = Tables<'papers'>;

export type PaperIndexItem = {
  userId: string;
  displayName: string;
  intro: string;
  avatarUrl: string;
  paperId: string;
  paperSlug: string;
  paperTitle: string;
  paperYear: number;
  paperCreatedAt: string;
};

type PaperIndexSelectRow = Pick<
  PaperRow,
  'id' | 'title' | 'slug' | 'year' | 'created_at' | 'is_published'
> & {
  owner: Pick<ProfileRow, 'id' | 'display_name' | 'intro' | 'avatar_url'> | null;
};

export function usePaperIndex() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [items, setItems] = useState<PaperIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentYear = new Date().getFullYear();

        const res = await supabase
          .from('papers')
          .select(
            `
            id, title, slug, year, created_at, is_published,
            owner:profiles ( id, display_name, intro, avatar_url )
          `,
          )
          .eq('year', currentYear)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (res.error) throw res.error;

        const rows = (res.data ?? []) as unknown as PaperIndexSelectRow[];

        const raw: PaperIndexItem[] = rows
          .map((paper) => {
            const { owner } = paper;
            if (!owner) return null;

            return {
              userId: owner.id,
              displayName: owner.display_name,
              intro: owner.intro ?? '',
              avatarUrl: owner.avatar_url ?? '/img/default-avatar.png',
              paperId: paper.id,
              paperSlug: paper.slug,
              paperTitle: paper.title,
              paperYear: paper.year,
              paperCreatedAt: paper.created_at ?? '',
            };
          })
          .filter((v): v is PaperIndexItem => v !== null);

        // 유저당 1개(가장 최신 created_at)
        const byUser = new Map<string, PaperIndexItem>();
        for (const item of raw) {
          if (!byUser.has(item.userId)) byUser.set(item.userId, item);
        }

        const deduped = Array.from(byUser.values()).sort((a, b) =>
          a.displayName.localeCompare(b.displayName, 'ko'),
        );

        if (alive) setItems(deduped);
      } catch (e) {
        const err = e as Error;
        if (alive) setError(err.message ?? '알 수 없는 에러가 발생했어요.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      alive = false;
    };
  }, [supabase]);

  return { items, loading, error };
}

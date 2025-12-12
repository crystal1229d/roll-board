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

export function usePaperIndex() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [items, setItems] = useState<PaperIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentYear = new Date().getFullYear();

        // 올해 + 공개된 paper들 + owner 프로필 join
        const { data, error } = await supabase
          .from('papers')
          .select(
            `
            id,
            title,
            slug,
            year,
            created_at,
            is_published,
            owner:profiles (
              id,
              display_name,
              intro,
              avatar_url
            )
          `,
          )
          .eq('year', currentYear)
          .eq('is_published', true)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // ── 1) raw -> (owner + paper) 매핑 ──────────────────
        const raw: PaperIndexItem[] = (data ?? [])
          .map((row: any) => {
            const paper = row as PaperRow & { owner?: ProfileRow | null };
            const owner = paper.owner ?? null;

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

        // ── 2) 한 유저당 올해 paper 하나만 (여러 개면 가장 최신 created_at) ──
        const byUser = new Map<string, PaperIndexItem>();

        for (const item of raw) {
          const existing = byUser.get(item.userId);
          if (!existing) {
            byUser.set(item.userId, item);
            continue;
          }

          // created_at 기준으로 더 최신 것 선택
          const prevTime = existing.paperCreatedAt ? Date.parse(existing.paperCreatedAt) : 0;
          const currTime = item.paperCreatedAt ? Date.parse(item.paperCreatedAt) : 0;

          if (currTime >= prevTime) {
            byUser.set(item.userId, item);
          }
        }

        // ── 3) displayName 기준으로 정렬해서 리스트 반환 ─────────────
        const deduped = Array.from(byUser.values()).sort((a, b) =>
          a.displayName.localeCompare(b.displayName, 'ko'),
        );

        setItems(deduped);
      } catch (e) {
        const err = e as Error;
        console.error(err);
        setError(err.message ?? '알 수 없는 에러가 발생했어요.');
      } finally {
        setLoading(false);
      }
    };

    void fetchAll();
  }, [supabase]);

  return { items, loading, error };
}

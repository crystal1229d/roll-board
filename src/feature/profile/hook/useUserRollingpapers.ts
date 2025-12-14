'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';

export type UserPaperSummary = {
  id: string;
  title: string;
  year: number;
  createdAt: string;
  letterCount: number;
};

export function useUserRollingpapers(userId: string) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [papers, setPapers] = useState<UserPaperSummary[]>([]);
  const [receivedThisYearCount, setReceivedThisYearCount] = useState(0);
  const [sentThisYearCount, setSentThisYearCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const run = async () => {
      const currentYear = new Date().getFullYear();
      const start = `${currentYear}-01-01`;
      const end = `${currentYear + 1}-01-01`;

      try {
        setLoading(true);
        setError(null);

        // ✅ 1) 유저의 롤링페이퍼 목록 (papers.owner_id)
        // letters(count) 조인은 관계가 잡혀있으면 동작
        const { data: paperData, error: paperErr } = await supabase
          .from('papers')
          .select('id, title, year, created_at, letters(count)')
          .eq('owner_id', userId);

        if (paperErr) throw paperErr;

        const mapped: UserPaperSummary[] =
          (paperData ?? []).map((p: any) => ({
            id: p.id as string,
            title: p.title as string,
            year: p.year as number,
            createdAt: (p.created_at as string) ?? '',
            letterCount: p.letters?.[0]?.count ?? 0,
          })) ?? [];

        setPapers(mapped);

        // ✅ 2) 올해 받은 편지 수: 올해 paper들의 letters count
        const thisYearPaperIds = mapped.filter((p) => p.year === currentYear).map((p) => p.id);

        if (thisYearPaperIds.length === 0) {
          setReceivedThisYearCount(0);
        } else {
          const { count, error: rcErr } = await supabase
            .from('letters')
            .select('*', { count: 'exact', head: true })
            .in('paper_id', thisYearPaperIds);

          if (rcErr) throw rcErr;
          setReceivedThisYearCount(count ?? 0);
        }

        // ✅ 3) 올해 보낸 편지 수: letters.writer_id = userId
        const { count: sc, error: scErr } = await supabase
          .from('letters')
          .select('*', { count: 'exact', head: true })
          .eq('writer_id', userId)
          .gte('created_at', start)
          .lt('created_at', end);

        if (scErr) throw scErr;
        setSentThisYearCount(sc ?? 0);

        // ✅ 4) 방문자 수: profile_visits에서 profile_id = userId count
        const { count: vc, error: vcErr } = await supabase
          .from('profile_visits')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', userId);

        if (vcErr) throw vcErr;
        setVisitCount(vc ?? 0);
      } catch (e) {
        setError((e as Error).message);
        setPapers([]);
        setReceivedThisYearCount(0);
        setSentThisYearCount(0);
        setVisitCount(0);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [supabase, userId]);

  return { papers, receivedThisYearCount, sentThisYearCount, visitCount, loading, error };
}

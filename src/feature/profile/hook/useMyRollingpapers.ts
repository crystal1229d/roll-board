'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import type { Tables } from '@/shared/type';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';

type PaperRow = Tables<'papers'>;
type LetterRow = Tables<'letters'>;
type ProfileRow = Tables<'profiles'>;

export type MyPaperSummary = {
  id: string;
  title: string;
  year: number;
  createdAt: string;
  letterCount: number;
};

export type SentLetterSummary = {
  id: string;
  paperId: string;
  paperTitle: string;
  paperYear: number;
  paperOwnerId: string;
  paperOwnerName: string;
  createdAt: string;
  content: string;
};

export function useMyRollingpapers() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const client = useMemo(() => supabase as any, [supabase]);

  const [myPapers, setMyPapers] = useState<MyPaperSummary[]>([]);
  const [sentLetters, setSentLetters] = useState<SentLetterSummary[]>([]);
  const [receivedThisYearCount, setReceivedThisYearCount] = useState(0);
  const [sentThisYearCount, setSentThisYearCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setLoading(false);
          return;
        }

        const currentYear = new Date().getFullYear();

        // 1) 내 롤링페이퍼 목록
        const { data: paperRows, error: papersError } = await client
          .from('papers')
          .select('*')
          .eq('owner_id', user.id)
          .order('year', { ascending: false })
          .order('created_at', { ascending: false });

        if (papersError) throw papersError;

        const papers = (paperRows ?? []) as PaperRow[];
        const paperIds = papers.map((p) => p.id);

        // 2) 내 롤링페이퍼에 달린 모든 letters (letterCount, 올해 개수 계산용)
        let lettersOnMyPapers: LetterRow[] = [];
        if (paperIds.length > 0) {
          const { data: letterRows, error: lettersError } = await client
            .from('letters')
            .select('*')
            .in('paper_id', paperIds);

          if (lettersError) throw lettersError;
          lettersOnMyPapers = (letterRows ?? []) as LetterRow[];
        }

        const letterCountByPaper = new Map<string, number>();
        let receivedThisYear = 0;

        const paperYearMap = new Map<string, number>();
        papers.forEach((p) => {
          paperYearMap.set(p.id, p.year);
        });

        lettersOnMyPapers.forEach((l) => {
          const count = letterCountByPaper.get(l.paper_id) ?? 0;
          letterCountByPaper.set(l.paper_id, count + 1);

          const year = paperYearMap.get(l.paper_id);
          if (year === currentYear) {
            receivedThisYear += 1;
          }
        });

        const myPaperSummaries: MyPaperSummary[] = papers.map((p) => ({
          id: p.id,
          title: p.title,
          year: p.year,
          createdAt: p.created_at ?? '',
          letterCount: letterCountByPaper.get(p.id) ?? 0,
        }));

        setMyPapers(myPaperSummaries);
        setReceivedThisYearCount(receivedThisYear);

        // 3) 프로필 방문자 수
        const { count: visitsCount, error: visitError } = await client
          .from('profile_visits')
          .select('id', { count: 'exact', head: true })
          .eq('profile_id', user.id);

        if (visitError) throw visitError;
        setVisitCount(visitsCount ?? 0);

        // 4) 내가 보낸 letters (paper, owner join)
        const { data: sentRows, error: sentError } = await client
          .from('letters')
          .select(
            `
            id,
            content,
            created_at,
            paper:papers (
              id,
              title,
              year,
              owner:profiles (
                id,
                display_name
              )
            )
          `,
          )
          .eq('writer_id', user.id)
          .order('created_at', { ascending: false });

        if (sentError) throw sentError;

        const sentLettersMapped: SentLetterSummary[] = (sentRows ?? []).map((row: any) => {
          const paper = row.paper as PaperRow & { owner?: ProfileRow };
          const owner = paper?.owner as ProfileRow | undefined;

          return {
            id: row.id as string,
            paperId: paper?.id ?? '',
            paperTitle: paper?.title ?? '(제목 없음)',
            paperYear: paper?.year ?? currentYear,
            paperOwnerId: owner?.id ?? '',
            paperOwnerName: owner?.display_name ?? '알 수 없음',
            createdAt: row.created_at ?? '',
            content: row.content ?? '',
          };
        });

        setSentLetters(sentLettersMapped);

        const sentThisYear = sentLettersMapped.filter((l) => l.paperYear === currentYear).length;
        setSentThisYearCount(sentThisYear);
      } catch (e) {
        const err = e as Error;
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchAll();
  }, [supabase, client]);

  // 6. 보낸 letter 수정
  const updateSentLetter = useCallback(
    async (letterId: string, newContent: string) => {
      const { data, error } = await client
        .from('letters')
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq('id', letterId)
        .select('id, content')
        .single();

      if (error) throw error;

      setSentLetters((prev) =>
        prev.map((l) =>
          l.id === letterId ? { ...l, content: (data as any).content ?? newContent } : l,
        ),
      );
    },
    [client],
  );

  // 7. 보낸 letter 삭제
  const deleteSentLetter = useCallback(
    async (letterId: string) => {
      const { error } = await client.from('letters').delete().eq('id', letterId);
      if (error) throw error;

      setSentLetters((prev) => prev.filter((l) => l.id !== letterId));
    },
    [client],
  );

  return {
    myPapers,
    sentLetters,
    receivedThisYearCount,
    sentThisYearCount,
    visitCount,
    loading,
    updateSentLetter,
    deleteSentLetter,
  };
}

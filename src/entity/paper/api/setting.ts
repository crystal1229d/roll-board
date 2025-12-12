import type { SupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type {
  MyPaperWithSettings,
  PaperRow,
  PaperUpdate,
  PaperStickerRow,
} from '@/entity/paper/type';

type DbClient = SupabaseBrowserClient;

// 현재 로그인 유저
const fetchCurrentUser = async (supabase: DbClient) => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

/* ─────────────────────────────────────────────────────────────
   📌 내 모든 Papers + Styles + Stickers 불러오기
─────────────────────────────────────────────────────────────── */
export const fetchMyPapersWithSettings = async (
  supabase: DbClient,
): Promise<MyPaperWithSettings[]> => {
  const user = await fetchCurrentUser(supabase);
  if (!user) return [];

  const { data, error } = await supabase
    .from('papers')
    .select(
      `
        *,
        paper_styles (*),
        paper_stickers (*)
      `,
    )
    .eq('owner_id', user.id)
    .order('year', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as any[];

  return rows.map((row) => ({
    paper: row as PaperRow,
    style: row.paper_styles?.[0] ?? null,
    stickers: (row.paper_stickers ?? []) as PaperStickerRow[],
  }));
};

/* ─────────────────────────────────────────────────────────────
   📌 특정 Paper + Style + Sticker 한 개
─────────────────────────────────────────────────────────────── */
export const fetchPaperWithSettingsById = async (
  supabase: DbClient,
  paperId: string,
): Promise<MyPaperWithSettings | null> => {
  const { data, error } = await supabase
    .from('papers')
    .select(
      `
        *,
        paper_styles (*),
        paper_stickers (*)
      `,
    )
    .eq('id', paperId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as any;

  return {
    paper: row as PaperRow,
    style: row.paper_styles?.[0] ?? null,
    stickers: (row.paper_stickers ?? []) as PaperStickerRow[],
  };
};

/* ─────────────────────────────────────────────────────────────
   📌 paper 업데이트(title/theme/bg_texture/is_published 등)
─────────────────────────────────────────────────────────────── */
export const updatePaperSetting = async (
  supabase: DbClient,
  paperId: string,
  payload: PaperUpdate,
): Promise<PaperRow> => {
  const { data, error } = await (supabase.from('papers') as any)
    .update(payload as any)
    .eq('id', paperId)
    .select('*')
    .single();

  if (error) throw error;
  return data as PaperRow;
};

/* ─────────────────────────────────────────────────────────────
   📌 해당 paper 의 스티커 전체 삭제 (초기화)
─────────────────────────────────────────────────────────────── */
export const clearPaperStickers = async (supabase: DbClient, paperId: string): Promise<void> => {
  const { error } = await supabase.from('paper_stickers').delete().eq('paper_id', paperId);
  if (error) throw error;
};

import { createServerSideClient } from '@/shared/lib/supabase/supabase';
import { TablesInsert } from '@/shared/type';
import { mapLetterRowToLetter, mapLetterWithWriterRowToLetter } from '../lib';
import { CreateLetterInput, LetterWithWriterRow } from '../type';

/**
 * 특정 paper에 달린 전체 편지 목록
 */
export const getLettersByPaperId = async ({
  paperId,
  serverComponent = false,
}: {
  paperId: string;
  serverComponent?: boolean;
}) => {
  const supabase = await createServerSideClient(serverComponent);

  const { data, error } = await supabase
    .from('letters')
    .select(
      `
      *,
      writer:profiles(
        id,
        display_name
      )
    `,
    )
    .eq('paper_id', paperId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  return (data as LetterWithWriterRow[]).map(mapLetterWithWriterRowToLetter);
};

/**
 * 특정 paper에 내가 쓴 편지 1개 (paper당 1개 제약 전제)
 */
export const getMyLettersForPaper = async ({
  paperId,
  writerId,
  serverComponent = false,
}: {
  paperId: string;
  writerId: string;
  serverComponent?: boolean;
}) => {
  const supabase = await createServerSideClient(serverComponent);

  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('paper_id', paperId)
    .eq('writer_id', writerId)
    .maybeSingle();

  if (error || !data) return null;

  return mapLetterRowToLetter(data);
};

/**
 * 새 편지 생성
 */
export const createLetter = async ({
  input,
  serverComponent = false,
}: {
  input: CreateLetterInput;
  serverComponent?: boolean;
}) => {
  const supabase = await createServerSideClient(serverComponent);

  const payload: TablesInsert<'letters'> = {
    paper_id: input.paperId,
    writer_id: input.writerId,
    content: input.content,
    is_anonymous: input.isAnonymous,
    teaser_title: input.teaserTitle,
    teaser_sticker_type: input.teaserStickerType,
    teaser_x: input.teaserX,
    teaser_y: input.teaserY,
    teaser_rotation: input.teaserRotation,
    teaser_scale: input.teaserScale,
  };

  const { data, error } = await (supabase as any)
    .from('letters')
    .insert(payload as any)
    .select('*')
    .maybeSingle();

  if (error || !data) {
    throw error ?? new Error('Failed to create letter');
  }

  return mapLetterRowToLetter(data);
};

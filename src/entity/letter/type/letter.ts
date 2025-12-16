import { Tables, TablesInsert } from '@/shared/type';
import type { StickerTypeId } from '@/entity/sticker/type';

export type LetterRow = Tables<'letters'>;
export type LetterInsert = TablesInsert<'letters'>;

export type ProfileRow = Tables<'profiles'>;

export type LetterWithWriterRow = LetterRow & {
  writer: Pick<ProfileRow, 'id' | 'display_name'> | null;
};

/**
 * UI 전용 모델 (DB Row 직접 사용 금지)
 */
export type Letter = {
  id: string;
  paperId: string;

  writerId: string;
  isAnonymous: boolean;
  writerName: string;

  content: string;

  teaserTitle: string;
  teaserStickerType: StickerTypeId | null;

  teaserX: number | null;
  teaserY: number | null;
  teaserRotation: number | null;
  teaserScale: number | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateLetterInput = {
  paperId: string;
  writerId: string;
  content: string;
  isAnonymous: boolean;
  teaserTitle: string | null;
  teaserStickerType: StickerTypeId | null;
  teaserX: number | null;
  teaserY: number | null;
  teaserRotation: number | null;
  teaserScale: number | null;
};

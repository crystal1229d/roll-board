import { Tables, TablesInsert } from '@/shared/type';
import { StickerTypeId } from '@/entity/sticker/type';

export type LetterRow = Tables<'letters'>;
export type LetterInsert = TablesInsert<'letters'>;

export type ProfileRow = Tables<'profiles'>;

export type Letter = {
  id: string;
  paperId: string;
  writerId: string;
  writerName: string | null;
  isAnonymous: boolean;

  content: string;

  teaserTitle: string | null;
  teaserStickerType: string | null;
  teaserX: number | null;
  teaserY: number | null;
  teaserRotation: number | null;
  teaserScale: number | null;

  createdAt: string;
  updatedAt: string;
};

export type LetterWriter = {
  id: string;
  displayName: string;
};

export type LetterWithWriter = Letter & {
  writer: LetterWriter | null;
};

export type LetterWithWriterRow = LetterRow & {
  writer: Pick<ProfileRow, 'id' | 'display_name'> | null;
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

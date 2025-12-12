import type { Tables } from '@/shared/type';

export type LetterRow = Tables<'letters'>;

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

export type CreateLetterInput = {
  paperId: string;
  writerId: string;
  content: string;
  isAnonymous: boolean;
  teaserTitle: string | null;
  teaserStickerType: string | null;
  teaserX: number | null;
  teaserY: number | null;
  teaserRotation: number | null;
  teaserScale: number | null;
};

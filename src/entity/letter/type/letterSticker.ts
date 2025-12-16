import { Database } from '@/shared/type';
import { StickerTypeId } from '@/entity/sticker';

export type LetterStickerRow = Database['public']['Tables']['letter_stickers']['Row'];

export type LetterStickerDraft = {
  id: string;
  stickerType: StickerTypeId;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

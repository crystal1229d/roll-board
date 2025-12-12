import { Tables } from '@/shared/type';

export type PaperRow = Tables<'papers'>;
export type PaperStyleRow = Tables<'paper_styles'>;
export type PaperStickerRow = Tables<'paper_stickers'>;

export interface PaperWithSettings {
  paper: PaperRow;
  style: PaperStyleRow | null;
  stickers: PaperStickerRow[];
}

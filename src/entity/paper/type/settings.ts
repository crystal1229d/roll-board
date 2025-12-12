import type { PaperRow, PaperStyleRow, PaperStickerRow } from './db';

export type MyPaperWithSettings = {
  paper: PaperRow;
  style: PaperStyleRow | null;
  stickers: PaperStickerRow[];
};

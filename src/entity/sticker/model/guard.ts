import { STICKER_CATALOG } from './catalog';
import type { StickerTypeId } from '../type';

export const isStickerTypeId = (v: string): v is StickerTypeId => {
  return STICKER_CATALOG.some((s) => s.id === v);
};

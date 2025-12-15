import { STICKER_CATALOG } from '../model/catalog';

export type StickerTypeId = (typeof STICKER_CATALOG)[number]['id'];

export const findStickerDef = (id?: StickerTypeId | null) =>
  STICKER_CATALOG.find((s) => s.id === id);

export const DEFAULT_STICKER_ID: StickerTypeId = 'star_blue_glitter';

export { STICKER_CATALOG, findStickerDef } from './model/catalog';
export { isStickerTypeId } from './model/guard';

export type { StickerTypeId } from './type';
export { DEFAULT_STICKER_ID } from './type';

export { StickerPalette } from './ui/StickerPalette';

// ✅ 추가
export { mapStickerRowToSticker, normalizeStickerTypeId } from './lib';
export type { StickerDomain, StickerRowLike } from './lib';

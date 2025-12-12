export const STICKER_CATALOG = [
  {
    id: 'bear_pink',
    label: '핑크 곰돌이',
    src: '/stickers/bear-pink.png',
  },
  {
    id: 'bear_brown',
    label: '브라운 곰돌이',
    src: '/stickers/bear-brown.png',
  },
  {
    id: 'heart_blue',
    label: '하트 • 블루',
    src: '/stickers/heart-blue.png',
  },
  {
    id: 'star_yellow',
    label: '별 • 옐로우',
    src: '/stickers/star-yellow.png',
  },
  {
    id: 'bow_pink',
    label: '리본 • 핑크',
    src: '/stickers/bow-pink.png',
  },
] as const;

export type StickerTypeId = (typeof STICKER_CATALOG)[number]['id'];

export const findStickerDef = (id: string | null | undefined) =>
  STICKER_CATALOG.find((s) => s.id === id);

export const STICKER_CATALOG = [
  {
    id: 'star_blue_glitter',
    label: '별 • 파랑',
    src: '/img/sticker/star-blue.png',
  },
  {
    id: 'star_pink_glitter',
    label: '별 • 분홍',
    src: '/img/sticker/star-pink-glitter.png',
  },
  {
    id: 'star_yellow',
    label: '별 • 노랑',
    src: '/img/sticker/star-yellow-glitter.png',
  },
  {
    id: 'heart_purple_glitter_love',
    label: '하트 • 보라',
    src: '/img/sticker/heart-purple-glitter-love.png',
  },
  {
    id: 'heart_purple_stripe',
    label: '하트 • 줄무늬 보라',
    src: '/img/sticker/heart-purple-stripe.png',
  },
  {
    id: 'heart_pink_glitter_loveya',
    label: '하트 • 분홍',
    src: '/img/sticker/heart-pink-glitter-loveya.png',
  },
  {
    id: 'smile',
    label: '스마일',
    src: '/img/sticker/smile.png',
  },
  {
    id: 'gun_pink',
    label: '총 • 분홍',
    src: '/img/sticker/gun-pink-glitter.png',
  },
  {
    id: 'circle_green',
    label: '원형 • 초록',
    src: '/img/sticker/circle-green-glitter.png',
  },
  {
    id: 'arrow_pink',
    label: '화살표 • 분홍',
    src: '/img/sticker/arrow-pink-glitter.png',
  },
  {
    id: 'computer',
    label: '컴퓨터',
    src: '/img/sticker/computer-glitter.png',
  },
] as const;

export type StickerTypeId = (typeof STICKER_CATALOG)[number]['id'];

export const findStickerDef = (id: string | null | undefined) =>
  STICKER_CATALOG.find((s) => s.id === id);

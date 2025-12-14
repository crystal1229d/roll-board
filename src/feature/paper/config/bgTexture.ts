export type BgTextureGroup = 'pattern' | 'texture';

export const BG_TEXTURE_OPTIONS = [
  // PATTERN
  { id: 'pattern_gridPink', label: '분홍 격자', group: 'pattern' as const },
  { id: 'pattern_linedBlue', label: '파란 줄노트', group: 'pattern' as const },
  { id: 'pattern_verticalPurple', label: '보라 세로줄', group: 'pattern' as const },
  { id: 'pattern_dotsYellow', label: '노란 땡땡이', group: 'pattern' as const },

  // TEXTURE
  { id: 'texture_cork', label: '코르크', group: 'texture' as const },
  { id: 'texture_starry', label: '별', group: 'texture' as const },
  { id: 'texture_clouds', label: '하늘', group: 'texture' as const },
] as const;

export type BgTextureId = (typeof BG_TEXTURE_OPTIONS)[number]['id'];

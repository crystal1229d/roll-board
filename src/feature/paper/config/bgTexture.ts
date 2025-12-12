export const BG_TEXTURE_OPTIONS = [
  { id: 'cork', label: '기본 코르크', group: 'texture' },

  // 단색
  { id: 'solidCream', label: '단색 · 크림', group: 'solid' },
  { id: 'solidPink', label: '단색 · 핑크', group: 'solid' },
  { id: 'solidBlue', label: '단색 · 파랑', group: 'solid' },

  // 패턴
  { id: 'gridPink', label: '분홍 격자', group: 'pattern' },
  { id: 'linedBlue', label: '파란 줄노트', group: 'pattern' },
  { id: 'starNavy', label: '네이비 별무늬', group: 'pattern' },
] as const;

export type BgTextureId = (typeof BG_TEXTURE_OPTIONS)[number]['id'];

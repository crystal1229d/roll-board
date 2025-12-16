export const PAPER_PATTERNS = [
  { id: 'plain', label: 'Plain' },
  { id: 'lined', label: 'Lined' },
  { id: 'grid', label: 'Grid' },
  { id: 'dots', label: 'Dots' },
] as const;

export type PaperPatternId = (typeof PAPER_PATTERNS)[number]['id'];

export const NOTE_COLORS = [
  { id: 'butter', label: 'Butter', value: '#fff7a8' },
  { id: 'milk', label: 'Milk', value: '#fffdf3' },
  { id: 'pink', label: 'Pink', value: '#ffe1ef' },
  { id: 'mint', label: 'Mint', value: '#dfffe9' },
  { id: 'sky', label: 'Sky', value: '#e2f4ff' },
] as const;

export const FONT_CATALOG = [
  { id: 'serif', label: 'Serif (old)', css: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', label: 'Mono (retro)', css: '"Courier New", Courier, monospace' },
  { id: 'comic', label: 'Comic (kitsch)', css: '"Comic Sans MS", "Comic Sans", cursive' },
  { id: 'gothic', label: 'Gothic', css: 'Verdana, Tahoma, sans-serif' },
] as const;

export type FontId = (typeof FONT_CATALOG)[number]['id'];

export const findFont = (id: string | null | undefined) =>
  FONT_CATALOG.find((f) => f.id === id) ?? FONT_CATALOG[0];

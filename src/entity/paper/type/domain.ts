import type { PaperRow } from './db';

export type Paper = {
  id: string;
  ownerId: string;
  slug: string;
  title: string;
  theme: string | null;
  bgTexture: string | null;
  year: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export const mapPaperRowToPaper = (row: PaperRow): Paper => ({
  id: row.id,
  ownerId: row.owner_id,
  slug: row.slug,
  title: row.title,
  theme: row.theme,
  bgTexture: row.bg_texture,
  year: row.year,
  isPublished: row.is_published ?? false,
  createdAt: row.created_at ?? '',
  updatedAt: row.updated_at ?? '',
});

import type { PaperRow, Paper } from '../type';

export const mapPaperRowToPaper = (row: PaperRow): Paper => ({
  id: row.id,
  ownerId: row.owner_id,
  slug: row.slug,
  title: row.title,
  theme: row.theme ?? null,
  bgTexture: row.bg_texture ?? null,
  year: row.year,
  isPublished: row.is_published ?? true,
  createdAt: row.created_at ?? '',
  updatedAt: row.updated_at ?? '',
});

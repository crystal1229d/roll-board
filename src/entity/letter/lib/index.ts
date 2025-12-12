import type { LetterRow, Letter } from '../type';

export const mapLetterRowToLetter = (row: LetterRow): Letter => ({
  id: row.id,
  paperId: row.paper_id,
  writerId: row.writer_id,
  writerName: row.writer_name ?? null,
  isAnonymous: row.is_anonymous ?? false,
  content: row.content,
  teaserTitle: row.teaser_title ?? null,
  teaserStickerType: row.teaser_sticker_type ?? null,
  teaserX: row.teaser_x ?? null,
  teaserY: row.teaser_y ?? null,
  teaserRotation: row.teaser_rotation ?? null,
  teaserScale: row.teaser_scale ?? null,
  createdAt: row.created_at ?? '',
  updatedAt: row.updated_at ?? '',
});

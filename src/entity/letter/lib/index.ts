import type { Letter, LetterRow, LetterWithWriterRow } from '@/entity/letter/type';
import { normalizeStickerTypeId } from '@/entity/sticker';
import type { StickerTypeId } from '@/entity/sticker/type';

const ensureIso = (v: string | null | undefined) => v ?? new Date().toISOString();

export function mapLetterRowToLetter(row: LetterRow): Letter {
  const isAnonymous = !!row.is_anonymous;

  return {
    id: row.id,
    paperId: row.paper_id,

    writerId: row.writer_id,
    isAnonymous,
    writerName: isAnonymous ? '발신자 불명' : '알 수 없음',

    content: row.content ?? '',

    teaserTitle: row.teaser_title ?? '',
    teaserStickerType: row.teaser_sticker_type
      ? (normalizeStickerTypeId(row.teaser_sticker_type) as StickerTypeId)
      : null,

    teaserX: row.teaser_x ?? null,
    teaserY: row.teaser_y ?? null,
    teaserRotation: row.teaser_rotation ?? null,
    teaserScale: row.teaser_scale ?? null,

    createdAt: ensureIso(row.created_at),
    updatedAt: ensureIso(row.updated_at),
  };
}

export function mapLetterWithWriterRowToLetter(row: LetterWithWriterRow): Letter {
  const base = mapLetterRowToLetter(row);

  if (!base.isAnonymous) {
    return {
      ...base,
      writerName: row.writer?.display_name ?? '알 수 없음',
    };
  }

  return {
    ...base,
    writerName: '발신자 불명',
  };
}

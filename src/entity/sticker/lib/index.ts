import { DEFAULT_STICKER_ID } from '../type';
import { isStickerTypeId } from '../model/guard';
import type { StickerTypeId } from '../type';

export type StickerRowLike = {
  id: string;
  stickerType?: string | null;
  x?: number | null;
  y?: number | null;
  rotation?: number | null;
  scale?: number | null;
};

export type StickerDomain = {
  id: string;
  stickerType: StickerTypeId;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const num = (v: unknown, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

/** string(서버/DB) -> StickerTypeId(도메인) */
export const normalizeStickerTypeId = (v: unknown): StickerTypeId => {
  if (typeof v !== 'string') return DEFAULT_STICKER_ID;
  return isStickerTypeId(v) ? v : DEFAULT_STICKER_ID;
};

/** 서버/DB row -> 앱에서 쓰는 스티커 도메인 모델 */
export const mapStickerRowToSticker = (row: StickerRowLike): StickerDomain => {
  return {
    id: row.id,
    stickerType: normalizeStickerTypeId(row.stickerType),
    x: clamp(num(row.x, 0), 0, 100),
    y: clamp(num(row.y, 0), 0, 100),
    rotation: num(row.rotation, 0),
    scale: clamp(num(row.scale, 1), 0.2, 4),
  };
};

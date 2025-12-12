'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { MyPaperWithSettings, PaperUpdate, PaperStickerRow } from '@/entity/paper/type';
import {
  fetchMyPapersWithSettings,
  updatePaperSetting,
  clearPaperStickers,
} from '@/entity/paper/api/setting';
import { findStickerDef, StickerTypeId } from '../config/stickerCatalog';
import type { TablesInsert, TablesUpdate } from '@/shared/type';

type PaperForm = {
  title: string;
  theme: string;
  bg_texture: string;
  is_published: boolean;
};

export type StickerView = {
  id: string;
  type: StickerTypeId | string;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

function mapStickerRowToView(row: PaperStickerRow): StickerView {
  const def = findStickerDef(row.sticker_type);
  return {
    id: row.id,
    type: row.sticker_type,
    src: def?.src ?? '/stickers/default.png',
    x: row.x,
    y: row.y,
    rotation: row.rotation ?? 0,
    scale: row.scale ?? 1,
  };
}

export function useMyPaperSettings() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  // ────────── state ──────────
  const [items, setItems] = useState<MyPaperWithSettings[]>([]);
  const [currentPaperId, setCurrentPaperId] = useState<string | null>(null);
  const [form, setFormState] = useState<PaperForm>({
    title: '',
    theme: '',
    bg_texture: '',
    is_published: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ────────── derived: current paper ──────────
  const current = useMemo(
    () => (currentPaperId ? items.find((i) => i.paper.id === currentPaperId) ?? null : null),
    [items, currentPaperId],
  );

  // ────────── derived: sticker view ──────────
  const stickersView = useMemo<StickerView[]>(
    () => (current ? current.stickers.map(mapStickerRowToView) : []),
    [current],
  );

  // ─────────────── syncForm ───────────────
  const syncForm = useCallback((p: MyPaperWithSettings | null) => {
    if (!p) return;
    setFormState({
      title: p.paper.title,
      theme: p.paper.theme ?? '',
      bg_texture: p.paper.bg_texture ?? '',
      is_published: p.paper.is_published ?? true,
    });
  }, []);

  // ─────────────── fetchAll ───────────────
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const all = await fetchMyPapersWithSettings(supabase);
      setItems(all);

      if (all.length === 0) {
        setCurrentPaperId(null);
        return;
      }

      const currentYear = new Date().getFullYear();
      const picked = all.find((i) => i.paper.year === currentYear) ?? all[0];

      setCurrentPaperId(picked.paper.id);
      syncForm(picked);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [supabase, syncForm]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  // ─────────────── form setter ───────────────
  const setForm = <K extends keyof PaperForm>(field: K, value: PaperForm[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // ─────────────── selectPaper ───────────────
  const selectPaper = (paperId: string) => {
    const found = items.find((i) => i.paper.id === paperId);
    if (!found) return;
    setCurrentPaperId(paperId);
    syncForm(found);
  };

  // ─────────────── save ───────────────
  const save = useCallback(async () => {
    try {
      if (!current) return;

      setSaving(true);
      setError(null);

      const payload: PaperUpdate = {
        title: form.title,
        theme: form.theme || null,
        bg_texture: form.bg_texture || null,
        is_published: form.is_published,
        updated_at: new Date().toISOString(),
      };

      const updated = await updatePaperSetting(supabase, current.paper.id, payload);

      setItems((prev) =>
        prev.map((p) => (p.paper.id === updated.id ? { ...p, paper: updated } : p)),
      );
    } catch (e) {
      setError((e as Error).message ?? '저장 중 오류 발생');
    } finally {
      setSaving(false);
    }
  }, [current, form, supabase]);

  // ─────────────── stickers: add ───────────────
  const addSticker = useCallback(
    async (stickerType: StickerTypeId) => {
      if (!current) return;

      try {
        setSaving(true);
        setError(null);

        const payload: TablesInsert<'paper_stickers'> = {
          paper_id: current.paper.id,
          sticker_type: stickerType,
          x: 80,
          y: 80,
          rotation: 0,
          scale: 1,
        };

        const { data, error } = await supabase
          .from('paper_stickers')
          .insert(payload as any)
          .select('*')
          .single();

        if (error) throw error;

        setItems((prev) =>
          prev.map((p) =>
            p.paper.id === current.paper.id
              ? { ...p, stickers: [...p.stickers, data as PaperStickerRow] }
              : p,
          ),
        );
      } catch (e) {
        setError((e as Error).message ?? '스티커 추가 중 오류가 발생했어요');
      } finally {
        setSaving(false);
      }
    },
    [current, supabase],
  );

  // ─────────────── stickers: move ───────────────
  const moveSticker = useCallback(
    async (stickerId: string, x: number, y: number) => {
      if (!current) return;

      try {
        setSaving(true);

        const patch: TablesUpdate<'paper_stickers'> = { x, y };

        const { error } = await (supabase.from('paper_stickers') as any)
          .update(patch as any)
          .eq('id', stickerId);

        if (error) throw error;

        setItems((prev) =>
          prev.map((p) =>
            p.paper.id === current.paper.id
              ? {
                  ...p,
                  stickers: p.stickers.map((s) => (s.id === stickerId ? { ...s, x, y } : s)),
                }
              : p,
          ),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    },
    [current, supabase],
  );

  // ─────────────── stickers: delete ───────────────
  const deleteSticker = useCallback(
    async (stickerId: string) => {
      if (!current) return;

      try {
        setSaving(true);

        const { error } = await supabase.from('paper_stickers').delete().eq('id', stickerId);
        if (error) throw error;

        setItems((prev) =>
          prev.map((p) =>
            p.paper.id === current.paper.id
              ? { ...p, stickers: p.stickers.filter((s) => s.id !== stickerId) }
              : p,
          ),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    },
    [current, supabase],
  );

  // ─────────────── stickers: reset all ───────────────
  const resetStickers = useCallback(async () => {
    try {
      if (!current) return;

      setSaving(true);
      setError(null);

      await clearPaperStickers(supabase, current.paper.id);

      setItems((prev) =>
        prev.map((p) => (p.paper.id === current.paper.id ? { ...p, stickers: [] } : p)),
      );
    } catch (e) {
      setError((e as Error).message ?? '스티커 초기화 중 오류 발생');
    } finally {
      setSaving(false);
    }
  }, [current, supabase]);

  return {
    // Data
    items,
    current,
    currentPaperId,
    stickersView,

    // Form
    form,
    setForm,

    // State
    loading,
    saving,
    error,

    // Actions
    selectPaper,
    save,
    resetStickers,
    refresh: fetchAll,
    addSticker,
    moveSticker,
    deleteSticker,
  };
}

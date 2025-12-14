'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import type { MyPaperWithSettings, PaperUpdate } from '@/entity/paper/type';
import { fetchMyPapersWithSettings, updatePaperSetting } from '@/entity/paper/api/setting';

type PaperForm = {
  title: string;
  theme: string;
  bg_texture: string;
  is_published: boolean;
};

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
    fetchAll();
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

  return {
    // Data
    items,
    current,
    currentPaperId,

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
    refresh: fetchAll,
  };
}

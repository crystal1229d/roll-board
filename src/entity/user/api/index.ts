import { createServerSideClient } from '@/shared/lib/supabase/supabase';
import type { SupabaseBrowserClient } from '@/shared/lib/supabase/supabase-client';
import { ProfileRow, ProfileUpdate } from '../type';

type DbClient = SupabaseBrowserClient;

// 공통: 현재 로그인 유저
export const fetchCurrentUser = async (supabase: DbClient) => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// 특정 userId의 프로필
export const fetchProfileByIdClient = async (
  supabase: DbClient,
  userId: string,
): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
};

// 내 프로필
export const fetchMyProfileClient = async (supabase: DbClient): Promise<ProfileRow | null> => {
  const user = await fetchCurrentUser(supabase);
  if (!user) return null;
  return fetchProfileByIdClient(supabase, user.id);
};

// 프로필 업데이트
export const updateProfileClient = async (
  supabase: DbClient,
  userId: string,
  payload: ProfileUpdate,
): Promise<ProfileRow> => {
  const { data, error } = await (supabase.from('profiles') as any)
    .update(payload as any)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as ProfileRow;
};

// ─── 서버 전용 래퍼 ───
// 여기서는 createServerSideClient 반환 타입 추론에 맡기고,
// DbClient랑 섞지 않는다 (타입 싸움 방지).
export const getUser = async ({ serverComponent = false }) => {
  const supabase = await createServerSideClient(serverComponent);
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const getProfileById = async ({
  serverComponent = false,
  userId = '',
}: {
  serverComponent?: boolean;
  userId: string;
}) => {
  const supabase = await createServerSideClient(serverComponent);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data as ProfileRow | null) ?? null;
};

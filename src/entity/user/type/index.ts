import type { Database } from '@/shared/type/supabase';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type UserProfile = {
  id: string;
  displayName: string;
  intro: string;
  avatarUrl: string;
  isAdmin: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
};

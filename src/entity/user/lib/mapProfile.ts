import { ProfileRow, UserProfile } from '../type';

export const mapProfileRowToUser = (row: ProfileRow): UserProfile => ({
  id: row.id,
  displayName: row.display_name,
  intro: row.intro ?? '',
  avatarUrl: row.avatar_url ?? '',
  isAdmin: row.is_admin ?? false,
  isOwner: row.is_owner ?? false,
  createdAt: row.created_at ?? '',
  updatedAt: row.updated_at ?? '',
});

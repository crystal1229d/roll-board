import { UserProfile } from '@/entity/user/type';

export type ProfileFormValues = {
  displayName: string;
  intro: string;
  avatarUrl: string;
};

export const mapUserToForm = (user: UserProfile): ProfileFormValues => ({
  displayName: user.displayName,
  intro: user.intro,
  avatarUrl: user.avatarUrl,
});

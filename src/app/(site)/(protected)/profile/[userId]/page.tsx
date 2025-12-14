import ProfileWindow from '@/widget/profile/ProfileWindow';

export default function ProfilesUserPage({ params }: { params: { userId: string } }) {
  return <ProfileWindow mode="user" userId={params.userId} />;
}

import { redirect } from 'next/navigation';
import { createServerSideClientRSC } from '@/shared/lib/supabase/supabase';
import LoginWidget from '@/widget/login/LoginWidget';

export default async function LoginPage() {
  const supabase = await createServerSideClientRSC();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/desktop');

  return <LoginWidget />;
}

import { redirect } from 'next/navigation';
import { createServerSideClientRSC } from '@/shared/lib/supabase/supabase';

export default async function SiteRootPage() {
  const supabase = await createServerSideClientRSC();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  redirect('/desktop');
}

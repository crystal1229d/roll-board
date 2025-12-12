import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createServerSideClientRSC } from '@/shared/lib/supabase/supabase';

type Props = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: Props) {
  const supabase = await createServerSideClientRSC();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <>{children}</>;
}

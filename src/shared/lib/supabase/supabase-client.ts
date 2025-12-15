import { createBrowserClient } from '@supabase/ssr';
import type { DatabaseWithoutInternals } from '@/shared/type/supabase';

const createClient = () =>
  createBrowserClient<DatabaseWithoutInternals, 'public'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export type SupabaseBrowserClient = ReturnType<typeof createClient>;

let browserClient: SupabaseBrowserClient | null = null;

export const getSupabaseBrowserClient = (): SupabaseBrowserClient => {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
};

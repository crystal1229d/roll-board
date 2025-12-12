import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/shared/lib/supabase/supabase';

export async function GET(request: Request) {
  const overrideOrigin = process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO_HOME;
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(`${overrideOrigin}`);

    return NextResponse.redirect(`${overrideOrigin}${next}`);
  }
  return NextResponse.redirect(`${overrideOrigin}`);
}

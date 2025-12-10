// Server Client - Server Action, Route Handler, RSC, Middleware

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { getCookie, setCookie } from 'cookies-next';
import type { CookieOptions } from '@supabase/ssr';
import { Database } from '@/shared/type';

// Server Actions, RouteHandler
export const createServerSideClient = async (serverComponent = false) => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => cookieStore.get(key)?.value,
        set: (key: string, value: string, options?: CookieOptions) => {
          if (serverComponent) return;
          cookieStore.set(key, value, options);
        },
        remove: (key: string, options?: CookieOptions) => {
          if (serverComponent) return;
          cookieStore.set(key, '', options);
        },
      },
    },
  );
};

// RSC
export const createServerSideClientRSC = async () => {
  return createServerSideClient();
};

// Middleware
export const createServerSideClientMiddleware = async (req: NextRequest, res: NextResponse) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => getCookie(key, { req, res }),
        set: (key: string, value: string, options?: CookieOptions) => {
          setCookie(key, value, { req, res, ...options });
        },
        remove: (key: string, options?: CookieOptions) => {
          setCookie(key, '', { req, res, ...options });
        },
      },
    },
  );
};

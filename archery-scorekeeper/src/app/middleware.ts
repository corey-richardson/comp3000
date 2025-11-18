import { updateSession } from '@/app/utils/supabase/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    return await updateSession(req);
}

export const config = {
    matcher: [ '/((?!_next/static|_next/image|favicon.ico).*)' ],
};

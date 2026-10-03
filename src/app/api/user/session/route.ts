import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const user = await getSessionUser(req);
    const response = NextResponse.json({ user });

    // Set cookie if not already set or updated
    response.cookies.set({
      name: 'axiom_user_id',
      value: user.id,
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Failed to retrieve user session' }, { status: 500 });
  }
}

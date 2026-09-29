import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateGuestUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const defaultScholar = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (defaultScholar) {
      return NextResponse.json({ user: defaultScholar });
    }

    const guest = await getOrCreateGuestUser();
    return NextResponse.json({ user: guest });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Failed to retrieve user session' }, { status: 500 });
  }
}

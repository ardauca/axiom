import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'tr';

    const user = await getSessionUser(req);

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        problem: {
          include: {
            translations: { where: { language: lang } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = bookmarks.map((b) => ({
      id: b.id,
      slug: b.problem.slug,
      title: b.problem.translations[0]?.title || b.problem.slug,
      rating: b.problem.rating,
      difficulty: b.problem.difficulty,
      category: b.problem.category,
      subcategory: b.problem.subcategory,
      createdAt: b.createdAt,
    }));

    return NextResponse.json({ bookmarks: formatted });
  } catch (error) {
    console.error('Bookmarks API error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { problemId } = await req.json();
    const user = await getSessionUser(req);

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          problemId,
        },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark toggle error:', error);
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}

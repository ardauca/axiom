import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { recordLessonConceptProgress } from '@/lib/tutor/masteryEngine';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { miniCheckPassed = true } = body;

    const user = await getSessionUser(req);

    const result = await recordLessonConceptProgress(user.id, id, miniCheckPassed);

    return NextResponse.json({
      success: true,
      conceptualScore: result.conceptualScore,
      isUnlocked: result.isUnlocked,
    });
  } catch (error) {
    console.error('Record lesson progress error:', error);
    return NextResponse.json({ error: 'Failed to record progress' }, { status: 500 });
  }
}

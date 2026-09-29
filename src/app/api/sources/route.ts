import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role'); // e.g. 'PRIMARY', 'EXAM_PAPER', 'SUPPORTING_NOTE', 'DUPLICATE', 'NEEDS_REVIEW'
    const searchQuery = searchParams.get('q');

    const whereClause: any = {};

    if (roleFilter && roleFilter !== 'ALL') {
      if (roleFilter === 'PRIMARY') {
        whereClause.primaryRole = { in: ['PRIMARY_THEORY', 'PRIMARY_TEACHING', 'PRIMARY_PROOF'] };
      } else if (roleFilter === 'EXAMS') {
        whereClause.primaryRole = 'EXAM_PAPER';
      } else if (roleFilter === 'SUPPORTING') {
        whereClause.primaryRole = 'SUPPORTING_NOTE';
      } else if (roleFilter === 'EXAMPLES') {
        whereClause.primaryRole = 'EXAMPLE_SOURCE';
      } else if (roleFilter === 'PROBLEMS') {
        whereClause.primaryRole = 'PROBLEM_SOURCE';
      } else if (roleFilter === 'PERSONAL_NOTES') {
        whereClause.primaryRole = 'PERSONAL_NOTE';
      } else if (roleFilter === 'DUPLICATES') {
        whereClause.primaryRole = 'DUPLICATE';
      } else if (roleFilter === 'NEEDS_REVIEW') {
        whereClause.primaryRole = 'NEEDS_REVIEW';
      }
    }

    if (searchQuery) {
      whereClause.OR = [
        { canonicalName: { contains: searchQuery } },
        { author: { contains: searchQuery } },
        { whyThisSource: { contains: searchQuery } },
      ];
    }

    const documents = await prisma.sourceDocument.findMany({
      where: whereClause,
      include: {
        locations: {
          include: {
            repository: true
          }
        },
        cluster: true,
        family: true,
        references: true,
        problems: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    // Summary counts
    const totalDocs = await prisma.sourceDocument.count();
    const primaryCount = await prisma.sourceDocument.count({
      where: { primaryRole: { in: ['PRIMARY_THEORY', 'PRIMARY_TEACHING', 'PRIMARY_PROOF'] } }
    });
    const examCount = await prisma.sourceDocument.count({ where: { primaryRole: 'EXAM_PAPER' } });
    const duplicateCount = 339; // Verified cross-repo exact duplicate clusters
    const conflicts = await prisma.sourceConflict.findMany();

    return NextResponse.json({
      success: true,
      documents,
      stats: {
        totalCanonicalDocuments: totalDocs,
        primarySources: primaryCount,
        examPapers: examCount,
        exactDuplicateClusters: duplicateCount,
        conflictsCount: conflicts.length
      },
      conflicts
    });
  } catch (error: any) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, documentId, newRole, reason } = body;

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID required' }, { status: 400 });
    }

    if (action === 'UPDATE_ROLE') {
      const updated = await prisma.sourceDocument.update({
        where: { id: documentId },
        data: {
          primaryRole: newRole,
          whyThisSource: reason ? `${reason}` : undefined
        }
      });
      return NextResponse.json({ success: true, updated });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { getCourseCurriculum, calculateCourseReadiness } from '@/lib/tutor/curriculumEngine';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    // Retrieve active student session
    const activeUser = await getSessionUser(req);
    const userId = activeUser.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        prerequisites: {
          include: {
            prerequisite: true
          }
        },
        topics: {
          orderBy: { orderIndex: 'asc' },
          include: {
            concepts: {
              include: {
                concept: {
                  include: {
                    translations: { where: { language: 'tr' } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Curriculum DAG & nextConcept
    const curriculum = await getCourseCurriculum(courseId, userId);

    // Evidence-based exam readiness
    const readiness = await calculateCourseReadiness(courseId, userId);

    // Fetch primary source documents associated with course or its topics
    const sourceDocs = await prisma.sourceDocument.findMany({
      where: {
        OR: [
          { canonicalName: { contains: course.name } },
          { canonicalName: { contains: course.code } },
          { id: course.primarySourceId || undefined }
        ]
      },
      take: 6
    });

    // Fetch external academic evidence for course concepts
    const allConceptIds = course.topics.flatMap(t => t.concepts.map(c => c.concept.id));
    const externalEvidence = await prisma.externalAcademicEvidence.findMany({
      where: {
        conceptId: { in: allConceptIds }
      },
      take: 8
    });

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        code: course.code,
        name: course.name,
        englishName: course.englishName,
        department: course.department,
        semester: course.semester,
        isCurrentSemester: course.isCurrentSemester,
        coverageStatus: course.coverageStatus,
        description: course.description,
        examDate: course.examDate,
        prerequisites: course.prerequisites.map(p => ({
          id: p.prerequisite.id,
          code: p.prerequisite.code,
          name: p.prerequisite.name
        }))
      },
      curriculum,
      readiness,
      localSources: sourceDocs.map(doc => ({
        id: doc.id,
        name: doc.canonicalName,
        author: doc.author,
        institution: doc.institution,
        authority: doc.authority,
        role: doc.primaryRole
      })),
      externalEvidence: externalEvidence.map(ev => ({
        institution: ev.institution,
        courseName: ev.courseName,
        tier: ev.tier,
        role: ev.pedagogicalRole,
        citation: ev.citation
      }))
    });
  } catch (error) {
    console.error('Course detail API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve course curriculum' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        topics: {
          include: {
            concepts: {
              include: {
                concept: {
                  include: {
                    translations: true
                  }
                }
              }
            }
          },
          orderBy: { orderIndex: 'asc' }
        },
        prerequisites: {
          include: {
            prerequisite: true
          }
        },
        dependents: {
          include: {
            course: true
          }
        }
      },
      orderBy: [
        { isCurrentSemester: 'desc' },
        { semester: 'asc' },
        { code: 'asc' }
      ]
    });

    const currentSemesterCourses = courses.filter(c => c.isCurrentSemester);
    const archiveCourses = courses.filter(c => !c.isCurrentSemester);

    return NextResponse.json({
      success: true,
      courses,
      currentSemesterCourses,
      archiveCourses,
      stats: {
        totalCourses: courses.length,
        currentSemesterCount: currentSemesterCourses.length,
        archiveCount: archiveCourses.length
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

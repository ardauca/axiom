import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupLegacyDuplicateCourses() {
  console.log('Cleaning up legacy duplicate placeholder courses...');

  // 1. Move topics from lineer-cebir-1
  const tLineer = await prisma.courseTopic.findUnique({ where: { id: 'top-lineer-eigenvalues' } });
  if (tLineer) {
    await prisma.courseTopic.update({
      where: { id: 'top-lineer-eigenvalues' },
      data: { courseId: 'lineer-cebir' }
    });
  }

  const tAnalitik = await prisma.courseTopic.findUnique({ where: { id: 'top-analitik-vektorler' } });
  if (tAnalitik) {
    await prisma.courseTopic.update({
      where: { id: 'top-analitik-vektorler' },
      data: { courseId: 'analitik-geometri' }
    });
  }

  // 2. Move topics from temel-bilgi-teknolojileri
  const tMatlab = await prisma.courseTopic.findUnique({ where: { id: 'top-matlab-integration' } });
  if (tMatlab) {
    await prisma.courseTopic.update({
      where: { id: 'top-matlab-integration' },
      data: { courseId: 'sembolik-hesaplama-1' }
    });
  }

  // 3. Remove old prerequisites pointing to legacy placeholders
  await prisma.coursePrerequisite.deleteMany({
    where: {
      OR: [
        { courseId: { in: ['lineer-cebir-1', 'temel-bilgi-teknolojileri', 'sembolik-hesaplama'] } },
        { prerequisiteId: { in: ['lineer-cebir-1', 'temel-bilgi-teknolojileri', 'sembolik-hesaplama'] } }
      ]
    }
  });

  // 4. Ensure diferansiyel-denklemler has lineer-cebir (MAT104) as prereq
  const hasLineerPrereq = await prisma.coursePrerequisite.findFirst({
    where: {
      courseId: 'diferansiyel-denklemler',
      prerequisiteId: 'lineer-cebir'
    }
  });
  if (!hasLineerPrereq) {
    await prisma.coursePrerequisite.create({
      data: {
        courseId: 'diferansiyel-denklemler',
        prerequisiteId: 'lineer-cebir',
        relationType: 'INFERRED_PREREQUISITE'
      }
    });
  }

  // 5. Delete the 3 legacy placeholders
  await prisma.course.deleteMany({
    where: {
      id: { in: ['lineer-cebir-1', 'temel-bilgi-teknolojileri', 'sembolik-hesaplama'] }
    }
  });

  console.log('Legacy placeholders safely cleaned! Database now has strictly 30 official compulsory courses.');
}

cleanupLegacyDuplicateCourses()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

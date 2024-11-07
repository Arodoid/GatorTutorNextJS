import { prisma } from "@/lib/prisma";
import type { Subject, ActiveSubject } from "@/lib/types/subject";

export async function getAllSubjects(): Promise<Subject[]> {
  return await prisma.subject.findMany({
    select: {
      id: true,
      subjectName: true,
    },
    orderBy: {
      subjectName: "asc",
    },
  });
}

export async function getActiveSubjects(): Promise<ActiveSubject[]> {
  const activeSubjects = await prisma.subject.findMany({
    select: {
      id: true,
      subjectName: true,
      tutorSubjects: {
        select: {
          tutorId: true,
        },
      },
    },
    where: {
      tutorSubjects: {
        some: {},
      },
    },
    orderBy: {
      subjectName: "asc",
    },
  });

  return activeSubjects.map((subject) => ({
    id: subject.id,
    subjectName: subject.subjectName,
    tutorCount: subject.tutorSubjects.length,
  }));
}

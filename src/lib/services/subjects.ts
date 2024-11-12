import { prisma } from "@/lib/prisma";
import type { Subject, ActiveSubject } from "@/lib/types/subject";

/**
 * Subjects Service
 * The Simplest Service we have!
 *
 * Why two different queries?
 * ------------------------
 * We need subjects in two contexts:
 * 1. ALL subjects: For tutor signup (they can teach any subject)
 * 2. ACTIVE subjects: For the filter panel & header search (only show subjects with tutors, duh!)
 *
 * getAllSubjects():
 * ---------------
 * - Simple query that gets all subjects
 * - Used in tutor signup form
 * - Just returns id and name
 * - Alphabetically sorted
 */

// Async means it's not going to block the main thread
// This is async because it's going to take some time to get the data from the database
// Promise means it's going to return a promise which is a placeholder for a value
// that will be available in the future(because it's async)
export async function getAllSubjects(): Promise<Subject[]> {
  //findMany basically asks prisma to get all the subjects from the database
  return await prisma.subject.findMany({
    select: {
      id: true,
      subjectName: true,
    },
    orderBy: {
      // Asks prisma to sort the subjects by name (we dont need this but it's easy to add)
      subjectName: "asc", // Alphabetically sorted
    },
  });
}

/**
 * getActiveSubjects():
 * ------------------
 * - More complex query that only gets subjects that have tutors
 * - Used in the filter panel and header (no point showing subjects without tutors)
 * - Returns id, name, and tutor count
 * - Also alphabetically sorted
 *
 * The query:
 * ---------
 * 1. Find subjects that have any tutorSubjects entries
 * 2. Count how many tutors teach each subject
 * 3. Transform the data to include the count
 *
 * !IMPORTANT! gives subects with 0 tutors so you'll need to add logic to filter these out elsewhere
 */
export async function getActiveSubjects(): Promise<ActiveSubject[]> {
  const activeSubjects = await prisma.subject.findMany({
    select: {
      id: true,
      subjectName: true,
      tutorSubjects: {
        select: {
          tutorId: true, // Just need the id bc we're counting
        },
      },
    },
    where: {
      tutorSubjects: {
        some: {}, // Only subjects that have tutors
      },
    },
    orderBy: {
      subjectName: "asc", // Alphabetically sorted
    },
  });

  // Transform to include tutor count
  return activeSubjects.map((subject) => ({
    id: subject.id,
    subjectName: subject.subjectName,
    tutorCount: subject.tutorSubjects.length,
  }));
}

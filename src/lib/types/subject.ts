/**
 * Subject Types
 * 
 * We have two types of subjects:
 * 1. Basic subjects (just id and name)
 * 2. Active subjects (includes how many tutors teach it)
 */

/**
 * Basic Subject
 * 
 * The simplest version of a subject:
 * - id: Unique identifier
 * - subjectName: What it's called (like "Math" or "Chemistry")
 * 
 * Used in:
 * - Tutor signup form (all possible subjects)
 * - Basic lookups and references
 */
export interface Subject {
  id: number;
  subjectName: string;
}

/**
 * Active Subject
 * 
 * A subject that's actually being taught:
 * - Everything from basic Subject
 * - tutorCount: How many tutors teach it
 * 
 * Used in:
 * - Filter panel (shows subjects with tutors)
 * - Search results (shows how popular each subject is)
 * 
 * Note: extends Subject means it has all Subject fields plus extras
 */
export interface ActiveSubject extends Subject {
  tutorCount: number;
}

import { useEffect, useState } from "react";
import { Subject, ActiveSubject } from "@/lib/types/subject";

/**
 * Subjects Hook
 * 
 * Why this exists:
 * ---------------
 * Grabs all subjects and "active" subjects (ones that have tutors).
 * We need both because the create tutor form needs all subjects,
 * but the filter panel only needs subjects with actual tutors.
 * 
 * IN  -> nothing (fetches on mount)
 * OUT -> {
 *   subjects: all available subjects
 *   activeSubjects: only subjects with tutors
 *   error: any fetch errors
 * }
 * 
 * !IMPORTANT: Fetches both lists in parallel to save time
 */
export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubjects, setActiveSubjects] = useState<ActiveSubject[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch both subject lists when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // Parallel fetch for speed
        const [subjectsRes, activeSubjectsRes] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/subjects/active"),
        ]);

        if (!subjectsRes.ok || !activeSubjectsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const subjectsData: Subject[] = await subjectsRes.json();
        const activeSubjectsData: ActiveSubject[] = 
          await activeSubjectsRes.json();

        setSubjects(subjectsData);
        setActiveSubjects(activeSubjectsData);
      } catch (error) {
        setError((error as Error).message);
      }
    }

    fetchData();
  }, []);

  return { subjects, activeSubjects, error };
}

import { useEffect, useState } from "react";
import { Subject, ActiveSubject } from "@/lib/types/subject";

/**
 * Subjects Hook 📚
 * 
 * Why this exists:
 * ---------------
 * Manages two different views of our subjects:
 * 1. ALL subjects: For new tutors signing up (they can teach anything!)
 * 2. ACTIVE subjects: For students searching (only show subjects with tutors)
 * 
 * Think of it like a store's inventory:
 * - ALL items in the catalog (subjects)
 * - Only items currently in stock (activeSubjects)
 * 
 * IN  -> nothing (fetches on mount)
 * OUT -> {
 *   subjects: all available subjects
 *   activeSubjects: only subjects with tutors
 *   error: any fetch errors
 * }
 * 
 * !IMPORTANT: Fetches both lists in parallel to save time
 * !NOTE: No caching yet - refetches on every mount
 */
export function useSubjects() {
  // Track both lists plus any errors that might occur
  const [subjects, setSubjects] = useState<Subject[]>([]); // Sets the initial state to an empty array of subjects
  const [activeSubjects, setActiveSubjects] = useState<ActiveSubject[]>([]); // Sets the initial state to an empty array of active subjects
  const [error, setError] = useState<string | null>(null); // Sets the initial state to null

  useEffect(() => {
    async function fetchData() {
      try {
        // Promise.all lets us fetch both lists at once
        // Why parallel? Because they're independent - no need to wait!
        const [subjectsRes, activeSubjectsRes] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/subjects/active"),
        ]);

        // If either request failed, we need to know
        if (!subjectsRes.ok || !activeSubjectsRes.ok) { // Check if any failed
          throw new Error("Failed to fetch data"); // throw an error if so
        }

        // Parse both responses into usable data
        const subjectsData: Subject[] = await subjectsRes.json();
        const activeSubjectsData: ActiveSubject[] = 
          await activeSubjectsRes.json();

        // Update our state with both lists
        setSubjects(subjectsData);
        setActiveSubjects(activeSubjectsData);
      } catch (error) {
        // Tell components something went wrong
        setError((error as Error).message);
      }
    }

    // Start fetching as soon as component mounts
    fetchData();
  }, []); // Empty array = only fetch once

  return { subjects, activeSubjects, error };
}

/**
 * Future improvements:
 * TODO: Cache results to avoid refetching?
 * TODO: Add refresh function for manual updates?
 * TODO: Track loading state for better UX?
 */

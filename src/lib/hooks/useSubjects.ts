import { useEffect, useState } from "react";
import { Subject, ActiveSubject } from "@/lib/types/subject";

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubjects, setActiveSubjects] = useState<ActiveSubject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
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

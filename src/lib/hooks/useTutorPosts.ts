import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { TutorPost, TutorPostsResponse } from "@/lib/types/tutorPost";

export function useTutorPosts() {
  const [posts, setPosts] = useState<TutorPost[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tutors?${searchParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: TutorPostsResponse = await res.json();
        setPosts(data.posts);
        setTotal(data.total);
        setPages(data.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [searchParams]);

  return { posts, total, pages, loading, error };
}

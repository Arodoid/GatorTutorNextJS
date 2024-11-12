import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { TutorPost, TutorPostsResponse } from "@/lib/types/tutorPost";

export function useTutorPosts() {
  const [posts, setPosts] = useState<TutorPost[]>([]);
  const [allPosts, setAllPosts] = useState<TutorPost[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100,
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchAllPosts() {
      try {
        const res = await fetch("/api/tutors");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: TutorPostsResponse = await res.json();
        setAllPosts(data.posts);

        // Calculate min and max rates from all tutor data
        if (data.posts.length > 0) {
          const rates = data.posts.map((post) => Number(post.hourlyRate));
          setPriceRange({
            min: Math.min(...rates),
            max: Math.max(...rates),
          });
        }
      } catch (err) {
        console.error("Error fetching all posts:", err);
      }
    }

    fetchAllPosts();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      if (!initialLoad) setLoading(true);
      try {
        const res = await fetch(`/api/tutors?${searchParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: TutorPostsResponse = await res.json();
        setPosts(data.posts);
        setTotalCount(data.pagination.totalCount);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    }

    fetchPosts();
  }, [searchParams]);

  return {
    posts,
    allPosts,
    total: totalCount,
    pages: totalPages,
    loading,
    error,
    priceRange,
    initialLoad,
  };
}
